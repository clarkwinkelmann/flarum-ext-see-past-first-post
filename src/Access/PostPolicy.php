<?php

namespace ClarkWinkelmann\SeePastFirstPost\Access;

use Flarum\Discussion\Discussion;
use Flarum\Event\ScopeModelVisibility;
use Flarum\Post\Post;
use Flarum\User\AbstractPolicy;
use Flarum\User\User;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Eloquent\Builder;

class PostPolicy extends AbstractPolicy
{
    protected $model = Post::class;

    protected $events;

    public function __construct(Dispatcher $events)
    {
        $this->events = $events;
    }

    public function find(User $actor, Builder $query)
    {
        $query->where(function (Builder $query) use ($actor) {
            $query
                ->whereExists(function ($query) use ($actor) {
                    $query->selectRaw('1')
                        ->from('discussions')
                        ->whereColumn('discussions.id', 'posts.discussion_id');

                    $this->events->dispatch(
                        new ScopeModelVisibility(Discussion::query()->setQuery($query), $actor, 'seePastFirstPost')
                    );
                })
                ->orWhere('posts.number', '=', 1);
        });
    }
}

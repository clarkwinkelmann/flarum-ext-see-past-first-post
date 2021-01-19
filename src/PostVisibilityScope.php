<?php

namespace ClarkWinkelmann\SeePastFirstPost;

use Flarum\Extension\ExtensionManager;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class PostVisibilityScope
{
    public function __invoke(User $actor, Builder $query)
    {
        $query->where(function (Builder $query) use ($actor) {
            $query
                ->whereHas('discussion', function (Builder $query) use ($actor) {
                    // The following will be handled by Tag's scopeAll which will check our `discussion.seePastFirstPost` tag-scoped permission
                    // If Tags is disabled, this will have no impact on the query and all discussions will match
                    $query->whereVisibleTo($actor, 'seePastFirstPost');

                    /**
                     * @var $manager ExtensionManager
                     */
                    $manager = app(ExtensionManager::class);

                    // Workaround for the tag scope not returning discussions with no tags
                    // @see https://github.com/flarum/core/issues/2554
                    if ($manager->isEnabled('flarum-tags') && $actor->hasPermission('discussion.seePastFirstPost')) {
                        $query->orWhereDoesntHave('tags');
                    }
                })
                ->orWhere('posts.number', '=', 1);
        });
    }
}

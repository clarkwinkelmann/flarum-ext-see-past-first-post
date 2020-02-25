<?php

namespace ClarkWinkelmann\SeePastFirstPost\Extenders;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Container\Container;

class DiscussionAttributes implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container->make('events')->listen(Serializing::class, [$this, 'attributes']);
    }

    public function attributes(Serializing $event)
    {
        if ($event->isSerializer(DiscussionSerializer::class)) {
            $canSee = $event->actor->can('seePastFirstPost', $event->model);

            $event->attributes['canSeePastFirstPost'] = $canSee;

            if (!$canSee) {
                /**
                 * @var $settings SettingsRepositoryInterface
                 */
                $settings = app(SettingsRepositoryInterface::class);

                // TODO: hide number on homepage instead of showing 0 ?
                // TODO: lastPost relationship
                // TODO: latest activity on tags page
                if ($settings->get('clarkwinkelmann-see-past-first-post.hideCommentCount')) {
                    $event->attributes['commentCount'] = 0;
                    $event->attributes['participantCount'] = 0;
                    $event->attributes['lastPostedAt'] = null;
                    $event->attributes['lastPostNumber'] = 1;
                }
            }
        }
    }
}

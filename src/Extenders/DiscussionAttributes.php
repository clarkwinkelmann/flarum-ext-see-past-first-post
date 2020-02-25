<?php

namespace ClarkWinkelmann\SeePastFirstPost\Extenders;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Container\Container;
use Illuminate\Support\Arr;

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

                if ($settings->get('clarkwinkelmann-see-past-first-post.hideCommentCount')) {
                    $event->attributes['commentCount'] = 0;
                    $event->attributes['participantCount'] = 0;
                    $event->attributes['seePastFirstPostHiddenCount'] = true;
                }

                if ($settings->get('clarkwinkelmann-see-past-first-post.hideLastPost')) {
                    $event->attributes['lastPostedAt'] = null;
                    $event->attributes['lastPostNumber'] = 1;
                    $event->attributes['seePastFirstPostHiddenLastPost'] = true;
                    $event->model->setRelation('lastPostedUser', null);
                    $event->model->setRelation('lastPost', null);

                    // In order to make sure Flarum doesn't erroneously show the discussions as unread, we remove additional properties
                    // Remove lastReadPostNumber which would be compared to lastPostNumber
                    // Remove lastPostedAt which would be compared to user.markedAllAsReadAt
                    if (Arr::exists($event->attributes, 'lastReadAt')) {
                        $event->attributes['lastReadAt'] = null;
                        $event->attributes['lastReadPostNumber'] = null;
                    }
                }
            }
        }
    }
}

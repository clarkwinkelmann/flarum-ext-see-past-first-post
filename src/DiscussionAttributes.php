<?php

namespace ClarkWinkelmann\SeePastFirstPost;

use Flarum\Api\Serializer\BasicDiscussionSerializer;
use Flarum\Discussion\Discussion;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Arr;

/**
 * Most use cases are for DiscussionSerializer but we use BasicDiscussionSerializer to make sure we hide the relationships
 * even if other extensions were to include them under BasicDiscussionSerializer
 */
class DiscussionAttributes
{
    public function __invoke(BasicDiscussionSerializer $serializer, Discussion $discussion): array
    {
        $canSee = $serializer->getActor()->can('seePastFirstPost', $discussion);

        $attributes = [
            'canSeePastFirstPost' => $canSee,
        ];

        if (!$canSee) {
            /**
             * @var $settings SettingsRepositoryInterface
             */
            $settings = resolve(SettingsRepositoryInterface::class);

            if ($settings->get('clarkwinkelmann-see-past-first-post.hideCommentCount')) {
                $attributes['commentCount'] = 0;
                $attributes['participantCount'] = 0;
                $attributes['seePastFirstPostHiddenCount'] = true;
            }

            if ($settings->get('clarkwinkelmann-see-past-first-post.hideLastPost')) {
                $attributes['lastPostedAt'] = null;
                $attributes['lastPostNumber'] = 1;
                $attributes['seePastFirstPostHiddenLastPost'] = true;
                $discussion->setRelation('lastPostedUser', null);
                $discussion->setRelation('lastPost', null);

                // In order to make sure Flarum doesn't erroneously show the discussions as unread, we remove additional properties
                // Remove lastReadPostNumber which would be compared to lastPostNumber
                // Remove lastPostedAt which would be compared to user.markedAllAsReadAt
                if (Arr::exists($attributes, 'lastReadAt')) {
                    $attributes['lastReadAt'] = null;
                    $attributes['lastReadPostNumber'] = null;
                }
            }

            if ($settings->get('clarkwinkelmann-see-past-first-post.hideFirstPost')) {
                $discussion->setRelation('firstPost', null);
            }
        }

        return $attributes;
    }
}

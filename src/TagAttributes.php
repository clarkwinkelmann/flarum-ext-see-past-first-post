<?php

namespace ClarkWinkelmann\SeePastFirstPost;

use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\Tags\Api\Serializer\TagSerializer;
use Flarum\Tags\Tag;

class TagAttributes
{
    public function __invoke(TagSerializer $serializer, Tag $tag): array
    {
        if ($tag->is_restricted) {
            if ($serializer->getActor()->hasPermission('tag' . $tag->id . '.discussion.seePastFirstPost')) {
                return [];
            }
        } else {
            if ($serializer->getActor()->hasPermission('discussion.seePastFirstPost')) {
                return [];
            }
        }

        /**
         * @var $settings SettingsRepositoryInterface
         */
        $settings = resolve(SettingsRepositoryInterface::class);

        if (!$settings->get('clarkwinkelmann-see-past-first-post.hideLastPost')) {
            return [];
        }

        // If the last post is hidden from the discussion list, it also makes sense to hide it from the tag list
        $tag->setRelation('lastPostedDiscussion', null);

        // Flarum Tags also stores last_posted_user_id which might be sensitive, but it currently doesn't seem to be exposed in the API

        return [
            'lastPostedAt' => null,
        ];
    }
}

<?php

namespace ClarkWinkelmann\SeePastFirstPost;

use Flarum\Api\Serializer\BasicDiscussionSerializer;
use Flarum\Extend;
use Flarum\Post\Post;
use Flarum\Tags\Api\Serializer\TagSerializer;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\ApiSerializer(BasicDiscussionSerializer::class))
        ->attributes(DiscussionAttributes::class),

    (new Extend\ApiSerializer(TagSerializer::class))
        ->attributes(TagAttributes::class),

    (new Extend\ModelVisibility(Post::class))
        ->scope(PostVisibilityScope::class),
];

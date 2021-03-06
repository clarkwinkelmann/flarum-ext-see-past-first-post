<?php

namespace ClarkWinkelmann\SeePastFirstPost;

use Flarum\Api\Serializer\DiscussionSerializer;
use Flarum\Extend;
use Flarum\Post\Post;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\ApiSerializer(DiscussionSerializer::class))
        ->mutate(DiscussionAttributes::class),

    (new Extend\ModelVisibility(Post::class))
        ->scope(PostVisibilityScope::class),
];

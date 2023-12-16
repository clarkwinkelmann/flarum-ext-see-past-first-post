# See past first post

[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/clarkwinkelmann/flarum-ext-see-past-first-post/blob/master/LICENSE.md) [![Latest Stable Version](https://img.shields.io/packagist/v/clarkwinkelmann/flarum-ext-see-past-first-post.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-see-past-first-post) [![Total Downloads](https://img.shields.io/packagist/dt/clarkwinkelmann/flarum-ext-see-past-first-post.svg)](https://packagist.org/packages/clarkwinkelmann/flarum-ext-see-past-first-post) [![Donate](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.me/clarkwinkelmann)

Adds a new permission to Flarum to let users see past the first post of discussions.

Set the permission to "Members" to hide the content from guests but show them to logged in users.
A message will invite the user to log in when they view the discussion.

If you set the permission to something else than member, a different message is shown saying the user is not allowed to see the discussion content.
You can customize the messages with the Linguist extension.

The permission can be applied to individual top-level tags.
Due to limitations in the Flarum tag system, if the discussion possesses any tag that isn't explicitly restricted, the user will be able to see the posts.

Two additional settings allow customizing the restrictions even further:

- **Hide comment count on discussion list**: this will hide the total post and recipient count from the API and the homepage.
- **Hide last post user and date on discussion list**: this will hide the `lastUser`, `lastPost` relationships, last post date and number as well as the user last read date and number from the API and homepage. It will also hide the tag `lastPostedDiscussion` relationship and last posted date from the API and tag list.
- **Hide first post as well**: this will hide the `firstPost` relationship from the API and homepage, and also hide post with number 1 when browsing a discussion, effectively hiding the discussion content in full.

## Installation

    composer require clarkwinkelmann/flarum-ext-see-past-first-post

## Support

This extension is under **minimal maintenance**.

It was developed for a client and released as open-source for the benefit of the community.
I might publish simple bugfixes or compatibility updates for free.

You can [contact me](https://clarkwinkelmann.com/flarum) to sponsor additional features or updates.

Support is offered on a "best effort" basis through the Flarum community thread.

**Sponsors**: HereWeLink, [FlarumTR](https://flarumtr.com/)

## Links

- [GitHub](https://github.com/clarkwinkelmann/flarum-ext-see-past-first-post)
- [Packagist](https://packagist.org/packages/clarkwinkelmann/flarum-ext-see-past-first-post)
- [Discuss](https://discuss.flarum.org/d/23077)

import {extend, override} from 'flarum/extend';
import app from 'flarum/app';
import PostStream from 'flarum/components/PostStream';
import DiscussionListItem from 'flarum/components/DiscussionListItem';

/* global m */

const translationPrefix = 'clarkwinkelmann-see-past-first-post.forum.';

app.initializers.add('clarkwinkelmann-see-past-first-post', () => {
    extend(PostStream.prototype, 'view', function (vdom) {
        if (this.discussion.attribute('canSeePastFirstPost')) {
            return;
        }

        let insertAtIndex = vdom.children.length;

        // We want to insert below the feed, but above the reply box
        // So do we perform the same check that decides if the reply box is visible, and go one index before if that's the case
        if (insertAtIndex > 0 && this.viewingEnd && (!app.session.user || this.discussion.canReply())) {
            insertAtIndex--;
        }

        vdom.children.splice(insertAtIndex, 0, m('.Post.CantSeePastFirstPost', app.translator.trans(translationPrefix + (app.session.user ? 'cant-see' : 'login-to-see'))));
    });

    override(PostStream.prototype, 'count', function (original) {
        if (this.discussion.attribute('canSeePastFirstPost') || this.props.discussion.attribute('seePastFirstPostHiddenCount')) {
            return original();
        }

        return this.discussion.commentCount();
    });

    extend(DiscussionListItem.prototype, 'view', function (vdom) {
        if (!this.props.discussion.attribute('seePastFirstPostHiddenCount')) {
            return;
        }

        // Sometimes we will get {subtree: retain}, in which case there's nothing to alter
        if (!Array.isArray(vdom.children)) {
            return;
        }

        vdom.children.forEach(content => {
            if (content.attrs && content.attrs.className.indexOf('DiscussionListItem-content') !== -1) {
                const countItemIndex = content.children.findIndex(d => d.attrs && d.attrs.className === 'DiscussionListItem-count');

                if (countItemIndex !== -1) {
                    content.children.splice(countItemIndex, 1);
                }
            }
        });
    });

    override(DiscussionListItem.prototype, 'showFirstPost', function (original) {
        // When the last post is hidden, force the list to show the info about the first post
        // Otherwise if we show comment count but hide last post, the TerminalPost would still try to show the last post
        if (this.props.discussion.attribute('seePastFirstPostHiddenLastPost')) {
            return true;
        }

        return original();
    });
});

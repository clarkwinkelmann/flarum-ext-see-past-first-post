import {extend, override} from 'flarum/common/extend';
import app from 'flarum/forum/app';
import PostStream from 'flarum/forum/components/PostStream';
import DiscussionListItem from 'flarum/forum/components/DiscussionListItem';
import PostStreamState from 'flarum/forum/states/PostStreamState';
import CantSeePastFirstPost from './components/CantSeePastFirstPost';

export * from './components';

app.initializers.add('clarkwinkelmann-see-past-first-post', () => {
    extend(PostStream.prototype, 'view', function (this: PostStream, vdom: any) {
        if (this.discussion.attribute('canSeePastFirstPost')) {
            return;
        }

        let insertAtIndex = vdom.children.length;

        // We want to insert below the feed, but above the reply box
        // So do we perform the same check that decides if the reply box is visible, and go one index before if that's the case
        if (insertAtIndex > 0 && this.stream.viewingEnd() && (!app.session.user || this.discussion.canReply())) {
            insertAtIndex--;
        }

        vdom.children.splice(insertAtIndex, 0, CantSeePastFirstPost.component({
            key: 'see-past-first-post',
        }));
    });

    override(PostStreamState.prototype, 'count', function (this: PostStreamState, original: any) {
        if (this.discussion.attribute('canSeePastFirstPost') || this.discussion.attribute('seePastFirstPostHiddenCount')) {
            return original();
        }

        return this.discussion.commentCount();
    });

    override(PostStreamState.prototype, 'viewingEnd', function (this: PostStreamState, original: any) {
        // We need to force viewingEnd to be true otherwise when we tweak PostStreamState.prototype.count
        // the "load more" button would appear
        if (this.discussion.attribute('canSeePastFirstPost')) {
            return original();
        }

        return true;
    });

    extend(DiscussionListItem.prototype, 'view', function (this: DiscussionListItem, vdom: any) {
        if (!this.attrs.discussion.attribute('seePastFirstPostHiddenCount')) {
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

    override(DiscussionListItem.prototype, 'showFirstPost', function (this: DiscussionListItem, original: any) {
        // When the last post is hidden, force the list to show the info about the first post
        // Otherwise if we show comment count but hide last post, the TerminalPost would still try to show the last post
        if (this.attrs.discussion.attribute('seePastFirstPostHiddenLastPost')) {
            return true;
        }

        return original();
    });
});

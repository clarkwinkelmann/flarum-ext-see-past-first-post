import {extend, override} from 'flarum/extend';
import app from 'flarum/app';
import PostStream from 'flarum/components/PostStream';

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

        // TODO: different message for users who need additional groups instead of logging in
        vdom.children.splice(insertAtIndex, 0, m('.Post.CantSeePastFirstPost', app.translator.trans(translationPrefix + 'login-to-see')));
    });
});

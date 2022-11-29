import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import SignUpModal from 'flarum/forum/components/SignUpModal';
import DiscussionControls from 'flarum/forum/utils/DiscussionControls';
import ItemList from 'flarum/common/utils/ItemList';

const translationPrefix = 'clarkwinkelmann-see-past-first-post.forum.';

export default class CantSeePastFirstPost extends Component {
    view() {
        if (app.session.user) {
            return m('.Post.CantSeePastFirstPost', app.translator.trans(translationPrefix + 'cant-see'));
        }

        return m('.Post.CantSeePastFirstPost', [
            m('p', app.translator.trans(translationPrefix + 'login-to-see')),
            m('p', this.links().toArray()),
        ]);
    }

    links() {
        const items = new ItemList();

        items.add('logIn', Button.component({
            className: 'Button Button--primary',
            onclick: () => {
                // Re-use the discussion controls, that way other extensions that replaced the login action
                // Will also apply here without any additional logic (like the kilowhat/wordpress wordpress-only login)
                DiscussionControls.replyAction(false, false).catch(() => {
                    // Ignore rejection since it's rejected when the modal opens
                });
            },
        }, app.translator.trans('core.forum.header.log_in_link')));

        if (app.forum.attribute('allowSignUp')) {
            items.add('signUp', Button.component({
                className: 'Button Button--link',
                onclick: () => app.modal.show(SignUpModal),
            }, app.translator.trans('core.forum.header.sign_up_link')));
        }

        return items;
    }
}

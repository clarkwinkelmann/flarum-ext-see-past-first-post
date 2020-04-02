import app from 'flarum/app';
import Component from 'flarum/Component';
import Button from 'flarum/components/Button';
import SignUpModal from 'flarum/components/SignUpModal';
import DiscussionControls from 'flarum/utils/DiscussionControls';
import ItemList from 'flarum/utils/ItemList';

/* global m */

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
            children: app.translator.trans('core.forum.header.log_in_link'),
            className: 'Button Button--primary',
            onclick: () => {
                // Re-use the discussion controls, that way other extensions that replaced the login action
                // Will also apply here without any additional logic (like the kilowhat/wordpress wordpress-only login)
                DiscussionControls.replyAction();
            },
        }));

        if (app.forum.attribute('allowSignUp')) {
            items.add('signUp', Button.component({
                children: app.translator.trans('core.forum.header.sign_up_link'),
                className: 'Button Button--link',
                onclick: () => app.modal.show(new SignUpModal()),
            }));
        }

        return items;
    }
}

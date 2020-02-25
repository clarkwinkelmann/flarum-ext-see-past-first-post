import app from 'flarum/app';
import SettingsModal from 'flarum/components/SettingsModal';
import Switch from 'flarum/components/Switch';

/* global m */

const settingsPrefix = 'clarkwinkelmann-see-past-first-post.';
const translationPrefix = 'clarkwinkelmann-see-past-first-post.admin.settings.';

export default class SeePastFirstPostSettingsModal extends SettingsModal {
    title() {
        return app.translator.trans(translationPrefix + 'title');
    }

    form() {
        return [
            m('.Form-group', [
                Switch.component({
                    state: this.setting(settingsPrefix + 'hideCommentCount')() === '1',
                    onchange: value => {
                        this.setting(settingsPrefix + 'hideCommentCount')(value ? '1' : '0');
                    },
                    children: app.translator.trans(translationPrefix + 'hide-comment-count'),
                }),
            ]),
            m('.Form-group', [
                Switch.component({
                    state: this.setting(settingsPrefix + 'hideLastPost')() === '1',
                    onchange: value => {
                        this.setting(settingsPrefix + 'hideLastPost')(value ? '1' : '0');
                    },
                    children: app.translator.trans(translationPrefix + 'hide-last-post'),
                }),
            ]),
        ];
    }
}

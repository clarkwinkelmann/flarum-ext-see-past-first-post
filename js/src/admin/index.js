import app from 'flarum/app';
import Switch from 'flarum/components/Switch';

/* global m */

const settingsPrefix = 'clarkwinkelmann-see-past-first-post.';
const translationPrefix = 'clarkwinkelmann-see-past-first-post.admin.settings.';

app.initializers.add('clarkwinkelmann-see-past-first-post', () => {
    app.extensionData
        .for('clarkwinkelmann-see-past-first-post')
        .registerSetting(function () {
            return [
                m('.Form-group', [
                    Switch.component({
                        state: this.setting(settingsPrefix + 'hideCommentCount')() === '1',
                        onchange: value => {
                            this.setting(settingsPrefix + 'hideCommentCount')(value ? '1' : '0');
                        },
                    }, app.translator.trans(translationPrefix + 'hide-comment-count')),
                ]),
                m('.Form-group', [
                    Switch.component({
                        state: this.setting(settingsPrefix + 'hideLastPost')() === '1',
                        onchange: value => {
                            this.setting(settingsPrefix + 'hideLastPost')(value ? '1' : '0');
                        },
                    }, app.translator.trans(translationPrefix + 'hide-last-post')),
                ]),
            ];
        })
        .registerPermission({
            icon: 'fas fa-stream',
            label: app.translator.trans('clarkwinkelmann-see-past-first-post.admin.permissions.see-past-first-post'),
            permission: 'discussion.seePastFirstPost',
            allowGuest: true,
        }, 'view');
});

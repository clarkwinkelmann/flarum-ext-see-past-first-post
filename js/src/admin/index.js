import {extend} from 'flarum/extend';
import app from 'flarum/app';
import PermissionGrid from 'flarum/components/PermissionGrid';
import SeePastFirstPostSettingsModal from './components/SeePastFirstPostSettingsModal';

app.initializers.add('clarkwinkelmann-see-past-first-post', () => {
    app.extensionSettings['clarkwinkelmann-see-past-first-post'] = () => app.modal.show(new SeePastFirstPostSettingsModal());

    extend(PermissionGrid.prototype, 'viewItems', items => {
        items.add('see-past-first-post', {
            icon: 'fas fa-stream',
            label: app.translator.trans('clarkwinkelmann-see-past-first-post.admin.permissions.see-past-first-post'),
            permission: 'discussion.seePastFirstPost',
            allowGuest: true,
        });
    });
});

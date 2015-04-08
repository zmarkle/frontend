import Ember from "ember";
import IsUpdateDisabled from "hospitalrun/mixins/is-update-disabled";
import GenderList from 'hospitalrun/mixins/gender-list';
import NewBelieverInfo from 'hospitalrun/mixins/new-believer-info';
export default Ember.ObjectController.extend(IsUpdateDisabled, GenderList, NewBelieverInfo, {
    needs: 'ministry/edit',

    editController: Ember.computed.alias('controllers.ministry/edit'),
    title: 'Add Believer',
    updateButtonText: 'Add',
    updateButtonAction: 'add',
    showUpdateButton: true,

    actions: {
        cancel: function() {
            this.send('closeModal');
        },

        add: function() {
            var newBeliever = this.getProperties('believerName', 'believer.religiousAffiliation',
            'believer.presentActivity', 'believer.declarationType', 'age', 'gender',
            'phone', 'email', 'address', 'country');
            this.get('editController').send('addBeliever', newBeliever);
        }
    }
});
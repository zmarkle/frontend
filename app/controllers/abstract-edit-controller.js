import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import UserSession from 'hospitalrun/mixins/user-session';
export default Ember.ObjectController.extend(IsUpdateDisabled, ModalHelper, UserSession, {
    cancelAction: 'allItems',
    
    cancelButtonText: function() {
        var isDirty = this.get('isDirty');
        if (isDirty) {
            return 'Cancel';
        } else {
            return 'Return';
        }
    }.property('isDirty'),

    disabledAction: function() {
        var isValid = this.get('isValid');
        if (!isValid) {
            return 'showDisabledDialog';  
        }
    }.property('isValid'),
    
    isNewOrDeleted: function() {
        return this.get('isNew') || this.get('isDeleted');
    }.property('isNew', 'isDeleted'),
    
    /**
     *  Lookup lists that should be updated when the model has a new value to add to the lookup list.
     *  lookupListsToUpdate: [{
     *      name: 'countryList', //Name of property containing lookup list
     *      property: 'country', //Corresponding property on model that potentially contains a new value to add to the list
     *      id: 'country_list' //Id of the lookup list to update
     *  }
     */
    lookupListsToUpdate: null,
    
    showUpdateButton: function() {
        var updateButtonCapability = this.get('updateCapability');
        return this.currentUserCan(updateButtonCapability);
    }.property('updateCapability'),
    
    updateButtonAction: 'update',    
    updateButtonText: function() {
        if (this.get('isNew')) {
            return 'Add';
        } else {
            return 'Update';
        }
    }.property('isNew'),
    updateCapability: null,
    
    /**
     * Add the specified value to the lookup list if it doesn't already exist in the list.
     * @param lookupList array the lookup list to add to.
     * @param value string the value to add.
     * @param listsToUpdate array the lookup lists that need to be saved.
     * @param listsName string name of the list to add the value to.
     */
    _addValueToLookupList: function(lookupList, value, listsToUpdate, listName) {
        var lookupListValues = lookupList.get('value');
        if (!lookupListValues.contains(value)) {
            lookupListValues.push(value);
            lookupListValues.sort();
            lookupList.set('value', lookupListValues);
            if (!listsToUpdate.contains(lookupList)) {
                listsToUpdate.push(lookupList);
            }
            this.set(listName, lookupList);
        }
    },
    
    _cancelUpdate: function() {
        var cancelledItem = this.get('model');
        if (this.get('isNew')) {
            cancelledItem.deleteRecord();
        } else {
            cancelledItem.rollback();
        }
    },
    
    actions: {
        cancel: function() {
            this._cancelUpdate();
            this.send(this.get('cancelAction'));
        },
        
        returnTo: function() {
            this._cancelUpdate();
            this.transitionToRoute(this.get('returnTo'));
        },        
        
        showDisabledDialog: function() {            
            this.displayAlert('Warning!!!!','Please fill in required fields (marked with *) and correct the errors before saving.');
        },        
        
        /**
         * Update the model and perform the before update and after update
         * @param skipAfterUpdate boolean (optional) indicating whether or not 
         * to skip the afterUpdate call.
         */
        update: function(skipAfterUpdate) {
            this.beforeUpdate().then(function() {
                this.get('model').save().then(function(record){
                    this.updateLookupLists();
                    if (!skipAfterUpdate) {
                        this.afterUpdate(record);
                    }
                }.bind(this));
            }.bind(this));
        }
    },
    
    /**
     * Override this function to perform logic after record update
     * @param record the record that was just updated.
     */
    afterUpdate: function() {
    },
    
    /**
     * Override this function to perform logic before record update.
     * @returns {Promise} Promise that resolves after before update is done.
     */
    beforeUpdate: function() {
        return Ember.RSVP.Promise.resolve();
    },    
    
    /**
     * Update any new values added to a lookup list
     */
    updateLookupLists: function() {
        var lookupLists = this.get('lookupListsToUpdate'),
            listsToUpdate = Ember.A();
        if (!Ember.isEmpty(lookupLists)) {            
            lookupLists.forEach(function(list) {
                var propertyValue = this.get(list.property),
                    lookupList = this.get(list.name);
                if (!Ember.isEmpty(propertyValue)) {
                    if (!lookupList) {
                        lookupList = this.get('store').push('lookup',{
                            id: list.id,
                            value: [],
                            userCanAdd: true
                        });                        
                    }
                    if (Ember.isArray(propertyValue)) {
                        propertyValue.forEach(function(value) {
                            this._addValueToLookupList(lookupList, value, listsToUpdate, list.name);    
                        }.bind(this));
                    } else {
                        this._addValueToLookupList(lookupList, propertyValue, listsToUpdate, list.name);
                    }
                }
            }.bind(this));
            listsToUpdate.forEach(function(list) {
                list.save();
            });
        }
    }
    
    


});

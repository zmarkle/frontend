import Ember from "ember";
import UnitTypes from "hospitalrun/mixins/unit-types";
export default Ember.Component.extend(UnitTypes, {
    firstQuantity: false,
    quantity: null,
    quantityClass: null,
    quantityHelp: null,
    unitName: null,
    unit: null,
    resetUnitName: false,
            
    unitChanged: function() {
        var selectedUnit = this.get('unit');
        this.get('parentView').updateCurrentUnit(selectedUnit, this.get('index'));
    }.observes('unit'),
    
    quantityChanged: function() {
        var quantity = this.get('quantity');
        if (Ember.isEmpty(quantity) || isNaN(quantity)) {
            this.setProperties({
                quantityHelp: 'not a valid number',
                quantityClass: 'has-error'
            });
        } else {
            this.setProperties({
                quantityHelp: null,
                quantityClass: 'has-success'
            });
        }
        Ember.run.once(this, function() {
            this.get('parentView').calculateTotal();
        });
    }.observes('quantity')
});
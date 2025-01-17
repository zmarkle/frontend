import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
    addCapability: 'add_medication',    
    moduleName: 'medication',
    newButtonText: '+ new request',
    sectionTitle: 'Medication',

    additionalModels: [{
        name: 'medicationFrequencyList',
        findArgs: ['lookup','medication_frequency']
    }],
    
    subActions: [{
        text: 'Requests',
        linkTo: 'medication.index'
    }, {
        text: 'Completed',
        linkTo: 'medication.completed'
    }]
});


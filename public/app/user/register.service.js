(function () {
	'use strict';

	angular
        .module('app.core')
        .factory('RegisterService', RegisterService);

	RegisterService.$inject = ['Rest'];
	/* @ngInject */
	function RegisterService(REST) {
		return {
		    register: function (email, username, password, applicationId) {
		        return REST.getInstance().registerResource().save({ login: username, password: password, applicationId: applicationId, email: email, userType: 1, firstName: "rares", lastName: "testing" }).$promise;
		    },
		    createSubscriber: function (subscriber) {
		        return REST.getInstance().createSubscriberOnRegisterResource().save(subscriber);
		    },
			getTypesOfBusiness: function () {
				return REST.getInstance().typeOfBusinessResource().get().$promise;
			}
		}
	}
})();

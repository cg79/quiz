(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('Rest', RestService);

    RestService.$inject = ['$resource'];
    /* @ngInject */
    function RestService($resource) {

        var factory = function () { };

        factory.prototype.loginResource = function () {
            return $resource("http://localhost:8000/");
        };


        factory.prototype.createSubscriberOnRegisterResource = function () {
            return $resource("/api/Register/CreateSubscriber");
        };

        factory.prototype.csvSchemaResource = function () {
            return $resource("/api/Csv/Schema?id=:id");
        };

        factory.prototype.csvSampleDataResource = function () {
        	return $resource("/api/Csv/SampleData?id=:id");
        };

        factory.prototype.csvData = function () {
        	return $resource("/api/Csv/Data?id=:id");
        };

        factory.prototype.registerResource = function () {
            return $resource("/api/Security/CreateUser");
        };

        factory.prototype.manuallyAddContactResource = function () {
            return $resource("/api/Contact/InsertContact");
        };

        factory.prototype.duplicateContact = function () {
        	return $resource("/api/Contact/DetectDuplicate");
        };

        factory.prototype.getContactsCollectionsBySubscriberId = function () {
            return $resource("/api/Contact/GetContactsCollectionsBySubscriberId");
        }

        factory.prototype.insertContactsCollection = function () {
            return $resource("/api/Contact/InsertContactsCollection");
        }

        factory.prototype.deleteContactsCollection = function () {
                return $resource("/api/Contact/DeleteContactsCollection");
        }

        factory.prototype.updateContact = function () {
            return $resource("/api/Contact/UpdateContact");
        }

        factory.prototype.getContactById = function () {
            return $resource("/api/Contact/GetContactById");
        }

        factory.prototype.typeOfBusinessResource = function () {
            return $resource("/api/Register/GetTypesOfBusiness");
        };

        factory.prototype.getProfileInfoResource = function () {
            return $resource("/api/Register/GetProfileInfo");
        }

        factory.prototype.getAllSubscribers = function () {
            return $resource("/api/Subscribers/GetAllSubscribers");
        }

        factory.prototype.getSubscriberInfoByIdResource = function () {
            return $resource("/api/Subscribers/GetSubscriberInfoById");
        }

        factory.prototype.saveProfileInfoResource = function () {
            return $resource("/api/Register/SaveProfileInfo");
        }

        factory.prototype.saveLogoImageOnDiskResource = function () {
            return $resource("/api/Register/SaveLogoImageOnDisk");
        }

        factory.prototype.changePasswordResource = function () {
            return $resource("/api/Security/ChangePassword");
        }

        factory.prototype.getCollections = function () {
            return $resource("/api/Communication/GetCollections");
        }
	
	    factory.prototype.addCollection = function () {
            return $resource("/api/Communication/InsertCollection");
        }

	    factory.prototype.sendOneClickCommunication = function () {
            return $resource("/api/Communication/SendOneClickCommunication");
	    }

	    factory.prototype.getContactCommunicationTypesById = function () {
	        return $resource("/api/Consumer/GetContactCommunicationTypesById");
	    }

	    factory.prototype.getCommunicationTypes = function () {
	        return $resource("/api/Consumer/GetCommunicationTypes");
	    }

	    factory.prototype.updateContactCommunications = function () {
	        return $resource("/api/Consumer/UpdateContactCommunications");
	    }

        factory.prototype.otherResource = function () {
            return $resource("http://smallfootprint.com");
        };

        var service = {
            getInstance: function () { return new factory(); }
        };

        return service;
    }
})();

(function() {
    'use strict';

    angular.module('app.security')
        .service('securityApiService', SecurityApiService);

    SecurityApiService.$inject = ['$resource', '$http','$q','configurationManager', 'securityResources','securityService'];

    function SecurityApiService($resource, $http, $q, configurationManager, securityResources,securityService) {

        var resources = securityResources.getInstance();

        return {
            post1: function (url, data) {
                url="http://localhost/SFP.Web.Api"+url;
 console.log(url);
                data.ApplicationId = "95D73343-9C1F-4F66-93D9-C8A82F0D3231";
                //var data = $.param({
                //    json: JSON.stringify({
                //        name: $scope.newName
                //    })
                //});
                var deferred = $q.defer();
                var promise = $http.get(url).success(function (response) {
                    console.log("a");
                    deferred.resolve(response);
                });
                // Return the promise to the controller
                return deferred.promise;
            },
            post: function(url, data) {
                console.log(url);
                data.ApplicationId = "95D73343-9C1F-4F66-93D9-C8A82F0D3231";
                var deferred = $q.defer();
                //var webApiUrl = "http://localhost/sfp.web.api" + url;
                //var webApiUrl = "http://localhost/sfp.web.api/" + url;
                var webApiUrl = url;
                $.ajax({ //58372  MvcRESTApplication
                    url: webApiUrl,
                    type: 'POST',
                    data: data,
                    dataType: "json",
                    crossDomain: true,
                    cache: false,
                    headers:{"SFP":securityService.token},
                    success: function(val) {
                        console.log("ok");
                        deferred.resolve(val);
                    },
                    error: function(xhr, textStatus, errorThrown) {
                        //alert('request failed');
                        console.log(textStatus);
                        deferred.reject();
                    }
                });

                return deferred.promise;
            },
            changePassword: function(data) {
                data.ApplicationId = configurationManager.AUTH.applicationId;
                return resources.changePassword().save(data).$promise;
            },
            forgotPassword: function(data) {
                data.ApplicationId = configurationManager.AUTH.applicationId;
                return resources.forgotPassword().save(data).$promise;
            },
            resetPassword: function(data) {
                data.ApplicationId = configurationManager.AUTH.applicationId;
                return resources.resetPassword().save(data).$promise;
            },
            login: function(data) {
                console.log(resources);
                data.ApplicationId = configurationManager.AUTH.applicationId;
                return resources.login().save(data).$promise;
            },
            logout: function(data) {
                data.ApplicationId = configurationManager.AUTH.applicationId;
                return resources.logout().save(data).$promise;
            },
            createUser: function(data) {
                data.ApplicationId = configurationManager.AUTH.applicationId;
                return resources.createUser().save(data).$promise;
            },
            createUserByAdmin: function (data) {
                data.ApplicationId = configurationManager.AUTH.applicationId;
                return resources.createUserByAdmin().save(data).$promise;
            },
            updateUser: function(data) {
                data.ApplicationId = configurationManager.AUTH.applicationId;
                return resources.updateUser().save(data).$promise;
            },
            validateToken: function() {
                var data = {
                    ApplicationId: configurationManager.AUTH.applicationId
                };
                return resources.validateToken().save(data).$promise;
            }
        }
    }

})();
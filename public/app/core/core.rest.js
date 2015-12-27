(function () {
    'use strict';

    angular.module('app.rest', [])
    .service('restService', function ($http, $q,securityService) {
        return {
            getData: function (url) {
                var deferred = $q.defer();
                var promise = $http.get(url).success(function (response) {
                    deferred.resolve(response);
                });
                // Return the promise to the controller
                return deferred.promise;
            },
           
           
            get: function(url, data) {
                var deferred = $q.defer();

                $.ajax({//58372  MvcRESTApplication
                    url: url,
                    type: 'POST',
                    headers: {
                        "ST": "",
                    },
                    data:data,
                    dataType:"json",
                    cache: false,
                    crossDomain: true,   
                    success: function (val) {
                        
                        deferred.resolve(val);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //alert('request failed');
                        console.log(textStatus);
                        deferred.reject();
                    }
                });

            return deferred.promise;
            },
            post: function (url, data) {
                var deferred = $q.defer();
                //var webApiUrl = "http://localhost/sfp.web.api" + url;
                //var webApiUrl = "http://sfpstageqa:8080" + url;
                var webApiUrl = "http://localhost:3001/"+ url;
                $.ajax({//58372  MvcRESTApplication
                    url: webApiUrl,
                    type: 'POST',
                    headers: {
                        "SFP": securityService.token,
                    },
                    data:data,
                    dataType:"json",
                    crossDomain: true,   
                    cache: false,
                    success: function (val) {
                        
                        deferred.resolve(val);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        //alert('request failed');
                        console.log(textStatus);
                        deferred.reject();
                    }
                });

            return deferred.promise;



            }
        }
    });


})();


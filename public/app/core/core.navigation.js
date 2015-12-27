(function () {
    'use strict';

    angular.module('app.navigation', [])
    .service('navigationService', function () {
        return {
            getData: function (url) {
                var deferred = $q.defer();
                var promise = $http.get(url).success(function (response) {
                    deferred.resolve(response);
                });
                // Return the promise to the controller
                return deferred.promise;
            },
            get1: function(url, data) {
                var deferred = $q.defer();
                var promise = $http({
                    method: "GET",
                    url: url,
                   headers: {
                        'Authorization': 'Basic dGVzdDp0ZXN0',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },

                    //params: {
                    //    action: "add"
                    //},
                    data: data
                });
                // Return the promise to the controller
                return deferred.promise;
            },
            post1 : function (url,data) {
                var deferred = $q.defer();
                var promise = $http({
                    method: "POST",
                    url: url,
                   headers: {
                        'Authorization': 'Basic dGVzdDp0ZXN0',
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },

                    //params: {
                    //    action: "add"
                    //},
                    data: data
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
            post : function (url,data) {
                var deferred = $q.defer();

                $.ajax({//58372  MvcRESTApplication
                    url: url,
                    type: 'POST',
                    headers: {
                        "ST": "",
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


(function () {
    'use strict';

    angular.module('app.security', [])
    .service('securityService', function ($rootScope, $http,localStorageService) {
        var security = {
            storageKey:"asdfgh",
            loggedUser:null,
            read:false,
            getLoggedUser:function()
            {
                if(this.read == true)
                {
                    return;                 
                }
                this.read = true;   
                    var storage = localStorageService.get(this.storageKey);
                    if (storage != null)
                    {
                        this.loggedUser = storage;
                        $http.defaults.headers.common['x-access-token'] = storage.token;
                        $rootScope.$broadcast('userChanged');
                    }
            },
            setLoggedUser:function(obj, rememberMe)
            {
            	debugger;
                    localStorageService.remove(this.storageKey);
                    
                    if(obj == null)
                    {
                        this.loggedUser = null;

                        $rootScope.$broadcast('userChanged');

                        return;    
                    }

                    this.loggedUser = obj;

                    //if (rememberMe == true) {
                       
                        //localStorageService.set(this.storageKey, JSON.stringify(storage));
                        localStorageService.set(this.storageKey, this.loggedUser);
                    //}
                    $rootScope.$broadcast('userChanged');
            },

            updateLoggedUser: function (obj) {
                localStorageService.remove(this.storageKey);

                if (obj == null) {
                    this.loggedUser = null;

                    $rootScope.$broadcast('userChanged');


                    return;
                }

                this.loggedUser = obj;
                
                localStorageService.set(this.storageKey, obj);
                $rootScope.$broadcast('userChanged');
            },

            isGuest:function()
            {
                return this.loggedUser == null;
            }
        }

        security.getLoggedUser();

        return security;
    });


})();




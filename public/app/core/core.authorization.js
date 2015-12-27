(function () {
    'use strict';

    //
    // This block of code is used to check if the user can acces a specific route.
    // This first implementation checks if the user is logged in. Further implementations should integrate the app permissions for different types of users
    //
    var app = angular.module('app');
    app.run(function ($rootScope, $state, $location, securityService) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {

            if(securityService.isGuest() == false)
            {
                if(toState.name == "login")
                {
                    $state.go('home');
                    event.preventDefault();    
                }
            }
            //we handle the case where there could be public pages like "about us" or "register" that don't require the user to be logged in
            var userShouldAuthenticate = (toState.data == undefined || !toState.data.isPublicPage) && toState.name != "login" && securityService.isGuest();

            //var userNotAuthorizated = (toState.data != undefined) && (toState.data.role != undefined);// && (LoginService.getUserRole() != toState.data.role)
            var userIsAuthorizated = false;
            if ((toState.data == undefined || toState.data.isPublicPage) && toState.roles == undefined) {
                userIsAuthorizated = true;
            } else
            {
                if (toState.roles == undefined || toState.roles == []) {
                    userIsAuthorizated = true;
                } else {
                    if (securityService.isGuest() == false && securityService.permissions.length > 0 )
                    {
                        var p = _.find(toState.roles, function (num) {
                            return num == securityService.permissions[0].Id;
                        });
                        if (p != undefined && p != null) {
                            userIsAuthorizated = true;
                        }
                    }
                }
            }

            if (userShouldAuthenticate || userIsAuthorizated == false) {
                $state.go('login');
                event.preventDefault();
            }
        });
    });

})();

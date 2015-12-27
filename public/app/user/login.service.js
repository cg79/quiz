(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('LoginService', LoginService);

    LoginService.$inject = ['Rest'];
    /* @ngInject */
    function LoginService(REST) {
        return {
            login: function(username, password) {
                return REST.getInstance().loginResource().get().$promise;
            }
        }
    }
})();

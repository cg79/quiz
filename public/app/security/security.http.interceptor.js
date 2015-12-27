(function () {
    'use strict';

    angular.module('app.security')
           .factory('HttpInterceptor', HttpInterceptor);

    HttpInterceptor.$inject = ['securityService'];

    function HttpInterceptor(securityService) {

        return {
            request: function (request) {
                if (request.url.indexOf('api') !== -1) {
                    request.headers.SFP = securityService.token;
                }

                return request;
            },
            response: function (response) {
                if (response.data && response.data.success == false && response.data.status == 2) {
                    securityService.updateLoggedUser(null);
                }

                return response;
            }
        }
    }
})();

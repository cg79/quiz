(function () {
    'use strict';

    angular.module('app.security')
           .config(configuration);

    configuration.$inject = ['$httpProvider'];

    function configuration($httpProvider) {
        $httpProvider.interceptors.push('HttpInterceptor');
    }
})();

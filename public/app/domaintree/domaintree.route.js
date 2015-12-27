(function() {
    'use strict';

    angular
        .module('app.domain')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state('domaintree', {
                    url: '/domaintree',
                    templateUrl: '/app/domaintree/domaintree.view.html',
                    controller: 'DomainTreeController',
                    controllerAs: 'vm',
                    data: { isPublicPage: true }
                });
               
        }]);
})();

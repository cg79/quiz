(function() {
    'use strict';

    angular
        .module('app.domain')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state('domain', {
                    url: '/domain',
                    templateUrl: '/app/domain/domain.view.html',
                    controller: 'DomainController',
                    controllerAs: 'vm',
                     data: { isPublicPage: true }
                });
               
        }]);
})();

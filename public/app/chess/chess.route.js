(function() {
    'use strict';

    angular
        .module('app.quiz')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state('chess', {
                    url: '/chess',
                    templateUrl: '/app/chess/chess.view.html',
                    controller: 'ChessController',
                    controllerAs: 'vm'
                });
               
        }]);
})();

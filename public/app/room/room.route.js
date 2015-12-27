(function() {
    'use strict';

    angular
        .module('app.room')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state('room', {
                    url: '/room',
                    templateUrl: '/app/room/room.view.html',
                    controller: 'RoomController',
                    controllerAs: 'vm'
                });
               
        }]);
})();

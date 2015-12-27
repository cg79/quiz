(function() {
    'use strict';

    angular
        .module('app.quiz')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state('quiz', {
                    url: '/quiz/:room',
                    templateUrl: '/app/quiz/quiz.view.html',
                    controller: 'QuizController',
                    controllerAs: 'vm'
                });
               
        }]);
})();

(function() {
    'use strict';

    angular
        .module('app.quiz')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state('quizquestions', {
                    url: '/quizquestions/:domain',
                    templateUrl: '/app/quizquestions/quizquestions.view.html',
                    controller: 'QuizQuestionsController',
                    controllerAs: 'vm'
                });
               
        }]);
})();

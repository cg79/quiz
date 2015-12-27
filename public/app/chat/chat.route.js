(function() {
    'use strict';

    angular
        .module('app.chat')
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state('chat', {
                    url: '/chat',
                    templateUrl: '/app/chat/chat.view.html',
                    controller: 'ChatController',
                    controllerAs: 'vm'
                })
                .state('contacts', {
                    url: '/contacts',
                    templateUrl: 'build/app/contacts/contacts.html',
                    controller: 'ContactsController',
                    controllerAs: 'vm'
                })
                .state('contacts.csvImport', {
                    url: '/csvImport',
                    templateUrl: 'build/app/contacts/csvImport/csvImport.view.html',
                    controller: 'CsvImportController',
                    controllerAs: 'vm'
                })
                .state('contacts.csvImport.step1', {
                    url: '/step1',
                    templateUrl: 'build/app/contacts/csvImport/steps/csvImport.step1.view.html',
                    controller: 'CsvImportControllerStep1',
                    controllerAs: 'vm'
                })
                .state('contacts.csvImport.step2', {
                    url: '/step2',
                    templateUrl: 'build/app/contacts/csvImport/steps/csvImport.step2.view.html',
                    controller: 'CsvImportControllerStep2',
                    controllerAs: 'vm'
                })
                .state('contacts.csvImport.step3', {
                    url: '/step3',
                    templateUrl: 'build/app/contacts/csvImport/steps/csvImport.step3.view.html',
                    controller: 'CsvImportControllerStep3',
                    controllerAs: 'vm'
                })
                .state('contacts.csvImport.step4', {
                    url: '/step3',
                    templateUrl: 'build/app/contacts/csvImport/steps/csvImport.step4.view.html',
                    controller: 'CsvImportControllerStep4',
                    controllerAs: 'vm'
                })
                .state('contacts.enterManually', {
                    url: '/enterManually',
                    templateUrl: 'build/app/contacts/enterManually/enterManually.view.html',
                    controller: 'EnterManuallyController',
                    controllerAs: 'vm'
                });
        }]);
})();

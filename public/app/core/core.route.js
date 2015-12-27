(function() {
    'use strict';
//hnjkhjk
    angular
        .module('app.core')
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('404', {
                    url: '/404',
                    templateUrl: 'app/core/404.html',
                    data: { isPublicPage: true }
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'app/user/login.view.html',
                    controller: 'LoginController',
                    controllerAs: 'vm',
                    data: { isPublicPage: true }
                })
                .state('home', {
                    url: '/home',
                    templateUrl: 'app/layout/home.view.html',
                    controller: 'HomeController',
                    controllerAs: 'vm'
                })
                .state('forgotpassword', {
                    url: '/login',
                    templateUrl: 'app/user/forgotpassword.view.html',
                    controller: 'ForgotPasswordController',
                    controllerAs: 'vm',
                    data: { isPublicPage: true }
                })
                .state('newpassword', {
                    url: '/newpassword',
                    templateUrl: 'app/user/newpassword.view.html',
                    controller: 'NewPasswordController',
                    controllerAs: 'vm',
                    data: { isPublicPage: true }
                })
                .state('changepassword', {
                    url: '/changepassword',
                    templateUrl: 'app/user/changepassword.view.html',
                    controller: 'ChangePasswordController',
                    controllerAs: 'vm'
                })
             .state('editUserInfo', {
                 url: '/editUserInfo',
                 templateUrl: 'app/user/editUserInfo.view.html',
                 controller: 'EditUserInfoController',
                 controllerAs: 'vm'
             })
            .state('register', {
                url: '/register',
                templateUrl: 'app/user/register.view.html',
                controller: 'RegisterController',
                controllerAs: 'vm',
                data: { isPublicPage: true }
            });
        }]);
})();

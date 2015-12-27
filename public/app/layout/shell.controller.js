(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('ShellController', ShellController);

    ShellController.$inject = ['$rootScope', '$scope', 'securityService', '$timeout', 'config'];
    /* @ngInject */
    function ShellController($rootScope, $scope,securityService, $timeout, config) {
        var vm = this;
        //vm.topmenu = "src/app/layout/topmenu.html";
        vm.loggedUser = securityService.loggedUser;
        activate();

        function activate() {
            console.log(config.appTitle + ' loaded!');
        }
        
        

       $scope.$on('userChanged', function() {
                 //$timeout(function () {
           vm.loggedUser = securityService.loggedUser;
                // $scope.$apply(function () {
                //if (data == null) {
                //    vm.topmenu == "src/app/layout/topmenu.html";
                //} else {
                //    vm.topmenu == "src/app/layout/aaaaaaaaaaaa.html";
                //}
                // });
            //}, 10);
        });
    }
})();

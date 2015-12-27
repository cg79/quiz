(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$state', 'RegisterService', 'restService','securityService'];
    /* @ngInject */
    function RegisterController($state, RegisterService, restService, securityService) {
        var vm = this;
        var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

        vm.register = register;
        
        function register() {
            if (this.registrationForm.$invalid) {
                //alert("invalid");
                return;
            }
            //RegisterService.register(vm.email, vm.username, vm.password, "95D73343-9C1F-4F66-93D9-C8A82F0D3231").then(function (data) {

            vm.serverError = "";
            var req = {
                Login: vm.username,
                Password: vm.password,
                Email:vm.email
            };

            restService.post("security/CreateUser", req)
            .then(function (obj) {
                if (obj.Success == false) {
                    toastr.error(obj.Message, 'Error');
                    return;
                }

                    toastr.success('Registration was successful', 'Success');
                    securityService.setLoggedUser(obj, false);
                    $state.go('home');
                
            })
        };

    }
})();

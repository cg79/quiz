(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', 'LoginService','restService','securityService'];
    /* @ngInject */
    function LoginController($state, LoginService,restService,securityService) {
        var vm = this;
        vm.message = 'Login Controller is working';
        vm.login = login;

        activate();

        function activate() {
            console.log('Activated Login View');
        };

        function login() {
            console.log("trying to log in " + vm.username + " with password " + vm.password);
            // LoginService.login(vm.username, vm.password).then(function (data) {
            //     console.log("returned OK");
            //     console.log(data);

            //     //TODO Implement check if login was successful here
            //     toastr.success('Login was successful', 'Success');
            //     $state.go("demo");
            // }, function (error) {
            //     console.log("returned error");
            //     toastr.error('There was an error on the server', 'Error');
            //     console.log(error);
            // });
            if (this.loginForm.$invalid) {
                //alert("invalid");
                return;
            }
            vm.Message = "";
             var req = {
                Login:vm.username ,
                Password:   vm.password
            };

            restService.post("security/Login", req)
            .then(function (obj) {
                if(obj.Success == false)
                {
                    vm.Message = obj.Message;
                    return;        
                }
                securityService.setLoggedUser(obj.Data,vm.RememberMe);
                //$state.go("home");
                $state.go("home");
            })


        };
    }
})();

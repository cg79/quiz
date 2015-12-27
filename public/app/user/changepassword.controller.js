
(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('ChangePasswordController', ChangePasswordController);

    ChangePasswordController.$inject = ['$state', 'restService'];
    /* @ngInject */
    function ChangePasswordController($state, restService) {
        var vm = this;
        vm.message = 'ChangePasswordController  is working';
        vm.newPassword = newPassword;

        activate();

        function activate() {
            console.log('Activated ChangePasswordController View');
        };

        function newPassword() {
            if (this.frmnewp.$invalid) {
                //alert("invalid");
                return;
            }


            var req = {
                OldPassword: vm.oldPassword,
                Password: vm.Password
            };

            vm.Message = "";
            restService.post("security/ChangePassword", req)
            .then(function (obj) {
                
                if (obj.Success) {
                    // $scope.$apply(function () {
                    $state.go('login');
                    // });
                    return;
                }

                vm.Message = obj.Message;
            })




            // console.log("trying to log in " + vm.username + " with password " + vm.password);
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
        };
    }
})();
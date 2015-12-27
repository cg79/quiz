

(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('ForgotPasswordController', ForgotPasswordController);

    ForgotPasswordController.$inject = ['$state','restService'];
    /* @ngInject */
    function ForgotPasswordController($state,restService) {
        var vm = this;
        vm.message = 'Login Controller is working';
        vm.resetPassword = resetPassword;

        activate();

        function activate() {
            console.log('Activated ForgotPasswordController View');
        };

        function resetPassword() {
            var req = {
                email:vm.email    
            };
            
            vm.serverError = "";
            restService.post("security/ForgotPassword", req)
            .then(function (obj) {
                if (obj.Success) {
                    // $scope.$apply(function () {
                    $state.go('newpassword');
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

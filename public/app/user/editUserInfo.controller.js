
(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('EditUserInfoController', EditUserInfoController);

    EditUserInfoController.$inject = ['$state', 'restService', 'securityService'];
    /* @ngInject */
    function EditUserInfoController($state, restService, securityService) {
        var vm = this;
        vm.message = 'EditUserInfoController  is working';
        vm.updateProfile = updateProfile;

        activate();

        function activate() {
            console.log('Activated EditUserInfoController View');
            debugger;
            vm.userName = securityService.loggedUser.Username;
            vm.email = securityService.loggedUser.Email;
            vm.firstName = securityService.loggedUser.UserInfo.FirstName;
            vm.lastName = securityService.loggedUser.UserInfo.LastName;
        };

        function updateProfile() {
            if (this.frmnewp.$invalid) {
                //alert("invalid");
                return;
            }


            var req = {
                Login: vm.userName,
                Email: vm.email,
                FirstName: vm.firstName,
                LastName:vm.lastName
            };

            vm.Message = "";
            restService.post("security/UpdateUser", req)
            .then(function (obj) {
                
                if (!obj.Success) {
                    vm.Message = obj.Message;
                    return;
                }

                securityService.loggedUser.Username = vm.userName;
                securityService.loggedUser.Email = vm.email;
                securityService.loggedUser.UserInfo.FirstName = vm.firstName;
                securityService.loggedUser.UserInfo.LastName = vm.lastName;

                securityService.updateLoggedUser(securityService.loggedUser);

                $state.go('home');
                
            })

        };
    }
})();
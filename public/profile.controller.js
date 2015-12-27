
(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, data) {

  $scope.items = data;
 

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

    ProfileController.$inject = ['$state', 'restService', 'securityService','$uibModalInstance','data'];
    /* @ngInject */
    function ProfileController($state, restService, securityService,$uibModalInstance,data) {
        var vm = this;
        vm.message = 'EditUserInfoController  is working';
        vm.updateProfile = updateProfile;

        activate();

        function activate() {
            console.log('Activated EditUserInfoController View');
            debugger;
            vm.name = securityService.loggedUser.name;
            vm.email = securityService.loggedUser.email;
            vm.firstName = securityService.loggedUser.userInfo.FirstName;
            vm.lastName = securityService.loggedUser.userInfo.LastName;
        };

        function updateProfile() {
            if (this.frmnewp.$invalid) {
                //alert("invalid");
                return;
            }


            var req = {
                Login: vm.name,
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
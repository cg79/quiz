
(function () {
    'use strict';

    angular
        .module('app.core')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$uibModalInstance','restService','securityService','data'];
    /* @ngInject */
    function ProfileController( $uibModalInstance,restService,securityService,data) {
        var vmModal = this;
        vmModal.message = 'EditUserInfoController  is working';
        vmModal.updateProfile = updateProfile;

		vmModal.data = data;
        activate();
        function activate() {
            console.log('Activated EditUserInfoController View');
        };

        function updateProfile() {
        	debugger;
            if (this.frmProfile.$invalid) {
                //alert("invalid");
                return;
            }


            var req = {
                Login: vmModal.data.lame,
                Email: vmModal.data.email,
                FirstName: vmModal.data.firstName,
                LastName:vmModal.data.lastName
            };

            vmModal.Message = "";
            restService.post("security/UpdateUser", req)
            .then(function (obj) {
                
                if (!obj.Success) {
                    vmModal.Message = obj.Message;
                    return;
                }

                securityService.loggedUser.Username = vmModal.data.login;
                securityService.loggedUser.Email = vmModal.data.email;
                securityService.loggedUser.UserInfo.FirstName = vmModal.data.firstName;
                securityService.loggedUser.UserInfo.LastName = vmModal.data.lastName;

                securityService.updateLoggedUser(securityService.loggedUser);
                $uibModalInstance.close();
                
            })

        };
    }
})();
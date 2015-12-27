(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('TopmenuController', TopmenuController);

    TopmenuController.$inject = ['$scope', '$state', '$log', '$uibModal', '$timeout', 'securityService', 'restService'];
    /* @ngInject */
    function TopmenuController($scope, $state, $log, $uibModal, $timeout, securityService, restService) {
        //TODO Add menu logic here if necessary
        var vm = this;
        vm.loggedUser = securityService.loggedUser;
        vm.logout = logout;
        vm.name = name();
        vm.profile = profile;

        function name() {
            if (vm.loggedUser == undefined || vm.loggedUser == null) {
                return "";
            }
            if (vm.loggedUser.UserInfo == undefined || vm.loggedUser.UserInfo == null) {
                return vm.loggedUser.Username;
            }

            if (vm.loggedUser.UserInfo.FirstName == null || vm.loggedUser.UserInfo.FirstName == "") {
                return vm.loggedUser.Username;
            }
            var rez = vm.loggedUser.UserInfo.FirstName;
            if (vm.loggedUser.UserInfo.LastName != null) {
                rez = rez + " " + vm.loggedUser.UserInfo.LastName;
            }
            return rez;

        }

        function profile() {
            var modalInstance = $uibModal.open({
                templateUrl: './app/user/profile/profile.view.html',
                controller: 'ProfileController as vmModal',
                //size: size,
                resolve: {
                    data: function() {
                        var req = {
                            login: securityService.loggedUser.name,
                            email: securityService.loggedUser.email,
                           firstName: securityService.loggedUser.userInfo.FirstName,
                            lastName: securityService.loggedUser.userInfo.LastName
                        };

                        return req;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }


        function logout() {

            var req = {};

            restService.post("security/Logout", req)
                .then(function(obj) {
                    // if(obj.Success == false)
                    // {
                    //     vm.serverError = obj.Message;
                    //     return;        
                    // }
                    securityService.setLoggedUser(null, false);
                    $state.go("login");
                })
        }


        $scope.$on('userChanged', function() {
            //$timeout(function () {
            vm.loggedUser = securityService.loggedUser;
            vm.name = name();
            //}, 10);
        });


    }
})();
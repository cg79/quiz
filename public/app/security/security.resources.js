(function () {
    'use strict';

    angular.module('app.security')
           .factory('securityResources', SecurityResources);

    SecurityResources.$inject = ['$resource'];

    function SecurityResources($resource) {

        var resources = function () { },
            postDefault = {
                save: {
                    method: 'POST'
                }
            };

        resources.prototype.changePassword = function () {
            return $resource("/api/security/ChangePassword", {}, postDefault);
        };

        resources.prototype.forgotPassword = function () {
            return $resource("/api/security/ForgotPassword", {}, postDefault);
        };

        resources.prototype.resetPassword = function () {
            return $resource("/api/security/ResetPassword", {}, postDefault);
        };

        resources.prototype.createUser = function () {
            return $resource("/api/security/CreateUser", {}, postDefault);
        };

        resources.prototype.createUserByAdmin = function () {
            return $resource("/api/security/CreateUserByAdmin", {}, postDefault);
        };
        

        resources.prototype.updateUser = function () {
            return $resource("/api/security/UpdateUser", {}, postDefault);
        };

        resources.prototype.login = function () {
            return $resource("/api/security/Login", {}, postDefault);
        };

        resources.prototype.logout = function () {
            return $resource("/api/security/Logout", {}, postDefault);
        };

        resources.prototype.validateToken = function () {
            return $resource("/api/security/ValidateToken", {}, postDefault);
        };

        return {
            getInstance: function () { return new resources(); }
        };
    }

})();
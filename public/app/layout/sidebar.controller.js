(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('SidebarController', SidebarController);

    SidebarController.$inject = ['$state'];
    /* @ngInject */
    function SidebarController($state) {
        //TODO Add menu logic here if necessary
    }
})();

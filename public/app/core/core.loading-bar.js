(function () {

    'use strict';

    angular
        .module('app')
        .config(configLoadingBar);

    configLoadingBar.$inject = ['cfpLoadingBarProvider'];

    function configLoadingBar(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.latencyThreshold = 1;
        cfpLoadingBarProvider.includeSpinner = false;
    }

})();
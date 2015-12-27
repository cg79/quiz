(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-top-right';
    }

    var config = {
        appErrorPrefix: '[SFP App Error] ',
        appTitle: 'App'
    };

    core.value('config', config);
})();

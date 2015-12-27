/* global toastr:false, moment:false */
(function() {
    'use strict';

    angular
        .module('app.core')
        .constant('toastr', toastr)
        .constant('appConstants', {
            LOGGED_USER_LOCAL_STORAGE_KEY: 'luser'
            //Add the rest of the app constants here
        });
})();

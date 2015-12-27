(function () {
    'use strict';

    angular
        .module('app.chat')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$state'];
    /* @ngInject */
    function ChatController($state) {

    	var vm = this;

    }
})();

(function() {
	'use strict';

	angular
		.module('app.quiz')
		.controller('QuizController', QuizController);

	QuizController.$inject = ['$state','$stateParams', 'LoginService','restService','securityService'];
	/* @ngInject */
	 function QuizController($state, $stateParams,LoginService,restService,securityService) {

		var vm = this;
		activate();
		vm.rooms = [];
		vm.createRoom =createRoom;
		//vm.params = $stateParams
        vm.room = JSON.parse($stateParams.room);

		function activate() {
			console.log('Activated Room View');
			
		};

		function createRoom() {
			 var room = {
                            country : 1,//romania
                            name:"qqqqqqqqq",
                            isPublic:true,
                            level:0,
                            game:1//quiz
                        };
			restService.post("room/addRoom", room)
            .then(function (obj) {
                if(obj.Success == false)
                {
                    vm.Message = obj.Message;
                    return;        
                }
                vm.rooms.push(obj.Data);
            })
		};

	}
})();
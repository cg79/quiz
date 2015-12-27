(function() {
	'use strict';

	angular
		.module('app.room')
		.controller('RoomController', RoomController);

	RoomController.$inject = ['$state', 'LoginService', 'restService', 'securityService'];
	/* @ngInject */
	function RoomController($state, LoginService, restService, securityService) {

		var vm = this;
		activate();
		vm.rooms = [];
		vm.createRoom = createRoom;
		vm.goToQuiz = goToQuiz;

		function activate() {
			console.log('Activated Room View');
			var req = {
				Login: "sdf",
				Password: "m.password"
			};
			restService.post("room/navigation", req)
				.then(function(obj) {
					if (obj.Success == false) {
						vm.Message = obj.Message;
						return;
					}
					vm.rooms = obj.Data;
				})
		};

		function createRoom() {
			var room = {
				country: 1, //romania
				name: "qqqqqqqqq",
				isPublic: true,
				level: 0,
				game: 1 //quiz
			};
			restService.post("room/addRoom", room)
				.then(function(obj) {
					if (obj.Success == false) {
						vm.Message = obj.Message;
						return;
					}
					vm.rooms.push(obj.Data);
				})
		};

		function goToQuiz(room) {
			$state.go("quiz",{room: JSON.stringify(room)});
		};


	}
})();
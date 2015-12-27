(function() {
	'use strict';

	angular
		.module('app.chess')
		.controller('ChessController', ChessController);

	ChessController.$inject = ['$state','$stateParams', 'LoginService','restService','securityService'];
	/* @ngInject */
	 function ChessController($state, $stateParams,LoginService,restService,securityService) {

		var vm = this;
		activate();

		vm.inportOpenings = inportOpenings;
		vm.createOpeningsTree = createOpeningsTree;
		//vm.params = $stateParams
        //vm.room = JSON.parse($stateParams.room);

		function activate() {
			console.log('Activated Chess View');
			
		};


function createOpeningsTree()
		{
			var req = {};
			restService.post("chess/createOpeningsTree", req)
				.then(function(obj) {
					if (obj.Success == false) {
						vm.Message = obj.Message;
						return;
					}
				})
		}

		function inportOpenings()
		{
			var req = {};
			restService.post("chess/inport", req)
				.then(function(obj) {
					if (obj.Success == false) {
						vm.Message = obj.Message;
						return;
					}
				})
		}

	

	}
})();
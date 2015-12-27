(function() {
	'use strict';

	angular
		.module('app.domain')
		.controller('DomainCrudController', DomainCrudController);

	DomainCrudController.$inject = ['$state', '$scope', '$modalInstance', 'inputParameter', 'LoginService', 'restService', 'securityService'];
	/* @ngInject */
	function DomainCrudController($state, $scope, $modalInstance, inputParameter, LoginService, restService, securityService) {

		var vm = this;
		activate();


		function activate() {
			console.log('Activated Domain View');
		};


		$scope.ok = function() {
			var req = {
				name:$scope.domainName
			};
			$modalInstance.close(req);
		};

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel');
		};


	}
})();
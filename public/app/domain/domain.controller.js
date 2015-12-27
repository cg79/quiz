(function() {
	'use strict';

	angular
		.module('app.domain')
		.controller('DomainController', DomainController);

	DomainController.$inject = ['$state', '$modal', 'LoginService', 'restService', 'securityService'];
	/* @ngInject */
	function DomainController($state, $modal, LoginService, restService, securityService) {

		var vm = this;
		activate();
		vm.domains = [];

		vm.parentDomain = {};
		vm.domain = null;
		vm.createDomain = createDomain;
		vm.navigateDown = navigateDown;
		vm.navigateUp = navigateUp;

		vm.showAddDomainPopup = showAddDomainPopup;

		vm.navigateToAddQuestion = navigateToAddQuestion;

		function activate() {
			console.log('Activated Domain View');

			navigateDown(vm.domain);
		};

		function navigateToAddQuestion()
		{
			
			var domainInfo = {
				guid:vm.domain.guid,
				name :vm.domain.name
			};
			$state.go("quizquestions",{domain: JSON.stringify(domainInfo)});
		}


		function createDomain(req) {
			var domain = {
				country: 1, //romania
				name: req.name,
				isPublic: true,
				level: req.level,

				game: 1 //quiz
			};
			if (req.parentGuid != undefined) {
				domain.parentGuid = req.parentGuid;
			}



			restService.post("domain/add", domain)
				.then(function(obj) {
					if (obj.Success == false) {
						vm.Message = obj.Message;
						return;
					}
					vm.domains.push(obj.Data);
				})
		};

		function navigateDown(domain) {
			//$state.go("quiz",{room: JSON.stringify(room)});
			vm.domain = domain;

			restService.post("domain/getdown", vm.domain)
				.then(function(obj) {
					if (obj.Success == false) {
						vm.Message = obj.Message;
						return;
					}
					vm.domains = obj.Data;
				})
		};

		function navigateUp(domain) {
			//$state.go("quiz",{room: JSON.stringify(room)});
			vm.domain = domain;

			restService.post("domain/getup", vm.domain)
				.then(function(obj) {
					if (obj.Success == false) {
						vm.Message = obj.Message;
						return;
					}
					vm.domains = obj.Data.items;
					vm.domain = obj.Data.parent;

					// vm.domain = _.find(vm.domains, function(o) {
					// 	return o.guid === vm.domain.parentGuid;
					// });
				})
		};

		function showAddDomainPopup(domain) {
			//$state.go("quiz",{room: JSON.stringify(room)});
			if (event != undefined) {
				event.preventDefault();
				event.stopPropagation();
			}
			var modalInstance = $modal.open({
				templateUrl: 'app/domain/domain.add.html',
				controller: 'DomainCrudController',
				resolve: {
					inputParameter: function() {
						return null;
					}
				}
			});
			modalInstance.result.then(function(selectedItem) {

				var req = {
					name: selectedItem.name
				};

				if (vm.domain != null) {
					req.parentGuid = vm.domain.guid;
					req.level = vm.domain.level + 1;
				} else {
					req.level = 0;
				}

				createDomain(req);
			}, function() {
				//$log.info('Modal dismissed at: ' + new Date());
			});

		};



	}
})();
(function() {
	'use strict';

	angular
		.module('app.domaintree')
		.controller('DomainTreeController', DomainTreeController);

	DomainTreeController.$inject = ['$state', '$modal', 'LoginService', 'restService', 'securityService'];
	/* @ngInject */
	function DomainTreeController($state, $modal, LoginService, restService, securityService) {

		var vm = this;

		vm.domains = [];

		vm.parentDomain = {};
		vm.domain = null;
		vm.createDomain = createDomain;
		vm.navigateDown = navigateDown;
		vm.navigateUp = navigateUp;

		vm.showAddDomainPopup = showAddDomainPopup;

		vm.navigateToAddQuestion = navigateToAddQuestion;
		vm.ggOrgChart_render = ggOrgChart_render;
		vm.oc_box_click_handler = oc_box_click_handler;


		vm.oc_options_1 = {
			data_id: 1, // identifies the ID of the "data" JSON object that is paired with these options
			container: 'oc_container_1', // name of the DIV where the chart will be drawn
			box_color: '#aaf', // fill color of boxes
			box_color_hover: '#faa', // fill color of boxes when mouse is over them
			box_border_color: '#008', // stroke color of boxes
			box_html_template: null, // id of element with template; don't use if you are using the box_click_handler
			line_color: '#f44', // color of connectors
			title_color: '#000', // color of titles
			subtitle_color: '#707', // color of subtitles
			max_text_width: 20, // max width (in chars) of each line of text ('0' for no limit)
			text_font: 'Courier', // font family to use (should be monospaced)
			use_images: false, // use images within boxes?
			box_click_handler: vm.oc_box_click_handler, // handler (function) called on click on boxes (set to null if no handler)
			debug: false // set to true if you want to debug the library
		};

		activate();

		function activate() {
			console.log('Activated Domain View');

			//navigateDown(vm.domain);
			ggOrgChart_render(vm.oc_options_1);
		};

		function navigateToAddQuestion() {

			var domainInfo = {
				guid: vm.domain.guid,
				name: vm.domain.name
			};
			$state.go("quizquestions", {
				domain: JSON.stringify(domainInfo)
			});
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


		function ggOrgChart_render() {
			var result;
			result = ggOrgChart.render(vm.oc_options_1, "demo-policia.json");
			if (result === false) {
				alert("INFO: render() failed (bad 'options' or 'data' definition)");
				return;
			}
		}

		function oc_box_click_handler(event, box) {
			if (box.oc_id !== undefined) {
				alert('clicked on node with ID = ' + box.oc_id + '; type = ' + box.oc_node.type);
			}
		}


	}



})();
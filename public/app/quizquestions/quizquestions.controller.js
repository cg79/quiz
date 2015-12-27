//https://github.com/danialfarid/ng-file-upload

(function() {
	'use strict';

	angular
		.module('app.quizquestions')
		.controller('QuizQuestionsController', QuizQuestionsController);

	QuizQuestionsController.$inject = ['$state', '$scope', '$stateParams', 'LoginService', 'restService', 'securityService', 'Upload'];
	/* @ngInject */
	function QuizQuestionsController($state, $scope, $stateParams, LoginService, restService, securityService, Upload) {

		var vm = this;
		activate();

		vm.domain = null;

		vm.quizQuestions = [];
		vm.saveQuizQuestion = saveQuizQuestion;
		vm.chooseAvatar = chooseAvatar;

		vm.params = $stateParams;
		vm.domain = JSON.parse($stateParams.domain);
		debugger;

//  vm.tinymceOptions = {
//         plugins: [
// "eqneditor advlist autolink lists link image charmap print preview anchor",
// "searchreplace visualblocks code fullscreen",
// "insertdatetime media table contextmenu paste"],
//         toolbar: " bold italic | bullist numlist outdent indent eqneditor",
//         menubar: "",
//         //toolbar: true
//     };

vm.tinymceOptions = {
        toolbar: " bold italic | bullist numlist outdent indent eqneditor",
        menubar: "",
        //toolbar: true
    };



		function activate() {
			console.log('Activated QQ View');

		};

		function chooseAvatar(i) {
			angular.element("#img" + i).click();
		};


		function saveQuizQuestion() {

			var quizquestion = {
				domainGuid: vm.domain.guid,
				country: 1, //romania
				definition: vm.definition,
				imgUrl:vm.picFileDef == undefined ? "":vm.picFileDef.name,
				answers: []

			};

			quizquestion.answers.push({
				isCorrect: true,
				definition: vm.ans1,
				imgUrl:vm.picFile1 == undefined ? "":vm.picFile1.name
			});

			if ((vm.ans2 != undefined && vm.ans2 != null && vm.ans2 != "")  || (vm.picFile2 != undefined)) {
				quizquestion.answers.push({
					isCorrect: false,
					definition: vm.ans2,
					imgUrl:vm.picFile2 == undefined ? "":vm.picFile2.name
				});

			}
			if ((vm.ans3 != undefined && vm.ans3 != null && vm.ans3 != "")|| (vm.picFile3 != undefined)) {
				quizquestion.answers.push({
					isCorrect: false,
					definition: vm.ans3,
					imgUrl:vm.picFile3 == undefined ? "":vm.picFile3.name
				});

			}

			if ((vm.ans4 != undefined && vm.ans4 != null && vm.ans4 != "")|| (vm.picFile4 != undefined)) {
				quizquestion.answers.push({
					isCorrect: false,
					definition: vm.ans4,
					imgUrl:vm.picFile4 == undefined ? "":vm.picFile4.name
				});

			}


			var data = new FormData();
			if (vm.picFileDef != undefined && vm.picFileDef != null) {
				data.append("picFileDef", vm.picFileDef);
			}

			if (vm.picFile1 != undefined && vm.picFile1 != null) {
				data.append("picFile1", vm.picFile1);
			}

			if (vm.picFile2 != undefined && vm.picFile2 != null) {
				data.append("picFile2", vm.picFile2);
			}
			if (vm.picFile3 != undefined && vm.picFile3 != null) {
				data.append("picFile3", vm.picFile3);
			}
			if (vm.picFile4 != undefined && vm.picFile4 != null) {
				data.append("picFile4", vm.picFile4);
			}
			data.append("method", "quizQuestion/add");
			data.append("data", JSON.stringify(quizquestion));
			data.append("imgdir", "img/quiz/");


			$.ajax({
				url: '/photo',
				type: 'POST',
				data: data,
				cache: false,
				dataType: 'json',
				processData: false, // Don't process the files
				contentType: false, // Set content type to false as jQuery will tell the server its a query string request
				success: function(data, textStatus, jqXHR) {
					console.log(data);
				},
				error: function(jqXHR, textStatus, errorThrown) {
					// Handle errors here
					console.log('ERRORS: ' + textStatus);
					// STOP LOADING SPINNER
				}
			});
		};

	}
})();
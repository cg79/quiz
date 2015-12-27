

function QQ(id, definition, defImgUrl, domainID, langID, ans1, ans2, ans3, ans4, addedDate, addedBy, validate) {
   this.ID = id;
   this.Definition = definition;
   this.DefImgUrl = defImgUrl;
   if (defImgUrl != null &&  defImgUrl != "")
   {
       this.DefImgUrl = webroot + "/Images/QuizImg/" + defImgUrl;
   }
   this.DomainID = domainID;
   this.LangID = langID;
   this.Ans1 = ans1;
   this.Ans2 = ans2;
   this.Ans3 = ans3;
   this.Ans4 = ans4;

   this.AddedDate = addedDate;
   this.AddedBy = addedBy;
   this.Validation = validate;

   this.getValidationDesc = function () {
       switch (this.Validation)
       {
           case 0:
               {
                   return "Neverificata";
                   break;
               }
           case 1:
               {
                   return "Ok";
                   break;
               }
           case 2:
               {
                   return "Raspuns Gresit";
                   break;
               }
           case 3:
               {
                   return "Revizuire";
                   break;
               }
       }
   }


   this.Sel = false;
   this.getCss = function () {
       if (this.Sel)
       {
           return "kin_selected";
       }
       return "";
   }
}
function QuizQuestionsController($scope, mySharedService) {
    //initSelect();
    $scope.qf = null;
   uploadButton1 = $('<button class="right dn " id="btnUpload"/>')
            //.addClass('btn btn-primary left')
            .prop('disabled', true)
            .text('Processing...')
            .on('click', function () {

                var $this = $(this),
                    data = $this.data();

                var scope = angular.element("#domains_div").scope();
                if (scope == undefined)
                    return;
                if (scope.selectedDomain == null)
                    return;
                $scope.question.DomainID = scope.selectedDomain.ID;

                $("#DomainID").val(scope.selectedDomain.ID);
                
          

                $this
                    .off('click')
                    .text('Abort')
                    .on('click', function () {
                        $this.remove();
                        data.abort();
                    });

                data.submit().always(function () {
                    $this.remove();
                    $scope.qf.$setPristine();
                    $scope.getQQuestions(mySharedService.selectedDomain,0);
                });

            });


    var url =       webroot + "Home/CreateQuestionWithAjax";
    $scope.chooseQuizImage = function () {

      $('#DefinitionFile1').fileupload({
        url: url,
        dataType: 'json',
        autoUpload: false,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 3000000, // 3 MB
        // Enable image resizing, except for Android and Opera,
        // which actually support image resizing, but fail to
        // send Blob objects via XHR requests:
        disableImageResize: /Android(?!.*Chrome)|Opera/
            .test(window.navigator.userAgent),
        previewMaxWidth: 150,
        previewMaxHeight: 150,
        previewCrop: true
    }).on('fileuploadadd', function (e, data) {

        $("#qfiles").html('');

        data.context = $('<div/>').appendTo('#qfiles');
        $.each(data.files, function (index, file) {
            var node = $('<div class="left"/>');
            //.append($('<span/>').text(file.name));
            if (!index) {
                node
                              //.append('<br>')
                          //.append('<div class="left">' + uploadButton.clone(true).data(data) + "</div>");
                          //.append('<div class="left">')
                .append(uploadButton1.clone(true).data(data));
                          //.append("</div>");
            }
            node.appendTo(data.context);
        });
    })
       .on('fileuploadprocessalways', function (e, data) {
           var index = data.index,
               file = data.files[index],
               node = $(data.context.children()[index]);
           if (file.preview) {
               node
                   //.prepend('<br>')
                   .prepend(file.preview);
           }
           if (file.error) {
               node
                  // .append('<br>')
                   .append($('<span class="text-danger"/>').text(file.error));
           }
           if (index + 1 === data.files.length) {
               data.context.find('button')
                   .text('Salveaza avatar')
                   .prop('disabled', !!data.files.error);
           }
       })
       .on('fileuploadprogressall', function (e, data) {
           var progress = parseInt(data.loaded / data.total * 100, 10);
           $('#progress .progress-bar').css(
               'width',
               progress + '%'
           );
       })
       .on('fileuploaddone', function (e, data) {

           $scope.$apply(function () {
               // $scope.LoggedUser.ImageUrl = data._response.result;
               $scope.question = new QQ(0, "", "", 0, 1, "", "", "", "", new Date(), "",0);
              
           });

       })
       .on('fileuploadfail', function (e, data) {
           $.each(data.files, function (index, file) {
               var error = $('<span class="text-danger"/>').text('File upload failed.');
               $(data.context.children()[index])
                   .append('<br>')
                   .append(error);
           });
       }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
        
      $("#DefinitionFile1").click();
    };
    


   // initSimpleFileUpload();
    $scope.tinymceOptions = {
        plugins: [
"eqneditor advlist autolink lists link image charmap print preview anchor",
"searchreplace visualblocks code fullscreen",
"insertdatetime media table contextmenu paste"],
        toolbar: " bold italic | bullist numlist outdent indent eqneditor",
        menubar: "",
        //toolbar: true
    };
  $scope.qqList = [];
  $scope.mypost = "";
  $scope.currentItem = null;
  $scope.question = new QQ(0, "", "", 0, 1, "", "", "", "", new Date(),"",0);
  $scope.showAddQuizQuestionDiv = true;

  $scope.PagerSettings = new PagerSettings(1, 0, 5, "<", ">", "<<", ">>");
   
    $scope.selectQQ = function (item) {
        if ($scope.currentItem != null)
        {
            $scope.currentItem.Sel = false;
           // $scope.currentItem.SelCss = ""
        }
        $scope.currentItem = item;
        $scope.currentItem.Sel = true;
        //$scope.currentItem.SelCss = "kin_selected"
    };

    $scope.execshowAddQuizQuestionDiv = function () {
        $scope.showAddQuizQuestionDiv = !$scope.showAddQuizQuestionDiv;
    };


    $scope.LoggedUser = mySharedService.LoggedUser;
    $scope.$on('handleBroadcast', function () {
        $scope.LoggedUser = mySharedService.LoggedUser;
    });

    $scope.saveQQ = function () {
      debugger;
      $scope.qf = this.formQ;
      
        var scope = angular.element("#domains_div").scope();
        if (scope == undefined)
            return;
        if (scope.selectedDomain == null)
            return;
        $scope.question.DomainID = scope.selectedDomain.ID;

        $("#DomainID").val(scope.selectedDomain.ID);
         $("#loggedUser").val(JSON.stringify($scope.LoggedUser));

        if ($("#btnUpload").length > 0) {
            $("#btnUpload").click();
            return;
        } else {
           
           this.formQ.$setPristine();

            $.ajax({
                url: webroot + "Home/CreateQuestionWithAjax",
                data: {
                  loggedUser: JSON.stringify($scope.LoggedUser),
                    Definition: $scope.question.Definition,
                    CorrectAnswer: $scope.question.Ans1,
                    WrongAnswer1: $scope.question.Ans2,
                    WrongAnswer2: $scope.question.Ans3,
                    WrongAnswer3: $scope.question.Ans4,
                    DomainID: $scope.question.DomainID
                },
                cache: false,
                type: "POST",
                dataType: "html",
                success: function (data, textStatus, XMLHttpRequest) {
                    // $scope.question = new QQ(0, "", "", 0, 1, "a1", "a2", "a3", "a4");

                    $scope.$apply(function () {
                        $scope.qqList.splice(0, 0, $scope.question);
                        $scope.question = new QQ(0, "", "", 0, 1, "", "", "", "", new Date(), "");

                       

                       
                        $scope.getQQuestions(mySharedService.selectedDomain,0);
                    });

                   

                }
            });
        }
       

        
    };



    $scope.selectPage = function (pageNo) {
       // $scope.currentPage = pageNo;
    };

    $scope.$watch('PagerSettings.PageIndex', function (newValue, oldValue) {
    // Do anything you like here
        //alert(newValue);
      if ($scope.usepagewatcher == false)
          return;

      var scope = angular.element("#domains_div").scope();
      if (scope == undefined)
          return;
      if (scope.selectedDomain == null)
          return;

      //scope.selectedDomain.QuizPager.PageIndex = newValue;
      $scope.getQQuestions(scope.selectedDomain,newValue);
  });
  
  $scope.$on('tabIndexChanged', function () {
     
        var tabIndex = mySharedService.tabIndex;

        if(tabIndex !=1)
            return;

        $scope.getQQuestions(mySharedService.selectedDomain);
    });
  
  $scope.currentDomain = null;
   $scope.getQQuestions = function (domain, refresh) {
        //$scope.currentMainQ = mainQ;
       //console.log(domainID + "  " + pageindex);
       

      
       if(refresh == undefined && $scope.currentDomain != undefined && mySharedService.selectedDomain.ID == $scope.currentDomain.ID  && mySharedService.selectedDomain.QuizPager.PageIndex == $scope.currentDomain.QuizPager.PageIndex)
        {
            return;
        }else
        {
          if(refresh != undefined && refresh != 0)
          {
            mySharedService.selectedDomain.QuizPager.PageIndex = refresh;
          }
        }

      $scope.currentDomain = domain;
        var overlay = new ItpOverlay("div_quiz");
        overlay.show();

        $.ajax({
            url: webroot+"Home/GetQuizQuestionList",
            type: "GET",
            data: { domainID: domain.ID, currentPage: domain.QuizPager.PageIndex },
            success: function (data, textStatus, jqXHR) {

                //var json_domains = JSON.parse(data.MainQuestionsList);

                $scope.$apply(function () {

                    $scope.qqList = [];
          
                    for (var i = 0; i < data.PagedListItems.length; i++) {
                    var ddd = new QQ
                      (
                              data.PagedListItems[i].ID,
                              data.PagedListItems[i].Definition,
                                          data.PagedListItems[i].DefinitionImageUrl,
                                          data.PagedListItems[i].DomainID,
                                          data.PagedListItems[i].LanguageID,
                                          data.PagedListItems[i].CorrectAnswer,
                                          data.PagedListItems[i].WrongAnswer1,
                                          data.PagedListItems[i].WrongAnswer2,
                                          data.PagedListItems[i].WrongAnswer3,
                                          data.PagedListItems[i].AddedDate,
                                          data.PagedListItems[i].NickName,
                                          data.PagedListItems[i].Validation
                      );
                    $scope.qqList.push(ddd);
                 }

                  domain.QuizPager.TotalItems = data.ItemsCount;
                  $scope.PagerSettings.TotalItems = data.ItemsCount;

                  
                  mySharedService.QuizQNO = $scope.PagerSettings.TotalItems;
                  overlay.hide();
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                overlay.hide();
                //alert("error " + jqXHR);
            }
        });

       
    }
  
   $scope.ValidateQuestion = function (question,newValue)
   {
       $.ajax({
           url: webroot + "Home/SetQuizQuestionValidation",
           data: {
               questionID: question.ID,
               userGuid: $scope.LoggedUser.UserGuid,
               userName:  $scope.LoggedUser.Name,
               newValue: newValue
           },
           cache: false,
           type: "POST",
           dataType: "html",
           success: function (data, textStatus, XMLHttpRequest) {

               $scope.$apply(function () {
                   question.Validation = newValue;
               });
           }
       });
   }

  

   $("#DefinitionFile").change(function () {
       readURL(this);
   });

   function readURL(input) {
       if (input.files && input.files[0]) {
           var reader = new FileReader();
           reader.onload = function (e) {
                $('#previewImage').attr('src', e.target.result);
               //var exif = EXIF.readFromBinaryFile(new BinaryFile(e.target.result));
               //$('#previewImage').attr('src', exif);
           }

           reader.readAsDataURL(input.files[0]);
       }
   }


    //What happens if the File changes?
   $('#DefinitionFile4').change(function (evt) {
       $("#preview").show();
       if (evt.target.files === undefined)
           return filePreview();

       var f = evt.target.files[0];
       var reader = new FileReader();

       if (!f.type.match('image.*')) {
           alert("The selected file does not appear to be an image.");
           return;
       }

       reader.onload = function (e) { preview.attr('src', e.target.result); };
       reader.readAsDataURL(f);
   });



}
QuizQuestionsController.$inject = ['$scope', 'mySharedService'];

var jqXHRData;
function initSimpleFileUpload() {
    'use strict';
    $('#DefinitionFile').fileupload({
        url: webroot+'Home/CreateQuestionWithAjax',
        dataType: 'json',
        add: function (e, data) {
          data.loggedUser= JSON.stringify($scope.LoggedUser);
            jqXHRData = data
        },
        done: function (event, data) {
           
        },
        fail: function (event, data) {
            if (data.files[0].error) {
                alert(data.files[0].error);
            }
        }
    });
}


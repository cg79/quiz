 myModule.service('questionService', function () {
        
this.getMainQuestions = function (domain, domsel) {
        $scope.currentDomain = domain;
        //console.log(domain.ID + "  " + domain.QuestionPager.PageIndex);

        var overlay = new ItpOverlay("main_questions_div");
        overlay.show();

        if (domsel)
        {
            $scope.usepagewatcher = false;
        }
        $.ajax({
            url: webroot + "Home/GetMainQuestions",
            type: "GET",
            data: { domainID: domain.ID, currentPage: domain.QuestionPager.PageIndex },
            success: function (data, textStatus, jqXHR) {

                //var json_domains = JSON.parse(data.MainQuestionsList);

                $scope.$apply(function () {

                    $scope.mainQuestionsList = [];

                    FillMainQuestionsList(data.PagedListItems);

                    $scope.currentDomain.QuestionPager.TotalItems = data.ItemsCount;
                    $scope.PagerSettings.TotalItems = data.ItemsCount;

                    var tabsCtrl = angular.element("#tabsCtrl").scope();
                    tabsCtrl.MainQNO = $scope.currentDomain.QuestionPager.TotalItems;

                    overlay.hide();
                   
                });

                $scope.usepagewatcher = true;
              
               // tinymce.init(
               //{
               //    selector: 'textarea',
               //    theme: 'modern',
               //    menubar: false,
               //    toolbar_items_size: 'small',
               //});

            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("error " + jqXHR);
                overlay.hide();
            }
        });

       
    }


    });
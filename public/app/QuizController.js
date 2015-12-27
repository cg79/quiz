//function QuizGameAnswer( answerGuid, answer) {
//    this.AnswerGuid = answerGuid;
//    this.Answer = answer;
//    this.IsSelected = false;
//	this.IsCorrect = false;
//}

//function QuizGameQuestion( def, imgurl, ans1,ans2,ans3,ans4) {
//    this.Def = def;
//    this.Imgurl = imgurl;
    
//	this.Ans1 = ans1;
//	this.Ans2 = ans1;
//	this.Ans3 = ans1;
//	this.Ans4 = ans1;
	
//}

function HourMinSec(hour,min,sec,totalSecconds) {
    this.Hour = hour;
    this.Min = min;
    this.Sec = sec;
    this.TotalSecconds = totalSecconds;
    this.InitialSeccondsValue = totalSecconds;
    this.Percent = 100;
   
    this.RemainingSecconds = 0;
    this.FriendlyTime="";
}

function Podium(position,positionOf, count, score) {
    this.Position = position;
    this.PositionOf = positionOf;
    this.Count = count;
    this.Score = score;    
	
	this.ResponseCount = 0;
	this.CorrectResponseCount = 0;
	this.WrongResponseCount = 0;
	
}

function QuizRoom(domainID,domainGuid, roomGuid,subdomains) {
    this.DomainID = domainID;
	this.DomainGuid = domainGuid;
    this.RoomGuid = roomGuid;
    this.SubDomains = subdomains;
  
    this.UserStatus = 0;
    this.ListOfUsers = [];
    this.QuizUsersCount = 0;

    this.QuizQuestion = null;
    this.AnsweredQuestions = [];
    this.HourMinSec = new HourMinSec(0,0,0,0);
	this.PodiumVal = new Podium(0,0,0,0);
    this.IsQuizStarted = false;
    this.QuizStat =null;
    this.Rating = null;
	
}

function QuestionAnswer(domainID, domainGuid, roomGuid, questionGuid,answerGuid, answer, selected, isCorrect) {
    this.DomainID = domainID;
    this.DomainGuid = domainGuid;
    this.RoomGuid = roomGuid;
	this.QuestionGuid = questionGuid;
    this.AnswerGuid = answerGuid;
	
    this.Answer = answer;
    this.Selected = selected;
    this.IsCorrect = isCorrect;
    this.Answered = false;
    this.UserGuid = "";
    this.GetAnswerStyle = function () {

        if (this.Answered == false) {
            if (this.Selected) {
                return "btn-success";
            }
            return "btn-kin";
        } else
        {
            if (this.IsCorrect) {
                return "btn-success good-answer";
            }
            return "btn-warning wrong-answer";
        }
    }

}

function QuizQuestion(domainID,domainGuid,roomGuid, questionIndex, questionGuid, definition,imgUrl) {
    this.DomainID = domainID;
    this.DomainGuid = domainGuid;
    this.RoomGuid = roomGuid;

    this.QuestionIndex = questionIndex;
    this.QuestionGuid = questionGuid;
    this.Definition = definition;
    if(imgUrl != null && imgUrl != undefined)
    {
        this.ImgUrl = webroot + "/Images/QuizImg/" +  imgUrl;
    }
    this.QuestionAnswers = [];
    this.SeccondsToAnswer = 10;

    this.HourMinSec = new HourMinSec(0, 0, 0, 0);
    this.IsLocked = false;
    this.AnswerReceived = false;

    this.clickOnAnswer = function (ans)
    {
        for (var i = 0; i < this.QuestionAnswers.length; i++)
        {
            if (this.QuestionAnswers[i].AnswerGuid == ans.AnswerGuid) {
                this.QuestionAnswers[i].Selected = true;
            } else {
                this.QuestionAnswers[i].Selected = false;
            }
        }
    }

    this.TimeElapsed = function () {
        this.IsLocked = true;
        this.HourMinSec.InitialSeccondsValue = 0;
        
        var arr = jQuery.grep(this.QuestionAnswers, function (a) {
            return a.Selected == true;
        });

        if (arr.length == 0) {
            return;
        }
		var userAnswer = arr[0];
		
		console.log("sending user answer" + JSON.stringify(userAnswer));
        

         var quizScope = angular.element("#quiz_controller_div").scope();
         var userAnswerData = {
                sid:"",
               
                answer: userAnswer
            };
        quizScope.userAnsweredToQuizQuestion(userAnswerData);

        
    };
}


function QuizController($scope, sharedService, $timeout,nodeService) {

    $scope.quizRoom = null;
    $scope.DomeniuNume = "";

    $scope.LoggedUser = sharedService.LoggedUser;

    $scope.$on('handleBroadcast', function () {
        $scope.LoggedUser = sharedService.LoggedUser;
        $scope.getUserRatingForDomain();
    });

    $scope.checkRoom = function () {

        if ($scope.quizRoom != null && $scope.quizRoom.DomainGuid == sharedService.selectedDomain.DomainGuid) {
            return;
        }

        // vezi daca quizul este in desfasurare
        if($scope.quizRoom != null && $scope.quizRoom.IsQuizStarted)
        {
                return;
        }

        //goleste camera existenta pt a se putea crea alta
        
        $scope.DomeniuNume = sharedService.selectedDomain.DomeniuNume;
        $scope.quizRoom = new QuizRoom(sharedService.selectedDomain.ID, sharedService.selectedDomain.DomainGuid, "00000000-0000-0000-0000-000000000000", sharedService.selectedDomain.SubDomains);
        
        
    };


    $scope.$on('tabIndexChanged', function () {
        var tabIndex = sharedService.tabIndex;
        if(tabIndex != 2)
            return;

        $scope.checkRoom();
        $scope.getUserRatingForDomain();
        
    });
    
     nodeService.nodeServer.socket.on("onUserRatingForDomain", function (msg) {
        console.log("onUserRatingForDomain  " + JSON.stringify(msg));
         $scope.$apply(function () {
            $scope.checkRoom();
            $scope.quizRoom.Rating=msg;
        });
    });

  $scope.getUserRatingForDomain = function () {
       if(sharedService.LoggedUser.IsGuest == true)
        {
            return;
        }
        var msg={
                DomainID:sharedService.selectedDomain.ID,
                UserGuid:sharedService.LoggedUser.UserGuid
            };
            nodeService.nodeServer.socket.emit('getUserRatingForDomain',msg);
    };
    


    $scope.userAnsweredToQuizQuestion = function (userAnswerData) {
        userAnswerData.sid = nodeService.nodeServer.SID;
        userAnswerData.answer.UserGuid = sharedService.LoggedUser.UserGuid;
        nodeService.nodeServer.socket.emit('userAnsweredToQuizQuestion',userAnswerData);
    };

    $scope.IsQuizRoomCreated = false;
    $scope.IsQuizStarted = false;

    $scope.domainSelected = function (domain) {
        if($scope.IsQuizRoomCreated)
            return;
        $scope.IsQuizRoomCreated = true;
        
    };

   $scope.enterQuizRoom = function (qr) {
        qr.UserStatus = 0;
        var domain = {
            ID: qr.DomainID,
            DomainGuid: qr.DomainGuid,
            SubDomains:qr.SubDomains
        };

        var scope = angular.element("#domains_div").scope();
        if (scope == undefined)
            return;

        nodeService.nodeServer.socket.emit('enterToQuizRoom', 
            { 
                sid: nodeService.nodeServer.SID, 
                domain:domain, 
                RoomGuid: qr.RoomGuid
            });
        };


    $scope.leaveQuizRoom = function (qr) {
        qr.UserStatus = 0;
        var scope = angular.element("#domains_div").scope();
        if (scope == undefined)
            return;
        
    };

   

    $scope.userAddedToQuizRoom = function (msg1) {
        return;
        var arr = jQuery.grep($scope.quizRooms, function (a) {
            return a.RoomGuid == msg1.RoomGuid && a.DomainID == msg1.DomainID;
        });

        if (arr.length == 0) {
            return;
        }
        var qr = arr[0];

        qr.ListOfUsers.push(msg1.User);
        qr.QuizUsersCount = UsersCount;
    };

    $scope.roomTimerSeconds = function (msg1) {
        if($scope.quizRoom==null)
            return;

        
        var qr = $scope.quizRoom;
        $scope.$apply(function () {
            //qr.Counter = 100;
            qr.HourMinSec.Hours = msg1.HourMinSec.Hours;
            qr.HourMinSec.Min = msg1.HourMinSec.Min;
            qr.HourMinSec.Sec = msg1.HourMinSec.Sec;
            qr.HourMinSec.TotalSecconds = msg1.HourMinSec.TotalSecconds;
            qr.HourMinSec.InitialSeccondsValue = msg1.HourMinSec.TotalSecconds;
        });
    };

    $scope.iLeavedTheQuizRoom = function (msg1) {

        if($scope.quizRoom==null)
            return;

        
        var qr = $scope.quizRoom;

        qr.UserStatus = 0;
    };

    $scope.userRemovedFromQuizRoom = function (msg1) {

        if($scope.quizRoom==null)
            return;

        
        var qr = $scope.quizRoom;
        qr.QuizUsersCount = msg1.UsersCount;
    };


    nodeService.nodeServer.socket.on("onReceiveQuizQuestion", function (msg1) {
        console.log("onReceiveQuizQuestion" + JSON.stringify(msg1));
        
        if($scope.quizRoom==null)
            return;

        
        var qr = $scope.quizRoom;
        if(msg1.question.QuestionIndex ==0)
        {
            qr.PodiumVal.ResponseCount =0;
            qr.PodiumVal.CorrectResponseCount = 0;
            qr.PodiumVal.WrongResponseCount = 0;
            qr.PodiumVal.Position = 0;
            qr.PodiumVal.PositionOf = 0;
            qr.PodiumVal.Count = 0;
            qr.PodiumVal.Score = 0;
        }
        msg1.question.QuestionIndex++;

        qr.IsQuizStarted = true;
        
            $scope.$apply(function () {
                //var serverObj = JSON.parse(msg1.question);
                if (qr.QuizQuestion == null || qr.QuizQuestion == undefined) {
                    qr.QuizQuestion = new QuizQuestion(msg1.question.DomainID, msg1.question.DomainGuid, msg1.question.RoomGuid, msg1.question.QuestionIndex, msg1.question.QuestionGuid, msg1.question.Definition, msg1.question.ImgUrl);
                } else {
                    qr.QuizQuestion.QuestionIndex = msg1.question.QuestionIndex;
                    qr.QuizQuestion.QuestionGuid = msg1.question.QuestionGuid;
                    qr.QuizQuestion.Definition = msg1.question.Definition;
                    qr.QuizQuestion.ImgUrl = msg1.question.ImgUrl;
                    qr.QuizQuestion.QuestionAnswers = [];
                }

                for (var i = 0; i < msg1.question.QuestionAnswers.length; i++) {
                    qr.QuizQuestion.QuestionAnswers.push(new QuestionAnswer(
                    msg1.question.DomainID,
                    msg1.question.DomainGuid,
                    msg1.question.RoomGuid,
                    msg1.question.QuestionGuid,
                    msg1.question.QuestionAnswers[i].AnswerGuid,
                    msg1.question.QuestionAnswers[i].Answer, false, false));
                }
                qr.QuizQuestion.HourMinSec.InitialSeccondsValue = 11;
                //$('timer')[1].start();
            });
            qr.QuizQuestion.IsLocked = false;
            qr.QuizQuestion.AnswerReceived = false;
            
    });

   

    nodeService.nodeServer.socket.on("onReceiveQuizQuestionAnswer",function (msg1) {

console.log("onReceiveQuizQuestionAnswer" + JSON.stringify(msg1));
    if(msg1 == null || msg1 == undefined)
    return;

		if($scope.quizRoom==null)
            return;

        
        var qr = $scope.quizRoom;
		
        $scope.$apply(function () {
            if (msg1.UserAnswers == undefined || msg1.UserAnswers == null ||  msg1.UserAnswers.length ==0) {
                console.log("msg1.question.QuestionUsersAnswers == undefined or length = 0");
                qr.PodiumVal.ResponseCount = 0;
                qr.PodiumVal.CorrectResponseCount =0;
                qr.PodiumVal.WrongResponseCount = 0;
                return;
            }
            var quizStat = jQuery.grep(msg1.QuizStatList, function (a) {
                return a.UserGuid == $scope.LoggedUser.UserGuid;
            });
            if(quizStat.length>0)
            {
                qr.QuizStat=quizStat[0];
            }

            //qr.QuizQuestion.HourMinSec.InitialSeccondsValue = 5;
            var serverAnswers = jQuery.grep(msg1.UserAnswers, function (a) {
                return a.UserGuid == $scope.LoggedUser.UserGuid;
            });

            if (serverAnswers.length == 0) {
                console.log("msg1.question.QuestionUsersAnswers not contains connectionId " + $scope.LoggedUser.connectionId);
                return;
            }

            qr.QuizQuestion.AnswerReceived = true;

            var serverAnswer = serverAnswers[0];
            var browserAnswers = jQuery.grep(qr.QuizQuestion.QuestionAnswers, function (a) {
                return a.AnswerGuid == serverAnswer.AnswerGuid;
            });

            if (browserAnswers.length == 0) {
                console.log("qr.QuizQuestion.QuestionAnswers not contains " + serverAnswer.AnswerGuid);
                return;
            }
            var browserAnswer = browserAnswers[0];

            browserAnswer.Answered = true;
            browserAnswer.IsCorrect = serverAnswer.IsCorrect;
            
            
            console.log("user answer guid is  " + browserAnswer.AnswerGuid);
            if (browserAnswer.IsCorrect == false) {
                var browserAnswers = jQuery.grep(qr.QuizQuestion.QuestionAnswers, function (a) {
                    return a.AnswerGuid == serverAnswer.CorrectAnswerGuid;
                });

                if (browserAnswers.length == 0) {
                    console.log("ERROR - find correct answer : qr.QuizQuestion.QuestionAnswers not contains " + serverAnswer.CorrectAnswerGuid);
                    return;
                }

                browserAnswers[0].Answered = true;
                browserAnswers[0].IsCorrect = true;
                console.log("correct answer guid is  " + browserAnswers[0].AnswerGuid);
            }
            
            qr.PodiumVal.ResponseCount = msg1.ResponseCount;
            qr.PodiumVal.CorrectResponseCount = msg1.CorrectResponseCount;
            qr.PodiumVal.WrongResponseCount = msg1.WrongResponseCount;

			if(msg1.PodiumPositionList != undefined)
			{
				var podiumPosition = null;
				for(var i=0;i<msg1.PodiumPositionList.length;i++)
				{
					var connections = jQuery.grep(msg1.PodiumPositionList[i].ConnectionIds, function (a) {
						return a == $scope.LoggedUser.UserGuid;
					});
					if(connections.length >0)
					{
						podiumPosition = msg1.PodiumPositionList[i];
					}
					break;						
				}
				if(podiumPosition != null)
				{
					qr.PodiumVal.Position = podiumPosition.Position;
					qr.PodiumVal.PositionOf = msg1.PodiumPositionList.length;
					qr.PodiumVal.Count = podiumPosition.ConnectionIds.length;//cati au raspuns la intrebare
					
					
					
					qr.PodiumVal.Score = podiumPosition.Score;
				}
			}
        });

    });

    nodeService.nodeServer.socket.on("onQuizHasEnded", function (msg1) {
        if (msg1 == null || msg1 == undefined)
            return;

       if($scope.quizRoom==null)
            return;

        
        var qr = $scope.quizRoom;

        $scope.$apply(function () {
            qr.IsQuizStarted = false;
            qr.HourMinSec.InitialSeccondsValue = msg1.secconds;
        });

    });

      nodeService.nodeServer.socket.on("onUserJoinedQuizRoom", function (data) {
        console.log("client : onUuserJoinedQuizRoom ");

       if($scope.quizRoom==null)
            return;

        
        var qr = $scope.quizRoom;

        $scope.$apply(function () {
             qr.UserStatus = 1;
            qr.QuizUsersCount = data.count;

            //qr.Counter = 100;
            qr.HourMinSec.Hours = data.HourMinSec.Hours;
            qr.HourMinSec.Min = data.HourMinSec.Min;
            qr.HourMinSec.Sec = data.HourMinSec.Sec;
            qr.HourMinSec.TotalSecconds = data.HourMinSec.TotalSecconds;
            qr.HourMinSec.InitialSeccondsValue = data.HourMinSec.TotalSecconds;

        });
                    
    });

      nodeService.nodeServer.socket.on("onUserJoinedQuizRoomQ", function (data) {
        console.log("client : onUuserJoinedQuizRoomQ ");

       if($scope.quizRoom==null)
            return;

        
        var qr = $scope.quizRoom;


        $scope.$apply(function () {
             qr.UserStatus = 1;
            qr.QuizUsersCount = data.count;

            //qr.Counter = 100;
            qr.HourMinSec.Hours = data.HourMinSec.Hours;
            qr.HourMinSec.Min = data.HourMinSec.Min;
            qr.HourMinSec.Sec = data.HourMinSec.Sec;
            qr.HourMinSec.TotalSecconds = data.HourMinSec.TotalSecconds;
            qr.HourMinSec.InitialSeccondsValue = data.HourMinSec.TotalSecconds;

        });
                    
    });
    
}

QuizController.$inject = ['$scope', 'mySharedService', '$timeout','nodeService'];
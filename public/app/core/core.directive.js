(function() {
    'use strict';

    angular.module('app.directive', [])
        .directive('pwCheck', [function() {
            return {
                require: 'ngModel',
                link: function(scope, elem, attrs, ctrl) {
                    var firstPassword = '#' + attrs.pwCheck;
                    elem.add(firstPassword).on('keyup', function() {
                        scope.$apply(function() {
                            var v = elem.val() === $(firstPassword).val();
                            ctrl.$setValidity('pwmatch', v);
                        });
                    });
                }
            }
        }])
        .directive('passwordValidate', [function() {
            return {
                require: 'ngModel',
                link: function(scope, elem, attrs, ctrl) {

                    elem.on('keyup', function() {
                        var viewValue = elem.val();
                        scope.$apply(function() {
                            var pwdValidLength = (viewValue && viewValue.length >= 8 ? true : false);
                            var pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? true : false;
                            var pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? true : false;

                            if (pwdValidLength && pwdHasLetter && pwdHasNumber) {
                                ctrl.$setValidity('length', true);
                                ctrl.$setValidity('letter', true);
                                ctrl.$setValidity('number', true);

                                ctrl.$setValidity('strength', true);
                            } else {

                                ctrl.$setValidity('length', pwdValidLength);
                                ctrl.$setValidity('letter', pwdHasLetter);
                                ctrl.$setValidity('number', pwdHasNumber);
                                ctrl.$setValidity('strength', false);
                            }
                        });
                    });
                }
            }
        }])
        .directive('regEx', [function() {
            var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
            return {
                require: 'ngModel',
                link: function(scope, elem, attrs, ctrl) {

                    elem.on('keyup', function() {
                        scope.$apply(function() {
                            var isMatchRegex = mediumRegex.test(elem.val());
                            ctrl.$setValidity('strength', isMatchRegex);
                        });
                    });
                }
            }
        }])
        .filter('mom', function() {
            return function(dateString) {
                return moment(dateString).format('LL');
            };
        })
        .filter('fromnow', function() {
            return function(dateString) {
                return moment(dateString).fromNow();
            };
        })
        .directive('jqPager', ['utilsService', function(utilsService){
            return {
                replace: false,
                scope: {
                    totalItems: '=',
                    itemsPerPage: '=',
                    pageIndex: '=',


                },
                templateUrl: 'build/app/core/templates/jqPager.html',
                // templateUrl: "app/views/templates/sec_button.html",
                //template: 'Name: {{ name }} {{isPermissionsEnabled}}'
                link: function(scope, element, attrs) {

                    scope.rows = [5, 10, 25];
                    scope.totalPages = 0;
                    scope.$watch('totalItems', function() {
                        var totalPages = scope.itemsPerPage < 1 ? 1 : Math.ceil(scope.totalItems / scope.itemsPerPage);
                        scope.totalPages = Math.max(totalPages || 0, 1);
                    });

                    scope.$watch('itemsPerPage', function() {
                        var totalPages = scope.itemsPerPage < 1 ? 1 : Math.ceil(scope.totalItems / scope.itemsPerPage);
                        scope.totalPages = Math.max(totalPages || 0, 1);
                    });
                    scope.setPageIndex = function(newV) {
                        //scope.$apply(function () {
                        scope.pageIndex = newV;
                        //});
                    }
                    scope.noPrevious = function() {
                        return scope.pageIndex === 1;
                    };
                    scope.noNext = function() {
                        return scope.pageIndex === scope.totalPages;
                    };
                    scope.next = function() {
                        var last = scope.pageIndex === scope.totalPages;
                        if (last) {
                            return;
                        }
                        scope.setPageIndex(scope.pageIndex + 1);

                    }
                    scope.previous = function() {
                        var prev = scope.pageIndex === 1;
                        if (prev) {
                            return;
                        }
                        scope.setPageIndex(scope.pageIndex - 1);
                    }
                    scope.first = function() {
                        scope.setPageIndex(1);
                    }
                    scope.last = function() {
                        scope.setPageIndex(scope.totalPages);
                    }
                    scope.changePageIndex = function(newPageIndex) {
                        var newv = utilsService.toInt(newPageIndex);

                        if (newv == null || newv == undefined)
                            return;
                        if (newv > scope.totalpages) {
                            return;
                        }
                        if (newv < 1) {
                            return;
                        }
                        scope.setPageIndex(newv);
                    }
                }
            };
        }])        
        .directive('genericFilter', ['$timeout','utilsService', function($timeout,utilsService){
            return {
                replace: false,
                scope: {
                    gridColumns: '=',
                    searchText: '=',
                    execFilter: '&'
                },
                templateUrl: 'build/app/core/templates/genericFilter.html',
                // templateUrl: "app/views/templates/sec_button.html",
                //template: 'Name: {{ name }} {{isPermissionsEnabled}}'
                link: function(scope, element, attrs) {

                    scope.filter = function() {
                        scope.execFilter();
                    };
                    scope.clearSearchText = function() {
                        scope.searchText = "";
                    }
                    scope.clearFilters = function() {

                        for (var i = 0; i < scope.gridColumns.length; i++) {
                            scope.gridColumns[i].Selected = false;
                        }
                        scope.execFilter();
                    };
                    var promise = null;
                    scope.$watch('searchText', function(newValue, oldValue) {
                        if (newValue == oldValue) {
                            return;
                        }

                        if (promise !== null) {
                            $timeout.cancel(promise);
                        }
                        promise = $timeout(function() {
                            //tableCtrl.search(evt.target.value, scope.predicate || '');
                            scope.execFilter();
                            promise = null;
                        }, 500);
                    });

                }
            };
        }])
        .directive('sfpSort', ['$parse', function($parse){
            return {
                scope: {
                    sortchanged: "&",
                },
                restrict: 'A',
                link: function(scope, element, attr, ctrl) {

                    var index = 0;
                    var states = ['natural', 'ascent', 'descent', ];
                    var fct = scope.sortchanged;

                    function reset() {
                        index = 0;
                        element
                            .removeClass('st-sort-ascent')
                            .removeClass('st-sort-descent');
                    }


                    function externalSort() {
                        index++;
                        //var stateIndex = index % 2;
                        if (index === 3) {
                            //manual reset
                            index = 0;
                            element
                                .removeClass('st-sort-descent')
                                .removeClass('st-sort-ascent')
                                .removeClass('st-sort-natural');

                            fct({
                                sortDirection: index
                            });
                        } else {
                            fct({
                                sortDirection: index
                            });
                            element
                                .removeClass('st-sort-descent')
                                .removeClass('st-sort-ascent')
                                .removeClass('st-sort-natural')
                                .addClass("st-sort-" + states[index]);
                        }
                    }

                    element.bind('click', function sortClick() {
                            externalSort();
                            //sort();
                    });

                }
            };
        }])

})();
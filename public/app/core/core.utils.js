(function() {
	'use strict';

	angular.module('app.core')
		.service('utilsService', UtilsService);

	UtilsService.$inject = ['$rootScope', 'localStorageService'];

	function UtilsService($rootScope, localStorageService) {
		var data = {
			hasValue: function(obj) {
				if (obj == undefined || obj == null)
					return false;
				return true;
			},
			uuid: function() {
				function _p8(s) {
					var p = (Math.random().toString(16) + "000000000").substr(2, 8);
					return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
				}
				return _p8() + _p8(true) + _p8(true) + _p8();
			},
			clone: function(obj) {
				var str = JSON.stringify(obj);
				return JSON.parse(str);
			},
			toInt: function(val) {
				if (val && typeof(val) == 'string') {
					return parseInt(val);
				}
				return val;
			},
			pack: function(bytes) {
				var chars = [];
				for (var i = 0, n = bytes.length; i < n;) {
					chars.push(((bytes[i++] & 0xff) << 8) | (bytes[i++] & 0xff));
				}
				return String.fromCharCode.apply(null, chars);
			},
			unpack: function(str) {
				var bytes = [];
				for (var i = 0, n = str.length; i < n; i++) {
					var char = str.charCodeAt(i);
					bytes.push(char >>> 8, char & 0xFF);
				}
				return bytes;
			},
			toUtc: function(val) {
				if (val && typeof(val) == 'string') {
					return moment(dateString).toUTCString();
				}
				return val.toUTCString();
			},
			toDateTimeInfo: function (val) {
			    var result = {
			        Year: val.getFullYear(),
			        Month: val.getMonth(),
			        Day: val.getDate(),
			        Hour: val.getHours(),
			        Minute: val.getMinutes(),
			        Seccond: val.getSeconds(),
			        Offset: val.getTimezoneOffset()
			    };
			   
			    return result;
			},
			pager: function () {
			    
			    var pagerInfo =
                {
                    pageSizes: [5, 10, 25, 30],
                    pageSize: 10,
                    currentPage: 1,
                    totalServerItems: 0,
                    FirstPage : function () {
			        	this.currentPage = 0;
			    	},
			    	NextPage : function () {
			        	this.currentPage++;
			    	},
			    	PreviousPage : function () {
			        	this.currentPage--;
			    	},
			    	LastPage : function () {
			     	   this.currentPage = 0;
			    	},
			    	SetTotalItems : function (val) {
			        	this.totalServerItems = val;
			    	},
			    	SortCriteria : function (propName, ascending) {
			        	this.PropertyName = propName;
			        	this.Ascending = ascending;
			    	},
			    	FilterCriteria : function () {
			        	this.FieldName = "";
			        	this.Operator = 0;
			        	this.Value;
			    	}
                };

                return pagerInfo;
			}
		};
		return data;

	}
})();
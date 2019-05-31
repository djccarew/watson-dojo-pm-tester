/*
 * Copyright 2019 IBM All Rights Reserved.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var	sampleSrv = angular.module("sampleSrv",	[]);

// Call to Node.js backend to call PM Service instance
sampleSrv.factory("dataServices", ['$http',
function($http)	{

	this.getScore	=	function(p) {
		/* create the scoring input object */
		var input = {
			fields:  ["AVGHEARTBEATSPERMIN","PALPITATIONSPERDAY","CHOLESTEROL","BMI","AGE","SEX","FAMILYHISTORY","SMOKERLAST5YRS","EXERCISEMINPERWEEK"],
			values: [[ parseInt(p.AVGHEARTBEATSPERMIN), parseInt(p.PALPITATIONSPERDAY), parseInt(p.CHOLESTEROL), parseInt(p.BMI), parseInt(p.AGE), p.SEX, p.FAMILYHISTORY, p.SMOKERLAST5YRS, parseInt(p.EXERCISEMINPERWEEK) ]]
		};

		/* call	scoring service	to generate results */
		return $http({	method: "post",
										url: "score",
                    data: { input: input }
                 })
			.success(function(data, status, headers, config) {
				return data;
			})
			.error(function(data, status, headers, config) {
				return status;
			});
	}

	return this;
}]);

// The modal dialogs for results and error
sampleSrv.factory("dialogServices",	['$modal',
function($modal) {

	this.resultsDlg	=	function (r) {
        var prettyHeader = ['Age', 'Gender', 'History', 'Smoker', 'Exercise min/wk', 'Cholesterol', 'BMI', 'Avg beats/min', 'Palpitations', 'Heart risk?', 'Confidence'];
		return $modal.open({
			templateUrl: 'partials/scoreResults.html',
			controller:	'ResultsCtrl',
			size:	'lg',
			resolve: {
				rspHeader: function	() {
					//return r[0].header;
					return prettyHeader;
				},
				rspData: function	() {
				//	return r.result;
					return r;
				}
			}
		});
	}

	this.errorDlg = function(msgTitle,	msgText) {
		return	$modal.open({
			templateUrl: 'partials/error.html',
			controller:	'ErrorCtrl',
			size:	'lg',
			resolve: {
				msgTitle:	function ()	{
					return msgTitle;
				},
				message: function	() {
					return msgText;
				}
			}
		});
	}

	return this;
}]);


/**
 *
 * This is the main Angular JavaScript module. 
 *
 * It has all the controller source
 *
 */
var bdadaysPMTester = angular.module("bdadaysPMTester", ['ui.bootstrap', 'sampleSrv']);

var	AppCtrl	=	['$scope',	'dialogServices', 'dataServices',
function AppCtrl($scope,	dialogServices, dataServices)	{
 		
	
	// init UI data model
	
	$scope.p = { AGE: '44',	SEX:'F', FAMILYHISTORY:'Y', SMOKERLAST5YRS: 'Y', EXERCISEMINPERWEEK: '125', CHOLESTEROL: '242', BMI: '24', AVGHEARTBEATSPERMIN: '100', PALPITATIONSPERDAY: '85'  };
		
	$scope.score = function()	{
		dataServices.getScore($scope.p)
		.then(
			function(rtn) {
				if (rtn.status == 200){
					// success
					console.log("score results: " + JSON.stringify(rtn.data));
					if (rtn.data.flag === undefined)
					   $scope.showResults(rtn.data);
				   else 
					  $scope.showError(rtn.data.message);
				} else {
					//failure
					$scope.showError(rtn.data.message);
				}
			},
			function(reason) {
				$scope.showError(reason);
			}
		);
	}
		
	$scope.showResults = function(rspHeader, rspData) {
		dialogServices.resultsDlg(rspHeader, rspData).result.then();
	}
		
	$scope.showError = function(msgText) {
		dialogServices.errorDlg("Error", msgText).result.then();
	}
}]

// This controller handles the results of the call to the ML Service
var	ResultsCtrl = ['$scope',	'$modalInstance',	'rspHeader', 'rspData',
function ResultsCtrl($scope,	$modalInstance, rspHeader, rspData) {
	
	var formattedData = [];
	
	formattedData.push(rspData.AGE.toString());
	formattedData.push(rspData.SEX);
	if (rspData.FAMILYHISTORY == 'Y')
	   formattedData.push('Yes');
    else
	   formattedData.push('No');
    
	if (rspData.SMOKERLAST5YRS == 'Y')
	   formattedData.push('Yes');
    else
	   formattedData.push('No');
   
    formattedData.push(rspData.EXERCISEMINPERWEEK.toString());
	formattedData.push(rspData.CHOLESTEROL.toString());
	formattedData.push(rspData.BMI.toString());
	formattedData.push(rspData.AVGHEARTBEATSPERMIN.toString());
	formattedData.push(rspData.PALPITATIONSPERDAY.toString());
	if (rspData.prediction == 1)
	   formattedData.push('Yes');
    else
	   formattedData.push('No');
   
   // Format confidence
    if (rspData.prediction == 1)
       confidence = (rspData.probability.values[1] * 100).toFixed(2) + '%';
    else
	   confidence = (rspData.probability.values[0] * 100).toFixed(2) + '%';
	
	formattedData.push(confidence);
	
	console.log('confidence is ' + confidence);	
	
	$scope.rspData = [];
	$scope.rspHeader = rspHeader;	
	
	
	$scope.rspData.push(formattedData);
	
	$scope.cancel	=	function() {
		$modalInstance.dismiss();
	}
}]

// This controller handles errors returned from the  call to the PM Service
var	ErrorCtrl = ['$scope',	'$modalInstance',	'msgTitle',	'message',
function ErrorCtrl($scope,	$modalInstance,	msgTitle,	message) {

	$scope.msgTitle	=	msgTitle;
	$scope.message = message;
	
	$scope.cancel	=	function() {
		$modalInstance.dismiss();
	}
}]

bdadaysPMTester.controller("AppCtrl",	AppCtrl);
bdadaysPMTester.controller("ResultsCtrl", ResultsCtrl);
bdadaysPMTester.controller("ErrorCtrl", ErrorCtrl);



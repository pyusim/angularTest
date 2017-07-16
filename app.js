var app=angular.module('myApp',['services']);

app.controller('mainController', ['$scope', 'parserService', function($scope, parserService) {

	    $scope.showText = "text to be shown";

	    var input = "(id,created,employee(id,firstname,employeeType(id), lastname),location)";

	    $scope.tokens = parserService.tokenizeLabels(input);

	    $scope.parsed = parserService.parseLabels($scope.tokens);
	}]);
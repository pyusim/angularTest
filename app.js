var app=angular.module('myApp',['services']);

app.controller('mainController', ['$scope', 'parserService', function($scope, parserService) {

	    $scope.sorted = false;

	    $scope.input = '(id,created,employee(id,firstname,employeeType(id), lastname),location)';

	    function compare(a, b) {

		if (a.label < b.label) return -1;
	    
		if (a.label > b.label) return 1;

		return 0;
	    }

	    $scope.tokenizeAndParse = function () {
		this.tokens = parserService.tokenizeLabels($scope.input);
		$scope.parse();
	    };

	    $scope.parse = function () {

		$scope.parsed = parserService.parseLabels(this.tokens, $scope.sorted ? compare : null);
	    };

	    $scope.tokenizeAndParse();
	}]);
angular.module('services', []).
    service('parserService', function() {
		
	    //
	    // This service aids in parsing a string that represents a nested structure of labels. The nesting can be arbitrarily deep, 
	    // limited only by the browser's ability to nest JavaScript recursive calls.
	    //
	    // Two methods are exposed - tokenizeLabels() and parseLabels(). It is conceivable that the service user will
	    // want to do just one of the actions at a time
	    //
	    // There exist libraries that provide lexers and parsers. As the grammar becomes more complex, it would be best
	    // to look into using a library.
	    //

	    var that = this;

	    var delims = {
		
		label : ',',
		listStart : '(',
		listEnd : ')'
	    };

	    //
	    // input  : a well form string of labels
	    // output : an array of tokens. Label separators are omitted because they serve no purpose during parsing
	    //
	    // example:
	    //  input -  "(id,created,employee(id,firstname,employeeType(id), lastname),location)" 
	    //  output - ['(', 'id', 'created', 'employee', '(', 'id', 'firstname', 'employeeType', '(', 'id', ')', 'lastname', ')', 'location', ')'];
	    //
	    that.tokenizeLabels = function(labelString) {

		if (typeof labelString === 'undefined') return null;

		if (typeof labelString !== 'string') return null;

		// split the trimmed string into characters first
		return labelString.trim().split('').reduce(function(acc, character) {

			if (character === delims.label) { 			

			    // if we are looking at a label delimiter, start a new array
			    acc.push([]);

			} else if (character === delims.listStart || character === delims.listEnd) {
			    
			    // if we are looking at a list delimiter, add the delimiter and then start a new array
			    acc.push([character], []);

			} else {

			    // this character is from a label - add it to the current label
			    acc[acc.length-1].push(character);
			}

			return acc;

		    }, [[]]).map(function(token) { // turn arrays of charactes into strings
				
			    return token.join('').trim();
			}).filter(function (token) { // git rid of all the empty tokens that reduce generated
				
				return token.length > 0;			    
			    });
	    };
	    
	    // Wrapper around local parseLabels - see the comment there for more information
	    that.parseLabels = function(tokens, compareFunction) {

		if (!tokens) return null;

		if (!Array.isArray(tokens)) return null;

		return parseLabels(tokens.slice(), compareFunction);
	    };

	    //
	    // input  : an array of tokens and a comparison function
	    // output : an nested object where label denotes label text, and nodes is an array of objects
	    //
	    // example:
	    //  input -  "(id,employee(id),location)" 
	    //  output - [ { label: 'id' }, { label: 'employee', nodes : [ { label: 'id' } ] }, { label: 'location' } ]
	    //	    
	    // This function modifies tokens, so it is not part of the service's API
	    // 
	    // All syntax errors result in a return value of null
	    //
	    var parseLabels = function(tokens, compareFunction) {

		// A well-formed structure has to be surrounded by parenthesis
		if (tokens[0] !== delims.listStart) return null;

		tokens.shift();

		var result = [ ];

		while (tokens.length) {

		    if (typeof tokens[0] !== 'string') return null;

		    if (tokens[0] === delims.listStart) {

			// a new list - the results of recursive call are put into nodes

			// these two checks cover lists without nodes
			if (result.length === 0) return null;

			if (result[result.length-1].nodes) return null;

			result[result.length-1].nodes = parseLabels(tokens, compareFunction);

		    } else if (tokens[0] === delims.listEnd) {

			// we just finished parsing an array - eat up the delimiter and return
			tokens.shift();

			if (typeof compareFunction === 'function') {

			    result.sort(compareFunction);
			}

			return result;
		    }
		    else {

			result.push( { label: tokens.shift() } );
		    }
		}

		return null;
	    };
	});;var app=angular.module('myApp',['services']);

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
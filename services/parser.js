angular.module('services', []).
    service('parserService', function() {
		
	    // "(id,created,employee(id,firstname,employeeType(id), lastname),location)" 

	    // id
	    // created
	    // employee
	    // - id
	    // - firstname
	    // - employeeType
	    // -- id
	    // - lastname
	    // location

	    // [ id, created, employee, [id, firstname, employeeType, [id], lastname ], location ]

	    var delims = {
		
		label : ',',
		listStart : '(',
		listEnd : ')'
	    };

	    // output an array of array
	    this.tokenizeLabels = function(labelString) {

		return labelString.trim().split('').reduce(function(acc, character) {
			
			if (character === delims.label) {

			    acc.push([]);

			} else if (character === delims.listStart || character === delims.listEnd) {
			    
			    acc.push([character], []);

			} else {

			    acc[acc.length-1].push(character);
			}

			return acc;

		    }, [[]]).filter(function (token) {

			    return token.length > 0;
			    
			}).map(function(token) {
				
				return token.join('').trim();
			    });
	    };

	    //
	    // ( id created employee ( id firstname employeeType ( id ) lastname ) location ) 
	    // 
	    // [ id, created, employee, [ id, firstname, employeeType, [id], lastname ], location
	    //
	    //

	    this.parseLabels = function(tokens) {		

		if (tokens[0] !== delims.listStart) return null;

		tokens.shift();

		var result = [];

		while (tokens.length) {

		    if (tokens[0] === delims.listStart) {

			result.push(this.parseLabels(tokens));

		    } else if (tokens[0] === delims.listEnd) {

			tokens.shift();
			return result;
		    }
		    else {

			result.push(tokens.shift());
		    }
		}

		return null;
	    };
	});
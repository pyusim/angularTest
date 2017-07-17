describe('Unit: Testing Services', function() {
	describe('Parser Service:', function() {
	       
		var parserService;		
		
		beforeEach(function() {

			var injector = angular.injector(['services']);
			parserService = injector.get('parserService');			
		    });
		
		it('should contain a parserService', function () {
			
			expect(parserService).not.toEqual(null);
		    });
		
		it('tokenize', function () {
			
			// input is null
			var output = parserService.tokenizeLabels(null);
			expect(output).toEqual(null);

			// input is not a string
			var output = parserService.tokenizeLabels({});
			expect(output).toEqual(null);

			// input is empty string
			output = parserService.tokenizeLabels('');
			expect(output).toEqual([]);

			// input has fields with spaces and is not trimmed
			output = parserService.tokenizeLabels('   field1, field with a space(        ');
			expect(output).toEqual(['field1', 'field with a space', '(']);

			// input has only delimiters and empty fields
			output = parserService.tokenizeLabels(',(,(),');
			expect(output).toEqual(['(', '(', ')']);
		    });

		it('parse', function () {
			
			// input is null
			var output = parserService.parseLabels(null);
			expect(output).toEqual(null);

			// input is not an array
			var output = parserService.parseLabels({});
			expect(output).toEqual(null);

			// input is an empty array
			var output = parserService.parseLabels([]);
			expect(output).toEqual(null);

			// input is an empty list
			var output = parserService.parseLabels(['(', ')']);
			expect(output).toEqual([]);

			// input has an unmatched parenthesis
			var output = parserService.parseLabels(['(', 'field1', '(', 'field2', ')']);
			expect(output).toEqual(null);

			// input starts with a list 
			var output = parserService.parseLabels(['(', '(', ')' ,'field2', ')']);
			expect(output).toEqual(null);

			// input has a list with no label
			var output = parserService.parseLabels(['(', 'field1', '(', 'field2', ')', '(','field2', ')', ')']);
			expect(output).toEqual(null);

			var input = ['(', 'field1', '(', 'field2', '(', 'field3', '(', 'field4', 'field5', '(', 'field6', ')', ')' ,')' ,')', ')'];

			var output = parserService.parseLabels(input);

			var expected = [ { label: 'field1', 
					   nodes: [ { label: 'field2', 
						      nodes: [ {label: 'field3', 
								nodes: [ { label : 'field4'}, { label: 'field5', 
												nodes: [ { label: 'field6'}  ] } ] } ] } ] } ];
			
			expect(output).toEqual(expected);
		    });
	    });
    });
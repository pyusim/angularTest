describe('Unit: Testing Services', function() {
	describe('Parser Service:', function() {
		
		beforeEach(function() {

			angular.module('services');
		    });
		
		it('should contain a parserService', function () {
			
			var injector = angular.injector(['services']);
			var parserService = injector.get('parserService');
			expect(parserService).not.toEqual(null);
		    });
		
		it('tokenize', function () {
			
			var injector = angular.injector(['services']);
			var parserService = injector.get('parserService');
			
			var input = '(id,created,employee(id,firstname,employeeType(id), lastname),location)';

			var expected = ['(', 'id', 'created', 
					'employee', '(', 'id', 'firstname', 'employeeType', '(', 'id', ')',
					'lastname', ')', 'location', ')'];
			
			console.log(input);

			var output = parserService.tokenizeLabels(input);		      
			
			expect(output).toEqual(expected);
		    });

		it('parse', function () {
			
			var injector = angular.injector(['services']);
			var parserService = injector.get('parserService');
			
			var input = ['(', 'id', 'created', 
					'employee', '(', 'id', 'firstname', 'employeeType', '(', 'id', ')',
					'lastname', ')', 'location', ')'];

			var expected = [ 'id', 'created', 'employee', 
					 [ 'id', 'firstname', 'employeeType', 
					   [ 'id' ],
					   'lastname' ], 
					 'location' ];
			
			console.log(input);
			
			var output = parserService.parseLabels(input);		      
			
			expect(output).toEqual(expected);
		    });
	    });
    });
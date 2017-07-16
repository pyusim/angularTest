module.exports = function(grunt) {
  
    grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),

	    concat: {
		options: {
		    separator: ';'
		},
		dist: {
		    src: [ 'services/**/*.js', 'app.js' ],
		    dest: 'dist/app.js'
		}
	    },

	    jasmine: {
		
		dist: {
		    src: 'dist/*.js',
		    options: {
			specs: 'tests/**/*.js',
			vendor: ['node_modules/angular/angular.js', 'node_modules/angular-mocks/angular-mocks.js'],
			summary: true
		    },
		}
	    },
    
	    jshint: {
		all: [ '*.js', 'services/*.js' ]
	    },

	    // Task configuration will be written here
	});

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
  
    grunt.registerTask('build', [ 'concat' ]);
    grunt.registerTask('unittests', [ 'jasmine' ]);
};

module.exports = function(grunt) {

  grunt.initConfig({
	cssmin: {
		my_target: {
			files: [
			    { src: 'src/css/style.css', dest: 'dist/css/style.min.css' }
		    ]
		}
	},
	jshint: {
		all: [
			'gruntfile.js', 'src/js/main.js'
		]
	},
	jsdoc : {
	    dist : {
	        src: ['src/js/main.js'],
	        options: {
	            destination : 'doc'
	        }
	    }
	},
    jsdoc2md: {
        oneOutputFile: {
            src: "src/js/main.js",
            dest: "readme.md"
        }
    },
    uglify:{
    	my_target: {
	      files: {
	        'dist/js/main.min.js': ['src/js/main.js']
	      }
	    }
	  },
	processhtml: {
	    options: {
	      data: {
	        message: 'Hello world!'
	      }
	    },
	    dist: {
	      files: {
	        'dist/index.html': ['src/index.html']
		  }
		}
	}
  });

grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-jsdoc');
grunt.loadNpmTasks("grunt-jsdoc-to-markdown");
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-processhtml');

grunt.registerTask('default', ['cssmin', 'jshint', 'jsdoc', 'jsdoc2md', 'uglify', 'processhtml']);

};
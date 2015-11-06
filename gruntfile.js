module.exports = function(grunt) {

  grunt.initConfig({
	  cssmin: {
		  my_target: {
		  	files: [
		    { src: 'src/css/style.css', dest: 'dist/css/style.css'}
		    ]
		  }
		}
  });

grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-jshint');

grunt.registerTask('default', ['cssmin', 'jshint']);

};
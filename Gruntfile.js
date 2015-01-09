module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		config: {
			css: 'css',
			js: 'js',
			banner:	'/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
					' *\n'+
					' * Adds draggable, resizable, maximizable, and minimizable windows to your site\n'+
					' *\n'+
					' * <%= pkg.repository.url %>\n'+
					' * Copyright (c) 2014 <%= pkg.author.name %> \<<%= pkg.author.email %>\> [<%= pkg.author.url %>]\n'+
					' * Licensed under <%= pkg.license %>\n'+
					' */'
			},
		clean: {
			min: ["<%= config.js %>/*.min.js","<%= config.cs %>/*.min.css"]
		},
		'string-replace': {
			inline: {
				files: {
					'<%= config.js %>/':'<%= config.js %>/<%= pkg.name %>.js',
					'<%= config.css %>/':'<%= config.css %>/<%= pkg.name %>.css'
				},
				options: {
					replacements: [{
						pattern: /^\/\*(.|[\r\n])*?\*\//g,
						replacement: '<%= config.banner %>'
					}]
				}
			}
		},
		uglify: {
			options: {
				banner: '<%= config.banner %>',
				sourceMap: true
			},
			build: {
				src: '<%= config.js %>/<%= pkg.name %>.js',
				dest: '<%= config.js %>/<%= pkg.name %>.min.js'
			}
		},
		cssmin: {
			my_target: {
				src: '<%= config.css %>/<%= pkg.name %>.css',
				dest: '<%= config.css %>/<%= pkg.name %>.min.css'
			}
		}
	});

	// Load the plugin that provides the tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-css');
	//grunt.loadNpmTasks('grunt-contrib-copy');
	
	// Default task(s).
	grunt.registerTask('default', ['clean','string-replace','uglify','cssmin']);

};
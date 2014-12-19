module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	config: {
		src: 'Windoge Demo',
		dist: 'dist',
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
		dist: ["<%= config.dist %>/*.js","<%= config.dist %>/*.css"]
	},
	'string-replace': {
		inline: {
			files: {
				'<%= config.src %>/': ['<%= config.src %>/<%= pkg.name %>.js', '<%= config.src %>/<%= pkg.name %>.css'],
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
			banner: '<%= config.banner %>\n'
		},
		build: {
			src: '<%= config.src %>/<%= pkg.name %>.js',
			dest: '<%= config.dist %>/<%= pkg.name %>.min.js'
		}
	},
	cssmin: {
		options: {
			banner: '<%= config.banner %>\n'
		},
		my_target: {
				src: '<%= config.src %>/<%= pkg.name %>.css',
				dest: '<%= config.dist %>/<%= pkg.name %>.min.css'
		}
	},
	copy: {
		main: {//Copy the original "un-minified" files to the dist as well
			files: [
				{expand: true, flatten: true, src: ['<%= config.src %>/*.js'], dest: '<%= config.dist %>/', filter: 'isFile'},
				{expand: true, flatten: true, src: ['<%= config.src %>/*.css'], dest: '<%= config.dist %>/', filter: 'isFile'}
			]
		}
	}
	});

	// Load the plugin that provides the tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-css');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	// Default task(s).
	grunt.registerTask('default', ['clean','string-replace','uglify','cssmin','copy']);

};
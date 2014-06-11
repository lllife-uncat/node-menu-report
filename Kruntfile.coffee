module.exports = (grunt) ->
	grunt.initConfig
		copy:
			venders:
				files: [
					{
						cwd: "src/venders"
						expand: true
						src: ["**"]
						dest: "dev/venders"
					}
					{
						cwd: "src/images"
						expand: true
						src: ["**"]
						dest: "dev/images"
					}
				]
		sync:
			main: {
				files: [
					{ cwd: "src", src: "**/*.html", dest: "dev/" }
					{ cwd: "venders", src: "**/*.*", dest: "dev/" }
				]
			}
		connect:
			options:
				port: 8000
				hostname: "0.0.0.0"
				base: "dev/"

			livereload:
				options:
					open: false
		watch:
			js:
				files: ["src/js/*.js", "src/js/**/*.js"]
				tasks: ["concat:js"]
			css:
				files: ["src/css/*.css"]
				tasks: ["concat:css"]
			html:
				files: ["src/views/**/*.html"]
				tasks: ["sync"]
			index:
				files: ["src/index.html"]
				tasks: ["sync"]
			options:
				livereload :
                	port: 8888

		concat:
			js:
				src: [
					"src/js/app.js"
					"src/js/services/**/*.js"
					"src/js/controllers/**/*.js"
          "src/js/directives/**/*.js"
				]
				dest: "dev/js/final.js"
			css:
				src: ["src/css/*.css"]
				dest: "dev/css/style.css"

	grunt.loadNpmTasks "grunt-contrib-concat"
	grunt.loadNpmTasks "grunt-contrib-watch"
	grunt.loadNpmTasks "grunt-contrib-copy"
	grunt.loadNpmTasks "grunt-contrib-connect"
	grunt.loadNpmTasks "grunt-sync"
	grunt.registerTask "default", ["copy", "connect:livereload","watch"]

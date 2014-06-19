module.exports = (grunt) ->
  
  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    
    concat:
      dist:
        src: [ 'build/*.js']
        dest: 'build/production.js'

    uglify:
        build:
            src: 'build/production.js',
            dest: 'build/production.min.js'
    
    watch:
        scripts:
            files: ['build/*.js']
            tasks: ['build']
            options:
              livereload: true
              spawn: false
            
      
  

    requirejs: 
      compile: 
        options: 
          baseUrl: "public"
          #mainConfigFile: "public/config.js"
          #name: "path/to/almond"
          dir: "build"
          paths: {
            "require": "../bower_components/requirejs/require",
            "cs": "../bower_components/require-cs/cs",
            "pico": "../node_modules/node-pico/pico",
            "text": "../bower_components/requirejs-text/text"

          },
          packages: [{
              "name": "cs",
              "location": "../bower_components/require-cs",
              "main": "cs"
             },{
              "name": "coffee-script",
              "location": "../bower_components/coffee-script",
              "main": "index"
          }],
          modules: [{
            "name": "main",
            "exclude": ["coffee-script"]
          }]

  
  require('load-grunt-tasks')(grunt);
  # grunt.loadNpmTasks 'grunt-contrib-concat'
  # grunt.loadNpmTasks 'grunt-contrib-uglify'
  # grunt.loadNpmTasks 'grunt-contrib-watch' 
  # grunt.loadNpmTasks 'grunt-contrib-requirejs' 
  grunt.loadNpmTasks 'grunt-newer' 
  
  # Default task(s).
  grunt.registerTask 'build', 'Restart the app daemon', [
      'newer:concat'
      'uglify'
  ]


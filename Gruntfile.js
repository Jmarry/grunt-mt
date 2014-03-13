/*
 * grunt-mt
 * https://github.com/Jmarry/grunt-mt
 *
 * Copyright (c) 2014 Jmarry
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Configuration to be run (and then tested).
    mt: {
      Config: {
        options: {
            path:'/test/'
        }
      }
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('MT', ['mt:Config']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'MT']);

};

/*
 * grunt-mt
 * https://github.com/Jmarry/grunt-mt
 *
 * Copyright (c) 2014 Jmarry
 * Licensed under the MIT license.
 */

'use strict';
var CWD = process.cwd(),
    tools = require('../bin/tools'),
    checkMatch = require('../bin/checkCustomTag');

module.exports = function (grunt) {
    grunt.file.defaultEncoding = 'utf8';
    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('mt', 'tms module test', function () {
        var options = this.options({
                path: ''
            }),
            testPath = CWD + options.path;
        if (grunt.file.exists(testPath)) {
            grunt.file.recurse(testPath, function (absPath, rootDir, subDir, filename) {
                if (tools.checkFileType(filename) === 'php') {
                    grunt.log.subhead('check the  module: ' + subDir);
                    checkMatch.goCheck(grunt.file.read(absPath));
                }
            });
        } else {
            grunt.warn('path is not found!:');
        }
    });

};

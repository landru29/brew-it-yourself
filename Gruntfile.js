/*jslint nomen: true*/
/*global require, module,  __dirname */

module.exports = function (grunt) {
    "use strict";

    // Load Grunt tasks declared in the package.json file
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Configure Grunt
    grunt.initConfig({

        express: {
            all: {
                options: {
                    bases: [__dirname],
                    port: 9000,
                    hostname: "0.0.0.0",
                    livereload: true
                }
            }
        },

        open: {
            all: {
                path: 'http://localhost:<%= express.all.options.port%>',
                app: 'google-chrome'
            }
        },

        watch: {
            all: {
                files: ['index.html', 'scripts/**', 'styles/**', 'views/**'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            }
        },

        jshint: {
            all: [
                '../lib/**/*.js',
                './scripts/**/*.js',
                'Gruntfile.js'
            ]
        }
    });

    grunt.registerTask('serve', [
        'express',
        'open',
        'watch'
    ]);

    grunt.registerTask('check', [
        'jshint'
    ]);
};
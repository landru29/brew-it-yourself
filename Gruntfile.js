/*jslint nomen: true*/
/*global require, module,  __dirname */

module.exports = function (grunt) {
    "use strict";

    // Load Grunt tasks declared in the package.json file
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Configure Grunt
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        project: {
            build: './build',
            dist: './dist'
        },

        /*************************************************/
        /** TASK USED IN GRUNT SERVE                    **/
        /*************************************************/
        express: { // create a server to localhost
            dev: {
                options: {
                    bases: [__dirname],
                    port: 9000,
                    hostname: "0.0.0.0",
                    livereload: true
                }
            },
            prod_check: {
                options: {
                    bases: [__dirname + '/dist'],
                    port: 3000,
                    hostname: "0.0.0.0",
                    livereload: true
                }
            }
        },

        open: { // open application in Chrome
            dev: {
                path: 'http://localhost:<%= express.dev.options.port%>',
                app: 'google-chrome'
            },
            prod_check: {
                path: 'http://localhost:<%= express.prod_check.options.port%>',
                app: 'google-chrome'
            }
        },

        watch: { // watch files, trigger actions and perform livereload
            dev: {
                files: ['index.html', 'scripts/**', 'styles/**', 'views/**'],
                tasks: ['jshint', 'sass:dist', 'copy:dev'],
                options: {
                    livereload: true
                }
            },
            prod_check: {
                files: ['<%= project.dist%>/**'],
                options: {
                    livereload: true
                }
            }
        },

        jshint: {
            dev: [
                '../lib/**/*.js',
                './scripts/**/*.js',
                'Gruntfile.js'
            ]
        },

        /*************************************************/
        /** TASK USED BUILDING                          **/
        /*************************************************/

        useminPrepare: {
            html: {
                src: ['./index.html']
            },
            options: {
                dest: '<%= project.dist%>',
                staging: '<%= project.build%>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        usemin: {
            html: [
                '<%= project.dist%>/index.html'
            ],
            options: {
                assetsDirs: ['<%= project.dist%>']
            }
        },

        concat: { // concatenate JS files in one
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: [
                    'scripts/*.js',
                    'scripts/controllers/*.js',
                    'scripts/directives/*.js',
                    'scripts/services/*.js'
                ],
                // the location of the resulting JS file
                dest: 'build/<%= pkg.name %>.js'
            }
        },

        wiredep: { // Inject bower components in index.html
            app: {
                src: ['./index.html'],
                //exclude: [/jquery/]
                /*,
                ignorePath: /\.\.\//*/
            }
        },

        cssmin: {
            dist: {
                files: [
                    {
                        dest: '<%= project.dist%>/styles/styles.min.css',
                        src: ['styles/*.css', '<%= project.build%>/styles/*.css']
                    }
                ]
            }
        },

        uglify: { // uglify the concatenated JS file
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/scripts/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        clean: { // erase all files in dist and build folder
            dist: ["dist", "build"]
        },

        sass: { // compile SCSS files into css files
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'build/styles/main.css': 'styles/main.scss',
                }
            }
        },

        filerev: { // change the name of files to avoid browser cache issue
            options: {
                algorithm: 'md5',
                length: 8
            },
            css: {
                src: '<%= project.dist%>/*.css'
            },
            js: {
                src: '<%= project.dist%>/*.js'
            }
        },

        copy: { // Copy files (images, ...)
            dist: {
                files: [
                    { // Images for the styles
                        expand: true,
                        flatten: true,
                        src: ['styles/img/**'],
                        dest: '<%= project.dist%>/styles/img'
                    },
                    { // html files in views foldder
                        expand: true,
                        src: ['views/**'],
                        dest: '<%= project.dist%>/'
                    },
                    { // glyphicon from bootstrap
                        expand: true,
                        flatten: true,
                        src: ['bower_components/bootstrap/fonts/*'],
                        filter: 'isFile',
                        dest: '<%= project.dist%>/fonts'
                    },
                    { // JSON fils in data folder
                        expand: true,
                        flatten: true,
                        src: ['data/*.json'],
                        dest: '<%= project.dist%>/data',
                        filter: 'isFile'
                    }

                ],
            },
            html: {
                files: [
                    {
                        expand: true,
                        src: ['index.html'],
                        dest: '<%= project.dist%>/',
                        filter: 'isFile'
                    }
                ]
            },
            dev: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['styles/img/**'],
                        dest: '<%= project.build%>/styles/img'
                    },
                ]
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'dist.tgz'
                },
                files: [
                    {
                        src:['dist/**'],
                        expand:true,
                        dest: '.'
                    }
                ]
            }
        }
    });

    grunt.registerTask('serve', [
        'wiredep',
        'express:dev',
        'open:dev',
        'watch:dev'
    ]);

    grunt.registerTask('prod_check', [
        'express:prod_check',
        'open:prod_check',
        'watch:prod_check'
    ]);

    grunt.registerTask('check', [
        'wiredep',
        'jshint:dev'
    ]);

    grunt.registerTask('prod', [
        'clean:dist',
        'wiredep',
        'copy:html',
        'useminPrepare',
        'concat:dist',
        'concat:generated', // this task is generated by useminPrepare
        'sass:dist',
        'cssmin:dist',
        'cssmin:generated', // this task is generated by useminPrepare
        'uglify:dist',
        'uglify:generated', // this task is generated by useminPrepare
        'copy:dist',
        'filerev:js',
        'filerev:css',
        'usemin',
        'compress'
    ]);
};
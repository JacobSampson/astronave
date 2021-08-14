module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
  
      cssmin: {
        dev: {
          files: {
            'dist/style.css': 'src/style/*.css'
          }
        },
        rel: {
          options: {
            mergeIntoShorthands: true
          },
          files: {
            'dist/style.css': 'src/style/*.css'
          }
        }
      },
      watch: {
        cssmin: {
          files: 'src/**/*.css',
          tasks: ['mincss:dev']
        },
        js: {
          files: ['src/**/*.js'],
          tasks: ['uglify:dev']
        },
        html: {
          files: ['src/**/*.html'],
          tasks: ['copy:htmldev']
        }
      },
      uglify: {
        dev: {
          options: {
            mangle: false,
            sourceMap: true,
            beautify: true
          },
          files: {
            'dist/scripts.js': [
              'src/js/*.js'
            ]
          }
        },
        rel: {
          options: {
            mangle: false,
            sourceMap: false,
            compress: true,
            beautify: false
          },
          files: {
            'dist/scripts.js': [
              'src/js/*.js'
            ]
          }
        }
      },
      copy: {
        htmldev: {
          files: [{
            expand: true,
            cwd: 'src/html',
            src: ['**'],
            dest: 'dist/'
          }]
        },
        htmlrel: {
          files: [{
            expand: true,
            cwd: 'src/html',
            src: ['**'],
            dest: 'dist/'
          }]
        }
      },
      compress: {
        makezip: {
          options: {
            archive: 'release.zip'
          },
          files: [{
              src: ['dist/*'],
              dest: '/'
            } ]
        }
      },
      open: {
        game: {
          path: 'http://localhost:8000/dist',
          app: 'chrome'
        }
      },
      connect: {
        server: {
          port: 8000,
        }
      },
    });
  
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-compress');
  
    grunt.registerTask('develop', ['cssmin:dev', 'uglify:dev', 'copy:htmldev', 'connect', 'open', 'watch']);
    grunt.registerTask('release', ['cssmin:rel', 'uglify:rel', 'copy:htmlrel','compress:makezip']);
  };
  
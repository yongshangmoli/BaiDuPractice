module.exports = function(grunt) {
    // 项目配置.
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
         concat: {
           options: {
               separator: ';',
               stripBanners: true
           },
           dist: {
               src: [
                   "js/common.js", 
                   "js/font-adjust.js",
               ],
               dest: "build/sufferer.js"
           }

       },
        uglify:{
            options:{
                banner:'/*!<%= pkg.name %><%= grunt.template.today("yyyy-mm-dd") %>*/\n'
            },
            dist:{
              files:{"build/sufferer.min.js":"build/sufferer.js"}
            }
            
        },
        cssmin:{
            target: {
                files: [{
                  expand: true,
                  cwd: 'css/',
                  src: ['*.css'],
                  dest: 'build',
                  ext: '.min.css'
                }]
            }
        },

        connect: {
            server: {
                options: {
                    port: 8080,
                    base: '.'
                }
            }
        },
       /* qunit: {
          options: {
            timeout: 10000,
            '--cookies-file': 'misc/cookies.txt'
          },
          all: ['./test.html']
          all: {
            options: {
              url: [
                'http://10.16.103.33:8080/test.html'
              ]
            }
          }
        },*/
        jshint: {
          files: ['build/sufferer.js'],
          options: {
            globals: {
              jQuery: true,
              console: true,
              module: true
            }
          }
        },
        watch: {
          files: ['<%= jshint.files %>'],
          tasks: ['jshint', 'qunit']
        }
    });

  // 加载任务.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // grunt.loadNpmTasks('grunt-contrib-qunit');
    // grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

  // 默认执行的任务.
  // grunt.registerTask('default', ['jshint','uglify','nodeunit']);
    grunt.registerTask('default', ['concat','uglify','cssmin',/*'qunit',*/'jshint','watch']);

};
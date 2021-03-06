/* ----------------------------------------------------------------------
 * Grunt
 *
 * 開発開始手順
 * $ npm install
 * $ grunt
 *
 * 開発watch,connectコマンド
 * $ grunt w
 *
 ---------------------------------------------------------------------- */

module.exports = function (grunt) {

  // manage
  require('time-grunt')(grunt);
  require('jit-grunt')(grunt, {
    // sprite
    sprite: 'grunt-spritesmith'
  });


  // process
  grunt.initConfig({

    path: {
      src: 'src/',
      dist: 'dist/',
      hbs_src: 'src/hbs/',
      scss_src: 'src/scss/',
      js_src: 'src/js/',
      img_src: 'src/img/',
      sprite_src: 'src/sprite/'
    },

    pkg: grunt.file.readJSON('package.json'),

    clean: ['<%= path.dist %>'],


    /* html */
    assemble: {
      options: {
        layoutdir: '<%= path.hbs_src %>layouts/',
        partials: ['<%= path.hbs_src %>partials/**/*.hbs'],
        data: ['<%= path.hbs_src %>data/**/*.{json,yml}'],
        helpers: ['handlebars-helper-prettify'],
        prettify: {
          indent: 4
        }
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.hbs_src %>pages/',
          src: ['**/*.hbs'],
          dest: '<%= path.dist %>'
        }]
      }
    },


    /* css */
    // spriteファイルの数だけタスクを記述
    sprite: {
      all: {
        src: ['<%= path.sprite_src %>*.png'],
        dest: '<%= path.dist %>img/sprite.png',
        imgPath: '../img/sprite.png',
        destCss: '<%= path.scss_src %>module/_sprite.scss',
        padding: 5
      }
    },

    sass: {
      options: {
        style: 'compact',
        sourcemap: 'none',
        noCache: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= path.scss_src %>',
          src: ['**/*.scss'],
          dest: '<%= path.dist %>css/',
          ext: '.css'
        }]
      },
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 7', 'ie 8', 'ie 9']
      },
      all: {
        src: '<%= path.dist %>css/**/*.css'
      }
    },

    csscomb: {
      all: {
        expand: true,
        cwd: '<%= path.dist %>css/',
        src: ['**/*.css'],
        dest: '<%= path.dist %>css/',
      }
    },

    csso: {
      all: {
        expand: true,
        cwd: '<%= path.dist %>css/',
        src: ['**/*.css'],
        dest: '<%= path.dist %>css/',
        options: {
          restructure: false
        }
      }
    },


    /* js */
    // 生成したいファイルの数だけタスクを記述
    concat: {
      options : {
        sourceMap :true
      },
      all: {
        src: ['<%= path.js_src %>*.js'],
        dest: '<%= path.dist %>js/all.js'
      },
      sample: {
        src: ['<%= path.js_src %>huge.js', '<%= path.js_src %>hoge.js'],
        dest: '<%= path.dist %>js/sample.js'
      }
    },

    // 生成したいファイルの数だけタスクを記述
    uglify: {
      options: {
        sourceMap : true,
        sourceMapIncludeSources : true
      },
      all: {
        options: {
          sourceMapIn : ['<%= path.dist %>js/all.js.map']
        },
        files: {
          '<%= path.dist %>js/all.js': ['<%= path.dist %>js/all.js']
        }
      },
      sample: {
        options: {
          sourceMapIn : ['<%= path.dist %>js/sample.js.map']
        },
        files: {
          '<%= path.dist %>js/sample.js': ['<%= path.dist %>js/sample.js']
        }
      }
    },


    /* img */
    // なぜかうまくいかないときがある
    imagemin: {
      all: {
        files: [{
          expand: true,
          cwd: '<%= path.img_src %>',
          src: ['**/*.{png,jpg}'],
          dest: '<%= path.dist %>img/'
        }]
      }
    },

    // imageminがうまくいかないとき用
    copy: {
      img: {
        expand: true,
        cwd: '<%= path.img_src %>',
        src: ['**/*.{png,jpg}'],
        dest: '<%= path.dist %>img/'
      }
    },


    watch: {
      html: {
        files: ['src/**/*.{hbs,json,yml}'],
        tasks: ['build:html']
      },
      css: {
        files: ['src/**/*.scss'],
        tasks: ['build:css'],
      },
      js: {
        files: ['src/**/*.js'],
        tasks: ['build:js']
      },
      img: {
        files: ['src/**/*.{png,jpg}'],
        tasks: ['build:img']
      },
      options: {
        livereload: true
      }
    },

    connect: {
      server: {
        options: {
          port: 1108,
          base: 'dist/'
        }
      }
    }

  });


  grunt.registerTask('build:html', ['assemble']);
  grunt.registerTask('build:css', ['sprite', 'sass', 'autoprefixer', 'csscomb', 'csso']);
  grunt.registerTask('build:js', ['concat', 'uglify']);
  grunt.registerTask('build:img', ['copy']);
  grunt.registerTask('build', ['clean', 'build:html', 'build:css', 'build:js', 'build:img']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('w', ['connect', 'watch']);
};

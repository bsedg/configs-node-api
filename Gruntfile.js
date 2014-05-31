module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        mochaTest: {
            test: {
                options: {
                    timeout: 100000,
                    reporter: 'spec'
                },
                src: ['test/**/*.js']
            }
        },
        jshint: {
            all: [
                'controllers/**/*.js',
                'models/**/*.js',
                'utils/**/*.js',
                'test/**/*.js',
                'workers/clipp_ranker.js',
                'workers/engagement_emails.js']
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('hint', ['jshint']);
    grunt.registerTask('all', ['jshint', 'mochaTest']);

    grunt.registerTask('default', ['mochaTest', 'jshint']);

};
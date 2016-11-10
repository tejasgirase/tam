var gulp    = require("gulp");
var nodemon = require("gulp-nodemon");
var run     = require('gulp-run');
var nconf   = require('./config.js');
// nconf.argv().env().file({ file: 'config.json' });

var Username     = nconf.Username;
var UserPassword = nconf.UserPassword;
var medical_db   = nconf.DB;
var pi_db        = nconf.PI_DB;
var user_db      = nconf.USER_DB;
var COUCH_URL    = "https://"+Username+":"+UserPassword+"@"+Username+".cloudant.com/";

// use gulp-run to start a pipeline
gulp.task('couchpush_db5', function() {
  return run('couchapp push ./public/ '+ COUCH_URL + medical_db).exec();
});

gulp.task('couchpush_db5_pi', function() {
  return run('couchapp push ./tamsa_pi/ '+ COUCH_URL + pi_db).exec();
});

gulp.task('couchpush_users', function() {
  return run('couchapp push ./tamsa_replicated/ '+ COUCH_URL + user_db).exec();
});


gulp.task('forever_start',["couchpush_db5","couchpush_db5_pi","couchpush_users"], function() {
  return run('forever start -a -l forever.log -o out.log -e err.log app.js').exec();
});

gulp.task('forever_restart',["couchpush_db5","couchpush_db5_pi","couchpush_users"], function() {
  return run('forever restart -a -l forever.log -o out.log -e err.log app.js').exec();
});

gulp.task('forever_stop',function() {
  return run('forever stop app.js').exec();
});

gulp.task("serve",["couchpush_db5","couchpush_db5_pi","couchpush_users"],function() {
	var options = {
		script:"app.js",
		delayTime:1,
		ext: "js css html",
		env:{
			PORT:55554
		}
	};
	return nodemon(options).on("restart",function(){
		console.log("restarting the Server.");
	});
});

gulp.task("default", ["serve"]);
var gulp    = require("gulp");
var nodemon = require("gulp-nodemon");
var run     = require('gulp-run');
var nconf   = require('nconf');
nconf.argv().env().file({ file: 'config.json' });

var Username     = nconf.get("Username");
var UserPassword = nconf.get("UserPassword");
var medical_db   = nconf.get("DB");
var COUCH_URL    = "https://"+Username+":"+UserPassword+"@"+Username+".cloudant.com/"+medical_db;

// use gulp-run to start a pipeline
gulp.task('couchpush', function() {
  return run('couchapp push ./public/ '+COUCH_URL).exec();
});

gulp.task('forever_start',["couchpush"], function() {
  return run('forever start -l forever.log -o out.log -e err.log app.js').exec();
});

gulp.task('forever_restart',["couchpush"], function() {
  return run('forever restart -l forever.log -o out.log -e err.log app.js').exec();
});

gulp.task('forever_stop',function() {
  return run('forever stop app.js').exec();
});

gulp.task("serve",["couchpush"],function() {
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
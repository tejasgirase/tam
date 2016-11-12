var gulp        = require("gulp");
var nodemon     = require("gulp-nodemon");
var run         = require('gulp-run');
var nconf       = require('./config.js');
var env         = require("gulp-env");
// nconf.argv().env().file({ file: 'config.json' });

// use gulp-run to start a pipeline
 
function cloudConfiguration() {
  env({
    vars: {
    	APP_ENVIRONMENT:"Cloud",
			APP_MODULE:'cloudant',
			DB_PROTOCOL:'https',
			DB_URL:'sensoryhealthsystems.cloudant.com',
			PORT:'55554',
			SESSION_MODULE:"sessionstore-cloudant",
			Username:'sensoryhealthsystems',
			UserPassword:'SHS_Cloudant1234',
			CLOUDANT_API_KEY:'irldeadifecondecturponda',
			CLOUDANT_PASSWORD:'0b86279b5be376c211c43493d854d7bf1e4db832',
			CLOUDANT_PORT:'443',
			USER_DB:'yhsqizvkmp',
			DB:'meluha_db5',
			PI_DB:'meluha_db5_pi',
			SESSION_DB:'sessions',
			// MAIL_API_KEY:'key-2e1c148b591cdd5767904c9e482b34ce',
			MAIL_DOMAIN:'mg.sensoryhealthsystems.com',
			MAIL_ID:'Sensory Health Systems Admin <noreply@sensoryhealthsystems.com>',
			IV:'EK9Hd0Ahf5PJ8eS8',
			SECRET_KEY:'sterceSllAfOterceSehT',
		}
  });
}

function FSConfiguration() {
  env({
    vars: {
    	APP_ENVIRONMENT:"FS",
			APP_MODULE:'nano',
			DB_PROTOCOL:'http',
			DB_URL:'localhost:5984',
			SESSION_MODULE:"sessionstore",
			PORT:'55555',
			Username:'nirmal',
			UserPassword:'nirmal',
			CLOUDANT_API_KEY:'nirmal',
			CLOUDANT_PASSWORD:'nirmal',
			CLOUDANT_PORT:'5984',
			USER_DB:'yhsqizvkmp',
			DB:'meluha_db5',
			PI_DB:'meluha_db5_pi',
			SESSION_DB:'sessions',
			// MAIL_API_KEY:'key-2e1c148b591cdd5767904c9e482b34ce',
			MAIL_DOMAIN:'mg.sensoryhealthsystems.com',
			MAIL_ID:'Sensory Health Systems Admin <noreply@sensoryhealthsystems.com>',
			IV:'EK9Hd0Ahf5PJ8eS8',
			SECRET_KEY:'sterceSllAfOterceSehT',
		}
  });
  console.log(process.env.APP_ENVIRONMENT);
}

gulp.task('couchpush_db5', function() {
	var COUCH_URL    = process.env.DB_PROTOCOL+"://"+process.env.Username+":"+process.env.UserPassword+"@"+process.env.DB_URL + "/";
  return run('couchapp push ./public/ '+ COUCH_URL + process.env.DB).exec();
});

gulp.task('couchpush_db5_pi', function() {
	var COUCH_URL    = process.env.DB_PROTOCOL+"://"+process.env.Username+":"+process.env.UserPassword+"@"+process.env.DB_URL + "/";
  return run('couchapp push ./tamsa_pi/ '+ COUCH_URL + process.env.PI_DB).exec();
});

gulp.task('couchpush_users', function() {
	var COUCH_URL    = process.env.DB_PROTOCOL+"://"+process.env.Username+":"+process.env.UserPassword+"@"+process.env.DB_URL + "/";
  return run('couchapp push ./tamsa_replicated/ '+ COUCH_URL + process.env.USER_DB).exec();
});

gulp.task('forever_start',["couchpush_db5","couchpush_db5_pi","couchpush_users"],function(foreverStart) {
	return run('forever start -a -l forever.log -o out.log -e err.log app.js').exec();
});

gulp.task('forever_restart',["couchpush_db5","couchpush_db5_pi","couchpush_users"], function() {
  return run('forever restart -a -l forever.log -o out.log -e err.log app.js').exec();
});

gulp.task('forever_stop',function() {
  return run('forever stop app.js').exec();
});

gulp.task('start_cloud_configuration_setup', function() {
	cloudConfiguration();
  gulp.start("forever_start");
});

gulp.task('start_fs_configuration_setup', function() {
	FSConfiguration();
  gulp.start("forever_start");
});

gulp.task('cloud_configuration_setup', function() {
	cloudConfiguration();
  gulp.start("forever_restart");
});

gulp.task('fs_configuration_setup', function() {
	FSConfiguration();
  gulp.start("forever_restart");
});

// gulp.task('start',["cloud_configuration_setup"]);
gulp.task('start',[process.env.NODE_ENV === 'FS' ? 'start_fs_configuration_setup' : 'start_cloud_configuration_setup']);
gulp.task('restart',[process.env.NODE_ENV === 'FS' ? 'fs_configuration_setup' : 'cloud_configuration_setup']);

// gulp.task("serve",["couchpush_db5","couchpush_db5_pi","couchpush_users"],function() {
// 	var options = {
// 		script:"app.js",
// 		delayTime:1,
// 		ext: "js css html",
// 		env:{
// 			PORT:55554
// 		}
// 	};
// 	return nodemon(options).on("restart",function(){
// 		console.log("restarting the Server.");
// 	});
// });

// gulp.task("default", ["serve"]);
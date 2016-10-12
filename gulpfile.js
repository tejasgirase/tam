var gulp    = require("gulp");
var nodemon = require("gulp-nodemon");

gulp.task("serve",function() {
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
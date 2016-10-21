var passport      = require("passport"),
		LocalStrategy = require("passport-local").Strategy,
		Cloudant      = require("cloudant"),
		config        = require("./../../config"),
		cloudant      = Cloudant(config.CLOUDENT_IP),
		db            = cloudant.db.use(config.USER_DB);

module.exports = function(app) {
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser(function(user,cb) {
		cb(null,user.username);
	});

	passport.deserializeUser(function(user,cb) {
		db.get("org.couchdb.user:"+user, function(err,body){
			if(!err) {
				cb(null,body);
			}	
		});
	});

	passport.use(new LocalStrategy({
		usernameField: "username",
		passwordField: "password"
	},
	function(username, password, cb) {
		db.get("org.couchdb.user:"+username, function(err,body){
			if(!err) {
				if(password == body.password) {
					var user = {
						username: body.email,
						password:body.password
					};
					cb(null, user);
				}else {
					cb(null, false);
				}
			}else {
				cb(null, false);
			}
		});
	}));
};

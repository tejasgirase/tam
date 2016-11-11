var nconf           = require('./../../config');
var passport      = require("passport"),
		Username          = nconf.Username,
		UserPassword      = nconf.UserPassword,
		USER_DB           = nconf.USER_DB,
		CLOUDANT_API_KEY  = nconf.CLOUDANT_API_KEY,
		CLOUDANT_PASSWORD = nconf.CLOUDANT_PASSWORD,
		CLOUDANT_PORT     = nconf.CLOUDANT_PORT,
		LocalStrategy     = require("passport-local").Strategy,
		Cloudant          = require(nconf.APP_MODULE),
		cloudant          = Cloudant(nconf.DB_PROTOCOL+"://"+CLOUDANT_API_KEY+":"+CLOUDANT_PASSWORD+"@"+nconf.DB_URL),
		db                = cloudant.db.use(USER_DB);
		var cryptLib      = require('cryptlib'),
		iv                = nconf.IV, //16 bytes = 128 bit 
		key               = cryptLib.getHashSha256(nconf.SECRET_KEY, 32);

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
				var encrypt_password = cryptLib.encrypt(password, key, iv);
				console.log(encrypt_password);
				console.log(body.password);
				if(encrypt_password == body.password) {
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

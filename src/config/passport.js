var nconf           = require('./../../config');
// nconf.argv().env().file({ file: 'config.json' });
var passport      = require("passport"),
		Username          = nconf.Username,
		UserPassword      = nconf.UserPassword,
		USER_DB           = nconf.USER_DB,
		CLOUDANT_API_KEY  = nconf.CLOUDANT_API_KEY,
		CLOUDANT_PASSWORD = nconf.CLOUDANT_PASSWORD,
		LocalStrategy     = require("passport-local").Strategy,
		// Cloudant       = require("cloudant"),
		Cloudant          = require('nano'),
		cloudant          = Cloudant("http://"+CLOUDANT_API_KEY+":"+CLOUDANT_PASSWORD+"@192.168.0.66:5984"),
		// cloudant       = Cloudant("https://"+Username+":"+UserPassword+"@"+Username+".cloudant.com"),
		db                = cloudant.db.use(USER_DB);
		var cryptLib      = require('cryptlib'),
		iv                = nconf.IV, //16 bytes = 128 bit 
		// key            = "b16920894899c7780b5fc7161560a412";//32 bytes = 256 bits 
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
		console.log(username);
		console.log(password);
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
					console.log("in else 2");
					cb(null, false);
				}
			}else {
				console.log("in else 1");
				console.log(err);
				cb(null, false);
			}
		});
	}));
};

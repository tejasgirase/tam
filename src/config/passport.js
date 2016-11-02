var nconf           = require('nconf');
nconf.argv().env().file({ file: 'config.json' });
var passport      = require("passport"),
		Username      = nconf.get("Username"),
		UserPassword  = nconf.get("UserPassword"),
		USER_DB       = nconf.get("USER_DB"),
		LocalStrategy = require("passport-local").Strategy,
		Cloudant      = require("cloudant"),
		cloudant      = Cloudant("https://"+Username+":"+UserPassword+"@"+Username+".cloudant.com"),
		db            = cloudant.db.use(USER_DB);
		var crypto = require('crypto'),
		algorithm = 'aes-256-ctr',
		password = 'd6F3Efeq';

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
				var eny_password = decrypt(body.password);
				if(password == eny_password) {
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

	function decrypt(text){
	  var decipher = crypto.createDecipher(algorithm,password)
	  var dec = decipher.update(text,'hex','utf8')
	  dec += decipher.final('utf8');
	  return dec;
	}
};

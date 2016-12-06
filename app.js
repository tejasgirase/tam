var nconf         = require('./config');
var sessionstore  = require(nconf.SESSION_MODULE),
https             = require("https"),
http              = require("http"),
fs                = require("fs"),
express           = require("express"),
app               = express(),
cookieParser      = require("cookie-parser"),
session           = require("express-session"),
passport          = require("passport"),
strategy          = require("passport-local").Strategy,
path              = require("path"),
bodyParser        = require("body-parser"),
cons              = require('consolidate'),
Username          = nconf.Username,
CLOUDANT_API_KEY  = nconf.CLOUDANT_API_KEY,
CLOUDANT_PASSWORD = nconf.CLOUDANT_PASSWORD,
CLOUDANT_PORT     = nconf.CLOUDANT_PORT,
SESSION_DB        = nconf.SESSION_DB,
Cloudant          = require(nconf.APP_MODULE),
cloudant          = Cloudant(nconf.DB_PROTOCOL+"://"+CLOUDANT_API_KEY+":"+CLOUDANT_PASSWORD+"@"+nconf.DB_URL),
Port              = nconf.PORT,
multer            = require('multer'),
stripe            = require('stripe')("sk_test_R7BL5InlXFCx3W76QzkG4OSi"),
upload            = multer();
//password encryption
var cryptLib = require('cryptlib'),
iv = nconf.IV, //16 bytes = 128 bit 
key = cryptLib.getHashSha256(nconf.SECRET_KEY, 32);
var service = require("./src/services/common.service");

// app.use(express.static('public/'));
app.use(express.static("public/_attachments"));
app.use(express.static("public/app"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  resave:            false,
  saveUninitialized: false,
	secret: "cloudant",
	cookie: {expires:60000*10,httpOnly:((nconf.DB_PROTOCOL == "http") ? true : false)},
	store: sessionstore.createSessionStore({
    type:    'couchdb',
    host:    nconf.DB_PROTOCOL+"://"+nconf.DB_URL,
    port:    CLOUDANT_PORT,
    dbName:  SESSION_DB,
    options: {
    	auth: {
    		username: CLOUDANT_API_KEY,
    		password: CLOUDANT_PASSWORD
    	}
    }
  })	
}));
// username: "irldeadifecondecturponda",
//     		password: "0b86279b5be376c211c43493d854d7bf1e4db832"
// app.use(session({secret:'cloudant'}));
var authRoutes = require("./src/routes/printRoutes");
require("./src/config/passport")(app);
 
function ensureAuthenticated(req, res, next) {
	console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
   return next();
  } else {
    res.redirect("/");
  }	
}

function ensureAPIAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
   return next();
  } else {
  	req.session.destroy();
  	req.logout();
  	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.status(401).json({ error: "Login Required", reason:"Login Required"});
  }	
}

function ensureLoginAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
   return next();
  } else {
    res.redirect("/myaccount");
  }	
}

app.use(function(req, res, next) {
  if (!req.user)
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});
app.use("/print",authRoutes);
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'pages'));
app.set('view engine', 'html');

app.get("/",ensureLoginAuthenticated,function(req,res) {
	req.session.destroy();
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render("index.html");
});

app.post("/api/login",passport.authenticate('local'), function(req,res) {
	res.send({"id":req.user});
});

app.get("/api/forgot",function(req,res) {
	var opendb = cloudant.db.use(req.query.db);
	opendb.get("org.couchdb.user:"+req.query.emailid,function(err, body) {
		if(!err) {
			var original_pass = service.getPcode(6, "alphabetic");
			// console.log(original_pass);
			body.password = cryptLib.encrypt(original_pass, key, iv);
			opendb.insert(body,function(err,data) {
				if(!err) {
					service.sendMail(res,data,nconf.MAIL_ID,(body.alert_email ? body.alert_email : body.email),"New Password","text","Your New Password has been set to "+original_pass);
					// res.send(data);
				}else {
					res.status(500).json({ error: err.error, reason:err.reason});
				}
			});
		}else {
			res.status(500).json({ error: err.error, reason:err.reason});
		}
	});
});

app.get("/api/logout",function(req,res) {
	if(req.user) {
		res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  	req.logout();
  	res.redirect("/");
		// res.status("201").send({"message": "successfully logged out."});
	}
});

app.get("/myaccount",ensureAuthenticated,function(req,res) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	console.log(req.user.plan_id);
	console.log(req.user.plan_name);
	if(req.user.plan_id == "PRO-BB" || req.user.plan_name == "Babybeeps") {
		res.render("telepediatric.html");
	}else {
		res.render("my-account.html");
	}
});

app.get("/api/session",ensureAPIAuthenticated,function(req,res) {
	if(req.user) {
		res.send(req.user);
	}else {
		res.status(500).json({ error: "Login Required", reason:"Login Required"});
	}
});

app.get("/api/open",function(req,res) {
	var opendb = cloudant.db.use(req.query.db);
	opendb.get(req.query._id,function(err, body) {
		if(!err) {
			res.send(body);
		}else {
			console.log(err);
			res.status(500).json({ error: err.error, reason:err.reason});
		}
	});
});

app.get("/api/view",function(req,res) {
	if(req.query.view_data.key) {
		var mykey = req.query.view_data.key;
	}
	var view_data = JSON.parse(req.query.view_data);
	var viewdb = cloudant.db.use(req.query.db);
	viewdb.view(req.query.design_doc,req.query.view,view_data.option_list,function(err, body) {
		if(!err) {
			res.send(body);
		}else {
			res.status(500).json({ error: err.error, reason:err.reason});
		}
	});
});

app.get("/api/list",function(req,res) {
	var view_data = JSON.parse(req.query.view_data);
	var listdb = cloudant.db.use(req.query.db);
	listdb.viewWithList(req.query.design_doc, req.query.view, req.query.list, view_data.option_list, function(err, body) {
	  if (!err) {
	    res.send(body);
	  }else {
	  	res.status(500).json({ error: err.error, reason:err.reason});
	  }
	});
});

app.post("/api/save",function(req,res) {
	var savedb = cloudant.db.use(req.body.db);
	savedb.insert(JSON.parse(req.body.doc),function(err, body) {
		if(!err) {
			res.send(body);
		}else {
			res.status(500).json({ error: err.error, reason:err.reason});
		}
	});
});


app.post("/api/change_password",function(req,res) {
	var updatedb = cloudant.db.use(req.body.db),
			password = cryptLib.encrypt(req.body.password, key, iv),
			data,original_pass;

	if(req.body.doc && req.body.doc.super_user_id) {
		data = req.body.doc;
		data.password = password;
		original_pass = req.body.password;
	}else if(req.user.password == password) {
		data = req.user;
		data.password = cryptLib.encrypt(req.body.new_password, key, iv);
		original_pass = req.body.new_password;
	}else {
		res.status(500).json({ error: "Your current password is wrong.", reason:"Your current password is wrong."});
	}
	if(data){
		updatedb.insert(data,function(err, body) {
			if(!err) {
				service.sendMail(res,body,nconf.MAIL_ID,(data.alert_email ? data.alert_email : data.email),"Password Change","text","Your New Password has been set to " + original_pass);
				// res.send(body);
			}else {
				res.status(500).json({ error: err.error, reason:err.reason});
			}
		});
	}
});

app.post("/api/email",function(req,res) {
	console.log(req.body);
	service.sendMail(res,"true",nconf.MAIL_ID,req.body.email,req.body.subject,req.body.type,req.body.msg);
});

app.put("/api/signup",function(req,res) {
	var updatedb = cloudant.db.use(req.body.db);
	var data     = JSON.parse(req.body.doc);
			if(data.password){
				var new_password = data.password;
				var password     = cryptLib.encrypt(data.password, key, iv);
				data.password    = password;
			}
			updatedb.insert(data,function(err, body) {
				if(!err) {
					service.sendMail(res,body,nconf.MAIL_ID,(data.alert_email ? data.alert_email : data.email),"Account Created","text","Hello "+data.first_name+" "+data.last_name+" \nWelcome to Sensory Health System. \n Your password for this account is : "+new_password+"\n To Log in go to following link http://www.digitalhealthpulse.com"	);
				}else {
					res.status(500).json({ error: err.error, reason:err.reason});
				}
			});
});


app.put("/api/update",function(req,res) {
	var updatedb = cloudant.db.use(req.body.db);
	updatedb.insert(JSON.parse(req.body.doc),function(err, body) {
		if(!err) {
			res.send(body);
		}else {
			res.status(500).json({ error: err.error, reason:err.reason});
		}
	});
});

app.post("/api/upload", ensureAPIAuthenticated, upload.single("_attachments"), function(req,res) {
	if(req.file || req.file.mimetype || req.file.buffer) {
		var savedb = cloudant.db.use(req.body.db),
	    fname = req.file.originalname || "attach.jpeg",
	    contenttype = req.file.mimetype || "image/jpeg";

		savedb.attachment.insert(req.body._id, fname, req.file.buffer, contenttype,
	    { rev: req.body._rev }, function(err, body) {
	      if (!err) {
	        res.status(201).send(body);
	      } else {
					res.status(500).json({ error: err.error, reason:err.reason});
	      }
	  });
	}else {
		res.status(500).json({ error: "Something is wrong contact your technical team.", reason:"Something is wrong contact your technical team."});
	}
});

app.get("/api/attachment", function(req,res) {
	var attachmentdb = cloudant.db.use(req.query.db);
	attachmentdb.attachment.get(req.query.id,req.query.attachment_name).pipe(res);
	// attachmentdb.attachment.get(req.query.id, req.query.attachment_name, function(err, body) {
	//   if (!err) {
	// 		res.sendFile(body);
	//   }
	// });
});

app.post("/api/bulk",ensureAPIAuthenticated,function(req,res) {
	var bulk_data = JSON.parse(req.body.master_docs);
	var bulksavedb = cloudant.db.use(req.body.db);
	bulksavedb.bulk({"docs":bulk_data.docs},function(err, body) {
		if(!err) {
			res.status(201).send(body);
		}else {
			res.status(500).json({ error: err.error, reason:err.reason});
		}
	});
});

app.post("/api/remove/:id",ensureAPIAuthenticated,function(req,res) {
	var bulksavedb = cloudant.db.use(req.query.db);
	bulksavedb.insert(req.body,function(err, body) {
		if(!err) {
			res.send(body);
		}else {
			res.status(500).json({ error: err.error, reason:err.reason});
		}
	});
});
if(nconf.DB_PROTOCOL == "http") {
	http.createServer(app).listen(Port, function() {
		console.log("server is running on port "+Port);
	});
}else {
	https.createServer({
	  key: fs.readFileSync('key.pem'),
	  cert: fs.readFileSync('cert.pem')
	}, app).listen(Port, function() {
		console.log("server is running on port "+Port);
	});
}

// app.listen(3005,"192.168.0.66", function(){
// 	console.log("server is listening on port 3005");
// });
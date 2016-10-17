var https        = require("https"),
		fs           = require("fs"),
		express      = require("express"),
		PORT         = process.env.PORT || 55554,
		app          = express(),
		path         = require("path"),
		bodyParser   = require("body-parser"),
		cookieParser = require("cookie-parser"),
		session      = require("express-session"),
		passport     = require("passport"),
		strategy     = require("passport-local").Strategy,
		cons         = require('consolidate'),
		Cloudant     = require('cloudant'),
		cloudant     = Cloudant("https://nirmalpatel59:nirmalpatel@nirmalpatel59.cloudant.com");

// app.use(express.static('public/'));
app.use(express.static("public/_attachments"));
// app.use(express.static("public/_attachments/controller"));
// app.use(express.static("public/_attachments/fonts"));
// app.use(express.static("public/_attachments/images"));
// app.use(express.static("public/_attachments/img"));
// app.use(express.static("public/_attachments/js"));
// app.use(express.static("public/_attachments/json_template"));
// app.use(express.static("public/_attachments/library"));
// app.use(express.static("public/_attachments/script"));
// app.use(express.static("public/_attachments/style"));
// app.use(express.static("public/_attachments/template"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({secret:'cloudant'}));
var authRoutes = require("./src/routes/authRoutes");
require("./src/config/passport")(app);

function ensureAuthenticated(req, res, next) {
	console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
  	console.log("in if 28");
     return next();
  } else {
  	console.log("in else 30");
     return res.send(401);
  }
}

app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'public/_attachments/'));
app.set('view engine', 'html');

app.get("/",function(req,res) {
	res.render("index.html");
});

app.post("/api/login",passport.authenticate('local'), function(req,res) {
	console.log(req.body);
	res.send({"request_body":req.body});
});

// app.get("/my-account.html",ensureAuthenticated,function(req,res) {
// 	res.render("my-account.html");
// });

app.get("/myaccount",ensureAuthenticated,function(req,res) {
	res.render("my-account.html");
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

// app.post("/api/view",function(req,res) {
// 	console.log(req.query);
// 	medical_db.view("tamsa","getMiscSetting",{key: ["org.couchdb.user:n@n.com","H-testingdhp"],
//       include_docs:true},function(err, body) {
// 		if(!err) {
// 			res.send(body);
// 		}else {
// 			console.log(err);
// 			res.send("test23");
// 		}
// 	});
// });

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

app.post("/api/bulk",function(req,res) {
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

app.post("/api/remove/:id",function(req,res) {
	var bulksavedb = cloudant.db.use(req.query.db);
	bulksavedb.insert(req.body,function(err, body) {
		if(!err) {
			res.send(body);
		}else {
			res.status(500).json({ error: err.error, reason:err.reason});
		}
	});
});

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}, app).listen(55554,"192.168.0.66", function() {
	console.log("server is running on port 55554");
});

// app.listen(3005,"192.168.0.66", function(){
// 	console.log("server is listening on port 3005");
// });
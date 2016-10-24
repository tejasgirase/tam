var express         = require('express'),
app                 = express(),
path                = require('path'),
wkhtmltopdf         = require('wkhtmltopdf'),
fs                  = require("fs"),
moment              = require('moment');
wkhtmltopdf.command = path.join(__dirname,"wkhtmltopdf");
// sharingFactory      = require('./external_handler_functions'),
app.use(express.static("public/_attachments"));
var css_path   = path.join(__dirname,'css/');
var images_path   = path.join(__dirname,'images/');

var Cloudant      = require('cloudant');
var cloudant      = Cloudant("https://willesiongleducentinglow:779b513d6d5d66522c3649362d16e3830fb1ca94@nirmalpatel59.cloudant.com");


// var EH_IP       = nconf.get("External_Handler_IP");
// var EH_Username = nconf.get("External_Handler_Username");
// var EH_Password = nconf.get("External_Handler_Password");
// var EH_DB       = nconf.get("External_Handler_DB");
// var EH_PI_DB    = nconf.get("External_Handler_PI_DB");

var db    = cloudant.db.use("meluha_db5");
var pi_db = cloudant.db.use("meluha_db5_pi");

var app_count,
temp = [],
hdata,
options = {
  "page-size":        "A4",
  "header-font-name": "Calibri",
  "header-font-size": "20",
  "footer-center":    "This is copyright under Sensory Health System",
  "footer-line":      true
};



var printController = function() {
	var printAppointment = function(req,res) {
		// res.send(images_path);
		// res.contentType("application/pdf");
		function generateHTMLForPDF(data) {
			//Tejas to check uncomment following
		  // data.sort(function (a,b){
		  //   return moment.utc(a.reminder_start).diff(moment.utc(b.reminder_start));
		  // });

		  var output = [];
		  output.push('<link href="'+css_path+'bootstrap.css" rel="stylesheet" type="text/css"/>');
		  output.push('<style> table { page-break-inside:auto } tr    { page-break-inside:avoid; page-break-after:auto } thead { display:table-header-group } tfoot { display:table-footer-group }.tbl-border tr td, .tbl-border tr th{border-left: 1px solid #ddd; border-top: 1px solid #ddd; } .tbl-border tr:last-child{border-bottom: 1px solid #ddd; } .tbl-border td:last-child{border-right: 1px solid #ddd; }</style>');
		  output.push('<table cellspacing="0" cellpadding="0" border="0" width="99%" bgcolor="#ffffff" align="center" style=" border-bottom: 10px solid #455a64; padding-bottom:10px;">');
		    output.push('<tbody>');
		      output.push('<tr>');
		        output.push('<td valign="top" align="center">');
		          output.push('<table cellspacing="0" cellpadding="0" border="0" width="265" align="center" style="margin:auto; background-color:#ffffff; padding-left:15px; padding-top:30px;">');
		            output.push('<tbody>');
		              output.push('<tr>');
		                output.push('<td>');
		                if(hdata && hdata.invoice_image)
		                  output.push('<a><img alt="Sensory Health Systems" src="'+hdata.invoice_image+'"></a>');
		                output.push('</td>');
		              output.push('</tr>');
		            output.push('</tbody>');
		          output.push('</table>');
		        output.push('</td>');
		        output.push('<td valign="top" align="center">');
		          output.push('<table cellspacing="0" cellpadding="0" border="0" width="615" align="center" style="margin:auto; background-color:#ffffff; border-bottom:2px solid #858e95; padding-left:15px; padding-top:30px;" class="em_main_table">');
		            output.push('<tbody style="float:left; width:37%; border-right:2px solid #b2b8bc; padding-top:10px">');
		              output.push('<tr>');
		                output.push('<td style="display: inline-block; padding-bottom:5px;"></td>');
		                output.push('<td style="display: inline-block; padding-bottom:5px; color:#000; font-size:16px; font-weight:bold;  text-align:left;">'+(hdata ? hdata.hospital_name : "")+' </td>');
		              output.push('</tr>');
		              output.push('<tr>');
		                output.push('<td style="display: inline-block; padding-bottom:5px;">&nbsp;</td>');
		                output.push('<td style="display: inline-block; padding-bottom:5px; font-size:16px; text-align:left;"><img style="display: inline-block; margin-right:4px;" src="'+images_path+'location.png"><b style="color:#000;">'+(hdata ? hdata.hospital_address : "")+'</b></td>');
		              output.push('</tr>');
		              output.push('<tr>');
		                output.push('<td style="display: inline-block; padding-bottom:5px;">&nbsp;</td>');
		                output.push('<td style="display: inline-block; padding-bottom:5px; padding-left:20px; font-size:16px; text-align:left;">'+(hdata ? hdata.hospital_secondary_address : "")+'</td>');
		              output.push('</tr>');
		              output.push('<tr>');
		                output.push('<td style="display: inline-block; padding-bottom:5px;">&nbsp;</td>');
		                output.push('<td style="display: inline-block; padding-bottom:35px; padding-left:20px; font-size:16px; text-align:left;">'+(hdata ? (hdata.hospital_city + ", "+ hdata.hospital_state + ", "+ "India" + ", "+ hdata.hospital_postal_zip_code) : "")+'</td>');
		              output.push('</tr>');
		            output.push('</tbody>');
		            output.push('<tbody style="width:27%;float:left;  border-right:2px solid #b2b8bc; padding-top:10px; padding-left:5px">');
		              output.push('<tr>');
		                output.push('<td style="display: inline-block; padding-bottom:5px;"></td>');
		                output.push('<td style="display: inline-block; padding-bottom:5px; font-size:16px; text-align:left;"><img style="display: inline-block;" src="'+images_path+'call.png">'+(hdata ? hdata.hospital_phone : "NA")+'</td>');
		              output.push('</tr>');
		              output.push('<tr>');
		                output.push('<td style="display: inline-block; padding-bottom:5px;">&nbsp;</td>');
		                output.push('<td style="display: inline-block; padding-bottom:5px;  font-size:16px; text-align:left;">&nbsp;</td>');
		              output.push('</tr>');
		              output.push('<tr>');
		                output.push('<td style="display: inline-block; padding-bottom:5px;">&nbsp;</td>');
		                output.push('<td style="display: inline-block; padding-bottom:5px; padding-left:26px; font-size:16px; text-align:left;">&nbsp;</td>');
		              output.push('</tr>');
		              output.push('<tr>');
		                output.push('<td style="display: inline-block; padding-bottom:5px;">&nbsp;</td>');
		                output.push('<td style="display: inline-block; padding-bottom:36px; padding-left:20px; font-size:16px; text-align:left;">&nbsp;</td>');
		              output.push('</tr>');
		            output.push('</tbody>');
		            output.push('<tbody style="width:34%;float:left; padding-top:10px">');
		              output.push('<tr>');
		                output.push('<td style="display: inline-block; padding-bottom:5px;"></td>');
		                output.push('<td style="display: inline-block; padding-bottom:5px; font-size:16px; text-align:left;"><img style="display: inline-block; margin-right:4px;" src="'+images_path+'mail.png">'+(hdata ? hdata.hospital_email : "")+'</td>');
		              output.push('</tr>');
		              output.push('<tr>');
		                output.push('<td style="display: inline-block; padding-bottom:5px;">&nbsp;</td>');
		                output.push('<td style="display: inline-block; padding-bottom:5px; font-size:16px; text-align:left;"><img style="display: inline-block; margin-right:4px;" src="'+images_path+'site.png">'+(hdata ? hdata.hospital_website : "")+'</td>');
		              output.push('</tr>');
		              output.push('<tr>');
		                output.push('<td style="display: inline-block; padding-bottom:5px;">&nbsp;</td>');
		                output.push('<td style="display: inline-block; padding-bottom:5px; padding-left:26px; font-size:16px; text-align:left;">DHP Code:'+req.query.dhp_code+'</td>');
		              output.push('</tr>');
		              output.push('<tr>');
		                output.push('<td style="display: inline-block; padding-bottom:5px;">&nbsp;</td>');
		                output.push('<td style="display: inline-block; padding-bottom:35px; padding-left:20px; font-size:16px; text-align:left;">&nbsp;</td>');
		              output.push('</tr>');
		            output.push('</tbody>');
		          output.push('</table>');
		        output.push('</td>');
		      output.push('</tr>');
		    output.push('</tbody>');
		  output.push('</table>');
		  output.push('<table class="tbl-border" cellspacing="0" cellpadding="0" border="0" width="99%" align="center" style="margin:auto; background-color:#ffffff; padding-left:15px; padding-top:60px;">');
		    output.push('<thead>');
		      output.push('<tr>');
		        output.push('<th style="padding:4px;text-align:center;color:green"><b>Appointment Date</b></th>');
		        output.push('<th style="padding:4px;text-align:center;color:green"><b>Time</b></th>');
		        output.push('<th style="padding:4px;text-align:center;color:green"><b>Patient Name</b></th>');
		        output.push('<th style="padding:4px;text-align:center;color:green"><b>Patient Email Id</b></th>');
		        output.push('<th style="padding:4px;text-align:center;color:green"><b>Patient Phone No</b></th>');
		        output.push('<th style="padding:4px;text-align:center;color:green"><b>Office</b></th>');
		        output.push('<th style="padding:4px;text-align:center;color:green"><b>Note</b></th>');
		      output.push('</tr>');
		    output.push('</thead>');
		    output.push('<tbody>');
		      for(var j=0;j<data.length;j++){
		        output.push('<tr>');
		        //Tejas to check uncomment following
		        output.push('<td style="padding:4px;">'+"10-24-2016"+'</td>');
		        output.push('<td style="padding:4px;">'+data[j].appointment_start_time + "<br>" +data[j].appointment_end_time+'</td>');
		        output.push('<td style="padding:4px;">'+data[j].patient_name+'</td>');
		        output.push('<td style="padding:4px;">'+data[j].patient_email_id+'</td>');
		        output.push('<td style="padding:4px;">'+data[j].patient_phone+'</td>');
		        output.push('<td style="padding:4px;">'+data[j].office_location+'</td>');
		        output.push('<td style="padding:4px;">'+data[j].appointment_note+'</td>');
		        output.push('</tr>');  
		      }
		    output.push('</tbody>');
		  output.push('</table>');
		  output.push('<table width="100%" align="center" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff" style=" border-top: 10px solid #455a64;margin-top:10px; padding:20px 20px 30px 20px;position:fixed;bottom:0;">');
		  output.push('</table>');

		  temp=[];
		  wkhtmltopdf(output.join(''), options).pipe(res);
		    // var mystr = wkhtmltopdf(output.join(''));
		    // var buffer = new Buffer(mystr).toString('base64');
		    // res.send(buffer);
		}

		function getPersonalInformation(appdata,temp) {
		  pi_db.view('tamsa', 'getPatientInformation', {key:appdata.user_id, include_docs:true}, function(err,pdata) {
		    if(pdata.rows.length > 0) {
		    	//Tejas to check uncomment following
		      temp.push({
		        "appointment_date": '10-24-2016',
		        "appointment_start_time": '08:50 pm',
		        "appointment_end_time": '10:30 pm',
		        "reminder_start":appdata.reminder_start,
		        "patient_name": pdata.rows[0].doc.first_nm + " " +pdata.rows[0].doc.last_nm,
		        "patient_email_id": pdata.rows[0].doc.user_email,
		        "patient_phone": pdata.rows[0].doc.phone,
		        "office_location": (appdata.location ? appdata.location : "NA"),
		        "appointment_note": (appdata.reminder_note ? appdata.reminder_note : "NA")
		      });
		      app_count--;
		      if(app_count == 0) {
		        //medicationHTML();
		        // res.send(temp);
		        generateHTMLForPDF(temp);
		        // wkhtmltopdf("No Appointments Found.", options).pipe(res);
		      }
		    }
		  });
		}

		function getAppointmentPrint() {
		  db.view('tamsa', 'getAppointmentNotification', {startkey:[req.query.id, req.query.start], endkey:[req.query.id, req.query.end], reduce:false, group:false}, function(err, body) {
		    if(body.rows.length > 0) {
		      app_count = body.rows.length;
		      for(var i=0;i<body.rows.length;i++) {
		        getPersonalInformation(body.rows[i].value,temp);
		      }
		    }else {
		      wkhtmltopdf("No Appointments Found.", options).pipe(res);
		    }
		  });  
		}
		
		db.view('tamsa','getPrintSetting', {key:req.query.dhp_code,include_docs:true}, function(err,body) {
		  if(!err) {
		    if(body.rows.length > 0) {
		      hdata = body.rows[0].doc;
		      options["footer-center"] = body.rows[0].doc.footer;
		    }
		    getAppointmentPrint();
		  }
		});
	};
	return {
		printAppointment : printAppointment
	};
};
module.exports = printController;

var express = require('express'),
app         = express(),
nconf       = require('./../../config');
// nconf.argv().env().file({ file: 'config.json' });
var Username        = nconf.Username,
CLOUDANT_API_KEY    = nconf.CLOUDANT_API_KEY,
CLOUDANT_PASSWORD   = nconf.CLOUDANT_PASSWORD,
medical_db          = nconf.DB,
pi_db               = nconf.PI_DB,
path                = require('path'),
wkhtmltopdf         = require('wkhtmltopdf'),
fs                  = require("fs"),
moment              = require('moment');
wkhtmltopdf.command = path.join(__dirname,"wkhtmltopdf");
// sharingFactory   = require('./external_handler_functions'),
app.use(express.static("public/_attachments"));
var css_path    = path.join(__dirname,'css/'),
		images_path = path.join(__dirname,'images/'),
		view_path   = path.join(__dirname,'../views/'),
		Cloudant    = require('cloudant'),
		cloudant    = Cloudant("https://"+CLOUDANT_API_KEY+":"+CLOUDANT_PASSWORD+"@"+Username+".cloudant.com");


// var EH_IP       = nconf.External_Handler_IP;
// var EH_Username = nconf.External_Handler_Username;
// var EH_Password = nconf.External_Handler_Password;
// var EH_DB       = nconf.External_Handler_DB;
// var EH_PI_DB    = nconf.External_Handler_PI_DB;

var db    = cloudant.db.use(medical_db);
var pi_db = cloudant.db.use(pi_db);

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
			// Tejas to check uncomment following
		  data.sort(function (a,b){
		  	return moment.utc(a.reminder_start).diff(moment.utc(b.reminder_start));
		  });

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
		        output.push('<td style="padding:4px;">'+moment(data[j].appointment_date).format("MM-DD-YYYY")+'</td>');
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
		        "appointment_date": moment(appdata.reminder_start).format("MM-DD-YYYY"),
		        "appointment_start_time": moment(appdata.reminder_start).format("hh:mm a"),
		        "appointment_end_time": moment(appdata.reminder_end).format("hh:mm a"),
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

	var printMedication = function(req,res) {
		// res.send(images_path);
		// console.log("Routes enterasdasd");
		// res.contentType("application/pdf");
		function noMedicaitonBox(header,image_name,box_name) {
		  var no_box = [];
		  if(header) {
		    no_box.push('<td width="10" valign="top" align="left" style="line-height:0px; font-size:0px; width:10px;">&nbsp;</td>');
		    no_box.push('<td valign="top" align="left">');
		      no_box.push('<table width="22%" cellspacing="0" cellpadding="0" border="0">');
		        no_box.push('<tbody>');
		          no_box.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-top:1px solid #c2c7cd; background-color:#455a64; padding:10px 5px 10px 15px; color: #020202; font-size: 27px; line-height:1.42857;">');
		            no_box.push('<td style="float:left;  width:79px; display: inline-block; padding-bottom:5px;"><img src="'+images_path+'images/'+image_name+'" style="padding-right:10px"></td>');
		            no_box.push('<td style="color: #fff; font-size: 13px; padding-left:15px; padding-bottom:10px; text-align: right;"></td>');
		            no_box.push('<td style="color: #fff; float:right; font-size: 20px; font-weight: bold; padding-left: 10px; text-align: right;">'+box_name+'</td>');
		          no_box.push('</tr>');
		          no_box.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd;  background:#EBECEC; min-height:30px; padding:60px 10px 60px 10px; ">');
		            no_box.push('<td width="100%" style="color: #4d8734; text-align:center; float:left; display: inline-block; font-size: 24px; font-weight: bold; ">Not</td>');
		            no_box.push('<td width="100%" style="color: #4d8734; text-align:center; float:left; display: inline-block; font-size: 24px; font-weight: bold;">Applicable</td>');
		          no_box.push('</tr>');
		          no_box.push('<tr style=" display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-bottom:1px solid #c2c7cd; border-left:1px solid #c2c7cd; background:#EBECEC none repeat scroll 0 0;  padding:0 10px; color: #000; font-size: 19px; line-height:1.42857; text-align:center; font-style:italic;"> </tr>');
		        no_box.push('</tbody>');
		      no_box.push('</table>');
		    no_box.push('</td>');
		  }else {
		    no_box.push('<td width="10" valign="top" align="left" style="line-height:0px; font-size:0px; width:10px;">&nbsp;</td>');
		    no_box.push('<td valign="top" align="left"><table cellpadding="0" cellspacing="0" border="0" width="22%" bgcolor="#EBECEC" style="background-color:#EBECEC;">');
		        no_box.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-top:1px solid #c2c7cd; padding:10px 5px 10px 15px; color: #020202; font-size: 24px;">');
		          no_box.push('<td colspan="3" style="color: #000; font-size: 16px; padding: 25px 0; text-align: center;">&nbsp;</td>');
		        no_box.push('</tr>');
		        no_box.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd;  background:#EBECEC; min-height:30px; padding:10px; ">');
		          no_box.push('<td width="100%;" style="color: #4d8734; text-align:center; float:left; display: inline-block; font-size: 24px; font-weight: bold;"> Not </td>');
		          no_box.push('<td width="100%;" style="color: #4d8734; text-align:center; font-size: 20px; float:right; font-weight: bold;">Applicable</td>');
		        no_box.push('</tr>');
		        no_box.push('<tr style="display: inline-block; width:230px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd;  background:#EBECEC; padding:8px 10px 5px 0px; ">');
		          no_box.push('<td style="  float:left; color: #fff; display: inline-block; font-size: 24px; margin-right: 8px; text-align: center; width: 24px; padding-left:1px; height:54px;"></td>');
		          no_box.push('<td style=" color: #020202; font-size: 20px; text-transform: uppercase; width:180px; float:left; padding-top:0px;"></td>');
		          no_box.push('<td style=" font-size: 16px; padding-top:0; float: right; text-align: right;"></td>');
		        no_box.push('</tr>');
		        no_box.push('<tr style=" display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-bottom:1px solid #c2c7cd; border-left:1px solid #c2c7cd;background:#EBECEC;  padding:0 10px; color: #000; font-size: 19px; line-height:1.42857; text-align:center; font-style:italic;">');
		          no_box.push('<td colspan="3" style="text-align:center">&nbsp;</td>');
		        no_box.push('</tr>');
		      no_box.push('</table>');
		    no_box.push('</td>');
		  }
		  return no_box.join('');
		}

		function generateMedicationHTML(data,pdata) {
	    var output = [];
	      output.push('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">');
	      output.push('<html xmlns="http://www.w3.org/1999/xhtml">');
	      output.push('<head>');
	        output.push('<title>Medications</title>');
	        output.push('<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />');
	        output.push('<meta name="viewport" content="width=device-width, initial-scale=1.0 " />');
	        output.push('<meta http-equiv="X-UA-Compatible" content="IE=edge" />');
	        output.push('<meta name="format-detection" content="telephone=no" />');
	        output.push('<style type="text/css"> body {margin: 0 !important; padding: 0 !important; -webkit-text-size-adjust: 100% !important; -ms-text-size-adjust: 100% !important; -webkit-font-smoothing: antialiased !important; } img {border: 0 !important; outline: none !important; display: inline-block !important; } </style>');
	      output.push('</head>');
	      output.push('<body style="margin:0px; padding:0px; font-family:Calibri; box-sizing:border-box;" bgcolor="#ffffff">');
	        // output.push(generatePrintHeader(hdata,data.dhp_code));

	        output.push('<div class="gm-template">');
	          output.push('<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#ffffff">');
	            output.push('<tr>');
	              output.push('<td align="center" valign="top">');
	                output.push('<table width="1024" border="0" align="center" cellpadding="0" cellspacing="0" style="margin:auto;background-color:#ffffff;">');
	                  output.push('<tr>');
	                    output.push('<td valign="top" align="left">');
	                      output.push('<table width="100%" border="0" align="left" cellpadding="0" cellspacing="0">');
	                        output.push('<tr>');
	                          output.push('<td valign="top" align="left">');
	                            output.push('<table border="0" align="left" cellpadding="0" cellspacing="0" style="">');
	                              output.push('<tr>');
	                                output.push('<td colspan="2" style="color:#7c868d; font-size:24px; text-transform:uppercase;">Patient Details</td>');
	                              output.push('</tr>');
	                              output.push('<tr>');
	                                output.push('<td colspan="2" height="20" style="line-height:0px; font-size:0px;">&nbsp;</td>');
	                              output.push('</tr>');
	                              output.push('<tr>');
	                                output.push('<td colspan="2" style="color:#000; font-size:18px; font-weight:bold; text-transform:uppercase;">'+pdata.first_nm+" "+pdata.last_nm+'</td>');
	                              output.push('</tr>');
	                              output.push('<tr>');
	                                output.push('<td colspan="2" height="20" style="line-height:0px; font-size:0px;">&nbsp;</td>');
	                              output.push('</tr>');
	                              output.push('<tr>');
	                                output.push('<td style="display: inline-block; padding-bottom:10px;"><img src="'+images_path+'images/location.png" style="padding-right:10px"></td>');
	                                output.push('<td style="display: inline-block; padding-bottom:10px; font-size:18px; color:#777; text-align:left;">'+pdata.address1+' ' +(pdata.address2 ? pdata.address2 : "")+'</td>');
	                              output.push('</tr>');
	                              output.push('<tr>');
	                                output.push('<td style="display: inline-block; padding-bottom:10px;"><img src="'+images_path+'images/call.png" style="padding-right:10px;"></td>');
	                                output.push('<td style="display: inline-block; padding-bottom:10px; font-size:18px; text-align:left; color:#777;">'+pdata.phone+'</td>');
	                              output.push('</tr>');
	                              output.push('<tr>');
	                                output.push('<td style="display: inline-block; padding-bottom:10px;"><img src="'+images_path+'images/mail.png" style="padding-right:10px"></td>');
	                                output.push('<td style="display: inline-block; padding-bottom:10px; font-size:18px; color:#777; text-align:left;">'+pdata.user_email+'</td>');
	                              output.push('</tr>');
	                              output.push('<tr>');
	                                // output.push('<td style="display: inline-block; padding-bottom:10px;"><img src="'+images_path+'images/site.png" style="padding-right:10px;"></td>');
	                                output.push('<td colspan="2" style="display: inline-block; padding-bottom:10px; font-size:18px; color:#777; text-align:left;">'+pdata.patient_dhp_id+'</td>');
	                              output.push('</tr>');
	                            output.push('</table>');
	                          output.push('</td>');
	                          output.push('<td valign="top" align="left">');
	                            output.push('<table border="0" align="left" cellpadding="0" cellspacing="0" style="">');
	                              // output.push('<tr>');
	                              //   output.push('<td style="display:inline-block; color:#000; color: #5d9930; font-size:24px; text-transform:uppercase;">Medications</td>');
	                              // output.push('</tr>');
	                              // output.push('<tr>');
	                              //   output.push('<td height="15" style="line-height:0px; font-size:0px;">&nbsp;</td>');
	                              // output.push('</tr>');
	                              // output.push('<tr>');
	                              //   output.push('<td style="display: inline-block; padding-bottom:10px; color: #455a64; font-size:18px;">#25879</td>');
	                              // output.push('</tr>');
	                              output.push('<tr>');
	                                output.push('<td style="display: inline-block; padding-bottom:3px; color: #5d9930; font-size: 24px; margin-bottom:0; text-transform:uppercase;"> Date</td>');
	                              output.push('</tr>');
	                              output.push('<tr>');
	                                output.push('<td height="10" style="line-height:0px; font-size:0px;">&nbsp;</td>');
	                              output.push('</tr>');
	                              output.push('<tr>');
	                                output.push('<td style="display: inline-block; padding-bottom:5px; color: #455a64; font-size: 18px;">'+data.medication_date+'</td>');
	                              output.push('</tr>');
	                            output.push('</table>');
	                          output.push('</td>');
	                          output.push('<td valign="top" align="right">');
	                            output.push('<table border="0" align="right" cellpadding="0" cellspacing="0" style="">');
	                              output.push('<tr>');
	                                output.push('<td style="display: inline-block; color: #7c868d; font-size: 24px; font-weight: bold; margin-bottom:0; text-transform:uppercase;">Medications summary</td>');
	                              output.push('</tr>');
	                              output.push('<tr>');
	                                output.push('<td height="20" style="line-height:0px; font-size:0px;">&nbsp;</td>');
	                              output.push('</tr>');
	                              output.push('<tr>');
	                                output.push('<td style="display: inline-block; background-color:#e4e7e8; padding: 10px 40px 20px 10px; color: #020202; font-size:18px; line-height:1.42857; padding-left:20px;" class="print">');
	                                  for(var i=0;i<data.medlist.length;i++) {
	                                    if(i!= 0) output.push('<br>');
	                                    if(data.medlist[i].desperse_form == "Syrup") {
	                                      output.push((i+1) +'. '+data.medlist[i].drug_name+' -'+data.medlist[i].quantity+' '+data.medlist[i].drug_strength+' '+data.medlist[i].drug_unit+' Bottle');
	                                    }else {
	                                      output.push((i+1) +'. '+data.medlist[i].drug_name+' - QTY '+data.medlist[i].quantity);
	                                    }
	                                  }
	                              output.push('</tr>');
	                            output.push('</table>');
	                          output.push('</td>');
	                        output.push('</tr>');
	                      output.push('</table>');
	                    output.push('</td>');
	                  output.push('</tr>');
	                  output.push('<tr>');
	                    output.push('<td height="15" style="line-height:0px; font-size:0px;">&nbsp;</td>');
	                  output.push('</tr>');
	                  output.push('<tr>');
	                    output.push('<td height="10" bgcolor="#455a64" style="line-height:0px; font-size:0px; background-color:#455a64;">&nbsp;</td>');
	                  output.push('</tr>');
	                  output.push('<tr>');
	                    output.push('<td valign="top" align="left" bgcolor="#e9eff7" style="background-color:#e9eff7;">');
	                      output.push('<table cellpadding="0" cellspacing="0" border="0" width="100%">');
	                        output.push('<tr>');
	                          output.push('<td colspan="9" height="10" bgcolor="#455a64" style="line-height:0px; font-size:0px; background-color:#455a64;">&nbsp;</td>');
	                        output.push('</tr>');
	                        output.push('<tr>');
	                          output.push('<td colspan="9" height="10" style="line-height:0px; font-size:0px;">&nbsp;</td>');
	                        output.push('</tr>');

	                        for(var i=0; i<data.med_info.length; i++) {
	                          output.push('<tr>');
	                          // output.push('<tr>');
	                            if(data.med_info[i].medication_time.indexOf("morning") > -1) {
	                              output.push('<td width="10" valign="top" align="left" style="line-height:0px; font-size:0px; width:10px;">&nbsp;</td>');
	                              output.push('<td valign="top" align="left">');
	                                output.push('<table cellpadding="0" cellspacing="0" border="0" width="22%">');
	                                  if(i == 0) {
	                                    output.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-top:1px solid #c2c7cd; background-color:#455a64;  padding:10px 5px 10px 15px; color: #020202; font-size: 27px; line-height:1.42857;">');
	                                      output.push('<td style="float:left;  width:79px; display: inline-block; padding-bottom:5px;"> <img style="padding-right:10px" src="'+images_path+'images/sun1.png"></td>');
	                                      output.push('<td style="color: #fff; font-size: 13px; padding-left:15px; padding-bottom:10px; text-align: right;">'+moment(data.med_info[i].drug_start_date).format("DD, MMM YYYY")+' TO '+moment(data.med_info[i].drug_end_date).format("DD, MMM YYYY")+'</td>');
	                                      output.push('<td style="color: #fff; float:right; font-size: 20px; font-weight: bold; padding-left: 10px; text-align: right;">Morning</td>');
	                                    output.push('</tr>');
	                                  }else {
	                                    output.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-top:1px solid #c2c7cd; padding:10px 5px 10px 15px; color: #020202; font-size: 24px;">');
	                                      output.push('<td colspan="3" style="color: #000; font-size: 16px; padding: 25px 0; text-align: center;">'+moment(data.med_info[i].drug_start_date).format("DD, MMM YYYY")+' TO '+moment(data.med_info[i].drug_end_date).format("DD, MMM YYYY")+'</td>'); 
	                                    output.push('</tr>');
	                                  }

	                                  output.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd;  background:#fff; min-height:30px; padding:10px; ">');
	                                    output.push('<td colspan="2" style="color: #4d8734; float:left; display: inline-block; font-size: 24px; font-weight: bold;">'+data.med_info[i].drug+'</td>');
	                                    output.push('<td style="color: #4d8734; text-align:right; font-size: 20px; float:right; font-weight: bold;">'+data.med_info[i].drug_strength+' '+data.med_info[i].drug_unit+'</td>');
	                                  output.push('</tr>');
	                                  output.push('<tr style="display: inline-block; width:230px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd;  background:#fff; padding:10px 10px 10px 0px; ">');
	                                    output.push('<td style=" background: #4d8732 none repeat scroll 0 0; float:left; color: #fff; display: inline-block; font-size: 24px; margin-right: 8px; text-align: center; width: 24px; padding-left:1px; height:46px;">'+data.med_info[i].medication_time.length+'</td>');
	                                    output.push('<td style=" color: #020202; font-size: 20px; text-transform: uppercase; width:180px; float:left; padding-top:10px;">times a day</td>');
	                                    if(data.med_info[i].medication_time_quantity && data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("morning")] > -1){
	                                      var images_path_med = "";
	                                      if(data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("morning")] == "1"){
	                                        images_path_med = "images/green-circle.png";
	                                      }else if(data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("morning")] == "0.5"){
	                                        images_path_med = "images/green-circle(3).png";
	                                      }else if(data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("morning")] == "2"){
	                                        images_path_med = "images/green-circle(1).png";
	                                      }else{
	                                        images_path_med = "images/green-circle.png";
	                                      }
	                                      output.push('<td style=" font-size: 16px; padding-top:0;margin-left:120px; float: left; text-align: left;"><img src="'+images_path+''+images_path_med+'" height="25px" width="25px"></td>');
	                                    }
	                                    output.push('<td style=" font-size: 16px; padding-top:0; float: right; text-align: right;">'+data.med_info[i].desperse_form+'</td>');
	                                  output.push('</tr>');
	                                  output.push('<tr style=" display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-bottom:1px solid #c2c7cd; border-left:1px solid #c2c7cd; background:#f1f7fc none repeat scroll 0 0;  padding:10px; color: #000; font-size: 19px; line-height:1.42857; text-align:center; font-style:italic;">');
	                                    output.push('<td colspan="3" style="text-align:center"><b>Note: </b>'+data.med_info[i].medication_instructions+'</td>');
	                                  output.push('</tr>');
	                                output.push('</table>');
	                              output.push('</td>');
	                            }else {
	                              if(i == 0) output.push(noMedicaitonBox(true,"sun1.png", "Morning"))
	                              else  output.push(noMedicaitonBox(false, "", "Morning"))
	                            }
	                            if(data.med_info[i].medication_time.indexOf("afternoon") > -1) {
	                              output.push('<td width="10" valign="top" align="left" style="line-height:0px; font-size:0px; width:10px;">&nbsp;</td>');
	                              output.push('<td valign="top" align="center">');
	                                output.push('<table cellpadding="0" cellspacing="0" border="0" width="22%">');
	                                    if(i == 0) {
	                                      output.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-top:1px solid #c2c7cd; background-color:#455a64;  padding:10px 5px 10px 15px; color: #020202; font-size: 27px; line-height:1.42857;">');
	                                        output.push('<td style="float:left;  width:79px; display: inline-block; padding-bottom:5px;"> <img style="padding-right:10px" src="'+images_path+'images/sun2.png"></td>');
	                                      
	                                        output.push(' <td style="color: #fff; font-size: 13px; padding-left:15px; padding-bottom:10px; text-align: right;">'+moment(data.med_info[i].drug_start_date).format("DD, MMM YYYY")+' TO '+moment(data.med_info[i].drug_end_date).format("DD, MMM YYYY")+'</td>');
	                                        output.push('<td style="color: #fff; float:right; font-size: 20px; font-weight: bold; padding-left: 10px; text-align: right;">Afternoon</td>');
	                                      output.push('</tr>');
	                                    }else {
	                                      output.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-top:1px solid #c2c7cd; padding:10px 5px 10px 15px; color: #020202; font-size: 24px;">');
	                                        output.push('<td colspan="3" style="color: #000; font-size: 16px; padding: 25px 0; text-align: center;">'+moment(data.med_info[i].drug_start_date).format("DD, MMM YYYY")+' TO '+moment(data.med_info[i].drug_end_date).format("DD, MMM YYYY")+'</td>'); 
	                                      output.push('</tr>');
	                                    }
	                                  output.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd;  background:#fff; min-height:30px; padding:10px; ">');
	                                    output.push('<td colspan="2" style="color: #4d8734; float:left; display: inline-block; font-size: 24px; font-weight: bold;">'+data.med_info[i].drug+'</td>');
	                                    output.push('<td style="color: #4d8734; text-align:right; font-size: 20px; float:right; font-weight: bold;">'+data.med_info[i].drug_strength+' '+data.med_info[i].drug_unit+'</td>');
	                                  output.push('</tr>');
	                                  output.push('<tr style="display: inline-block; width:230px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd;  background:#fff; padding:10px 10px 10px 0px; ">');
	                                    output.push('<td style=" background: #4d8732 none repeat scroll 0 0; float:left; color: #fff; display: inline-block; font-size: 24px; margin-right: 8px; text-align: center; width: 24px; padding-left:1px; height:46px;">'+data.med_info[i].medication_time.length+'</td>');
	                                    output.push('<td style=" color: #020202; font-size: 20px; text-transform: uppercase; width:180px; float:left; padding-top:10px;">times a day</td>');
	                                    if(data.med_info[i].medication_time_quantity && data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("afternoon")] > -1){
	                                      var images_path_med = "";
	                                      if(data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("afternoon")] == "1"){
	                                        images_path_med = "images/green-circle.png";
	                                      }else if(data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("afternoon")] == "0.5"){
	                                        images_path_med = "images/green-circle(3).png.png";
	                                      }else if(data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("afternoon")] == "2"){
	                                        images_path_med = "images/green-circle(1).png";
	                                      }else{
	                                        images_path_med = "images/green-circle.png";
	                                      }
	                                      output.push('<td style=" font-size: 16px; padding-top:0;margin-left:120px; float: left; text-align: left;"><img src="'+images_path+''+images_path_med+'" height="25px" width="25px"></td>');
	                                    }
	                                    output.push('<td style=" font-size: 16px; padding-top:0; float: right; text-align: right;">'+data.med_info[i].desperse_form+'</td>');
	                                  output.push('</tr>');
	                                  output.push('<tr style=" display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-bottom:1px solid #c2c7cd; border-left:1px solid #c2c7cd; background:#f1f7fc none repeat scroll 0 0;  padding:10px; color: #000; font-size: 19px; line-height:1.42857; text-align:center; font-style:italic;">');
	                                    output.push('<td colspan="3" style="text-align:center"><b>Note: </b>'+data.med_info[i].medication_instructions+'</td>');
	                                  output.push('</tr>');
	                                output.push('</table>');
	                              output.push('</td>');
	                            }
	                            else {
	                              if(i == 0) output.push(noMedicaitonBox(true,"sun2.png", "Afteroon"))
	                              else  output.push(noMedicaitonBox(false, "", "Afteroon"))
	                            }
	                            if(data.med_info[i].medication_time.indexOf("evening") > -1) {
	                              output.push('<td width="10" valign="top" align="left" style="line-height:0px; font-size:0px; width:10px;">&nbsp;</td>');
	                              output.push('<td valign="top" align="right">');
	                                output.push('<table cellpadding="0" cellspacing="0" border="0" width="22%">');
	                                     if(i == 0) {
	                                      output.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-top:1px solid #c2c7cd; background-color:#455a64;  padding:10px 5px 10px 15px; color: #020202; font-size: 27px; line-height:1.42857;">');
	                                        output.push('<td style="float:left;  width:79px; display: inline-block; padding-bottom:5px;"> <img style="padding-right:10px" src="'+images_path+'images/sun3.png"></td>');
	                                        output.push('<td style="color: #fff; font-size: 13px; padding-left:15px; padding-bottom:10px; text-align: right;">'+moment(data.med_info[i].drug_start_date).format("DD, MMM YYYY")+' TO '+moment(data.med_info[i].drug_end_date).format("DD, MMM YYYY")+'</td>');
	                                        output.push('<td style="color: #fff; float:right; font-size: 20px; font-weight: bold; padding-left: 10px; text-align: right;">Evening</td>');
	                                      output.push('</tr>');
	                                    }else {
	                                      output.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-top:1px solid #c2c7cd; padding:10px 5px 10px 15px; color: #020202; font-size: 24px;">');
	                                        output.push('<td colspan="3" style="color: #000; font-size: 16px; padding: 25px 0; text-align: center;">'+moment(data.med_info[i].drug_start_date).format("DD, MMM YYYY")+' TO '+moment(data.med_info[i].drug_end_date).format("DD, MMM YYYY")+'</td>'); 
	                                      output.push('</tr>');
	                                    }
	                                  output.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd;  background:#fff; min-height:30px; padding:10px; ">');
	                                    output.push('<td style="color: #4d8734; float:left; display: inline-block; font-size: 24px; font-weight: bold;">'+data.med_info[i].drug+'</td>');
	                                    output.push('<td style="color: #4d8734; text-align:right; font-size: 20px; float:right; font-weight: bold;">'+data.med_info[i].drug_strength+' '+data.med_info[i].drug_unit+'</td>');
	                                  output.push('</tr>');
	                                  output.push('<tr style="display: inline-block; width:230px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd;  background:#fff; padding:10px 10px 10px 0px; ">');
	                                    output.push('<td style=" background: #4d8732 none repeat scroll 0 0; float:left; color: #fff; display: inline-block; font-size: 24px; margin-right: 8px; text-align: center; width: 24px; padding-left:1px; height:46px;">'+data.med_info[i].medication_time.length+'</td>');
	                                    output.push('<td style=" color: #020202; font-size: 20px; text-transform: uppercase; width:180px; float:left; padding-top:10px;">times a day</td>');
	                                    if(data.med_info[i].medication_time_quantity && data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("evening")] > -1){
	                                      var images_path_med = "";
	                                      if(data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("evening")] == "1"){
	                                        images_path_med = "images/green-circle.png";
	                                      }else if(data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("evening")] == "0.5"){
	                                        images_path_med = "images/green-circle(3).png";
	                                      }else if(data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("evening")] == "2"){
	                                        images_path_med = "images/green-circle(1).png";
	                                      }else{
	                                        images_path_med = "images/green-circle.png";
	                                      }
	                                      output.push('<td style=" font-size: 16px; padding-top:0;margin-left:120px; float: left; text-align: left;"><img src="'+images_path+''+images_path_med+'" height="25px" width="25px"></td>');
	                                    }
	                                    output.push('<td style=" font-size: 16px; padding-top:0; float: right; text-align: right;">'+data.med_info[i].desperse_form+'</td>');
	                                  output.push('</tr>');
	                                  output.push('<tr style=" display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-bottom:1px solid #c2c7cd; border-left:1px solid #c2c7cd; background:#f1f7fc none repeat scroll 0 0;  padding:10px; color: #000; font-size: 19px; line-height:1.42857; text-align:center; font-style:italic;">');
	                                    output.push('<td style="text-align:center"><b>Note: </b>'+data.med_info[i].medication_instructions+'</td>');
	                                  output.push('</tr>');
	                                output.push('</table>');
	                              output.push('</td>');
	                            }else {
	                              if(i == 0) output.push(noMedicaitonBox(true,"sun3.png","Evening"))
	                              else  output.push(noMedicaitonBox(false,"","Evening"))
	                            }
	                            if(data.med_info[i].medication_time.indexOf("night") > -1) {
	                              output.push('<td width="10" valign="top" align="left" style="line-height:0px; font-size:0px; width:10px;">&nbsp;</td>');
	                              output.push('<td valign="top" align="left">');
	                                output.push('<table cellpadding="0" cellspacing="0" border="0" width="22%">');
	                                     if(i == 0) {
	                                      output.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-top:1px solid #c2c7cd; background-color:#455a64;  padding:10px 5px 10px 15px; color: #020202; font-size: 27px; line-height:1.42857;">');
	                                        output.push('<td style="float:left;  width:79px; display: inline-block; padding-bottom:5px;"> <img style="padding-right:10px" src="'+images_path+'images/sun4.png"></td>');
	                                        output.push('<td style="color: #fff; font-size: 13px; padding-left:15px; padding-bottom:10px; text-align: right;">'+moment(data.med_info[i].drug_start_date).format("DD, MMM YYYY")+' TO '+moment(data.med_info[i].drug_end_date).format("DD, MMM YYYY")+'</td>');
	                                        output.push('<td style="color: #fff; float:right; font-size: 20px; font-weight: bold; padding-left: 10px; text-align: right;">Night</td>');
	                                      output.push('</tr>');
	                                    }else {
	                                      output.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-top:1px solid #c2c7cd; padding:10px 5px 10px 15px; color: #020202; font-size: 24px;">');
	                                        output.push('<td colspan="3" style="color: #000; font-size: 16px; padding: 25px 0; text-align: center;">'+moment(data.med_info[i].drug_start_date).format("DD, MMM YYYY")+' TO '+moment(data.med_info[i].drug_end_date).format("DD, MMM YYYY")+'</td>'); 
	                                      output.push('</tr>');
	                                    }
	                                  output.push('<tr style="display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd;  background:#fff; min-height:30px; padding:10px; ">');
	                                    output.push('<td style="color: #4d8734; float:left; display: inline-block; font-size: 24px; font-weight: bold;">'+data.med_info[i].drug+'</td>');
	                                    output.push('<td style="color: #4d8734; text-align:right; font-size: 20px; float:right; font-weight: bold;">'+data.med_info[i].drug_strength+' '+data.med_info[i].drug_unit+'</td>');
	                                  output.push('</tr>');

	                                  output.push('<tr style="display: inline-block; width:230px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd;  background:#fff; padding:10px 10px 10px 0px; ">');
	                                    output.push('<td style=" background: #4d8732 none repeat scroll 0 0; float:left; color: #fff; display: inline-block; font-size: 24px; margin-right: 8px; text-align: center; width: 24px; padding-left:1px; height:46px;">'+data.med_info[i].medication_time.length+'</td>');
	                                    output.push('<td style=" color: #020202; font-size: 20px; text-transform: uppercase; width:180px; float:left; padding-top:10px;">times a day</td>');
	                                    if(data.med_info[i].medication_time_quantity && data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("night")] > -1){
	                                      var images_path_med = "";
	                                      if(data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("night")] == "1"){
	                                        images_path_med = "images/green-circle.png";
	                                      }else if(data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("night")] == "0.5"){
	                                        images_path_med = "images/green-circle(3).png";
	                                      }else if(data.med_info[i].medication_time_quantity[data.med_info[i].medication_time.indexOf("night")] == "2"){
	                                        images_path_med = "images/green-circle(1).png";
	                                      }else{
	                                        images_path_med = "images/green-circle.png";
	                                      }
	                                      output.push('<td style=" font-size: 16px; padding-top:0;margin-left:120px; float: left; text-align: left;"><img src="'+images_path+''+images_path_med+'" height="25px" width="25px"></td>');
	                                    }
	                                    output.push('<td style=" font-size: 16px; padding-top:0; float: right; text-align: right;">'+data.med_info[i].desperse_form+'</td>');
	                                  output.push('</tr>');
	                                  output.push('<tr style=" display: inline-block; width:220px; border-left:1px solid #c2c7cd; border-right:1px solid #c2c7cd; border-bottom:1px solid #c2c7cd; border-left:1px solid #c2c7cd; background:#f1f7fc none repeat scroll 0 0;  padding:10px; color: #000; font-size: 19px; line-height:1.42857; text-align:center; font-style:italic;">');
	                                    output.push('<td style="text-align:center"><b>Note: </b>'+data.med_info[i].medication_instructions+'</td>');
	                                  output.push('</tr>');
	                                output.push('</table>');
	                              output.push('</td>');  
	                            }else {
	                              if(i == 0) output.push(noMedicaitonBox(true,"sun4.png","Night"))
	                              else  output.push(noMedicaitonBox(false,"","Night"))
	                            }
	                            output.push('<td width="10" valign="top" align="left" style="line-height:0px; font-size:0px; width:10px;">&nbsp;</td>');
	                          output.push('</tr>');
	                          // if((i%2)== 0) {
	                          output.push('<tr>');
	                          // }else {
	                          //   output.push('<tr style="page-break-after:always">');
	                          // }
	                            output.push('<td colspan="9" height="25" style="line-height:0px; font-size:0px;">&nbsp;</td>');
	                          output.push('</tr>');
	                        }
	                        output.push('<tr>');
	                          output.push('<td colspan="9" height="25" style="line-height:0px; font-size:0px;">&nbsp;</td>');
	                        output.push('</tr>');
	                      output.push('</table>');
	                    output.push('</td>');
	                  output.push('</tr>');
	                  output.push('<tr>');
	                    output.push('<td height="25" style="line-height:0px; font-size:0px;">&nbsp;</td>');
	                  output.push('</tr>');
	                  output.push('<tr>');
	                    output.push('<td valign="top" align="left" style="display: inline-block; padding-bottom:10px; color: #000; font-size: 20px; font-weight: bold; margin-bottom:0; text-transform:uppercase;">Additional Notes:</td>');
	                  output.push('</tr>');
	                  output.push('<tr>');
	                    output.push('<td valign="top" align="left">');
	                      output.push('<table cellpadding="0" cellspacing="0" border="0" width="100%">');
	                        output.push('<tr>');
	                          output.push('<td class="print" style="background-color:#ebecec; padding:12px 16px; color: #231f20; font-size: 18px; line-height:1.42857; padding-left:20px;">NA</td>');
	                        output.push('</tr>');
	                      output.push('</table>');
	                    output.push('</td>');
	                  output.push('</tr>');
	                  output.push('<tr>');
	                    output.push('<td height="25" style="line-height:0px; font-size:0px;">&nbsp;</td>');
	                  output.push('</tr>');

	                  if(data.pharmacy_name) {
	                    output.push('<tr>');
	                      output.push('<td height="25" style="line-height:0px; font-size:0px;">&nbsp;</td>');
	                    output.push('</tr>');
	                    output.push('<tr>');
	                      output.push('<td valign="top" align="left" style="display: inline-block; padding-bottom:10px; color: #000; font-size: 20px; font-weight: bold; margin-bottom:0; text-transform:uppercase;">Pharmacy Name:</td>');
	                      output.push('<td valign="top" align="left" style="display: inline-block; padding-bottom:10px; color: #000; font-size: 20px; font-weight: bold; margin-bottom:0; color: #5d9930;margin-left:10px;">'+data.pharmacy_name+'</td>');
	                      output.push('<td valign="top" align="right" style="display: inline-block; padding-bottom:10px; color: #000; font-size: 20px; font-weight: bold; margin-bottom:0; text-transform:uppercase;float:right;"><img src="'+images_path+'images/call.png" style="padding-right:10px;">'+data.pharmacy_phone+'</td>');
	                    output.push('</tr>');
	                    output.push('<tr>');
	                      output.push('<td valign="top" align="left">');
	                        output.push('<table cellpadding="0" cellspacing="0" border="0" width="100%">');
	                          output.push('<tr>');
	                            output.push('<td class="print" style="background-color:#ebecec; padding:12px 16px; color: #231f20; font-size: 18px; line-height:1.42857; padding-left:20px;">'+(data.pharmacy_instructions ? data.pharmacy_instructions : "NA")+'</td>');
	                          output.push('</tr>');
	                        output.push('</table>');
	                      output.push('</td>');
	                    output.push('</tr>');
	                  }

	                  output.push('<tr>');
	                    output.push('<td height="25" style="line-height:0px; font-size:0px;">&nbsp;</td>');
	                  output.push('</tr>');

	                output.push('</table>');
	              output.push('</td>');
	            output.push('</tr>');
	          output.push('</table>');
	        output.push('</div>');
	        output.push('<div style="display:none; white-space:nowrap; font:15px courier; color:#ffffff;">- - - - - - - - - - - - - - - - - -</div>');
	      output.push('</body>');
	      output.push('</html>');
	    return output.join('');
	  }
	  function generatePrintHeader(hdata,dhp_code) {
	    var tmp_img     = (hdata && hdata.invoice_image) ? hdata.invoice_image : "";
	    var tmp_name    = (hdata && hdata.hospital_name) ? hdata.hospital_name : "";
	    var tmp_add1    = (hdata && hdata.hospital_address) ? hdata.hospital_address : "";
	    var tmp_add2    = (hdata && hdata.hospital_secondary_address) ? hdata.hospital_secondary_address : "";
	    var tmp_city    = (hdata && hdata.hospital_city) ? hdata.hospital_city : "";
	    var tmp_state   = (hdata && hdata.hospital_state) ? hdata.hospital_state : "";
	    var tmp_pincode = (hdata && hdata.hospital_postal_zip_code) ? hdata.hospital_postal_zip_code : "";
	    var tmp_phone   = (hdata && hdata.hospital_phone) ? hdata.hospital_phone : "";
	    var tmp_email   = (hdata && hdata.hospital_email) ? hdata.hospital_email : "";
	    var tmp_website = (hdata && hdata.hospital_website) ? hdata.hospital_website : "";
	    var add_btm     = tmp_city +", "+ tmp_state +", India"+", "+ tmp_pincode;

	    // var data = fs.readFileSync(view_path+'header.html', 'utf-8');
	    var data = fs.readFileSync(view_path + 'header.html', 'utf-8');
	    var newValue = data.replace(/hospital_logo_img/gim, tmp_img);
	      newValue = newValue.replace(/hospital_name_for_print/gim, tmp_name);
	      newValue = newValue.replace(/hospital_address_for_print/gim, tmp_add1);
	      newValue = newValue.replace(/hospital_second_address_for_print/gim, tmp_add2);
	      newValue = newValue.replace(/hospital_city_for_print/gim, add_btm);
	      newValue = newValue.replace(/hospital_phone_for_print/gim, tmp_phone);
	      newValue = newValue.replace(/hospital_email_for_print/gim, tmp_email);
	      newValue = newValue.replace(/hospital_website_for_print/gim, tmp_website);
	      newValue = newValue.replace(/hospital_dhpcode_for_print/gim, dhp_code);
	      newValue = newValue.replace(/hospital_location_img/gim, images_path + "images/location.png");
	      newValue = newValue.replace(/hospital_call_img/gim, images_path + "images/call.png");
	      newValue = newValue.replace(/hospital_website_img/gim, images_path + "images/site.png");

	    // var writedata = fs.writeFileSync(view_path+'header.html', newValue);
	    // fs.writeFile('/home/tops/gits/tamsaplugins/tamsa_node/views/header2.html', "data", 'utf-8', function(err){
	    //   if(err) res.send(err);
	    //   else res.send("success");
	    // });
	    return newValue;
	    // fs.writeFileSync('/home/tops/gits/tamsaplugins/tamsa_node/views/header2.html', "data", 'utf-8');
	    // res.send("written");
	  }

	  function generateMedicationData(meddata, med_arr, med_info, hdata, med_count, i) {
	    if(meddata) {
	      med_arr.push({
	        drug_name:meddata.drug,
	        quantity:meddata.drug_quantity,
	        desperse_form: meddata.desperse_form,
	        drug_strength: meddata.drug_strength,
	        drug_unit: meddata.drug_unit
	      });
	      med_info.push(meddata);
	      if(med_count == (i + 1)) {
	        var medTime           = {};
	        medTime.med_info      = med_info;
	        medTime.medlist       = med_arr;

	        if(meddata.pharmacy_name) {
	          medTime.pharmacy_name         = meddata.pharmacy_name;
	          medTime.pharmacy_phone        = meddata.pharmacy_phone;
	          medTime.pharmacy_instructions = meddata.pharmacy_instructions;    
	        }
	        medTime.dhp_code = meddata.dhp_code;
	        medTime.medication_date = moment(medTime.update_ts).format("DD, MMM YYYY");
	        pi_db.view("tamsa","getPatientInformation",{key:meddata.user_id,include_docs:true}, function(err, pdata) {
	          if(pdata.rows.length > 0 ) {
	            var output     = generateMedicationHTML(medTime,pdata.rows[0].doc);
	            var changedata = generatePrintHeader(hdata,medTime.dhp_code);
	            // wkhtmltopdf(changedata, options).pipe(res);

	            fs.writeFile(view_path + 'header2.html', changedata, 'utf-8', function(err){
	              if(!err) {
	              	// var readdata = fs.readFileSync(view_path + "header2.html",'utf-8');
	                // res.send(readdata);
	                options["header-html"] = view_path + "header2.html";
	                //console.log(options);
                	// console.log(output);
	                wkhtmltopdf(output, options).pipe(res);
	              }else {
	                res.send(err);
	              }
	            });
	          }else {
	            wkhtmltopdf("Patient Details are not Found!!!", options).pipe(res);
	          }
	        });
	      }else {
	        // res.send("in else");
	      }
	    }
	  }

		var prescription_id = req.query.ids;
	  db.view('tamsa','getPrintSetting', {key:req.query.dhp_code,include_docs:true}, function(err,body) {
	    if(!err) {
	      if(body.rows.length > 0) {
	        hdata = body.rows[0].doc;
	        options["footer-center"] = body.rows[0].doc.footer;
	      }
	      var medTime = {},
	          med_info = [],
	          afternoon_arr = [],
	          evening_arr = [],
	          night_arr = [],
	          med_arr = [];
	      db.view("tamsa","getMedicationByPrescriptionId", {"key":req.query.ids, include_docs:true}, function(err,body_docs) {
	        if(body_docs.rows.length > 0) {
	          var med_count = body_docs.rows.length;
	          for(var i=0;i<med_count; i++) {
	            generateMedicationData(body_docs.rows[i].doc, med_arr, med_info,hdata,med_count,i);
	          }
	        }else {
	          wkhtmltopdf("No Medication Details are Found.").pipe(res);
	        }
	      });
	    }
	  });
	};
	return {
		printAppointment: printAppointment,
		printMedication:  printMedication,
	};
};
module.exports = printController;

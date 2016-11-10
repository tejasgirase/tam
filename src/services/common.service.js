var nconf = require('./../../config');
// nconf.argv().env().file({ file: 'config.json' });
var mailgun = require('mailgun-js')({apiKey: nconf.MAIL_API_KEY, domain: nconf.MAIL_DOMAIN});
var service = {};
service.getPcode = getPcode;
service.sendMail = sendMail;
module.exports = service;

function sendMail(res,data,from,to,subject,contentType,content,attachment) {
  var message;
  if (contentType == "html") {
    message= {from: from, to: to, subject: subject, html:content};
  }else if(contentType == "text"){
    message= {from: from, to: to, subject: subject, text:content};
  }
  mailgun.messages().send(message, function (error, body) {
    if(!error){
      res.send(data);
    }else{
      res.status(500).json({ error: "Not able to send the email.", reason:"Not able to send the email."});
    }
  });
}

function getNumber(type) {
	var letters,pool;
  if(type == "alphabetic"){
    letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];
  }else if(type == "numeric"){
    letters = "0123456789";
    pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  }else{
  }
  
  var index = Math.floor(pool.length * Math.random());
  var drawn = pool.splice(index, 1);
  return letters.substring(drawn[0], drawn[0]+1);
}

function getPcode(len,type) {
  var length = Number(len),
			code = "";
  for (var i = 0; i < length; i++) {
    code += getNumber(type);
  }
  return code;
}
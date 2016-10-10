function(doc) {
if(doc.doctype == "UserInfo" ||doc.doctype=="Subscriber" ||doc.doctype == "LoginInfo" || doc.doctype == "UserMedHis" || doc.doctype == "DeviceInfo" || doc.doctype=="NSDevice" || doc.doctype=="currentMedications" || doc.doctype=="MapDevices" || (doc.doctype=="MigDevices" && doc.MigrationStatus == "InProgress"))
  	
	emit(doc.user_id, doc);

else if(doc.doctype == "ProUserInfo"  || doc.doctype=="MedHis" )
  emit(doc.doctype, doc);
}
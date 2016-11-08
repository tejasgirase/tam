function(doc) {
if(doc.type =='user' && doc.name && doc.first_name && doc.last_name && doc.level != "Nurse" && doc.level != "Staff" && doc.level != "Front Desk")
  emit([doc.dhp_code, doc.first_name+" "+doc.last_name], doc._id);
}

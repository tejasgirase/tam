function(doc) {
   if(doc.type =='user' && doc.first_name) {
    emit([doc.dhp_code,doc.hospital_type,doc.hospital_affiliated,doc.city,doc.state,doc.country,doc.hospital_phone,doc.hospital_email]);
    emit([doc.hospital_affiliated,doc.hospital_type,doc.dhp_code,doc.city,doc.state,doc.country,doc.hospital_phone,doc.hospital_email]);
    // emit([doc.hospital_type,doc.hospital_affiliated,doc.dhp_code,doc.city,doc.state,doc.country,doc.hospital_phone,doc.hospital_email]);
   }
  }
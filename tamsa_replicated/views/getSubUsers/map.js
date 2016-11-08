function(doc) {
 if(doc.super_user_id && !doc.isdelete)
   emit ([doc.super_user_id,doc.first_name])
}
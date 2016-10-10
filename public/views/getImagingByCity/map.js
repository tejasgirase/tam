function(doc) {
if(doc.doctype =='Imaging')
  emit([doc.doctor_id, doc.city], doc.imaging_name);
}
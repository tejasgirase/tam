function(doc) {
  emit(doc.user_id, doc._id);
}
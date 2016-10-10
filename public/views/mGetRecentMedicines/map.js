function(doc) {
if(doc.doctype=="recentMedicinesUsed")
	
  		emit (doc.user_id,doc)
}
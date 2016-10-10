function(doc) {
if(doc._id == "indian_states_cities"){
	for (x in doc.states){
	emit(x,doc.states[x]);
}

}
}
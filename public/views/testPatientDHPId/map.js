function(doc) {
if(doc.doctype == "temppatientdhpid"){
var length = Number(8);
  var code = "";
  var shsval ="";
  for (var i = 0; i < length; i++) {
    var letters = "0123456789";
    var pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    var index = Math.floor(pool.length * Math.random());
    var drawn = pool.splice(index, 1);

    code += letters.substring(drawn[0], drawn[0]+1);
  }

  shsval = "SHS-"+code;
  emit(shsval,doc);
}


}
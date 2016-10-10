function drugNameAutocompleter($obj){
	if($obj.attr("id") == "drug"){
	  $element = $("#add_new_medication_parent");
	}else{
	  $element = $("#charting_medicalinfo_model");
	}
	$obj.autocomplete({
	  search: function(event, ui) { 
	     $obj.addClass('myloader');
	  },
	  source: function( request, response ) {
	    $.couch.db(db).view("tamsa/getMedicationList", {
	      success: function(data) {
	          $obj.removeClass('myloader');
	          response(data.rows);
	      },
	      error: function(status) {
	        console.log(status);
	      },
	      startkey: [pd_data.dhp_code, request.term],
	      endkey: [pd_data.dhp_code, request.term + "\u9999", {}, {}],
	      reduce : true,
	      group : true
	    });
	  },
	  minLength: 2,
	  focus: function(event, ui) {
	    return false;
	  },
	  select: function( event, ui ) {
	    if (ui.item.key[1] == "Add New Medication"){
	    	if($obj.attr("id") == "drug"){
		    	$obj.val($obj.closest(".medication_details_parent").find(".drug").val());
		      $obj.closest(".medication_details_parent").find(".drug_strength").val("");
		      $obj.closest(".medication_details_parent").find(".drug_unit").val("");
		      $obj.closest(".medication_details_parent").find(".desperse_form").val("");
		      $obj.closest(".medication_details_parent").find(".medication_route").val("");
		      $obj.closest(".medication_details_parent").find(".hideCheckbox").show();
		      return false;
		    }else{
		    	return false;
		    }
	    }else{
	    	if($obj.attr("id") == "drug"){
		    	$obj.val(ui.item.key[1].trim());
		    	$obj.closest(".medication_details_parent").find(".hideCheckbox").data("index",ui.item.key[6]);
		    	$obj.closest(".medication_details_parent").find(".hideCheckbox").show();
		      $obj.closest(".medication_details_parent").find(".drug_strength").val(ui.item.key[2]);
		      $obj.closest(".medication_details_parent").find(".drug_unit").val(ui.item.key[3].toLowerCase());
		      $obj.closest(".medication_details_parent").find(".desperse_form").val(ui.item.key[4]);
		      $obj.closest(".medication_details_parent").find(".medication_route").val(ui.item.key[5]);
		      $("#medication_tabs").find("[href='#"+$obj.closest(".medication_details_parent").attr("id")+"']").html(ui.item.key[1]);
		      
		      return false;
		    }else{
		    	$("#more_medication_add").hide();
		      $("#medication_name").val(ui.item.key[1].trim());
		      $("#medication_disperse").val(ui.item.key[4].trim());
		      $("#medication_unit").val(ui.item.key[3]);
		      $("#medication_doce").val(ui.item.key[2]);
		      if(ui.item.key[1].trim() != ""){
		        $("#medic_route").val(ui.item.key[5]);
		      }
		      var index = ui.item.key[6];
		      $("#add_new_favourite_medication").data("index",index);
		      createModal("add_favourite_medication_modal");
		      return false;
		    }
	    }
	  },
	  response: function(event, ui) {
	    if (!ui.content.length) {
	      var noResult = { key:['','Add New Medication', '', ''],label:"Add New Medication" };
	      ui.content.push(noResult);
	      //$("#message").text("No results found");
	    }
	  }
	}).
	data("uiAutocomplete")._renderItem = function(ul, item) {
	  return $("<li></li>")
	    .data("item.autocomplete", item)
	    .append("<a><h5>"+ item.key[1]+"<small style='float:right'>  "+item.key[2]+"    "+item.key[3]+"</small></h5></a>")
	    .appendTo(ul);
	};
}
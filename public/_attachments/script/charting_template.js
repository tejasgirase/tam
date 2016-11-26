function addNewChartingTemplate(fields){
  $(".tab-pane").removeClass("active");
  $("#new_charting_template").addClass('active');
  $("#new_charting_specialization_name").removeAttr('readonly');
  $(".new_charting_section_name").val('');
  $(".charting_template_field_table .maintbody").html('');
  $("#add-new-field-parent").hide();
  $("#save_new_charting_template").attr("index","");
  $("#save_new_charting_template").attr("rev","");
  $("#save_publish_new_charting_template").attr("index","");
  $("#save_publish_new_charting_template").attr("rev","");
  getAllExistingSpecializationList("new_charting_specialization_name");
}

function getFieldsFromSpecialization(){
	var fielddata = '<tr class="" response_val="" format_val="" >';

	fielddata += '<td><div class="field-choice-list"><table class = "table draggable-field-response-table"><tr class = "default-msg"><td><ul class = "field-list"><li draggable = "true" class = "ctemplate-field-names">No fields found</li></ul></td>';

	fielddata += '<td><ul class="response-list"><li class="ctemplate-response-name default-msg">No Response Found</li></ul></td></tr></table></div></td>';

		fielddata += '<td><div class="form-parent-div">';

			fielddata += '<div class="vital-sign-parent"><input type="checkbox" class="checkshow vital-sign"> &nbsp;&nbsp;<span class = "theme-color">Add Vital Signs</span><input type="checkbox" style="margin-left: 10px;" class="checkshow visit-type"> &nbsp;&nbsp;<span class="theme-color">Add Visit Type</span></div>';
			fielddata += '<div class="form-content-div mrgright1">';
				fielddata += '<div class="form-section-div">';
				fielddata += '<div class="form-section-name"><input type="text" placeholder="Enter Section Name Here" class="form-section-name-inputbox"><span title="remove section" class="glyphicon glyphicon-remove remove-section"></span></div>';

					fielddata += '<ul class="form-main-div-parent">';
						fielddata += '<li style="list-style-type:none;">';
							fielddata += '<div class="form-main-div">';
								fielddata += '<div class="form-remove-field-parent"><span class="form-remove-field glyphicon glyphicon-remove-circle"></span><span style="float: right; margin-right: 10px;" class="label label-warning edit-existing-field" count="'+getPcode(3,"numeric")+'">Edit</span></div>';
								fielddata += '<div class="form-field-div">';
									fielddata += '<div class="form-field-name"><span class="default-placeholder">Drop Your Field Name Here</span></div>';
									fielddata += '<div class="form-response-div"><span class="default-placeholder">Drop Your response here</span></div>';
								fielddata += '</div>';
							fielddata += '</div>';
						fielddata += '</li>';
					fielddata += '</ul>';
				
					fielddata += '<div class="form-more-fields-link"><a class = "form-add-more-fields"> add more fields</a></div>';
				
				fielddata += '</div>';
			fielddata += '</div>';	
			fielddata +='<div class="form-more-sections-link"><a class="form-add-more-sections"> Add More Section</a></div>';
		fielddata +='</div></td>';

	fielddata +='</tr>';

	$(".charting_template_field_table tbody").html(fielddata);
	enableDragDropSortableFunctions();
	$("#add-new-field-parent").show();
}

function saveChartingResponseField(){
	if (validateChartingResponseField()) {
		var fields = [];
		var ctemplate_rf_array = generateChartingTemplateFieldArray();
		var ctemplate_fields_table = "";
		var edit_ctemplate_field_name = "";
		var ctemplate_fieldname = $("#ctemplate-fieldname").val();

  	if(!($(this).attr("edit"))){
    	fields.push({
      		"name":              ctemplate_fieldname,
      		"ctemplate_rf_pair": ctemplate_rf_array
    	});
  	}

  	$('.default-msg').remove();
  	$(".default-msg").remove();


		if($("#save_charting_response_field").attr("count")){
			var tmpcount = $("#save_charting_response_field").attr("count");
			var $myele = $(".edit-existing-field").filter("[count="+tmpcount+"]").parent().parent();
			$myele.find(".ctemplate-field-names").html(fields[0].name);
			for(var k=0;k< fields[0].ctemplate_rf_pair.length;k++){
			  edit_ctemplate_field_name += '<li class="ctemplate-response-name res_draggable">'+generateResponseDisplay(fields[0].ctemplate_rf_pair[k])+'</li>';
			}
			$myele.find(".form-response-div").html(edit_ctemplate_field_name);
			if($myele.find(".remove-response").length < 1){
				$("<span class = 'label label-warning pointer remove-response'>remove</span><br>").prependTo($myele.find(".responsedivs"));
			}
		}else{
			for (var i=0;i<fields.length;i++) {
		  	var ctemplate_field_name = "";
		  	ctemplate_field_name = '<tr style="border-bottom: 1px solid grey;"><td width="50%" style="border-right: 1px solid grey;padding-right: 18px;"><ul class="field-list"><li class="draggable ctemplate-field-names" draggable="true">'+fields[i].name+'</li></ul></td><td width="50%" style = "padding-right:6px;"><ul class="response-list">';
		    for(var j=0;j< fields[i].ctemplate_rf_pair.length;j++){
		      ctemplate_field_name += '<li class="ctemplate-response-name res_draggable">'+generateResponseDisplay(fields[i].ctemplate_rf_pair[j])+'</li>';
		    }
		    ctemplate_field_name += '</ul></td></tr>';
			 	$(".draggable-field-response-table").append(ctemplate_field_name);
			}
		}

    $('#build_charting_template_modal').modal("hide");
    enableDragDropSortableFunctions();
	}
}

function generateChartingTemplateFieldArray () {
  	var temp_array = [];
  	$(".ctemplate-response-cmn").each(function(){
  		var row_count = $(this).attr("count");
  		var response_value = $(this).find('.cmn-ctemplate-response-val').val();
  		var format_values = getResponseValue(response_value ,row_count);
  		temp_array.push({
  		    response: response_value,
  		    format:   format_values
  			});
  		});
  	return temp_array;
}

function getResponseValue(resval,row_count){
	var format_values = []; 
	if(resval == "scale"){
		var tmp_array = {};
		tmp_array.min = $("#frmt_ctemplate_id"+row_count+" .frmtdivs").find(".cmn-scale-min").val();
		tmp_array.max = $("#frmt_ctemplate_id"+row_count+" .frmtdivs").find(".cmn-scale-max").val();
		if($("#frmt_ctemplate_id"+row_count+" .frmtdivs").find('.lower').val() != "" && $("#frmt_ctemplate_id"+row_count+" .frmtdivs").find('.higher').val() != "" ){
			tmp_array.lower  = $("#frmt_ctemplate_id"+row_count+" .frmtdivs").find('.lower').val();
			tmp_array.higher = $("#frmt_ctemplate_id"+row_count+" .frmtdivs").find('.higher').val();
		}
		format_values.push(tmp_array);
	}else if(resval == "checkbox" || resval == "multiple" || resval == "combobox"){
		$("#frmt_ctemplate_id"+row_count+" .frmtdivs").each(function(){
			format_values.push($(this).find('.cmn-ctemplate-format-val').val());
		});
	}else if(resval == "Text" || resval == "paragraph"){
		format_values.push($("#frmt_ctemplate_id"+row_count+" .frmtdivs").find('.cmn-ctemplate-format-val').val());	
	}else if(resval == "image"){
		format_values.push("image");
	}else if(resval == "table"){
		var tmp_array = {};
		var table_columns = [];
		var new_table_columns = [];
		var table_rows = [];
		var new_table_rows = [];
		
		$("#frmt_ctemplate_id"+row_count+" .column-parent").find(".frmtdivs").each(function(){
			table_columns.push($(this).find('.cmn-ctemplate-format-val').val());	
		});

		for (var i = 0; i < table_columns.length; i++) {
			if (table_columns[i]) {
				new_table_columns.push(table_columns[i]);
			}
		 }

		$("#frmt_ctemplate_id"+row_count+" .row-parent").find(".frmtdivs").each(function(){
			table_rows.push($(this).find('.cmn-ctemplate-format-val').val());	
		});

		for (var i = 0; i < table_rows.length; i++) {
			if (table_rows[i]) {
				new_table_rows.push(table_rows[i]);
			}
		}

		format_values.push({
			table_columns: new_table_columns,	
			table_rows:    new_table_rows
		});		
	}else if(resval == "grid"){
		var tmp_array = {};
		var grid_column = [];
		var new_grid_column = [];
		var grid_row = [];
		var new_grid_row = [];
		
		$("#frmt_ctemplate_id"+row_count+" .grid-column-parent").find(".frmtdivs").each(function(){
			grid_column.push($(this).find('.cmn-ctemplate-format-val').val());	
		});

		$("#frmt_ctemplate_id"+row_count+" .grid-row-parent").find(".frmtdivs").each(function(){
			grid_row.push($(this).find('.cmn-ctemplate-format-val').val());	
		});

		format_values.push({
			grid_columns: grid_column,	
			grid_rows:    grid_row
		});
	}else if(resval == "soapnote"){
		format_values.push("soapnote");
	}
	// else if(resval == "biometrics"){
	// 	format_values = $(".biometrics_values").val();
	// }
	else{
		console.log("no response value found");
	}
	return format_values;
} 

function generateResponseDisplay(resval){
	var tempstring = "";
	if(resval.response == "Text"){
		tempstring= '<div class = "responsedivs" response_type = "Text"><input  type = "text" class = "cmn-response-divs"  value = "Text" placeholder = "Text" readonly></div>';
	}else if(resval.response == "paragraph"){
		tempstring = '<div class = "responsedivs" response_type = "paragraph"><textarea  class = "cmn-response-divs txtarea" readonly>Paragraph text</textarea></div>';
	}else if(resval.response == "checkbox"){
		tempstring = generateCheckboxDisplay(resval);
	}else if(resval.response == "multiple"){
		tempstring = generateMultipleDisplay(resval);
	}else if(resval.response == "combobox"){
		tempstring = generateComboboxDisplay(resval);
	}else if(resval.response == "date"){
		tempstring= '<div class = "responsedivs" response_type = "date"><input  type = "text" class = "cmn-response-divs" date = "date" placeholder = "dd/mm/yyyy" readonly></div>';
	}else if(resval.response == "scale"){
		var count = getPcode(3,"numeric");
		tempstring += '<div class = "responsedivs" response_type = "scale" minimum = "'+resval.format[0].min+'" maximum = "'+resval.format[0].max+'" ><table><tr>';
		for(var i = resval.format[0].min; i <=resval.format[0].max; i++){
			tempstring +='<td class=" text-align"><span>'+i+'</span><br><input type="radio" name = "scale'+count+'" class="form-control"></td>';
		}
		tempstring +='</tr></table></div>';
	}else if(resval.response == "table"){
		tempstring = generateTableDisplay(resval);
	}else if(resval.response == "image"){
		tempstring = '<div class = "responsedivs" response_type = "image"><input  type = "text" class = "cmn-ctemplate-format-val" count = "'+count+'" value = "No image uploaded" readonly><button>Browse</button></div>';
	}else if(resval.response == "grid"){
		tempstring = generateGridDisplay(resval);
	}else if(resval.response == "soapnote"){
		tempstring= '<div class = "responsedivs" response_type = "soapnote"><span class = "cmn-ctemplate-format-val" count = "'+count+'">soapnote</span></div>';
	}else if(resval.response == "biometrics"){
		tempstring='<div class = "responsedivs" response_type = "biometrics"><span class = "cmn-ctemplate-format-val" count = "'+count+'">'+resval.format +'</span></div>';
	}
	else{
		tempstring = "no response Selected";
	}
	return tempstring;
}

function generateCheckboxDisplay(resval){
	var frmttype = resval.format;
	var tmpstring = '<div class = "responsedivs" response_type = "'+resval.response+'">';
	for(var i=0;i<frmttype.length;i++){
		tmpstring += '<input type = "checkbox" value = "'+frmttype[i]+'" class = "checkshow">'+frmttype[i]+'&nbsp';
	}
	tmpstring += '</div>';
	return tmpstring;
}

function generateMultipleDisplay(resval){
	var frmttype = resval.format;
	var tmpstring = '<div class = "responsedivs" response_type = "'+resval.response+'"><select class="ctemplate-multiple"><option>Single Select</option>';
	for(var i=0;i<frmttype.length;i++){
		tmpstring += '<option>'+frmttype[i]+'</option>';
	}
		tmpstring += '</select></div>';
		return tmpstring;
}

function generateComboboxDisplay(resval){
	var frmttype = resval.format;
	var tmpstring = '<div class = "responsedivs" response_type = "'+resval.response+'"><select class="ctemplate-combobox"><option>Multiple Select</option>';
		for(var fi=0; fi<frmttype.length; fi++){
			tmpstring += '<option>'+frmttype[fi]+'</option>';
		}
		tmpstring += '</select></div>';
	return tmpstring;
}

function generateTableDisplay(resval){
	var frmttype = resval.format[0];
	var tmpstring = '<div class = "responsedivs" response_type = "'+resval.response+'"><div class = "theme-color">Table Columns</div>';
		for(var fi=0; fi<frmttype.table_columns.length; fi++){
			tmpstring += '<div class = "table-column">'+frmttype.table_columns[fi]+'</div>';
		}
		tmpstring += '<br><div class = "theme-color">Table Rows</div>';
		for(var fi=0; fi<frmttype.table_rows.length; fi++){
			tmpstring += '<div class = "table-rows">'+frmttype.table_rows[fi]+'</div>';
		}
		tmpstring += '</div>';
	return tmpstring;
}

function generateGridDisplay(resval){
	var frmttype = resval.format[0];
	var tmpstring = '<div class = "responsedivs" response_type = "'+resval.response+'"><div class = "theme-color">Grid Columns</div>';
		for(var fi=0; fi<frmttype.grid_columns.length; fi++){
			tmpstring += '<div class = "grid-column">'+frmttype.grid_columns[fi]+'</div>';
		}
		tmpstring += '<br><div class = "theme-color">Grid Rows</div>';
		for(var fi=0; fi<frmttype.grid_rows.length; fi++){
			tmpstring += '<div class = "grid-rows">'+frmttype.grid_rows[fi]+'</div>';
		}
		tmpstring += '</div>';
	return tmpstring;	
}

function enableDragDropSortableFunctions(){
	$(".draggable").draggable({
  	revert:'invalid',
  	helper:'clone',
  	connectToSortable:'.form-field-name'
	});

	$(".res_draggable").draggable({
  	helper:'clone',
  	connectToSortable:'.form-response-div'
	});

	$(".form-response-div").sortable({
		forceHelperSize:true,
		forcePlaceholderSize:true,
		receive: function( event, ui ) {
			var list = $(this);
				list.find("li").each(function(){
					if($(this).hasClass('res_draggable')){
						$(this).removeClass('res_draggable').removeClass('ui-draggable').removeClass('ui-draggable-handle');
					}
					if($(this).find(".remove-response").length < 1){
						//if($(this).find(".responsedivs").attr("response_type") == "table"){
							$("<span class = 'label label-warning pointer remove-response'>remove</span><br>").prependTo($(this).find(".responsedivs"));
						//}else if($(this).find(".responsedivs").attr("response_type") == "scale"){
							// $("<span class = 'label label-warning pointer remove-response'>remove</span>").prependTo($(this).find(".responsedivs"));
						//}else{
						// 	$(this).find(".responsedivs").append("<span class = 'label label-warning pointer remove-response'>remove</span>");	
						// }
					}
				});
			list.find(".default-placeholder").remove();
			list.children().css("width","");
		}
	});

	// $(".form-res").draggable({
	// 	revert:'invalid',
	// 	connectToSortable:'.response-list',
	// 	start: function( event, ui ) {
	// 		ui.helper.css('width','40px');
	// 	}
	// });
	$(".response-list").sortable({
		revert:true
	});

  	$(".form-field-name").sortable({
  		revert:true,
  		forceHelperSize:true,
  		forcePlaceholderSize:true,
  		receive: function( event, ui ) {
            var list = $(this);
            list.html($(this).data().uiSortable.currentItem);
            list.children().css("width","100%");

        }
  	});
}

function addMoreSectionsOnForm(){
	var sectiondata = "";
	sectiondata += '<div class="form-section-div">';
		sectiondata += '<div class="form-section-name"><input type = "text" placeholder = "Enter Section Name Here" class = "form-section-name-inputbox">&nbsp;<span title="remove section" class="glyphicon glyphicon-remove remove-section"></span></div>';

			sectiondata += '<ul class="form-main-div-parent" style = "padding-left: 0px;">';
				sectiondata += '<li style="list-style-type:none;">';
					sectiondata += '<div class="form-main-div" style="min-height: 107px; border: 1px solid grey; margin: 10px;">';
						sectiondata += '<div style="min-height: 10px;"><span class="form-remove-field glyphicon glyphicon-remove-circle"></span><span style="float: right; margin-right: 10px;" class="label label-warning edit-existing-field" count = "'+getPcode(3,"numeric")+'">Edit</span></div>';
						sectiondata += '<div style="padding: 10px;" class="form-field-div">';
							sectiondata += '<div class="form-field-name" style="padding: 5px; min-height: 36px; border: 1px solid rgb(248, 224, 177);"><span class = "default-placeholder">Drop Your Field Name Here</span></div>';
							sectiondata += '<div class="form-response-div" style="min-height: 60px; padding: 5px; border: 1px solid rgb(214, 233, 198);"><span class = "default-placeholder">Drop Your response here</span></div>';
						sectiondata += '</div>';
					sectiondata += '</div>';
				sectiondata += '</li>';
			sectiondata += '</ul>';
		
		sectiondata += '<div class="form-more-fields-link"><a class = "form-add-more-fields"> add more fields</a></div>';
	sectiondata += '</div>';

	$(".form-content-div").append(sectiondata);
	enableDragDropSortableFunctions();
}

function addMoreFieldsOnForm($obj){
	var add_field_data = "";
	add_field_data = '<li style="list-style-type:none;"><div class="form-main-div" style="min-height: 107px; border: 1px solid grey; margin: 10px;"><div style="min-height: 10px;"><span class="form-remove-field glyphicon glyphicon-remove-circle"></span><span style="float: right; margin-right: 10px;" class="label label-warning edit-existing-field" count = "'+getPcode(3,"numeric")+'">Edit</span></div><div style="padding: 10px;" class="form-field-div"><div class="form-field-name" style="padding: 5px; min-height: 36px; border: 1px solid rgb(248, 224, 177);"><span class = "default-placeholder">Drop Your Field Name Here</span></div><div class="form-response-div" style="min-height: 60px; padding: 5px; border: 1px solid rgb(214, 233, 198);"><span class = "default-placeholder">Drop Your response here</span></div></div></div></div></li>';
	$obj.parent().parent().find(".form-main-div-parent").append(add_field_data);
	
	$(".form-main-div-parent").sortable({
		placeholder: "ui-state-highlight"
	});

	enableDragDropSortableFunctions();
}

function removeFormField($obj){
	$obj.parent().parent().remove();
}

function addChartingTemplateField(){
	//$mainElement = $(".ct-section-parentdiv").find("div[section-count = '"+current_count+"']");
	$("#build_charting_template_modal").modal({
	  show:true,
	  backdrop:'static',
	  keyboard:false
	});
	$("#section_name_label").html($("#new_charting_specialization_name").val());
	$("#ctemplate-fieldname").val("");
	$("#save_charting_response_field").removeAttr("count");
}

function removeSection($obj){
	$obj.parent().parent().remove();
}

function chartingTemplateModalDisplay(){
	$("#ctemplate-fieldname").focus();
	$("#ctemplate_combo_table tbody").html('<tr class="ctemplate-response-cmn" response_val="" format_val="" count="0"><td><select count="0" class="form-control cmn-ctemplate-response-val"><option value="Text" >Text</option><option value="paragraph">Paragraph Text</option><option value="multiple">Choose From List (Single Select)</option><option value="combobox">Choose From List(Multiple Select)</option><option value="date">Date</option><option value="scale">Scale</option><option value="table">Table</option><option value="image">Image</option><option value="grid">Grid</option><option value="soapnote">SoapNote</option></select></td><td id="frmt_ctemplate_id0"><div class="frmtdivs"><input  class="form-control cmn-ctemplate-format-val" count="0" value="Text" readonly></div></td><td><span class="label label-warning pointer remove-ctemplate-response" count="0">Delete</span></td></tr>');
}

function generateChartingResponseCombobox(){
  var count = new Number($(".ctemplate-response-cmn:last").attr("count")) + 1;
    var ctemplate_response_data = '';

    ctemplate_response_data +='<tr class="ctemplate-response-cmn" response_val="" format_val="" count="'+count+'"><td><select count="'+count+ '" class="form-control cmn-ctemplate-response-val"><option value="Text" >Text</option><option value="paragraph">Paragraph Text</option><option value="multiple">Choose From List(Single Select)</option><option value="combobox">Choose From List(Multiple Select)</option><option value="date">Date</option><option value="scale">Scale</option><option value="table">Table</option><option value="image">Image</option><option value="grid">Grid</option><option value="soapnote">SoapNote</option><option value="biometrics">Biometrics & Medical History</option></select></td><td id="frmt_ctemplate_id'+count+'"><div class="frmtdivs"><input  class="form-control cmn-ctemplate-format-val" count="'+count+'" value="Text" readonly></div></td><td><span class="label label-warning pointer remove-ctemplate-response" count="'+count+'">Delete</span></td></tr>';
      
    $("#ctemplate_combo_table tbody").append(ctemplate_response_data);
}

function updateValueForEditingChartingTemplateFieldResponse(RFarray){
	$(".ctemplate-response-cmn").each(function(i){
		$(this).find(".cmn-ctemplate-response-val").val(RFarray[i].response);
		$(this).find(".cmn-ctemplate-response-val").trigger("change");
		switch(RFarray[i].response){
			case "checkbox":
				$(this).find(".cmn-ctemplate-format-val").val(RFarray[i].format[0]);
				for(var j=1;j<RFarray[i].format.length;j++){
					$(this).find(".add-format-options").trigger("click");
					$(this).find(".cmn-ctemplate-format-val:last").val(RFarray[i].format[j]);
				}
			break;
			case "multiple":
				$(this).find(".cmn-ctemplate-format-val").val(RFarray[i].format[0]);
				for(var j=1;j<RFarray[i].format.length;j++){
					$(this).find(".add-format-options").trigger("click");
					$(this).find(".cmn-ctemplate-format-val:last").val(RFarray[i].format[j]);
				}
			break;
			case "combobox":
				$(this).find(".cmn-ctemplate-format-val").val(RFarray[i].format[0]);
				for(var j=1;j<RFarray[i].format.length;j++){
					$(this).find(".add-format-options").trigger("click");
					$(this).find(".cmn-ctemplate-format-val:last").val(RFarray[i].format[j]);
				}
			break;
			case "table":
				if(RFarray[i].format[0].table_columns.length > 0){
					$(this).find(".column-parent").find(".cmn-ctemplate-format-val").val(RFarray[i].format[0].table_columns[0]);
					for(var j=1;j<RFarray[i].format[0].table_columns.length;j++){
						$(this).find(".add-more-columns").trigger("click");
						$(this).find(".column-parent").find(".cmn-ctemplate-format-val:last").val(RFarray[i].format[0].table_columns[j]);
					}
				}
				if(RFarray[i].format[0].table_rows.length > 0){
					$(this).find(".row-parent").find(".cmn-ctemplate-format-val").val(RFarray[i].format[0].table_rows[0]);
					for(var j=1;j<RFarray[i].format[0].table_rows.length;j++){
						$(this).find(".add-more-rows").trigger("click");
						$(this).find(".row-parent").find(".cmn-ctemplate-format-val:last").val(RFarray[i].format[0].table_rows[j]);
					}
				}
			break;
			case "grid":
				if(RFarray[i].format[0].grid_columns.length > 0){
					$(this).find(".grid-column-parent").find(".cmn-ctemplate-format-val").val(RFarray[i].format[0].grid_columns[0]);
					for(var j=1;j<RFarray[i].format[0].grid_columns.length;j++){
						$(this).find(".add-more-columns-grid").trigger("click");
						$(this).find(".grid-column-parent").find(".cmn-ctemplate-format-val:last").val(RFarray[i].format[0].grid_columns[j]);
					}
				}
				if(RFarray[i].format[0].grid_rows.length > 0){
					$(this).find(".grid-row-parent").find(".cmn-ctemplate-format-val").val(RFarray[i].format[0].grid_rows[0]);
					for(var j=1;j<RFarray[i].format[0].grid_rows.length;j++){
						$(this).find(".add-more-rows-grid").trigger("click");
						$(this).find(".grid-row-parent").find(".cmn-ctemplate-format-val:last").val(RFarray[i].format[0].grid_rows[j]);
					}
				}
			break;
			case "scale":
				$(this).find(".cmn-scale-min").val(RFarray[i].format[0].min);
				$(this).find(".cmn-scale-max").val(RFarray[i].format[0].max);
			break;
			// case "biometrics":
			// 	var are = [];
			// 	for (var j = 0; j < RFarray[i].format.length; j++) {
			// 		are.push(RFarray[i].format[j])
			// 	};
			// 	$(this).find(".biometrics_values").multiselect("widget").find(":checkbox").each(function () {
			// 	    if ($.inArray(this.value, are) != -1) {
			// 	        $(this).click();
			// 	        $(this).prop('checked', true);
			// 	    }
			// 	});
			// break;
		}
	});
}

function generateFormatFromResponse(resval,current_count){
	var tempstring = "";
	if(resval == "Text"){
		tempstring= '<div class = "frmtdivs"><input  type = "text" class = "cmn-ctemplate-format-val" count = "'+current_count+'" value = "Text" readonly></div>';
	}else if(resval == "paragraph"){
		tempstring = '<div class = "frmtdivs"><textarea  class = "cmn-ctemplate-format-val" count = "'+current_count+'" readonly>Paragraph Text</textarea></div>';
	}else if(resval == "checkbox"){
		tempstring = generateCheckbox(current_count);
	}else if(resval == "multiple"){
		tempstring = generateMultiple(current_count);
	}else if(resval == "combobox"){
		tempstring = generateCombobox(current_count);
	}else if(resval == "date"){
		tempstring = '<div class = "frmtdivs"><input type = "text" class = "cmn-ctemplate-format-val" value = "" count = "'+current_count+'" placeholder = "dd/mm/yyyy" readonly></div>';
	}else if(resval == "scale"){
		tempstring = generateScale(current_count);
	}else if(resval == "table"){
		tempstring = generateTable(current_count);
	}else if(resval == "image"){
		tempstring= '<div class = "frmtdivs"><input  type = "text" class = "cmn-ctemplate-format-val" count = "'+current_count+'" value = "No image uploaded" readonly><button disabled>Browse</button></div>';
	}else if(resval == "grid"){
		tempstring = generateGrid(current_count);
	}else if(resval == "soapnote"){
		tempstring= '<div class = "frmtdivs"><span class = "cmn-ctemplate-format-val" count = "'+current_count+'">SOAP Note</div>';
	}
	// else if(resval == "biometrics"){
	// 	tempstring = generateBiometrics(current_count);
	// }
	else{
		tempstring = "no response Selected";
	}
	$("#frmt_ctemplate_id"+current_count).html(tempstring);

	// $(".biometrics_values").multiselect({
	// 	selectedList: 4,
	// 	noneSelectedText: "Biometrics & Medical History "
	// });
}

function generateCheckbox(current_count){
	return '<div class="frmtdivs"><input type="checkbox" class="checkshow">&nbsp;<input  type="text" class="cmn-ctemplate-format-val" count="'+current_count+'"><img src="images/close-mini.png" class="pointer close-format-options"/></div><div class="add-format-options-parent"><a class="add-format-options" count="'+current_count+'">add options</a></div>';
}

function generateMultiple(current_count){
	return '<div class="frmtdivs"><input  type="text" class="cmn-ctemplate-format-val" count="'+current_count+'" placeholder="add option"><img src="images/close-mini.png" class="pointer close-format-options"/></div><div class="add-format-options-parent"><a class="add-format-options" count="'+current_count+'">add options</a></div>';
}

function generateCombobox(current_count){
	return '<div class="frmtdivs"><input  type="text" class="cmn-ctemplate-format-val" count="'+current_count+'" placeholder="add option"><img src="images/close-mini.png" class="pointer close-format-options"/></div><div class="add-format-options-parent"><a class="add-format-options" count="'+current_count+'">add options</a></div>';
}

function generateScale(current_count){
	return '<div class="frmtdivs"><select class="cmn-scale-min"><option>0</option><option>1</option></select>to<select class="cmn-scale-max"><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option><option>10</option></select><br><input class="lower" type= "text" placeholder="lower limit(optional)"><br><input type= "text" class="higher" placeholder="higher limit(optional)"></div>';
}

function generateTable(current_count){
	var tempstring='<div class="column-parent"><div class="frmtdivs"><input  type="text" class="cmn-ctemplate-format-val" count="'+current_count+'" placeholder="column header"><img src="images/close-mini.png" class="pointer close-format-options"/></div><div class="add-format-options-parent"><a class="add-more-columns theme-color" count="'+current_count+'">add more columns</a></div></div><br>';
		tempstring += '<div class="row-parent"><div class="frmtdivs"><input  type="text" class="cmn-ctemplate-format-val" count="'+current_count+'" placeholder="row header"><img src="images/close-mini.png" class="pointer close-format-options"/></div><div class="add-format-options-parent"><a class="add-more-rows theme-color" count = "'+current_count+'">add more rows</a></div></div>';
	 return tempstring;
}

function generateImage(current_count){
	return '<div class="frmtdivs"><input  type="text" class="cmn-ctemplate-format-val" count="'+current_count+'" placeholder="upload image"><img src="images/close-mini.png" class="pointer close-format-options"/></div><div class="add-format-options-parent"><a class="add-format-options" count="'+current_count+'">add options</a></div>';
}

function generateGrid(current_count){
	var tempstring='<div class="grid-column-parent"><div class="frmtdivs"><input  type="text" class="cmn-ctemplate-format-val" count="'+current_count+'" placeholder="Insert Grid column"><img src="images/close-mini.png" class="pointer close-format-options"/></div><div class="add-format-options-parent"><a class="add-more-columns-grid theme-color" count="'+current_count+'">add more Grid columns</a></div></div><br>';
		
		tempstring += '<div class="grid-row-parent"><div class="frmtdivs"><input  type="text" class="cmn-ctemplate-format-val" count="'+current_count+'" placeholder="Insert Grid row"><img src="images/close-mini.png" class="pointer close-format-options"/></div><div class="add-format-options-parent"><a class="add-more-rows-grid theme-color" count="'+current_count+'">add more Grid rows</a></div></div>';
	return tempstring;	
}

function removeChartingTemplateResponse(current_count){
	$(".ctemplate-response-cmn").filter("[count = '"+current_count+"']").remove();
}

function closeFormatOptions($obj){
	if($obj.parent().length > 0){
		$obj.parent().remove();	
	}else{
		newAlert('danger', "minimum one value required.");
		$('html, body').animate({scrollTop: 0}, 'slow');
	}
}

function addFormatOptions($obj){
	var temp_count = new Number($obj.attr("count"));
	$cloneEle =  $obj.parent().prev().clone();
	$cloneEle.find(".cmn-ctemplate-format-val").val("");
	$("#frmt_ctemplate_id"+temp_count +" .frmtdivs:last").after($cloneEle);
}

function addMoreRows($obj){
	var temp_count = new Number($obj.attr("count"));
	$cloneEle =  $obj.parent().prev().clone();
	$cloneEle.find(".cmn-ctemplate-format-val").val("");
	$("#frmt_ctemplate_id"+temp_count).find(".row-parent").find(".frmtdivs:last").after($cloneEle);
}

function addMoreColumns($obj){
	var temp_count = new Number($obj.attr("count"));
	$cloneEle =  $obj.parent().prev().clone();
	$cloneEle.find(".cmn-ctemplate-format-val").val("");
	$("#frmt_ctemplate_id"+temp_count).find(".column-parent").find(".frmtdivs:last").after($cloneEle);
}

function addMoreRowsGrid($obj){
	var temp_count = new Number($obj.attr("count"));
	$cloneEle =  $obj.parent().prev().clone();
	$cloneEle.find(".cmn-ctemplate-format-val").val("");
	$("#frmt_ctemplate_id"+temp_count).find(".grid-row-parent").find(".frmtdivs:last").after($cloneEle);
}

function addMoreColumnsGrid($obj){
	var temp_count = new Number($obj.attr("count"));
	$cloneEle =  $obj.parent().prev().clone();
	$cloneEle.find(".cmn-ctemplate-format-val").val("");
	$("#frmt_ctemplate_id"+temp_count).find(".grid-column-parent").find(".frmtdivs:last").after($cloneEle);
}

function ctemplateSectionArray(){
	var section = [];
	$(".form-section-div").each(function(index){
		var sectionfieldArray = [];
		var s_name = $(this).find(".form-section-name-inputbox").val();
		$(this).find(".form-main-div").each(function(myindex){
			var response_format = [];
			var section_field_name = $(this).find(".ctemplate-field-names").html();
			$(this).find(".responsedivs").each(function(innerindex){
				var response_type = $(this).attr("response_type");
				var frmt_array = generateFormatArray(response_type, $(this));
				response_format.push({
					response: response_type,
					format:   frmt_array  
				});
			});	
			sectionfieldArray.push({
				f_name:               section_field_name,
				response_format_pair: response_format
			});
		});
		section.push({
			s_name: s_name,
			fields: sectionfieldArray
		});
	});
	return section;
}

function generateFormatArray(resval,$obj){
	var temp_array = [];
	if(resval == "Text"){
		temp_array.push("Text");
	}else if(resval == "paragraph"){
		temp_array.push("paragraph");
	}else if(resval == "checkbox"){
		$obj.find(".checkshow").each(function(){
			temp_array.push($(this).val());
		});
	}else if(resval == "multiple"){
		$obj.find(".ctemplate-multiple option").each(function(){
			temp_array.push($(this).val());
		});
		temp_array.shift();
	}else if(resval == "combobox"){
		$obj.find(".ctemplate-combobox option").each(function(){
			temp_array.push($(this).val());
		});
		temp_array.shift();
	}else if(resval == "date"){
		temp_array.push("date");
	}else if(resval == "scale"){
		var scale_array = {};
		scale_array.min = $obj.attr("minimum");
		scale_array.max = $obj.attr("maximum");
		temp_array.push(scale_array);
	}else if(resval == "table"){
		var col_arry = [];
		var row_arry = [];
		$obj.find(".table-column").each(function(){
			col_arry.push($(this).html());
		});
		$obj.find(".table-rows").each(function(){
			
			row_arry.push($(this).html());
		});
		temp_array.push({
			table_columns: col_arry,
			table_rows:    row_arry
		});
	}else if(resval == "image"){
		temp_array.push("image");
	}else if(resval == "grid"){
		var grid_col = [];
		var grid_row = [];
		$obj.find(".grid-column").each(function(){
			grid_col.push($(this).html());
		});
		$obj.find(".grid-rows").each(function(){
			grid_row.push($(this).html());
		});
		temp_array.push({
			grid_columns: grid_col,
			grid_rows:    grid_row
		});
	}else if(resval == "soapnote"){
		temp_array.push("soapnote");
	}else if(resval == "biometrics"){
		temp_array = $obj.find(".cmn-ctemplate-format-val").html().split(",");
	}else{
		console.log("no response");
	}
	return temp_array; 
}

function openeditModeForChartingTemplate(index) {
}

function editChartingTemplate(indexval){
	$(".tab-pane").removeClass("active");
	$("#new_charting_template").addClass('active');
	$(".charting_template_field_table .maintbody").html('');
	$.couch.db(db).openDoc(indexval, {
	  success: function(data) {
	    $("#new_charting_specialization_name").val(data.specialization);
	    if($("#dc_charting_flag").val() == "Copy"){
		    $("#new_charting_template_name").val(data.template_name + "_copy");
	    	$("#save_new_charting_template").removeAttr("index");
	    	$("#save_new_charting_template").removeAttr("rev");
	    	$("#save_publish_new_charting_template").removeAttr("index");
		    $("#save_publish_new_charting_template").removeAttr("rev");	
		  }else{
	    	$("#new_charting_template_name").val(data.template_name);
		    $("#save_new_charting_template").attr("index",data._id);
		    $("#save_new_charting_template").attr("rev",data._rev);
		    $("#save_publish_new_charting_template").attr("index",data._id);
		    $("#save_publish_new_charting_template").attr("rev",data._rev);	
	    }
	    var edit_charting_tempate_data = "";
	    existingFieldsFromSpecialization(data.specialization,data);
	  },
	  error: function(status) {
	    console.log(status);
	  }
	});
}

function existingFieldsFromSpecialization(selecteditem,data){
	var updatedata = data;
	$("#add-new-field-parent").show();
	$.couch.db(db).view("tamsa/getFieldsFromSpecialization", {
	  success: function(data) {
	  	if(data.rows.length > 0){
	  		$(".add-new-field-parent").show();
	  		var fielddata = '<tr class = "" response_val = "" format_val = ""><td><div class="field-choice-list"><table class = "table draggable-field-response-table" style = "border: 1px solid grey;">';
	  			for (var i = 0;i < data.rows.length;i++) {
	  				fielddata += '<tr style = "border-bottom: 1px solid grey;"><td width="50%" style="border-right: 1px solid grey;"><ul class = "field-list"><li draggable = "true" class = "draggable ctemplate-field-names">'+data.rows[i].key[1]+'</li></ul></td><td width="50%" style = "padding-right:18px;"><ul class = "response-list">';
	  				for(var j=0;j< data.rows[i].key[2].length;j++){
	  					fielddata += '<li class="ctemplate-response-name res_draggable">'+generateResponseDisplay(data.rows[i].key[2][j])+'</li>';
	  				}
	  				fielddata +='</ul></td></tr>';
	  			}
	  			
	  			fielddata +='</table></div></td>';

	  			fielddata += '<td><div class="form-parent-div">';
	  				fielddata += '<div class = "vital-sign-parent"><input type="checkbox" class="checkshow vital-sign"> &nbsp;&nbsp;<span class = "theme-color">Add Vital Signs</span><input type="checkbox" style="margin-left: 10px;" class="checkshow visit-type"> &nbsp;&nbsp;<span class="theme-color">Add Visit Type</span></div>';
	  				fielddata += '<div class = "form-content-div mrgright1">';
	  					fielddata += '<div class="form-section-div">';
	  					fielddata += '<div class="form-section-name"><input type = "text" placeholder = "Enter Section Name Here" class = "form-section-name-inputbox"><span title="remove section" class="glyphicon glyphicon-remove remove-section"></span></div>';

	  						fielddata += '<ul class="form-main-div-parent" style = "padding-left: 0px;">';
	  							fielddata += '<li style="list-style-type:none;">';
	  								fielddata += '<div class="form-main-div" style="min-height: 107px; border: 1px solid grey; margin: 10px;">';
	  									fielddata += '<div style="min-height: 10px;"><span class="form-remove-field glyphicon glyphicon-remove-circle"></span><span style="float: right; margin-right: 10px;" class="label label-warning edit-existing-field" count = "'+getPcode(3,"numeric")+'">Edit</span></div>';
	  									fielddata += '<div style="padding: 10px;" class="form-field-div">';
	  										fielddata += '<div class="form-field-name" style="padding: 5px; min-height: 36px; border: 1px solid rgb(248, 224, 177);"><span class = "default-placeholder">Drop Your Field Name Here</span></div>';
	  										fielddata += '<div class="form-response-div" style="min-height: 60px; padding: 5px; border: 1px solid rgb(214, 233, 198);"><span class = "default-placeholder">Drop Your response here</span></div>';
	  									fielddata += '</div>';
	  								fielddata += '</div>';
	  							fielddata += '</li>';
	  						fielddata += '</ul>';
	  					
	  						fielddata += '<div class="form-more-fields-link"><a class = "form-add-more-fields"> add more fields</a></div>';
	  					
	  					fielddata += '</div>';
	  				fielddata += '</div>';	
	  				fielddata +='<div class="form-more-sections-link"><a class="form-add-more-sections"> Add More Section</a></div>';
	  			fielddata +='</div></td>';

	  		fielddata +='</tr>';

	  		$(".charting_template_field_table tbody").html(fielddata);
	  		enableDragDropSortableFunctions();
	  		//update charting template
	  		if(updatedata){
	  			updateChartingFormValues(updatedata);
	  		}
	  	}
	  	else{
	  		newAlert('danger', 'No Fields are saved for .' + selecteditem);
			$('html, body').animate({scrollTop: 0}, 'slow');
	  	}

	  },
	  error: function(status) {
	      console.log(status);
	  },
	  startkey: [selecteditem],
	  endkey:[selecteditem,{},{}],
	  reduce:true,
	  group:true
	});
}

function updateChartingFormValues(data){
	for(var i=0; i<data.sections.length;i++){
        if(i > 0){
		    addMoreSectionsOnForm();
		}
		$(".form-section-div:last").find(".form-section-name-inputbox").val(data.sections[i].s_name);
		for(var j=0 ;j<data.sections[i].fields.length;j++){
			if(j > 0){
		    	$(".form-add-more-fields:last").trigger('click');
			}
			var updatedata = '<li class="draggable ctemplate-field-names" draggable="true" style="width: 100%; right: auto; bottom: auto;">'+data.sections[i].fields[j].f_name+'</li>';
			$(".form-section-div:last").find(".form-field-name:last").append(updatedata);
			for(var k=0;k<data.sections[i].fields[j].response_format_pair.length;k++){
				var updateresponse = '<li class="ctemplate-response-name">'+generateResponseDisplay(data.sections[i].fields[j].response_format_pair[k])+'</li>';
				$(".form-section-div:last").find(".form-response-div:last").append(updateresponse);
				enableDragDropSortableFunctions();
			}
		}
	}

	$(".form-parent-div").find(".responsedivs").each(function(){
		if($(this).find(".remove-response").length < 1){
			$("<span class = 'label label-warning pointer remove-response'>remove</span>").prependTo($(this));
		}
	});

	$(".default-placeholder").remove();
	$(".form-main-div-parent").sortable({
		placeholder: "ui-state-highlight"
	});
	if(data.vital_signs_active == "Yes") $(".vital-sign").prop("checked",true)
	else $(".vital-sign").prop("checked",false)

	if(data.visit_type_active && data.visit_type_active == "Yes") $(".visit-type").prop("checked",true)
	else $(".visit-type").prop("checked",false)
}

function checkSectionName(){
	var tmp;
	$(".form-section-name-inputbox").each(function(){
		if($(this).val() == ""){
			$(this).focus();
			tmp = false;
			return;
		}else{
			tmp = true;
			return;
		} 
	});
	return tmp;
}

function checkFieldName(){
	var tmp;
	$(".form-field-name").each(function(){
		if($(this).find("li").length == 0){
			newAlert('danger', 'Drag and Drop your field name.');
			$('html, body').animate({scrollTop: 0}, 'slow');	
			tmp = false;
			return;
		}else{
			tmp = true;
			return;
		}
	});
	return tmp;
}

function checkResponseName(){
	var tmp;
	$(".form-response-div").each(function(){
		if($(this).find("li").length == 0){
			newAlert('danger', 'Drag and Drop your response value.');
			$('html, body').animate({scrollTop: 0}, 'slow');	
			tmp = false;
			return;
		}else{
			tmp = true;
			return;
		}
	});
	return tmp;
}

function requireFieldValidation(){
	if($("#new_charting_template_name").val() == ""){
		newAlert('danger', 'Template name can not be empty.');
		$("#new_charting_template_name").focus();
		$('html, body').animate({scrollTop: 0}, 'slow');
		return false;
	}else if(!$("#new_charting_specialization_name").val() && $("#new_charting_template_name_by_text").val().trim() == "" ){
		newAlert('danger', 'Specialization name can not be empty.');
		$('html, body').animate({scrollTop: 0}, 'slow');
		return false;
	}else if(!(checkSectionName())){
		newAlert('danger', 'Section name can not be empty.');
		$('html, body').animate({scrollTop: 0}, 'slow');
		return false;
	}else if(!(checkFieldName())){
		return false;
	}else if(!(checkResponseName())){
		return false;
	}else{
		return true;
	}
}

function fieldResponseListFromSpecialization(){
	var temp_array = [];
	var fields     = [];
	var responses  = [];

	$(".field-list li").each(function(){
		fields.push($(this).html());
	});
	$(".response-list li").each(function(){
		var response_type = $(this).find(".responsedivs").attr("response_type");
		var frmt_array = generateFormatArray(response_type, $(this));
		responses.push({
			response: response_type,
			format:   frmt_array
		});
	});

	temp_array.push({
		fieldlist:    fields,
		responselist: responses
	});
	return temp_array;
}

function saveNewChartingTemplate(saveid){
	$("#save_new_charting_template ,#save_publish_new_charting_template").attr("disabled","disabled");
	if($("#dc_charting_flag").val() == "Copy" || $("#dc_charting_flag").val() == "Source"){
	  $("#save_new_charting_template").removeAttr("index");
	  $("#save_new_charting_template").removeAttr("rev");
	  $("#save_publish_new_charting_template").removeAttr("index");
	  $("#save_publish_new_charting_template").removeAttr("rev");
	}
	if(!$("#new_charting_specialization_name").val()){
		if($("#new_charting_template_name_by_text").val != ""){
    	var specialization_name = $("#new_charting_template_name_by_text").val();
  	}else{

  	}
  }else{
  	var specialization_name = $("#new_charting_specialization_name").val();
  }
	var template_name = $.trim($("#new_charting_template_name").val());
	if(saveid == "save_new_charting_template"){
		$.couch.db(db).view("tamsa/getExistingChartingTemplates", {
		  success: function(data) {
		    if(data.rows.length > 0 ){
		      if($("#save_new_charting_template").attr("index") &&  $("#save_new_charting_template").attr("rev")){
		        $("#save_new_charting_template").attr("index",data.rows[0].doc._id);
		        $("#save_new_charting_template").attr("rev",data.rows[0].doc._rev);
		        $("#save_publish_new_charting_template").attr("index",data.rows[0].doc._id);
		        $("#save_publish_new_charting_template").attr("rev",data.rows[0].doc._rev);
		        saveNewChartingTemplateRequest(saveid);
		      }else{
		        newAlert('danger', 'Charting Template with given name is already exist in My Practise.');
		        $('html, body').animate({scrollTop: 0}, 'slow');
		    		$("#save_new_charting_template, #save_publish_new_charting_template").removeAttr("disabled");
		        return false;
		      }
		    }else {
		      saveNewChartingTemplateRequest(saveid);
		    }
		  },
		  error: function(data,error,reason) {
		    $("#save_new_charting_template, #save_publish_new_charting_template").removeAttr("disabled");
		    newAlert('danger', error);
		    $('html, body').animate({scrollTop: 0}, 'slow');
		    return;  
		  },
		   key:[pd_data._id,template_name,specialization_name],
		   include_docs:true
		});
	}else{
		$.couch.db(db).view("tamsa/getCommunityChartingTemplates", {
		  success: function(data) {
		    if(data.rows.length > 0 ){
	        newAlert('danger', 'Charting Template with given name is already exist in Community.');
	        $('html, body').animate({scrollTop: 0}, 'slow');
	        $("#save_new_charting_template, #save_publish_new_charting_template").removeAttr("disabled");
	        return false;
		    }else {
		    	$.couch.db(db).view("tamsa/getExistingChartingTemplates", {
		    	  success: function(data) {
		    	    if(data.rows.length > 0 ){
		    	    	if($("#dc_charting_flag").val() == "New"){
		    	    		$("#save_new_charting_template").attr("index",data.rows[0].doc._id);
		    	    		$("#save_new_charting_template").attr("rev",data.rows[0].doc._rev);
		    	    		$("#save_publish_new_charting_template").attr("index",data.rows[0].doc._id);
		    	    		$("#save_publish_new_charting_template").attr("rev",data.rows[0].doc._rev);
		    	    		saveNewChartingTemplateRequest(saveid);
		    	    	}else{
		    	        newAlert('danger', 'Charting Template already exist.');
	      	        $('html, body').animate({scrollTop: 0}, 'slow');
	      	        $("#save_new_charting_template, #save_publish_new_charting_template").removeAttr("disabled");
	      	        return false;	
		    	    	}
		    	    }else{
		    	      saveNewChartingTemplateRequest(saveid);
		    	    }
		    	  },
		    	  error: function(data,error,reason) {
		    	    $("#save_new_charting_template, #save_publish_new_charting_template").removeAttr("disabled");
		    	    newAlert('danger', 'Charting Template already exist.');
		    	    $('html, body').animate({scrollTop: 0}, 'slow');
		    	    return;  
		    	  },
		    	   key:[pd_data._id,template_name,specialization_name],
		    	   include_docs:true
		    	});
		    }
		  },
		  error: function(data,error,reason) {
		    $("#save_new_charting_template, #save_publish_new_charting_template").removeAttr("disabled");
		    newAlert('danger', 'Charting Template already exist.');
		    $('html, body').animate({scrollTop: 0}, 'slow');
		    return;  
		  },
		   key:[template_name,specialization_name],
		   include_docs:true
		});	
	}
}

function saveNewChartingTemplateRequest(saveid){
	if(requireFieldValidation()){
		var vs_active,bmi_values; 
		if($(".vital-sign").prop("checked")) vs_active = "Yes"
		else vs_active = "No"
		if($(".visit-type").prop("checked")) visit_active = "Yes"
		else visit_active = "No"

		if(!$("#new_charting_specialization_name").val()){
	    if($("#new_charting_template_name_by_text").val != ""){
	    var specialization_value = $("#new_charting_template_name_by_text").val();
	      $.couch.db(db).view("tamsa/getSpecializationList", {
	        success:function(data){
	          if(data.rows.length > 0){
	            var new_list = data.rows[0].value.specialization;
	            if($.inArray(specialization_value, new_list) == -1){
	                new_list.push(specialization_value);
	              var doc = {
	                _id:            data.rows[0].value._id,
	                _rev:           data.rows[0].value._rev,
	                doctype:        data.rows[0].value.doctype,
	                specialization: new_list
	              }
	              $.couch.db(db).saveDoc(doc,{
	                success:function(data){
	                  console.log(data);
	                },
	                error:function(status){
	                  console.log(status);
	                }
	              });
	            }else{
	              $("#new_charting_template_name_by_text").text("Specialization name already exist");
	              $('html, body').animate({scrollTop: 0}, 'slow');
	              $("#new_specialization").focus();
	            }    
	          }
	        },
	        error:function(status){
	        	console.log(status);
	        } 
	      });  
	    }
  	}else{
   	var specialization_value = $("#new_charting_specialization_name").val();
  	}	
			
	  var d = new Date();
	  var tempfields = ctemplateSectionArray();
	  
	  var charting_template_doc = {
	    doctor_id:          pd_data._id,
	    dhp_code:           pd_data.dhp_code,
	    practice_code:      pd_data.random_code,
			doctor_name:        pd_data.first_name+" "+pd_data.first_name,
	    template_name:      $("#new_charting_template_name").val(),
	    doctype:            "charting_template",
	    update_ts:          d,
	    publish:            "No",
	    specialization:     specialization_value,
	    sections:           tempfields,
	    vital_signs_active: vs_active,
	    visit_type_active:  visit_active
	  };

	  var community_charting_template_doc = {
	    doctor_id:          pd_data._id,
	    dhp_code:           pd_data.dhp_code,
	    practice_code:      pd_data.random_code,
			doctor_name:        pd_data.first_name+" "+pd_data.first_name,
	    template_name:      $("#new_charting_template_name").val(),
	    doctype:            "charting_template",
	    update_ts:          d,
	    publish:            "Yes",
	    specialization:     specialization_value,
	    vital_signs_active: vs_active,
	    visit_type_active:  visit_active
	  };

	  if($("#save_new_charting_template").attr("index") &&  $("#save_new_charting_template").attr("rev")){
	    charting_template_doc._id  = $("#save_new_charting_template").attr("index");
	    charting_template_doc._rev = $("#save_new_charting_template").attr("rev");

	    $.couch.db(db).openDoc($("#save_new_charting_template").attr("index"), {
	      success: function(data) {
	        $.couch.db(db).saveDoc(charting_template_doc, {
	          success: function(data) {
    	     		if(saveid == "save_publish_new_charting_template"){
    	     			$.couch.db(db).saveDoc(community_charting_template_doc, {
    	     				success:function(udata){
    	     					newAlert('success', 'Charting Template updated successfully!');
				     				$('html, body').animate({scrollTop: 0}, 'slow');
    				     		$("#save_new_charting_template").attr("index","");
    				     		$("#save_new_charting_template").attr("rev","");
    				     		if($("#dc_charting_flag").val() == "Copy"){
    				     			$(".pd_back").trigger('click');
    				     		}else{
    				     			$("#back_to_charting_build").trigger('click');	
    				     		}
    				     		$("#save_new_charting_template ,#save_publish_new_charting_template").removeAttr("disabled");
    				     		$("#save_new_charting_template ,#save_publish_new_charting_template").removeAttr("disabled");
    				     		saveAuditRecord("Charting","Update","New Charting Update Successfully.");
    				     		
    	     				},
    			      	error: function(data, error, reason) {
    			        	newAlert('danger', reason);
    		        		$('html, body').animate({scrollTop: 0}, 'slow');
    		        		$("#save_new_charting_template ,#save_publish_new_charting_template").removeAttr("disabled");
    		        		saveAuditRecord("Charting","Update","Error while Updating Charting");
    		        		return false;
    			      	}
    	     			});
    	     		}else{
    	     			newAlert('success', 'Charting Template updated successfully!');
				     		$('html, body').animate({scrollTop: 0}, 'slow');
    	     			$("#save_new_charting_template").attr("index","");
    	     			$("#save_new_charting_template").attr("rev","");
    	     			if($("#dc_charting_flag").val() == "Copy"){
    	     				$(".pd_back").trigger('click');
    	     			}else{
    	     				$("#back_to_charting_build").trigger('click');	
    	     			}
    	     			$("#save_new_charting_template ,#save_publish_new_charting_template").removeAttr("disabled");
    	     			saveAuditRecord("Charting","Update","New Charting Update Successfully.");
    	     		}
	          },
	          error: function(data, error, reason) {
							newAlert('danger', reason);
	     				$('html, body').animate({scrollTop: 0}, 'slow');
	     				$("#save_new_charting_template ,#save_publish_new_charting_template").removeAttr("disabled");
	     				saveAuditRecord("Charting","Update","Error while Updating Charting");
	     				return false;
	          }
	        });
	      },
	      error: function(data, error, reason) {
	        newAlert('danger', reason);
	     		$('html, body').animate({scrollTop: 0}, 'slow');
	     		$("#save_new_charting_template ,#save_publish_new_charting_template").removeAttr("disabled");
	     		saveAuditRecord("Charting","Update","Error while Updating Charting");
	     		return false;
	      }
	    });
	  }else{
	    $.couch.db(db).saveDoc(charting_template_doc, {
	     	success: function(data) {
	     		if(saveid == "save_publish_new_charting_template"){
	     			$.couch.db(db).saveDoc(community_charting_template_doc, {
	     				success:function(udata){
				     		newAlert('success', 'Charting Template added successfully!');
				     		$('html, body').animate({scrollTop: 0}, 'slow');
			  				if($("#dc_charting_flag").val() == "Copy"){
			  					$(".pd_back").trigger('click');
			  				}else{
			  					$("#back_to_charting_build").trigger('click');	
			  				}
				     		$("#save_new_charting_template ,#save_publish_new_charting_template").removeAttr("disabled");
				     		saveAuditRecord("Charting","Insert","New Charting Template Build Successfully.");
	     				},
			      	error: function(data, error, reason) {
			        	newAlert('danger', reason);
		        		$('html, body').animate({scrollTop: 0}, 'slow');
		        		$("#save_new_charting_template ,#save_publish_new_charting_template").removeAttr("disabled");1
		        		saveAuditRecord("Charting","Insert","Error while New Charting");
		        		return false;
			      	}
	     			});
	     		}else{
	     			newAlert('success', 'Charting Template added successfully!');
		     		$('html, body').animate({scrollTop: 0}, 'slow');
	  				if($("#dc_charting_flag").val() == "Copy"){
	  					$(".pd_back").trigger('click');
	  				}else{
	  					$("#back_to_charting_build").trigger('click');	
	  				}
		     		$("#save_new_charting_template ,#save_publish_new_charting_template").removeAttr("disabled");
	     			saveAuditRecord("Charting","Insert","New Charting Template Build Successfully.");
	     		}
	    	},
      	error: function(data, error, reason) {
        	newAlert('danger', reason);
      		$('html, body').animate({scrollTop: 0}, 'slow');
      		$("#save_new_charting_template ,#save_publish_new_charting_template").removeAttr("disabled");
      		saveAuditRecord("Charting","Insert","Error while New Charting");
      		return false;
      	}
	    });
	  }
	}else{
		$("#save_new_charting_template ,#save_publish_new_charting_template").removeAttr("disabled");
	}
}

function publishChartingTemplate(id){
	$.couch.db(db).openDoc(id,{
		success:function(data){
			var newdata = {
				doctor_id:          data.doctor_id,
				dhp_code:           data.dhp_code,
				practice_code:      data.random_code,
				doctor_name:        data.first_name+" "+data.first_name,
				template_name:      data.template_name,
				doctype:            "charting_template",
				update_ts:          data.update_ts,
				publish:            "Yes",
				specialization:     data.specialization,
				sections:           data.sections,
				vital_signs_active: data.vital_signs_active
			}
			$.couch.db(db).view("tamsa/getCommunityChartingTemplates", {
			  success: function(udata) {
			    if(udata.rows.length > 0 ){
		        newAlert('danger', 'Charting Template with given name is already exist in Community.');
		        $('html, body').animate({scrollTop: 0}, 'slow');
		        return false;
			    }else {
						$.couch.db(db).saveDoc(newdata,{
							success:function(data){
				   			newAlert('success', 'Charting Template Publish to Community successfully.');
				     		$('html, body').animate({scrollTop: 0}, 'slow');
				     		return false;
							},
							error:function(data,error,reason){
						  	newAlert('danger', reason);
								$('html, body').animate({scrollTop: 0}, 'slow');
								return false;
							}
						});	    	
			    }
			  },
			  error: function(data,error,reason) {
			    $("#save_new_charting_template, #save_publish_new_charting_template").removeAttr("disabled");
			    newAlert('danger', 'Charting Template already exist.');
			    $('html, body').animate({scrollTop: 0}, 'slow');
			    return;  
			  },
			   key:[data.template_name,data.specialization],
			   include_docs:true
			});	
		},
		error:function(data,error,reason){
	  	newAlert('danger', reason);
			$('html, body').animate({scrollTop: 0}, 'slow');
			return false;
		}
	});
}

function chooseChartingTemplate(){
	$(".tab-pane").removeClass("active");
	$("#choose_charting_template_list").addClass("active");
	$("#ctemplate_my_practise_tab").addClass('active');
	$("#home").addClass("active");
	$("#personal_details_in").addClass("active");
	$("#lab_results_inner").addClass("active");
	$("#ctemplate_my_practise_link").parent().find("div").addClass('ChoiceTextActive');
	$("#ctemplate_community_link").removeClass('ChoiceTextActive');
	$("#save_charting_template_tab").hide();
	$("#update_charting_template_tab").hide();
	$("#search_charting_template_tab").show();
	$("#back_to_choose_charting_template").show();
	$("#dc_charting_flag").val("Source");
	viewLabImagingOrders('charting');
}

function chartingTemplateListFromSpecialzation(id,publish,specialization){
	if(id == 'all_practise_charting_templates') {
		var keyval = [pd_data.dhp_code,publish,specialization];
		var view   = "getTemplatesFromSpecialization";
	}else if(id == "all_community_charting_templates") {
		var keyval = [publish,specialization];
		var view   = "getCommunityTemplatesFromSpecialization";
	}else {
		var keyval = [publish,specialization];
		var view   = "getCommunityTemplatesFromSpecialization";
	}
  $.couch.db(db).view("tamsa/"+view, {
    success: function(data) {
    	if (data.rows.length > 0) {
	      	if(id == 'all_community_charting_templates'){	
	      		paginationConfiguration(data,"community_charting_pagination",10,getSearchedTemplate,id);
	      	}else if(id == 'doctor_community_charting_templates_list'){
	      		paginationConfiguration(data,"DC_template_pagination",10,getSearchedTemplate,id);
	      	}
	      	else{
	      		paginationConfiguration(data,"my_practise_charting_pagination",10,getSearchedTemplate,id);
	      	}
			}
		else{
				var all_charting_template_data = [];
				all_charting_template_data.push('<tr><td>No Charting Template Found</td></tr>')
				var id_val = id+" tbody";
				$("#"+id_val).html(all_charting_template_data.join(''));
		    if($('#my_practise_charting_pagination')){
					$('#my_practise_charting_pagination').css('display','none');
				}
      }
    },
    error: function(status) {
      console.log(status);
    },
    key:    keyval,
    reduce: false,
    group:  false,
  }); 
}

function chooseChartingTemplateList() {
  $.couch.db(db).view("tamsa/getChartingTemplates", {
    success: function(data) {
    	if(data.rows.length > 0){
    		paginationConfiguration(data,"my_practise_charting_pagination",15,displayPractiseChartingTemplateList);
    	}else{
    		var all_charting_template_data=[];
    		all_charting_template_data.push('<tr><td>No Charting Template Found</td></tr>');
    		$("#all_practise_charting_templates tbody").html(all_charting_template_data.join(''));
    	}
    },
    error: function(status) {
      console.log(status);
    },
    startkey:     [pd_data.dhp_code,"No"],
    endkey:       [pd_data.dhp_code,"No",{}],
    include_docs: true
  }); 
}

function displayPractiseChartingTemplateList(start,end,data){
	var all_charting_template_data=[];
  for (var i=start; i<end; i++) {
		all_charting_template_data.push('<tr><td class="list-group-item col-md-6 charting_template_results text-align hovercolor pointer" doc_id="'+data.rows[i].id+'">'+data.rows[i].doc.template_name+'</td><td class="list-group-item col-md-6 text-align">'+data.rows[i].doc.specialization+'</td></tr>');
  }
  $("#all_practise_charting_templates tbody").html(all_charting_template_data.join(''));
}

function chooseCommunityChartingTemplateList(id){
	$("#search_community_specialization").val("Select Specialization");
  $.couch.db(db).view("tamsa/getCommunityChartingTemplates", {
    success: function(data) {
    	if (data.rows.length > 0) {
    		paginationConfiguration(data,"community_charting_pagination",15,displayCommunityChartingTemplateList);
    	}
	    else {
	    	var all_charting_template_data = [];
	      all_charting_template_data.push('<tr><td colspan="2">No Charting Template Found.</td></tr>');
	      $("#all_community_charting_templates tbody").html(all_charting_template_data);
	      $('#community_charting_pagination').css('display','none');
	    }
    },
    error: function(status) {
      console.log(status);
    },
    include_docs: true
  }); 
}

function displayCommunityChartingTemplateList(start,end,data){
	var all_charting_template_data = [];
	for (var i=start; i<end; i++) {
    all_charting_template_data.push('<tr><td class="list-group-item col-md-6 charting_template_results text-align pointer hovercolor" doc_id="'+data.rows[i].id+'">'+data.rows[i].doc.template_name+'</td><td class="list-group-item col-md-6 text-align">'+data.rows[i].doc.specialization+'</td></tr>');
  }
  $("#all_community_charting_templates tbody").html(all_charting_template_data);
}

function getSearchedTemplate(start,end,data,id){
	var all_charting_template_data = [];
	for (var i = start; i < end; i++) {
		if(data.rows[i].value.template_name){		
  		all_charting_template_data.push('<tr><td class="hoverme pointer charting_template_results text-align" doc_id="'+data.rows[i].id+'">'+data.rows[i].value.template_name+'</td><td class="text-align">'+data.rows[i].value.specialization+'</td></tr>');
		}
  }
	$("#"+id+" tbody").html(all_charting_template_data.join(''));
}

function generateChartingTemplateResponse(responseArray,data,priordata,sname,fname){
	var retstring = "";
	if(responseArray.response == "Text"){
		retstring = '<div  restype = "Text" class="ctemplate-display-response-value"><span style="float: right;margin-top:10px;" class="label label-default pointer txt-recent-value" resname = "Text" sname="'+sname+'" fname="'+fname+'">Show Recent Value</span><input type="text" placeholder = "Enter text here" class="form-control tp-fixed-wdth"></div>';
		return retstring;
	}else if(responseArray.response == "paragraph"){
		retstring = '<div restype="paragraph" class="ctemplate-display-response-value"><span style="float: right;margin-top:10px;" class="label label-default pointer txt-recent-value" resname = "paragraph" sname="'+sname+'" fname="'+fname+'">Show Recent Value</span><textarea class="form-control tp-fixed-wdth" placeholder="Enter text here"></textarea></div>';
		return retstring;
	}else if(responseArray.response == "checkbox"){
		retstring = '<div restype="checkbox" class="ctemplate-display-response-value">';
		for(var fi=0; fi<responseArray.format.length > 0; fi++){
			retstring += '<input type="checkbox" frmtval = "'+responseArray.format[fi]+'" class="checkshow ctemplate-display-chkbox"> &nbsp;'+responseArray.format[fi]+'&nbsp;';	
		}
		retstring += '</div>';
		return retstring;
	}else if(responseArray.response == "multiple"){
		retstring = '<div restype="multiple" class="ctemplate-display-response-value"><div class="overflow-override"><table class="table tbl-border tp-fixed-wdth charting-multiple-area-parent"><tbody>';

			var charting_count  = getPcode(3,"numeric");
			for(var fi=0; fi<responseArray.format.length;fi++){
				if(fi%3 == 0) retstring += '<tr>'
				retstring += '<td class=""><input type="radio" name="single-select'+charting_count+'" myval="'+responseArray.format[fi]+'">&nbsp;&nbsp;<span>'+responseArray.format[fi]+'</span></td>';
		    if(fi%3 == 2 || fi+1 == responseArray.format.length) retstring +='</tr>'
		  }  
	  retstring += '</tbody></table></div><span style="float: right;" class="label label-default pointer txt-recent-value" resname = "multiple" sname="'+sname+'" fname="'+fname+'">Show Recent Value</span></div>';
		return retstring;
	}else if(responseArray.response == "combobox"){
		retstring = '<div restype="combobox" class="ctemplate-display-response-value"><div class="overflow-override"><table class="table tbl-border tp-fixed-wdth charting-multiple-area-parent"><tbody>';
			for(var fi=0; fi<responseArray.format.length; fi++){
				if(fi%3 == 0) retstring += '<tr>'
				retstring += '<td><input type="checkbox" class="checkshow multiple-value" value="'+responseArray.format[fi]+'">&nbsp;&nbsp;<span>'+responseArray.format[fi]+'</span></td>';
		    if(fi%3 == 2 || fi+1 == responseArray.format.length) retstring +='</tr>'
		  }  
	  retstring += '</tbody></table></div><span style="float: right;" class="label label-default pointer txt-recent-value" resname = "combobox" sname="'+sname+'" fname="'+fname+'">Show Recent Value</span></div>';
		return retstring;
	}else if(responseArray.response == "date"){
		retstring = '<div  restype="date" class="ctemplate-display-response-value"><input type="text" placeholder = "DD/MM/YYYY" class="form-control datetime"></div>';
		return retstring;
	}else if(responseArray.response == "scale"){
 		retstring  = '<div restype = "scale" class="ctemplate-display-response-value"><table class="table tbl-border"><tbody><tr>';
 		var count  = getPcode(3,"numeric");
 		var min    = responseArray.format[0].min;
 		var max    = responseArray.format[0].max;
 		for(var fi = min; fi<max; fi++){
 			retstring += '<td class=" text-align"><span>'+fi+'</span><br><input type="radio" value = "'+fi+'" name = "scale'+count+'" class="form-control scale-radio"></td>';
 		}
 		retstring +='</tr></tbody></table></div>';
 		return retstring;
	}else if(responseArray.response == "table"){
		retstring = '<div restype="table" class="ctemplate-display-response-value table-scroll" tclen="'+responseArray.format[0].table_columns.length+'" trlen="'+responseArray.format[0].table_rows.length+'"  ><span style="float: right;margin-top:10px;" class="label label-default pointer txt-recent-value" resname = "table" sname="'+sname+'" fname="'+fname+'">Show Recent Value</span>';
		retstring += '<table class = "form-table-response table tbl-border">';
		if(responseArray.format[0].table_columns.length > 0){
			retstring += '<thead>';
			if(responseArray.format[0].table_rows.length > 0){
				retstring += '<th></th>';
			}
			for(var th=0; th<responseArray.format[0].table_columns.length; th++){
				retstring += '<th class = "tbl-head">'+responseArray.format[0].table_columns[th]+'</th>';	
			}	
			if(responseArray.format[0].table_columns.length > 0 && responseArray.format[0].table_rows.length == 0){
				retstring += '<th></th>';	
			}
			retstring += '</thead>';
		}
		retstring += '<tbody>';

		if(responseArray.format[0].table_rows.length > 0){
			for(var rh=0;rh<responseArray.format[0].table_rows.length;rh++){
				retstring += '<tr class = "trows-count" count = "0"><td class="tbl-rows">'+responseArray.format[0].table_rows[rh]+'</td>';
				if(responseArray.format[0].table_columns.length > 0){
					//table with row and column header
					for(var tc=0; tc<responseArray.format[0].table_columns.length; tc++){
						retstring += '<td class="tbl-data0"><input class="table-rows-input" type="text"></td>';
					}
				}else{
					retstring += '<td class="tbl-data0"><input class="table-rows-input" type="text"></td>';
				}
				if(responseArray.format[0].table_columns.length > 0 && responseArray.format[0].table_rows.length == 0){
					retstring += '<td><span count="0" class="label label-warning pointer remove-form-table-row">Delete</span></td>';
				}
				retstring += '</tr>';
			}
		}else{

		}
		retstring +='</tbody></table>';
		if(responseArray.format[0].table_rows.length == 0){
			retstring +='<div><span count="0" class="label label-warning pointer add-rows-table-form">Add Rows</span></div>';
		}
		retstring += '</div><br><br>';
		return retstring;
	}else if(responseArray.response == "image"){
		retstring = '<div  restype="image" class="ctemplate-display-response-value row"><form role="form" enctype="multipart/form-data" method="post" action="">';
		retstring += '<input type="file" placeholder="Enter text here" class="form-control form-image" name="_attachments" style="display:none;">';

		retstring += '<div class="row"><div class="col-lg-6"><select class="form-control canvas_images"></select></div><div class="col-lg-6"></div></div>';
		retstring += '<input type="hidden" name="_id" value=""><input type="hidden" name="_rev" value=""><input type="hidden" name="imagenote" class="imagenote" value=""><input type="hidden" name="image_postion_top" class="image_postion_top" value=""><input class="image_postion_left" type="hidden" name="image_postion_left" value=""></form></div>';
		return retstring;
	}else if(responseArray.response == "grid"){
		retstring = '<div restype = "grid" class="ctemplate-display-response-value table-scroll" gridlen="'+responseArray.format[0].grid_columns.length+'" trlen="'+responseArray.format[0].grid_rows.length+'"><table class = "form-table-response table tbl-border"><thead><th></th>';

		for(var th=0; th<responseArray.format[0].grid_columns.length; th++){
			retstring += '<th class="grid-head">'+responseArray.format[0].grid_columns[th]+'</th>';	
		}	

		retstring += '<th>Notes</th></thead><tbody>';

		for(var rh=0;rh<responseArray.format[0].grid_rows.length;rh++){
			retstring += '<tr class = "grid-rows-count" count = "0"><td class="grid-rows">'+responseArray.format[0].grid_rows[rh]+'</td>';
			var grpcount = getPcode(3,"numeric");
				for(var tc=0; tc<responseArray.format[0].grid_columns.length; tc++){
					retstring += '<td class="grid-data"><input class="grid-rows-input" type="radio" name="grpradio'+grpcount+'"></td>';
				}
			retstring += '<td class="grid-data"><input class="grid-rows-value" type="text"></td></tr>';
		}
		retstring +='</tbody></table></div><br><br>';
		return retstring;
	}else if(responseArray.response == "soapnote"){
		retstring = generateSoapNote(data);
		return retstring;					
	}else if(responseArray.response == "biometrics"){
		var tdata = '<div restype="biometrics" class="ctemplate-display-response-value">';

		for(var i=0;i<responseArray.format.length;i++){
			tdata += '<div class="col-lg-2 mrg-top5 theme-color biometrics-label">'+responseArray.format[i]+'</div>';
			tdata += '<div class="col-lg-10 mrg-top5">';
	  	tdata += '<textarea class= "ctemplate-biometric-textbox" bio-name="'+responseArray.format[i]+'">'+getBiometricsAndMedicationHistory(responseArray.format[i])+'</textarea>';
			tdata += '</div>';
		}
		tdata +='</div>';
		return tdata;
	}else{
		retstring = "no response found"; 
		return retstring;
	}
}

function getBiometricsAndMedicationHistory(response){
	if(response == "procedure") return userinfo_medical.Procedure
	else if(response == "medication") return userinfo_medical.Medication
	else if(response == "Allergies") return userinfo_medical.Allergies
	else if(response == "condition") return userinfo_medical.Condition
}

function chartingTemplateImagePreview(obj){
  if($(obj).disabled) return alert('File upload not supported!');
  returnImageURI(F[0],$(obj));
}

function generateDraggable($obj){
	$dragEl = $obj.parent().parent().find(".dragnote");
	$dropEl = $obj.parent().parent().parent().parent().find(".ct-image-preview-parent");
	
	$dragEl.draggable({
		revert:"invalid",
		tolerance:"fit",
		containment: $dropEl
	});

	$dropEl.droppable({
		drop:function(event,ui){
			console.log("left:" + (ui.offset.left - $dropEl.offset().left));
			console.log("top:" + (ui.offset.top - $dropEl.offset().top));
			$(".dragtext").val("");
			if(!($(ui.draggable).hasClass('copiedImgNotes'))){
				var droppedItem = $(ui.draggable).clone().addClass('copiedImgNotes');
				droppedItem.css({
					"position":"absolute",
					"top":ui.offset.top - $dropEl.offset().top,
					"left":ui.offset.left - $dropEl.offset().left
				});
				droppedItem.data({
					dragval:droppedItem.find(".dragval").html(),
					dragtop:ui.offset.top - $dropEl.offset().top,
					dragleft:ui.offset.left - $dropEl.offset().left
				});
	      droppedItem.draggable({
	        containment: $dropEl
	      });
	      console.log(droppedItem.data());
	      $dropEl.find(".ct-image-preview").append(droppedItem);
	      $(ui.draggable).remove();
			}
		}
	})
}

function toggleSoapNoteinCharting($obj){
	if($obj.prev().html() == "Subjective"){
		if($obj.hasClass("glyphicon-plus")){
			$(".cmn-subjective-toggle").show("slow");
			$obj.removeClass("glyphicon-plus").addClass("glyphicon-minus");
		}else{
			$(".cmn-subjective-toggle").hide("slow");
			$obj.removeClass("glyphicon-minus").addClass("glyphicon-plus");
		}
	}else if($obj.prev().html() == "Objective"){
		if($obj.hasClass("glyphicon-plus")){
			$(".cmn-objective-toggle").show("slow");
			$obj.removeClass("glyphicon-plus").addClass("glyphicon-minus");
		}else{
			$(".cmn-objective-toggle").hide("slow");
			$obj.removeClass("glyphicon-minus").addClass("glyphicon-plus");
		}
	}else if($obj.prev().html() == "Assessment"){
		if($obj.hasClass("glyphicon-plus")){
			$(".cmn-assessment-toggle").show("slow");
			$obj.removeClass("glyphicon-plus").addClass("glyphicon-minus");
		}else{
			$(".cmn-assessment-toggle").hide("slow");
			$obj.removeClass("glyphicon-minus").addClass("glyphicon-plus");
		}
	}else{
		if($obj.hasClass("glyphicon-plus")){
			$(".cmn-plan-toggle").show("slow");
			$obj.removeClass("glyphicon-plus").addClass("glyphicon-minus");
		}else{
			$(".cmn-plan-toggle").hide("slow");
			$obj.removeClass("glyphicon-minus").addClass("glyphicon-plus");
		}
	}
}

function generateSoapNote(data,partialdata){
	console.log(data);
	var tempstring = '';
	tempstring += '<div restype="soapnote" class="ctemplate-display-response-value">';

		tempstring += '<div class="col-lg-12 charting-template-subjective-response">';
			tempstring += '<div class="row">';
					tempstring += '<div class="tab-heading-section"><span>Subjective</span><span class="rght-float glyphicon glyphicon-plus cmn-soapnote-toggle-link"></span></div>';
				tempstring += '<div class="col-lg-7 cmn-subjective-toggle">';
					tempstring += '<div class="complaints">';
						tempstring += '<h5 class = "theme-color">add Subjective :</h5>';
						tempstring += '<input type="text" value="" placeholder="Write Something and Hit enter or Drag n Drop" class="form-control add-charting-soap-value">';
						tempstring += '<ul class="charting-target cmn-charting-complaint charting-target-complaint ui-sortable">';
							if(partialdata){
								for(var sub=0;sub < partialdata.values[0].subjective.length	;sub++) {
									if(partialdata.values[0].subjective[sub] && partialdata.values[0].subjective[sub] != ""){
										tempstring += '<li>'+partialdata.values[0].subjective[sub]+'</li>';
									}
								}	
							}
						tempstring +='</ul>';
					tempstring += '</div>';
				tempstring += '</div>';

				tempstring += '<div class="col-lg-5 cmn-subjective-toggle">';
					tempstring += '<div class="row">';
						tempstring += '<div class="col-lg-12">';
							tempstring += '<div class="right">';
								tempstring += '<h5 class = "theme-color">Subjectives List:</h5>';
								tempstring += '<ul class="charting-source cmn-charting-complaint charting-source-complaint"></ul>';
							tempstring += '</div>';
						tempstring += '</div>';
					tempstring += '</div>';
				tempstring += '</div>';
			tempstring += '</div>';
	    tempstring += '</div>';

	   	tempstring += '<div class="col-lg-12 charting-template-objective-response">';
        tempstring += '<div class="row"><div class="tab-heading-section"><span>Objective</span><span class="rght-float glyphicon glyphicon-plus cmn-soapnote-toggle-link"></span></div></div>';
        tempstring += '<div class="col-lg-12 cmn-objective-toggle"><span>Patient&nbsp;</span><select class="is_patient_historian">';
        if(partialdata) {
        	switch(partialdata.values[0].objective[0].patient_historian) {
        		case "is" :
        			tempstring += '<option selected="selected">is</option><option>is not</option><option>is somewhat</option>';	
        			break; 
        		case "is not" :
        			tempstring += '<option>is</option><option selected="selected">is not</option><option>is somewhat</option>';
        			break;
        		case "is somewhat" :
	        		tempstring += '<option>is</option><option>is not</option><option selected="selected">is somewhat</option>';
	        		break;
        	}
        }else {
        	tempstring += '<option>is</option><option>is not</option><option>is somewhat</option>';
        }
 
        tempstring += '</select> a reliable historian.</div>';
        for(var i=0; i<data.soapnote.fields.length; i++){
        	tempstring += '<div class = "objective-fields-parent cmn-objective-toggle"><div class="obj-btn-parent"><span style = "width: 200px;" class = "objective-field-name">'+data.soapnote.fields[i].field_name+'</span><span>&nbsp;::</span><span class="label label-warning normal-btn-soapnote pointer">Normal</span><span  class="label label-default prior-btn-soapnote pointer">Prior</span></div><div class="choicelist">';
        	for(var j=0; j<data.soapnote.fields[i].choices.length; j++){
        		tempstring += '<input type="checkbox" class="checkshow" ';
        		if(partialdata) {
        			if($.inArray(data.soapnote.fields[i].choices[j],partialdata.values[0].objective[0].fields[i].choices) >= 0) {
        				tempstring += 'checked="checked" ';
        			}	
        		}
        		tempstring += 'value="'+data.soapnote.fields[i].choices[j]+'"> &nbsp;&nbsp;&nbsp;<span>'+data.soapnote.fields[i].choices[j]+'</span><br>';
        	}
        	tempstring += '</div>';
        	
      		tempstring += '<div class="col-lg-12 obj-field-detail-list">';
      			tempstring += '<div class="row">';
      				tempstring += '<div class="col-lg-7">';
      					tempstring += '<div class="complaints">';
      						tempstring += '<h5>Details :</h5>';
      						tempstring += '<input type="text" value="" placeholder="Write Something and Hit enter or Drag n Drop" class="form-control add-charting-soap-value">';
      						tempstring += '<ul count="'+i+'" class="charting-target cmn-charting-objective'+i+' 	charting-target-objective-details">';
  									if(partialdata){
											if(partialdata.values[0].objective[0].fields[i].details_list.length > 0){
												for(var obj=0; obj<partialdata.values[0].objective[0].fields[i].details_list.length; obj++) {
													if(partialdata.values[0].objective[0].fields[i].details_list[obj] != "") {
														tempstring += '<li>'+partialdata.values[0].objective[0].fields[i].details_list[obj]+'</li>';
													}
												}
  										}	
  									}
      						tempstring += '</ul>';
      					tempstring += '</div>';
      				tempstring += '</div>';
      				tempstring += '<div class="col-lg-5">';
      					tempstring += '<div class="row">';
      						tempstring += '<div class="col-lg-12">';
      							tempstring += '<div class="right">';
      								tempstring += '<h5>Details :</h5>';
      								tempstring += '<ul count="'+i+'" field_name="'+data.soapnote.fields[i].field_name+'" class="charting-source cmn-charting-objective'+i+' charting-source-objective-details"></ul>';
      							tempstring += '</div>';
      						tempstring += '</div>';
      					tempstring += '</div>';
      				tempstring += '</div>';
      			tempstring += '</div>';
      		tempstring += '</div></div>';
        }
	    tempstring += '</div>';

	    tempstring += '<div class="col-lg-12 charting-template-assessment-response">';
        tempstring += '<div class="row">';
        	tempstring += '<div class="tab-heading-section"><span>Assessment</span><span class="rght-float glyphicon glyphicon-plus cmn-soapnote-toggle-link"></span></div>';
        	tempstring += '<div class="col-lg-7 cmn-assessment-toggle">';
          	tempstring += '<div class="complaints">';
          		tempstring += '<h5 class = "theme-color">add Assessment :</h5>';
          		tempstring += '<input type="text" placeholder="Write Something and Hit enter or Drag n Drop" class="form-control add-charting-soap-value">';
          		tempstring += '<ul class="charting-target cmn-charting-diagnosis charting-target-diagnosis">';
          		if(partialdata){
          			for(var ass=0; ass<partialdata.values[0].assessment.length; ass++) {
          				if(partialdata.values[0].assessment[ass] && partialdata.values[0].assessment[ass] != "") {
	          				tempstring += '<li>'+partialdata.values[0].assessment[ass]+'</li>';
          				}
          			}	
          		}
          		tempstring += '</ul>';
          	tempstring += '</div>';
        	tempstring += '</div>';

        	tempstring += '<div class="col-lg-5 cmn-assessment-toggle">';
          	tempstring += '<div class="row">';
            		tempstring += '<div class="col-lg-12">';
              		tempstring += '<div class="right">';
                			tempstring += '<h5 class = "theme-color">Assessments List:</h5>';
                			tempstring += '<ul class="charting-source cmn-charting-diagnosis charting-source-diagnosis"></ul>';
              		tempstring += '</div>';
            		tempstring += '</div>';
          	tempstring += '</div>';
        	tempstring += '</div>';
        tempstring += '</div>';
	    tempstring += '</div>';

		tempstring += '<div class="textareatmain">';
			tempstring += '<div class="row"><div class="tab-heading-section"><span>Plan</span><span class="rght-float glyphicon glyphicon-plus cmn-soapnote-toggle-link"></span></div></div>';
      tempstring += '<textarea class="form-control parsley-validated mrg5 cmn-plan-toggle charting_template_plan" name="plan" type="text">'+(partialdata ? partialdata.values[0].plan : "")+'</textarea>';
	  tempstring += '</div>';
	tempstring += '</div>';
	return tempstring;
}

function enableSoapNoteDragDrop(){
	$(".charting-target-complaint,.charting-source-complaint").sortable({
	  connectWith:".cmn-charting-complaint"
	});

	$(".charting-target-objective-details, .charting-source-objective-details").sortable();
	$(".charting-target-objective-details").each(function(){
		var connector = ".cmn-charting-objective"+$(this).attr("count");
		$(this).sortable("option","connectWith", connector);
	});
	$(".charting-source-objective-details").each(function(){
		var connector = ".cmn-charting-objective"+$(this).attr("count");
		$(this).sortable("option","connectWith", connector);
	});

	$(".charting-source-diagnosis, .charting-target-diagnosis").sortable({
		connectWith:".cmn-charting-diagnosis"
	});

	$(".charting-source-plan,.charting-target-plan").sortable({
		connectWith:".cmn-charting-plan"
	});
}

function getChartingTemplateObjectiveDetails(){
}

function getChartingTemplatePlans(){
}

function addRowsInTableForm(count,$obj){
	var retstring = "";
	var tlength = $obj.parent().parent().find(".form-table-response th").length - 1;
	retstring +='<tr class = "trows-count" count = "'+count+'">';
	for(var i=0; i<tlength; i++){
		retstring += '<td class = "tbl-data'+count+'"><input  class = "table-rows-input" type = "text"></td>';
	}
	retstring += '<td><span count="'+count+'" class="label label-warning pointer remove-form-table-row">Delete</span></td></tr>';
	$obj.parent().parent().find(".form-table-response tbody").append(retstring);
}

function screeningVaccinationAlertMessage(reminder){
	$("#"+reminder).html("");
	var output = [];
	output.push('<h2 style="background: rgb(184, 208, 165) none repeat scroll 0% 0%; color: rgb(51, 51, 51); font-weight: bold; font-size: 15px; padding: 10px; margin-top: 0px; margin-bottom: 0px; border-radius: 4px;" class="row"> <div class="alert_name_parent" style="margin-top: 0px;"><span class="alert_name">Immunization Alerts</span><span style="margin-left:6px;top:3px;" class="glyphicon glyphicon-plus-sign alert_list pull-right"></span></div></h2><div class="row" id="immmunization_alerts" style="display:none;"></div><h2 style="background: rgb(184, 208, 165) none repeat scroll 0% 0%; color: rgb(51, 51, 51); font-weight: bold; font-size: 15px; padding: 10px; margin-top: 10px; margin-bottom: 0px; border-radius: 4px;" class="row"> <div class="alert_name_parent" style="margin-top: 0px;"><span class="alert_name">Screening Alerts</span><span style="margin-left:6px;top:3px;" class="glyphicon glyphicon-plus-sign alert_list pull-right"></span></div></h2><div class="row" style="display:none;" id="screening_alerts"></div>');
	$("#"+reminder).append(output);
	/*vaccination alerts code starts*/
	if(moment(userinfo.date_of_birth)) {
		var user_dob = userinfo.date_of_birth;
		var user_age = "";
	}else {
		var user_age = userinfo.age;
		var user_dob = "";
	}
	$.couch.db(db).list("tamsa/getImmunizationListByAge", "getImmunizationCustomDose", {
	key:pd_data.dhp_code,
	include_docs:true,
  user_dob: user_dob,
  user_age: user_age,
  user_id:  userinfo.user_id
	}).success(function(data){
	  if(data.rows.length > 0){
			$.couch.db(db).view("tamsa/getPatientImmunizations",{
				success:function(idata) {
					if(idata.rows.length > 0) {
						for(var i=0;i<data.rows.length;i++) {
							var exist;
							for(var j=0;j<idata.rows.length;j++){
								if(idata.rows[j].value.status == "Taken" && data.rows[i].vaccine_name == idata.rows[j].value.immunization_name && data.rows[i].dose_details.dose_name == idata.rows[j].value.dose_name) {
									exist = true;
									break;
								}else {
									exist = false;
								}
							}
							if(!exist) {
								if(data.rows[i].dose_details) {
									vaccinationAlertMessage(data.rows[i].vaccine_name, data.rows[i].dose_details.dose_name, data.rows[i].dose_details.dose_no, "immmunization_alerts", "doc_msg_danger");
								}else if(data.rows[i].upcoming_details){
									vaccinationUpcomingAlertMessage(data.rows[i].vaccine_name, data.rows[i].upcoming_details, "immmunization_alerts", "doc_msg");
								}
							}
						}
					}else {
						for(var i=0;i<data.rows.length;i++){
							if(data.rows[i].dose_details) {
								vaccinationAlertMessage(data.rows[i].vaccine_name, data.rows[i].dose_details.dose_name, data.rows[i].dose_details.dose_no, "immmunization_alerts", "doc_msg_danger");
							}else if(data.rows[i].upcoming_details){
								vaccinationUpcomingAlertMessage(data.rows[i].vaccine_name, data.rows[i].upcoming_details, "immmunization_alerts", "doc_msg");
							}
						}
					}
					getScreeningAlerts("screening_alerts",true);
				},
				error:function(data,error,reason){
					newAlert("danger",reason);
					$("html, body").animate({scrollTop: 0}, 'slow');
					return false;
				},
				startkey:[userinfo.user_id],
				endkey:[userinfo.user_id,{},{}],
		 		include_docs:true
			});
	  }else{
	  	/*screening alerts code starts*/
	  	getScreeningAlerts("screening_alerts",false);
	  	/*screening alerts code ends*/
	  }
	}).error(function(reason){
		newAlert("danger",reason);
		$("html, body").animate({scrollTop: 0}, 'slow');
	});
	//number of days from date of birth
	/*vaccination alerts code ends*/
}

function getScreeningAlerts(reminder,immunization_flag) {
	var days = moment().diff(moment(userinfo.date_of_birth),"days");
	if (days < 6570) var tstart = 1
	else var tstart = 6570
	
	if(days >= 6570){
		if(userinfo.date_of_birth) var age = getAgeFromDOB(userinfo.date_of_birth)
		else console.log("date of birth not Found.");

		$.couch.db(db).list("tamsa/getHealthMaintenanceNotificationsList", "getHealthMaintenanceAlertsForChartingTemplates", {
		user_age:age,
	  user_gender:userinfo.gender,
	  user_id:userinfo.user_id
		}).success(function(data){
		  if(data.rows.length > 0){
		    for(var i=0;i<data.rows.length;i++){
		    	if(data.rows[i].past_screenings.length > 0){
		    		if(data.rows[i].past_screenings[0].alert_status.trim() == "Taken") {
		    			 	checkPastScreeningAlerts(data.rows[i],age,reminder);
		    		}else {
		    			screeningAlertMessage(data.rows[i].alert_name,reminder);
		    		}
		    	}else{
		    		screeningAlertMessage(data.rows[i].alert_name,reminder);
		    	}
		    }
		  }else{
		  	if(!immunization_flag) $("#"+reminder).html("No Risk Alerts are Found.");
		  }
		}).error(function(reason){
			newAlert("danger",reason);
			$("html, body").animate({scrollTop: 0}, 'slow');
			return false;
		});
	}else {
		if(!immunization_flag) $("#"+reminder).html("No Risk Alerts are Found.");
	}
}

function checkPastScreeningAlerts(screendata,age,reminder) {
	if(screendata.interval) {
		var last_screen_date = moment(screendata.past_screenings[0].alert_date);
		var last_date = moment(screendata.past_screenings[0].alert_date).format("DD-MM-YYYY");
		var current_diff     = moment().diff(last_screen_date,screendata.interval_type);
		if(current_diff > screendata.interval) {
			screeningAlertMessage(screendata.alert_name,reminder);
		}else {
			var nextdate = (last_screen_date.add(screendata.interval, screendata.interval_type)).format("DD-MM-YYYY");
			nextScreeningAlertMessage(screendata.alert_name,reminder,last_date,nextdate);
		}
	}else {
		console.log("Screening Rule for "+screendata.alert_name+" not having intervals.");
		screeningAlertMessage(screendata.alert_name,reminder);
	}
}

function nextScreeningAlertMessage(screening_name,reminder,past_date,next_date){
	var output  = '<div class="doc_msg">';
	output += '<p>You have taken your last ';
	output += screening_name;
	output += ' on ';
	output += past_date;
	output += '. Your next screening will be on ';
	output += next_date;
	output += ' .</p></div>';
	$("#"+reminder).append(output);
}

function screeningAlertMessage(screening_name,reminder){
	var output  = '<div class="doc_msg_danger">';
	output += '<p>Your have required to take ';
	output += screening_name;
	output += ' Screening.</p></div>';
	$("#"+reminder).append(output);		
}

function vaccinationAlertMessage(vaccine_name, dose_name, dose_no,reminder,classname){
	var output  = '<div class="'+classname+'">';
	output += '<p>Your have required to take ';	
	output += dose_no + " (" + dose_name + ") of "+  vaccine_name;
	output += ' Vaccination.</p></div>';
	$("#"+reminder).append(output);		
}

function vaccinationUpcomingAlertMessage(vaccine_name, upcoming_dose_details,reminder,classname) {
	var min_age = upcoming_dose_details.min_age_value,
	min_type    = upcoming_dose_details.min_age_type || "Years",
	dob         = userinfo.date_of_birth ? userinfo.date_of_birth : calculateDOBFromAge(userinfo.age),
  nextdate    = moment(dob).add(min_age,min_type).format("DD-MM-YYYY"),
	output = '<div class="'+classname+'">';
	output += '<p>Your upcoming vaccination is ';	
	output += upcoming_dose_details.dose_no + " (" + upcoming_dose_details.dose_name + ") of "+ vaccine_name + " on " + nextdate;
	output += '.</p></div>';
	$("#"+reminder).append(output);
}

function closeChartingMedicationModal(){
	$("#charting_medicalinfo_model").modal("hide");
}

function addNewMedicationFromCharting(){
	$("#add_medication_from_charting_modal").modal({
	  show:true,
	  backdrop:'static',
	  keyboard:false
	});
}

function getChartingMedicalInfoModel($obj){
	$("#charting_medicalinfo_model").modal({
    show:true,
    backdrop:'static',
    keyboard:false
  });
  $("#charting_medical_information").html("");
  var ct_medical_info = [];
  if($obj.attr('infotype') =='Histories'){
  	$('.charting_medicalinfo_title').html('Medical History');
		$.couch.db(db).view("tamsa/getVaccineDetails", {
		  success: function(data) {
  	  	ct_medical_info.push('<div style="height:235px;" class="chart-scroll summary_right_main_box col-lg-4"><h6 class="mrgtop">Procedures</h6>');
  			ct_medical_info.push('<ul class="chart-medic-history">');
  			for(var i=0;i<userinfo_medical.Procedure.length;i++){
  				if(userinfo_medical.Procedure[i].trim()) ct_medical_info.push("<li>"+userinfo_medical.Procedure[i]+"</li>")
  			}
  			ct_medical_info.push('</ul></div>');
  	  	ct_medical_info.push('<div style="height:235px;" class="chart-scroll summary_right_main_box col-lg-4"><h6 class="mrgtop">Diagnosis</h6>');
  			ct_medical_info.push('<ul class="chart-medic-history">');
  			for(var i=0;i<userinfo_medical.Condition.length;i++){
  				if(userinfo_medical.Condition[i]) ct_medical_info.push("<li>"+userinfo_medical.Condition[i]+"</li>")
  			}
  			ct_medical_info.push('</ul></div>');
  			if (data.rows.length > 0) {
    			ct_medical_info.push('<div style="height:235px;" class="chart-scroll summary_right_main_box col-lg-4"><h6 class="mrgtop">Vaccination</h6>');
		    	ct_medical_info.push('<ul class="chart-medic-vaccination">');
		    	for(var i=0;i<data.rows.length;i++){
	    			ct_medical_info.push('<li class=""><label><span style="font-weight:bold;">Due/Alert:</span>'+data.rows[i].doc.Vaccine_Name+'</label></li>');
	    			ct_medical_info.push('<li class=""><label><span style="font-weight:bold;">Last Date Taken:</span>'+data.rows[i].doc.Vaccine_Date+'</label></li>');
	    			ct_medical_info.push('<li class=""><label><span style="font-weight:bold;">Result:</span>'+data.rows[i].doc.Vaccine_Status+'</label></li>');
	    			ct_medical_info.push('<li class=""><label><span style="font-weight:bold;">Next Due Date:</span>'+data.rows[i].doc.Due_Date+'</label></li>');
		    	}
		    	ct_medical_info.push('</ul></div>');
	    	}
		    $("#charting_medical_information").html(ct_medical_info.join(''));
    		$(".chart-scroll").mCustomScrollbar({
	  		  theme:"minimal"
    		});
		  },
		  error:function(data,error,reason){
		  	newAlert("danger",reason);
		  	$("html, body").animate({scrollTop: 0}, 'slow');
		  	return false;
		  },
		  key: userinfo.user_id,
		  descending:true,
		  include_docs:true
		});
  }else if($obj.attr('infotype') == 'Allergies'){
  	$('.charting_medicalinfo_title').html('Allergies Information');
  	if(userinfo_medical.Allergies.length > 0){
  		ct_medical_info.push('<table class="table"><thead><tr><th>Allergies Name</th><th>Severe:</th><th>Reaction:</th></tr></thead><tbody>');
  		for(var i=0;i<userinfo_medical.Allergies.length;i++) {
  			 var element = userinfo_medical.Allergies[i];
        // var arry =element.split(",");
        ct_medical_info.push("<tr><td>"+element.allergies+"</td><td>"+(element.severe ? element.severe : "NA")+"</td><td>"+(element.reaction ? element.reaction : "NA")+"</td></tr>");
  		}
  		ct_medical_info.push('</tbody></table>');
  	}else{
  		ct_medical_info.push("No Allergies are found in Patient Medical information.");
  	}
  	$("#charting_medical_information").html(ct_medical_info.join(''));
  }else if($obj.attr('infotype') == 'Risks'){
		$('.charting_medicalinfo_title').html('Risks Information');
		ct_medical_info.push('<div class="col-lg-12" id="charting_remainder"></div>');
		$("#charting_medical_information").html(ct_medical_info.join(''));
		screeningVaccinationAlertMessage("charting_remainder");
  }else if($obj.attr('infotype') == 'Referral'){
  	$('.charting_medicalinfo_title').html('Referral Information');
		$.couch.db(db).view("tamsa/getPatientRefferals", {
			success: function(data) {
				$("#charting_medical_information").html('');
				var ct_medical_html = [];
    		if(data.rows.length > 0){
    			ct_medical_html.push("<table class='table'><tr><th>Date</th><th>referred By</th><th>referred To</th><th style='width: 20%;'>Introduction</th><th>Chart Notes</th></tr><tbody id='charting_referal' class='charting_referal'></tbody></table> <div class='col-lg-12 pagination-align' style='margin-top: 5px;' id='refferal_pagination'></div>");
    			$("#charting_medical_information").html(ct_medical_html.join(''));		
    			paginationConfiguration(data,"refferal_pagination",5,displayChartingCareplan);
    		}else{
    			$("#charting_medical_information").html("<span color='red'>No Referral found for this Patient.</span>");
    		}
			},
			error:function(data,error,reason){
				newAlert("danger", reason);
				$('body,html').animate({scrollTop: 0}, 'slow');
				return false;
			},
			key:userinfo.user_id,
			include_docs:true
		});
  }else if($obj.attr('infotype') == 'Care Plans'){
  	$('.charting_medicalinfo_title').html('Care Plans Information');
  	$("#charting_medical_information").html('<div class="careplanlist col-md-12"><div class="sidebar-offcanvas" role="navigation"><h3 style="line-height: 18px; font-size: 16px;" class="list-group-item active text-align">Currently Prescribed Care Plans</h3><br><table id="prescribed_patient_care_plans_charting" class="table tbl-border"><thead><tr><th style="border-top-left-radius: 4px;">Care Plan Name</th><th>Doctor Name</th><th>Specialization</th><th>Start Date</th><th style="border-top-right-radius: 4px;">End Date</th></tr></thead><tbody></tbody></table><div class="col-lg-12 pagination-align" style="margin-top: 5px;" id="current_prescribed_care_plan_chart"></div></div><div class="sidebaroffcanvas" role="navigation"><h3 style="margin-top: 61px;line-height: 18px; font-size: 16px;" class="list-group-item active text-align">Care plans From Past</h3><br><table id="past_patient_care_plans_charting" class="table tbl-border"><thead><tr><th style="border-top-left-adius: 4px;">Care Plan Name</th><th>Doctor Name</th><th>Specialization</th><th>Start Date</th><th style="border-top-right-radius: 4px;">End Date</th></tr></thead><tbody></tbody></table></table><div class="col-lg-12 pagination-align" style="margin-top: 5px;" id="past_prescribed_care_plan_chart"></div></div></div>');
  	prescribedPatientCarePlanList("prescribed_patient_care_plans_charting","past_patient_care_plans_charting");
   	// prescribedPatientCarePlanList("past_patient_care_plans_charting","past");
  }else if($obj.attr('infotype') == 'Lab'){
  	$.couch.db(db).view("tamsa/getRecentLabResults", {
	    success:function(data) {
	      $("#charting_medical_information").html('');
				var ct_lab_html = [];
	    	if(data.rows.length > 0){
	    		ct_lab_html.push("<table class='table'><tr><th>Lab Result</th></tr><tbody id='charting_lab'></tbody></table> <div class='col-lg-12 pagination-align' style='margin-top: 5px;' id='lab_pagination'></div>");
	    		$("#charting_medical_information").html(ct_lab_html.join(''));			
	    		paginationConfiguration(data,"lab_pagination",5,displayChartingLab);
	    	}else{
	    		$("#charting_medical_information").html("<span color='red'>No Lab Results found for this Patient.</span>");
	    	}
	    },
	    error: function(status) {
	      console.log(status);
	    },
	    startkey: [userinfo.user_id,{},{}],
	    endkey: [userinfo.user_id],
	    descending:true,
	    include_docs:true
  	});
  	$('.charting_medicalinfo_title').html('Lab Information');
  }
}

function getVitalSignMoreDetails($obj){
	$("#charting_medicalinfo_model").modal({
    show:true,
    backdrop:'static',
    keyboard:false
  });
  $("#charting_medical_information").html("");
  $.couch.db(db).view("tamsa/getAnalyticsRange", {
    success: function(data) {
      if (data.rows.length > 0) {
        var vital_sign_data = [];
        vital_sign_data.push('<table class="table tbl-border"><thead><th class="text-align">Reading Date</th><th class="text-align">'+$obj.attr("vtype")+'</th></thead><tbody>');
        for(var i=0;i<data.rows.length;i++){
					if($obj.attr("vtype") == "systolic_bp" && data.rows[i].value.Value_Systolic_BP){
					 vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+data.rows[i].value.Value_Systolic_BP+'</td>'); 
					}
					if($obj.attr("vtype") == "diastolic_bp" && data.rows[i].value.Value_Diastolic_BP){
					 vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+data.rows[i].value.Value_Diastolic_BP+'</td>'); 
					}
					if($obj.attr("vtype") == "bp_map" && data.rows[i].value.Value_Systolic_BP && data.rows[i].value.Value_Diastolic_BP){
					 vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+calculateMAP(Number(data.rows[i].value.Value_Systolic_BP),Number(data.rows[i].value.Value_Diastolic_BP))+'</td>'); 
					}
					if($obj.attr("vtype") == "heartrate" && data.rows[i].value.HeartRate){
					 vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+data.rows[i].value.HeartRate+'</td>'); 
					}
					if($obj.attr("vtype") == "fasting_glucose" && data.rows[i].value.Fasting_Glucose){
					 vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+data.rows[i].value.Fasting_Glucose+'</td>'); 
					}
					if($obj.attr("vtype") == "o2" && data.rows[i].value.O2){
					 vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+data.rows[i].value.O2+'</td>');  
					}
					if($obj.attr("vtype") == "normal_condition" && data.rows[i].value.OutOfRange){
					 vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+data.rows[i].value.OutOfRange+'</td>');  
					}
					// if($obj.attr("vtype") == "value_weight" && data.rows[i].value.Value_weight){
					//  vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+data.rows[i].value.Value_weight+'</td>');  
					// }
					if($obj.attr("vtype") == "temprature" && data.rows[i].value.Value_temp){
					 vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+data.rows[i].value.Value_temp+'</td>');  
					}
					if($obj.attr("vtype") == "respiration" && data.rows[i].value.Respiration_Rate){
					 vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+data.rows[i].value.Respiration_Rate+'</td>');  
					}
					if($obj.attr("vtype") == "weight" && data.rows[i].Value_weight){
					 vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+data.rows[i].Value_weight+'</td>');  
					}
					if($obj.attr("vtype") == "height" && data.rows[i].value.height){
					 vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+data.rows[i].value.height+'</td>');  
					}
					if($obj.attr("vtype") == "bmi" && data.rows[i].value.bmi){
					 vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+data.rows[i].value.bmi+'</td>'); 
					}
					if($obj.attr("vtype") == "waist" && data.rows[i].value.waist){
					 vital_sign_data.push('<tr><td class="text-align">'+moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY")+'</td><td class="text-align">'+data.rows[i].value.waist+'</td>'); 
					}
					vital_sign_data.push('</tr>');
				}
        vital_sign_data.push('</tbody></table>');
        $("#charting_medical_information").html(vital_sign_data.join(''));
      }else{
      }
    },
    error:function(data,error,reason){
      newAlert('error', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    },
    descending:true,
    startkey: ['SelfCare',userinfo.user_id,{}],
    endkey: ['SelfCare',userinfo.user_id]
  });
  $('.charting_medicalinfo_title').html('Vital Sign More Details');
}

function getVitalSignGraphs($obj){
	$("#charting_medicalinfo_model").modal({
    show:true,
    backdrop:'static',
    keyboard:false
  });
  $('.charting_medicalinfo_title').html('Vital Sign More Details');
  $("#charting_medical_information").html("<div id='charting_medical_information_statistics' style='min-width: 850px; height: 400px; margin: 0 auto'></div>");
  $.couch.db(db).view("tamsa/getAnalyticsRange", {
    success: function(data) {
      if(data.rows.length > 0){
      	var statistics_value = [];
      	var statistics_date  = [];
				if($obj.attr("vtype") == "systolic_bp"){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].value.Value_Systolic_BP){
							var text = "Systolic BP";
						 	var subtext = "mmHg";
						 	if(Number(data.rows[i].value.Value_Systolic_BP) && moment(data.rows[i].value.insert_ts).format("DD-MMM") != "Invalid date"){
						 		statistics_value.push(Number(data.rows[i].value.Value_Systolic_BP));
						 		statistics_date.push(moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY"));
						 	}
						}
					}
					if(statistics_date.length == 0 || statistics_value.length == 0){
						$("#charting_medical_information").html("No Records are Found.");
						return false;
					}
				}else if($obj.attr("vtype") == "diastolic_bp"){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].value.Value_Diastolic_BP){
							var text = "Diastolic BP";
							var subtext = "mmHg";	
							if(Number(data.rows[i].value.Value_Diastolic_BP) && moment(data.rows[i].value.insert_ts).format("DD-MMM") != "Invalid date"){
								statistics_value.push(Number(data.rows[i].value.Value_Diastolic_BP));
								statistics_date.push(moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY"));
							}
						}
					}
					if(statistics_date.length == 0 || statistics_value.length == 0){
						$("#charting_medical_information").html("No Records are Found.");
						return false;
					}
				}else if($obj.attr("vtype") == "bp_map"){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].value.Value_Systolic_BP && data.rows[i].value.Value_Diastolic_BP){
							var text = "Mean Arterial Pressure";
						  var subtext = "mmHg";
						  if(Number(data.rows[i].value.Value_Systolic_BP) && Number(data.rows[i].value.Value_Diastolic_BP) && moment(data.rows[i].value.insert_ts).format("DD-MMM") != "Invalid date"){
						  	//console.log(calculateMAP(Number(data.rows[i].value.Value_Systolic_BP),Number(data.rows[i].value.Value_Diastolic_BP)));
						  	statistics_value.push(calculateMAP(Number(data.rows[i].value.Value_Systolic_BP),Number(data.rows[i].value.Value_Diastolic_BP)));
						  	statistics_date.push(moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY"));
						  }else {
						  	// console.log(data.rows[i]);
						  }
						}else {
							// console.log(data.rows[i]);
						}
					}
					// console.log(statistics_date);
					// console.log(statistics_value);
					if(statistics_date.length == 0 || statistics_value.length == 0){
						$("#charting_medical_information").html("No Records are Found.");
						return false;
					}
				}else if($obj.attr("vtype") == "heartrate"){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].value.HeartRate){
							var text = "HeartRate";
							var subtext = "bpm";
							if(Number(data.rows[i].value.HeartRate) && moment(data.rows[i].value.insert_ts).format("DD-MMM") != "Invalid date"){
								statistics_value.push(Number(data.rows[i].value.HeartRate));
								statistics_date.push(moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY"));
							}
						}
					}
					if(statistics_date.length == 0 || statistics_value.length == 0){
						$("#charting_medical_information").html("No Records are Found.");
						return false;
					}
				}else if($obj.attr("vtype") == "fasting_glucose"){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].value.Fasting_Glucose){
							var text = "Fasting Glucose";
							var subtext = "";
							if(Number(data.rows[i].value.Fasting_Glucose) && moment(data.rows[i].value.insert_ts).format("DD-MMM") != "Invalid date"){
								statistics_value.push(Number(data.rows[i].value.Fasting_Glucose));
								statistics_date.push(moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY"));
							}
						}
					}
					if(statistics_date.length == 0 || statistics_value.length == 0){
						$("#charting_medical_information").html("No Records are Found.");
						return false;
					}
				}else if($obj.attr("vtype") == "o2"){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].value.O2){
							var text = "O2";
							var subtext = "";
							if(Number(data.rows[i].value.O2) && moment(data.rows[i].value.insert_ts).format("DD-MMM") != "Invalid date"){
								statistics_value.push(Number(data.rows[i].value.O2));
								statistics_date.push(moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY"));								
							}
						}
					}
					if(statistics_date.length == 0 || statistics_value.length == 0){
						$("#charting_medical_information").html("No Records are Found.");
						return false;
					}
				}/*else if($obj.attr("vtype") == "value_weight"){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].value.Value_weight){
							var text = "Value Weight";
						 	var subtext = "";
						 	if(Number(data.rows[i].value.Value_weight) && moment(data.rows[i].value.insert_ts).format("DD-MMM") != "Invalid date"){
						 		statistics_value.push(Number(data.rows[i].value.Value_weight));
						 		statistics_date.push(moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY"));
						 	}
						}
					}
					if(statistics_date.length == 0 || statistics_value.length == 0){
						$("#charting_medical_information").html("No Records are Found.");
						return false;
					}
				}*/else if($obj.attr("vtype") == "temprature"){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].value.Value_temp){
  						var text = "Temprature";  					 
							var subtext = "*F";
							if(Number(data.rows[i].value.Value_temp) && moment(data.rows[i].value.insert_ts).format("DD-MMM") != "Invalid date"){
								statistics_value.push(Number(data.rows[i].value.Value_temp));
								statistics_date.push(moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY"));
							}
						}
					}
					if(statistics_date.length == 0 || statistics_value.length == 0){
						$("#charting_medical_information").html("No Records are Found.");
						return false;
					}
				}else if($obj.attr("vtype") == "respiration"){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].value.Respiration_Rate){
							var text = "Respiration Rate";
						 	var subtext = "bpm";
						 	if(Number(data.rows[i].value.Respiration_Rate) && moment(data.rows[i].value.insert_ts).format("DD-MMM") != "Invalid date"){
						 		statistics_value.push(Number(data.rows[i].value.Respiration_Rate));
						 		statistics_date.push(moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY"));
						 	}
						}
					}
					if(statistics_date.length == 0 || statistics_value.length == 0){
						$("#charting_medical_information").html("No Records are Found.");
						return false;
					}
				}else if($obj.attr("vtype") == "weight"){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].value.Value_weight){
							var text = "Weight";
						 	var subtext = "kgs";
						 	if(Number(data.rows[i].value.Value_weight) && moment(data.rows[i].value.insert_ts).format("DD-MMM") != "Invalid date"){
						 		statistics_value.push(Number(data.rows[i].value.Value_weight));
						 		statistics_date.push(moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY"));
						 	}
						}
					}
					if(statistics_date.length == 0 || statistics_value.length == 0){
						$("#charting_medical_information").html("No Records are Found.");
						return false;
					}
				}else if($obj.attr("vtype") == "height"){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].value.height){
							var text = "Height";
						 	var subtext = "cms";
						 	if(Number(data.rows[i].value.height) && moment(data.rows[i].value.insert_ts).format("DD-MMM") != "Invalid date"){
						 		statistics_value.push(Number(data.rows[i].value.height));
						 		statistics_date.push(moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY"));
						 	}
						}
					}
					if(statistics_date.length == 0 || statistics_value.length == 0){
						$("#charting_medical_information").html("No Records are Found.");
						return false;
					}
				}else if($obj.attr("vtype") == "bmi"){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].value.bmi){
							var text = "Body Mass Index";
						 	var subtext = "kg/m*m";
						 	if(Number(data.rows[i].value.bmi) && moment(data.rows[i].value.insert_ts).format("DD-MMM") != "Invalid date"){
						 		statistics_value.push(Number(data.rows[i].value.bmi));
						 		statistics_date.push(moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY"));
						 	}
						}
					}
					if(statistics_date.length == 0 || statistics_value.length == 0){
						$("#charting_medical_information").html("No Records are Found.");
						return false;
					}
				}else if($obj.attr("vtype") == "waist"){
					for(var i=0;i<data.rows.length;i++){
						if(data.rows[i].value.waist){
							var text = "Waist";
						 	var subtext = "cms";
						 	if(Number(data.rows[i].value.waist) && moment(data.rows[i].value.insert_ts).format("DD-MMM") != "Invalid date"){
						 		statistics_value.push(Number(data.rows[i].value.waist));
						 		statistics_date.push(moment(data.rows[i].value.insert_ts).format("DD-MM-YYYY"));
						 	}
						}
					}
					if(statistics_date.length == 0 || statistics_value.length == 0){
						$("#charting_medical_information").html("No Records are Found.");
						return false;
					}
				}
      }else{
      }
      $('#charting_medical_information_statistics').highcharts({
        chart: {
          type: 'column'
        },
        title: {
          text: text
        },
        subtitle: {
          html: subtext
        },
        xAxis: {
          categories: statistics_date,
          crosshair: true,
					labels: {
						rotation: -45,
						style: {
					    fontSize: '10px'
						}
					}
        },
        yAxis: {
            min: 0,
            title: {
                text: text + " (" + subtext + ")"
            }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="padding:0"><b>{point.y:.1f} '+subtext+'</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
              pointPadding: 0.2,
              borderWidth: 0
          }
        },
        series: [{
          name: "Reading Date",
          data: statistics_value
        }]
      });
    },
    error:function(data,error,reason){
      newAlert('error', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    },
    descending:true,
    startkey: ['SelfCare',userinfo.user_id,{}],
    endkey: ['SelfCare',userinfo.user_id]
  });
}

function getChartingAlertsCounts(){
	if(moment(userinfo.date_of_birth)) {
		var user_dob = userinfo.date_of_birth;
		var user_age = "";
	}else {
		var user_age = userinfo.age;
		var user_dob = "";
	}

	var vaccine_count = 0;
	$.couch.db(db).list("tamsa/getImmunizationListByAge", "getImmunizationCustomDose", {
	key:pd_data.dhp_code,
	include_docs:true,
  user_dob: user_dob,
  user_age: user_age,
  user_id:  userinfo.user_id
	}).success(function(data){
	  if(data.rows.length > 0){
			$.couch.db(db).view("tamsa/getPatientImmunizations",{
				success:function(idata) {
					if(idata.rows.length > 0) {
						for(var i=0;i<data.rows.length;i++) {
							var exist;
							for(var j=0;j<idata.rows.length;j++){
								if(idata.rows[j].value.status == "Taken" && data.rows[i].vaccine_name == idata.rows[j].value.immunization_name && data.rows[i].dose_details.dose_name == idata.rows[j].value.dose_name) {
									exist = true;
									break;
								}else {
									exist = false;
								}
							}
							if(!exist) {
								vaccine_count++;
							}
						}
					}else {
						for(var i=0;i<data.rows.length;i++){
							vaccine_count++;
						}
					}
					getScreeningAlertsCount(vaccine_count,true);
				},
				error:function(data,error,reason){
					newAlert("danger",reason);
					$("html, body").animate({scrollTop: 0}, 'slow');
					return false;
				},
				startkey:[userinfo.user_id],
				endkey:[userinfo.user_id,{},{}],
		 		include_docs:true
			});
	  }else{
	  	/*screening alerts code starts*/
	  	getScreeningAlertsCount(vaccine_count,false);
	  	/*screening alerts code ends*/
	  }
	}).error(function(reason){
		newAlert("danger",reason);
		$("html, body").animate({scrollTop: 0}, 'slow');
	});
	
	if(userinfo_medical.Allergies){
		if(userinfo_medical.Allergies.length > 0){
			$("#charting_alerts_allergies_count").html("("+userinfo_medical.Allergies.length+")");
		}else{
			$("#charting_alerts_allergies_count").html("(0)");
		}
	}

	$.couch.db(db).view("tamsa/getPatientRefferals", {
		success: function(data) {
			if(data.rows.length > 0){
				$("#charting_alerts_referral_count").html("(" + data.rows.length + ")");
			}else{
				$("#charting_alerts_referral_count").html("(0)");
			}
		},
		error:function(data,error,reason){
			newAlert("danger", reason);
			$('body,html').animate({scrollTop: 0}, 'slow');
			return false;
		},
		key:userinfo.user_id,
		include_docs:true
	});
	$.couch.db(db).view("tamsa/getPatientCarePlan", {
	  success: function(data) {
	    if (data.rows.length > 0) {
	    	$("#charting_alerts_careplan_count").html("("+data.rows.length+")");
	    }
	    else {
	      $("#charting_alerts_careplan_count").html("(0)");
	    }
	  },
	  error: function(status) {
	    console.log(status);
	  },
	  startkey: [userinfo.user_id],
	  endkey:   [userinfo.user_id,{}]
	});

	$.couch.db(db).view("tamsa/getRecentLabResults", {
    success: function(data) {
    	if(data.rows.length > 0){
    		$("#charting_alerts_lab_count").html("("+data.rows.length+")");
    	}else{
    		$("#charting_alerts_lab_count").html("(0)");
    	}
    },
    error: function(status) {
      console.log(status);
    },
    startkey: [userinfo.user_id,{},{}],
    endkey: [userinfo.user_id],
    descending:true,
    include_docs:true
	});
}

function getScreeningAlertsCount(vaccine_count,immunization_flag) {
	var days = moment().diff(moment(userinfo.date_of_birth),"days");
	if(days < 6570) var tstart = 1
	else var tstart = 6570

	if(days >= 6570){
		if(userinfo.age) var age = userinfo.age
		else var age = getAgeFromDOB(userinfo.date_of_birth)

		$.couch.db(db).list("tamsa/getHealthMaintenanceNotificationsList", "getHealthMaintenanceAlertsForChartingTemplates", {
		user_age:age,
	  user_gender:userinfo.gender,
	  user_id:userinfo.user_id
		}).success(function(data){
		  if(data.rows.length > 0){
				vaccine_count = vaccine_count + Number(data.rows.length);
		  }
		  $("#charting_alerts_risk_count").html("(" + vaccine_count + ")");
		}).error(function(reason){
			newAlert("danger",reason);
			$("html, body").animate({scrollTop: 0}, 'slow');
			return false;
		});
	}else {
		$("#charting_alerts_risk_count").html("(" + vaccine_count + ")");
	}
}

function displayChartingCurrentMedication(start,end,data){
  var medication_tbody = [];
  for (var i = start; i < end; i++) {
    medication_tbody.push('<tr><td>'+data.rows[i].value.drug+'</td><td>'+data.rows[i].value.drug_strength+'</td><td>'+(data.rows[i].value.drug_unit).toLowerCase()+'</td><td>'+data.rows[i].value.drug_start_date+'</td><td>'+data.rows[i].value.drug_end_date+'</td></tr>');
  };
  $("#charting_current_medication_list tbody").html(medication_tbody.join(''));
}

function cTemplateSaveFieldArray($obj){
	var section = [];
	$obj.find(".ctemplate-display-sectionlist").each(function(){
		var sect_name = $(this).find(".ctemplate-display-section-name").html();
		var fields = [];
		$(this).find(".ctemplate-display-fieldlist").each(function(){
			var field_name = $(this).find(".ctemplate-display-fieldname").html();
			var response_format_pair = [];
			$(this).find(".ctemplate-display-response-value").each(function(){
				var $frmt = $(this).attr("restype"),
						frmt_type = getFormatFromResponseType($frmt,$(this));
				response_format_pair.push({
					response: $(this).attr("restype"),
					format:   frmt_type,
					values:   getValueFromResponseType($(this),sect_name,field_name)
				});
			});
			fields.push({
				field_name: field_name,
				response_format_pair:response_format_pair
			});
		});
		section.push({
			section_name: sect_name,
			fields:       fields
		});
	});
	return section;
}

function cTemplatePartialSaveFieldArray($obj){
	var section = [];
	$obj.find(".ctemplate-display-sectionlist").each(function(){
		var sect_name = $(this).find(".ctemplate-display-section-name").html();
		if(sect_name != "History of Presenting Illness" && sect_name != "Past Medical History" && sect_name != "Family History" && sect_name != "") {
			var fields = [];
			$(this).find(".ctemplate-display-fieldlist").each(function(){
				var field_name = $(this).find(".ctemplate-display-fieldname").html();
				var response_format_pair = [];
				$(this).find(".ctemplate-display-response-value").each(function(){
					var $frmt = $(this).attr("restype"),
							frmt_type = getFormatFromResponseType($frmt,$(this));
					response_format_pair.push({
						response: $(this).attr("restype"),
						format: frmt_type,
						values:   getValueFromResponseType($(this),sect_name,field_name)
					});
				});
				fields.push({
					f_name: field_name,
					response_format_pair:response_format_pair
				});
			});
			section.push({
				s_name: sect_name,
				fields:       fields
			});
		}
	});
	return section;
}

function getFormatFromResponseType($frmt,$obj) {
	var frmt_type = [];
	if($frmt == "Text" || $frmt == "paragraph" || $frmt == "soapnote" || $frmt == "date" || $frmt == "image" ){
		frmt_type.push($frmt);
	}else if($frmt == "combobox") {
		$obj.find(".multiple-value").each(function() {
			frmt_type.push($obj.val());
		});
	}else if($frmt == "multiple") {
		$obj.find("input[type='radio']").each(function() {
			frmt_type.push($obj.attr("myval"));
		});
	}else if($frmt == "table") {
		var table_columns = [],
		    table_rows = [],
		    trlen = Number($obj.attr("trlen")),
		    tclen = Number($obj.attr("tclen"));
		if(trlen > 0) {
			$obj.find(".tbl-rows").each(function() {
				table_rows.push($obj.html());
			});
		}
		if(tclen > 0) {
			$obj.find(".tbl-head").each(function() {
				table_columns.push($obj.html());
			});
		}
		frmt_type.push({
			table_columns : table_columns,
			table_rows : table_rows
		});
	}
	else if($frmt == "grid") {
		var grid_columns = [],
		    grid_rows = [],
		    trlen = Number($obj.attr("trlen")),
		    tclen = Number($obj.attr("gridlen"));
		if(trlen > 0) {
			$obj.find(".grid-rows").each(function() {
				grid_rows.push($obj.html());
			});
		}

		if(tclen > 0) {
			$obj.find(".grid-head").each(function() {
				grid_columns.push($obj.html());
			});
		}
		
		frmt_type.push({
			grid_columns : grid_columns,
			grid_rows : grid_rows
		})					    
	}
	else if($frmt == "scale") {
		var smin = $obj.find(".scale-radio").first().attr("value"),
		    smax = $obj.find(".scale-radio").last().attr("value");
		frmt_type.push({
			min : smin,
			max : smax
		});
	}
	return frmt_type;
}

function getValueFromResponseType($obj,section_name,field_name){
	var restype = $obj.attr("restype");
	var format = [];
	if(restype == "Text"){
		format.push($obj.find("input").val());
	}else if(restype == "paragraph"){
		format.push($obj.find("textarea").val());
	}else if(restype == "checkbox"){
		$obj.find(".ctemplate-display-chkbox").each(function(){
			if($(this).is(":checked")){
				format.push($(this).attr("frmtval"));
			}
		});	
	}else if(restype == "multiple"){
		format.push($obj.find('input[name^="single-select"]:checked').attr("myval"));
	}else if(restype == "combobox"){
		var tempmulti = [];
		$obj.find("table tbody tr td").each(function(){
			if($(this).find(".multiple-value").prop("checked")){
				tempmulti.push($(this).find(".multiple-value").attr("value"));
			}
		});
		format = tempmulti;
	}else if(restype == "date"){
		format.push($obj.find("input").val());
	}else if(restype == "scale"){
		format.push($obj.find(".scale-radio:checked").val());
	}else if(restype == "table"){
		var table_column = [];
		var table_rows = [];
		var table_data = [];
		
		if($obj.attr("tclen") > 0){
			$obj.find(".tbl-head").each(function(){
				table_column.push($(this).html());
			});	
		}
		
		if($obj.attr("trlen") > 0){
			$obj.find(".tbl-rows").each(function(){
				table_rows.push($(this).html());
			});
		}

		$obj.find(".trows-count").each(function(){
			var tmp = [];
			if($(this).find(".table-rows-input").length > 0){
				$(this).find(".table-rows-input").each(function(){
					tmp.push($(this).val());
				});
				table_data.push(tmp);	
			}
		});
		
		format.push({
			table_head:table_column,
			table_rows:table_rows,
			table_data:table_data
		});
	} else if (restype == "image") {
		var section_fieldname = section_name +"|"+field_name;
		$("#print_division").html('');
		$("#print_division").append('<canvas id="tempCanvas" height="600" width="1200" style="border:3px solid rgb(204, 204, 204); border-radius: 10px;">Canvas not supported</canvas>');
		if($("#charting_section_selection").data(section_fieldname)) {
			var saveCanvas        = document.getElementById('tempCanvas');
			var saveCanvasContext = saveCanvas.getContext('2d');
			var saveCanvasImage	= $("#charting_section_selection").data(section_fieldname).image_data;
			
			saveCanvasContext.putImageData(saveCanvasImage, 0,0);
			// saveCanvasContext.drawImage($("#tempCanvas"), 0,0, $("#tempCanvas").width, $("#tempCanvas").height);
			var saveCanvasDataUrl = saveCanvas.toDataURL('image/png');
			format.push({
				image_name:$("#charting_section_selection").data(section_fieldname).image_name,
				image_width:$("#charting_section_selection").data(section_fieldname).image_width,
				image_height:$("#charting_section_selection").data(section_fieldname).image_height,
				image_data:saveCanvasDataUrl
			});
		}else{
			//validation for charting template	
		}
		
		// var doc = {};
		// var file_form = $obj.find('form');
		// var form_id   = $obj.find('form').find("input[name='_id']");
		// var form_rev  = $obj.find('form').find("input[name='_rev']");
		// var _id = $.couch.newUUID();
		// doc._id = _id;
		// format.push(_id);
		// $.couch.db(db).saveDoc(doc, {
		//     success: function(data) {
		//       form_id.val(data.id);
		// 	  	form_rev.val(data.rev);
		//       file_form.ajaxSubmit({
	 //              // Submit the form with the attachment
	 //              url: "/"+ db +"/"+ data.id,
	 //              success: function(response) {
	 //              	$.couch.db(db).openDoc(data.id,{
	 //              		success:function(data){
	 //              			var newdata = data;
	 //              			var tempimgnotes = [];
	 //              			$obj.find(".copiedImgNotes").each(function(){
	 //              				tempimgnotes.push({
	 //              					note_text:$(this).data("dragval"),
	 //              					note_top:$(this).data("dragtop"),
	 //              					note_left:$(this).data("dragleft")
	 //              				});
	 //              			});
	 //              			newdata.imgNotes = tempimgnotes;
	 //              			console.log(newdata);
	 //              			$.couch.db(db).saveDoc(newdata,{
	 //              				success:function(data){
	 //              					newAlert('success', "charting Template successfully Saved.");
	 //              					$('html, body').animate({scrollTop: 0}, 'slow');
	 //              					return false;
	 //              				},
	 //              				error:function(data,error,reason){
	 //              					newAlert('danger', reason);
	 //              					$('html, body').animate({scrollTop: 0}, 'slow');
	 //              					return false;		
	 //              				}
	 //              			});
	 //              		},
	 //              		error:function(data,error,reason){
		// 									newAlert('danger', reason);
		// 									$('html, body').animate({scrollTop: 0}, 'slow');
		// 									return false;	              			
	 //              		}
	 //              	});
	 //              },
	 //              error: function(data, error, reason) {
	 //                newAlert('danger', reason);
	 //                $('html, body').animate({scrollTop: 0}, 'slow');
	 //                return false;
	 //              }
		//        })
		//     },
		//     error: function(data,erro,reason) {
		//     	newAlert('danger', reason);
		//     	$('html, body').animate({scrollTop: 0}, 'slow');
		//     	return false;
		//     }
		// });
	}else if(restype == "grid"){
		var grid_columns = [];
		var grid_rows = [];
		var grid_data = [];
		
		$obj.find(".grid-head").each(function(){
			grid_columns.push($(this).html());
		});	
	
		$obj.find(".grid-rows").each(function(){
			grid_rows.push($(this).html());
		});

		$obj.find(".grid-rows-count").each(function(){
			var tmp = [];
			$(this).find(".grid-rows-input").each(function(){
			 	tmp.push($(this).is(":checked"));
			});
			tmp.push($(this).find(".grid-rows-value").val());
			grid_data.push(tmp);	
		});	
		format.push({
			grid_columns:grid_columns,
			grid_rows:grid_rows,
			grid_data:grid_data
		});
	}else if(restype == "soapnote"){
		format = saveSoapNoteValues($obj);
	}else if(restype == "biometrics"){
		$obj.find("textarea").each(function(){
			format.push({
				 biometrics_key:$(this).attr("bio-name"), 
				 biometrics_value:$(this).val()
			});
		});
	}else{
		console.log("no value generated from response");
	}
	return format;
}

function saveSoapNoteValues($obj){
	var complaints = [];
	var soapnote   = [];
	var objective  = [];
	var dignosis   = [];
	var plan       = [];
	var fields     = [];
	$obj.find(".charting-template-subjective-response").find(".charting-target-complaint li").each(function(){
		complaints.push($(this).html());
	});
	
	patient_historian = $obj.find(".charting-template-objective-response").find(".is_patient_historian").val();
	$obj.find(".charting-template-objective-response").find(".objective-fields-parent").each(function(){
		var field_name = $(this).find(".objective-field-name").html();
		var choices = [];
		var details_list = [];
		$(this).find(".choicelist input").each(function(){
			if($(this).prop("checked")){
				choices.push($(this).val());
			}
		});
		$(this).find(".charting-target-objective-details li").each(function(){
			details_list.push($(this).html());
		});
		fields.push({
			field_name:field_name,
			choices:choices,
			details_list:details_list	
		});
	});
	objective.push({
		patient_historian:          patient_historian,
		fields:                     fields
	});

	$obj.find(".charting-template-assessment-response").find(".charting-target-diagnosis li").each(function(){
		dignosis.push($(this).html());
	});
	// $obj.find(".charting-template-plan-response").find(".charting-target-plan li").each(function(){
	// 	plan.push($(this).html());
	// });

	soapnote.push({
		subjective:                 complaints,
		objective:                  objective,
		assessment:                 dignosis,
		plan:                       $obj.find(".charting_template_plan").val()
	})
	return soapnote;
}

function existingChartingTemplateSearch(id){
  var doctor_id = pd_data._id;
  $('#charting_template_current_list thead').html('<tr><th>Charting Template List :</th><th>Specialization</th></tr>'); 
  $('#charting_template_current_list tbody').html('');
  $.couch.db(db).openDoc(id,{
    success: function(data) {
      var ctemplate_tbody = '';
        ctemplate_tbody += '<tr><td>'+data.template_name;

        if (data.doctor_id == pd_data._id) {
          ctemplate_tbody  += '&nbsp; &nbsp; &nbsp;<span class="glyphicon glyphicon-trash delete_charting_template pointer" data-target="#delete_charting_template_modal" role="button" class="dropdown-toggle" data-toggle="modal" index="'+data._id+'" rev="'+data._rev+'"></span><a data-toggle="tab" class="edit_charting_template" index="'+data._id+'"><span class="glyphicon glyphicon-pencil pointer" role="button" class="dropdown-toggle"></span></a></td><td>'+data.specialization+'</td></tr>';
        }
        else {
          ctemplate_tbody += '</td></tr>';
        }
      $("#charting_template_current_list tbody").html(ctemplate_tbody);
    },
    error: function(status) {
      console.log(status);
    }
  });
}

function existingSpecializationSearch(specialization){
	$.couch.db(db).view("tamsa/getExistingSpecialization", {
	  success: function(data) {
	  	if(data.rows.length > 0){
	  	$('#charting_template_current_list thead').html('<tr><th>Charting Template List :</th><th>Specialization</th><th>Publish</th></tr>'); 
	  	var specialization_tbody = '';
	  	$("#charting_template_current_list tbody").html("");
	  	for(var i =0;i<data.rows.length;i++){
				specialization_tbody += '<tr><td>'+data.rows[i].doc.template_name;

				if (data.rows[i].doc.doctor_id == pd_data._id) {
				  specialization_tbody  += '&nbsp; &nbsp; &nbsp;<span class="glyphicon glyphicon-trash delete_charting_template pointer" data-target="#delete_charting_template_modal" role="button" class="dropdown-toggle" data-toggle="modal" index="'+data.rows[i].doc._id+'" rev="'+data.rows[i].doc._rev+'"></span><a data-toggle="tab" class="edit_charting_template" index="'+data.rows[i].doc._id+'"><span class="glyphicon glyphicon-pencil pointer" role="button" class="dropdown-toggle"></span></a></td><td>'+data.rows[i].doc.specialization+'</td><td>'+data.rows[i].doc.publish+'</td></tr>';
				}
				else {
				  specialization_tbody += '</td></tr>';
				}
	  	}
	  	$("#charting_template_current_list tbody").html(specialization_tbody);
	  }else{
      newAlert("danger","Not Any Tempalate available in this Specialization ");
      $("html, body").animate({scrollTop: 0}, 'slow');
      return false;
    }	
	  },
	  error: function(status) {
	      console.log(status);
	  },
	   key: [pd_data._id,specialization],
	   reduce:false,
	   include_docs:true
	});
}

function deleteChartingTemplate() {
  var delete_index = $("#delete_charting_template_confirm").attr("index");
  var delete_rev   = $("#delete_charting_template_confirm").attr('rev');

  var doc = {
    _id: delete_index,
    _rev: delete_rev
  };
  
  $.couch.db(db).removeDoc(doc, {
    success: function(data) {
      $('#delete_charting_template_modal').modal("hide");
      newAlert('success', 'Charting Template Deleted successfully !');
      $('html, body').animate({scrollTop: 0}, 'slow');
      if($("#search_and_display_care_plan_list").val() != "Select Specialization") existingSpecializationSearch($("#search_and_display_care_plan_list").val())
      else{
      	$("#charting_template_current_list tbody").html("");
      	$("#existing_charting_template_list").val("");	
      }
    },
    error: function(data, error, reason) {
      newAlert('error', reason);
      $('html, body').animate({scrollTop: 0}, 'slow');
    }
  })
}

function deleteChartingTemplateField($obj){
	$obj.parent().parent(".section-field-row").remove();
}

function resetBuildingTemplate(){
	$("#charting_template_current_list thead").html("");
	$("#charting_template_current_list tbody").html("");
	$("#existing_charting_template_list").val("");
	$("#dc_charting_flag").val("New");
}

function tlChartingTemplateResponseDisplay(data){
  var tempstring = "";
  if(data.response == "table"){
    tempstring = "<tr><td>";
    tempstring += '<div class = "tl-table-scroll"><table class="table myborder retable">';
    if(data.values){
      for(var l=0; l<data.values.length;l++){
        if(data.values[l].table_head.length > 0){
          tempstring += '<thead>';
          if(data.values[l].table_rows && data.values[l].table_rows.length > 0){
            tempstring += '<th></th>';
          } 
        }
        
        if(data.values[l].table_head.length > 0){
          for(var m=0 ; m<data.values[l].table_head.length;m++){
            tempstring += '<th>'+data.values[l].table_head[m]+'</th>';  
          }
          tempstring += '</thead>';
        }

        tempstring += '<tbody>';
        if(data.values[l].table_rows && data.values[l].table_rows.length > 0){
          for(var n=0; n<data.values[l].table_rows.length;n++){
            tempstring += '<tr><td>'+data.values[l].table_rows[n]+'</td>';  
            for(var p=0; p<data.values[l].table_data[n].length;p++){
              tempstring += '<td>'+data.values[l].table_data[n][p]+'</td>';  
            }
          tempstring += '</tr>';  
          } 
        }else{
          for(var n=0; n<data.values[l].table_data.length;n++){
            tempstring += '<tr>'; 
            for(var p=0; p<data.values[l].table_data[n].length;p++){
                tempstring += '<td>'+data.values[l].table_data[n][p]+'</td>';  
            }
            tempstring += '</tr>';  
          }
        }
        tempstring += '</tbody></table></div></td></tr>';
      }
    }
  }
  else if(data.response == 'image') {
    if(data.values.length > 0){
    	if(data.values[0] && data.values[0].image_data) {
    		tempstring += '<tr><td><div class="imgcontainer" data-width="'+data.values[0].image_width+'" data-height="'+data.values[0].image_height+'"><img class="timeline-preview-image" src="'+data.values[0].image_data+'" height="150" width="150"></div>';
    	}else{
    		tempstring += '<tr><td><div class="imgcontainer" id="'+data.values[0]+'"></div>';
    		$.couch.db(db).openDoc(data.values[0],{
  		    success: function(data1){
  		      if (data1._attachments != undefined) {
  		        var url = "/api/attachment?attachment_name="+Object.keys(data1._attachments)[0]+"&db="+db+"&id="+data1._id;
  		        $('#'+data1._id).html("<img src='"+url+"' height='100px'>");
  		      }
  		    },
  		    error:function(data,error,reason){
  		    	newAlert("danger",reason);
  		    	$("html, body").animate({scrollTop: 0}, 'slow');
  		    	return false;
  		    }
  		  });	
    	}
    }
  }else if(data.response == 'grid'){
    tempstring = '<tr><td>';
    tempstring += '<div class = "tl-table-scroll"><table class = "table myborder retable">';
    for(var l=0; l<data.values.length;l++){ 
      tempstring += '<thead><th></th>';
      for(var m=0 ; m<data.values[l].grid_columns.length;m++){
        tempstring += '<th>'+data.values[l].grid_columns[m]+'</th>';  
      }
      tempstring += '<th>Notes</th>';  
      tempstring += '</thead><tbody>';

      for(var n=0; n<data.values[l].grid_rows.length;n++){
        tempstring += '<tr><td>'+data.values[l].grid_rows[n]+'</td>'; 
        for(var p=0; p<data.values[l].grid_data[n].length;p++){
          tempstring += '<td>'+data.values[l].grid_data[n][p]+'</td>';
        }
        tempstring += '</tr>';  
      } 
      tempstring += '</tbody>';
    }
    tempstring += '</table></div></td></tr>';
  }else if(data.response == "soapnote"){
  	// $.couch.db(db).view("tamsa/testPatientsInfo",{
    //  success:function(usedata){
    //    console.log(usedata.rows.length);
    //    console.log(data);
    //    if(usedata.rows.length == 1){
    		tempstring += getInnerData(data,data.response);
          // tempstring += '<tr><td class="theme-color"><h5 class="inner_section">Subjective</h5></td><td>'+data.values[0].subjective+'</td></tr>';
          // tempstring += '<tr><td class="theme-color"><h5 class="inner_section">Objective</h5></td><td>';
          //     tempstring += '<div class="tl-objective-parent"><div>Patient '+data.values[0].objective[0].patient_historian+' a reliable historian</div><br>';

          //     for(var i=0;i<data.values[0].objective[0].fields.length;i++){
          //       tempstring += '<table class="table myborder">';
          //         tempstring += '<tbody><tr>';
          //           tempstring += '<td class="bieven">'+data.values[0].objective[0].fields[i].field_name+'</td>';
          //           tempstring += '<td class=" ">'+data.values[0].objective[0].fields[i].choices+'</td>';
          //         tempstring += '</tr>';
          //         tempstring += '<tr>';
          //           tempstring += '<td>Details</td>';
          //           tempstring += '<td>'+data.values[0].objective[0].fields[i].details_list+'</td>';
          //         tempstring += '</tr>';
          //       tempstring += '</tbody></table>';
          //       tempstring += '<br>'; 
          //     }

          //     tempstring += '</div></td></tr>';
          //     if(data.values[0].chief_complaint) tempstring += '<tr><td class="theme-color"><h5 class="inner_section">Chief Complaint</h5></td><td><span style="float:left">'+data.values[0].chief_complaint+'</span></td></tr>';
          //     if(data.values[0].history_of_present_illness) tempstring += '<tr><td class="theme-color"><h5 class="inner_section">History Of Present Illness</h5></td><td><span style="float:left">'+data.values[0].history_of_present_illness+'</span></td></tr>';

          // tempstring += '<tr><td class="theme-color"><h5 class="inner_section">assessment</h5></td><td><span style="float:left">'+data.values[0].assessment+'</span></td></tr>';
          // tempstring += '<tr><td class="theme-color"><h5 class="inner_section">Plan</h5></td><td><span style="float:left">'+data.values[0].plan+'</span></td></tr></tbody>';
          // tempstring += '<tr><td class="theme-color">Procedure</td><td>'+usedata.rows[0].value.Procedure.toString()+'</td></tr>';
          // tempstring += '<tr><td class="theme-color">Medication</td><td>'+usedata.rows[0].value.Medication.toString()+'</td></tr>';
          // tempstring += '<tr><td class="theme-color">Condition</td><td>'+usedata.rows[0].value.Condition.toString()+'</td></tr>';
          // tempstring += '<tr><td class="theme-color">Allergies</td><td>'+usedata.rows[0].value.Allergies.toString()+'</td></tr></tbody>';
        // }else{
        //  console.log("Multiple users with same user id.");
        // }      
    //  },
    //  error:function(data,error,reason){
    //    console.log(reason);
    //  },
    //  key:[userinfo.user_id,1]
    // });
  }else if(data.response == "biometrics"){
    tempstring += '<table class="table myborder">';
    if(data.values){
      for(var bi = 0;bi<data.values.length;bi++){
      	if(bi%2 == 0){
      		tempstring += '<tr><td class="bieven">'+data.values[bi].biometrics_key+'</td><td class="bieven">'+data.values[bi].biometrics_value+'</td></tr>';
      	}else{
      		tempstring += '<tr><td>'+data.values[bi].biometrics_key+'</td><td>'+data.values[bi].biometrics_value+'</td></tr>';	
      	}
      }
      tempstring += '</table>';
    }
  }else{
    tempstring = '<tr><td>';
    if(data.values){
      for(var l=0; l<data.values.length;l++){
        if(l>0){
          tempstring += ',';
        }
        tempstring += data.values[l];
      }   
      tempstring += '</td></tr>';
    }
  }
  return tempstring;
}

function getObjectiveDetailsList(selector) {
  $.couch.db(db).view("tamsa/getObjectiveDetailsList", {
    success: function(data) {
      for (var i = 0; i < data.rows.length; i++) {
        $('#'+selector).find(".charting-template-objective-response").find('ul[field_name = "'+data.rows[i].key[1]+'"]').append('<li>'+data.rows[i].key[2]+'</li>').animate('slow');
      };
    },
    error:function(data,error,reason){
    	newAlert("danger",reason);
    	$("html, body").animate({scrollTop: 0}, 'slow');
    	return false;
    },
    startkey: [userinfo.user_id],
    endkey: [userinfo.user_id, {}, {}],
    reduce : true,
    group : true
  });
}

function getObjectivePriorChoices($obj){
	if($obj.hasClass("label-default")){
	  $obj.removeClass("label-default").addClass("label-warning");
	}
	$obj.parent().find(".normal-btn-soapnote").removeClass("label-warning").addClass("label-default");
	var section_name = $obj.parent().find(".objective-field-name").html();
	$.couch.db(db).view("tamsa/getObjectivePriorChoices",{
	  success:function(data){
	  	if(data.rows.length > 0){
	  		for(var i=0;i<data.rows[0].value.length;i++){
	  			var tmp_choice = data.rows[0].value[i].toUpperCase();
	  			$obj.parent().parent().find(".choicelist").find("input[value='"+tmp_choice+"']").prop("checked",true);	
	  		}
	  	}else{
	  		console.log("debug :: in else");	
	  	}
	  	getObjectivePriorDetails($obj,section_name);
	  },
	  error:function(data,error,reason){
	  	newAlert('danger',reason);
	  	$('html, body').animate({scrollTop: 0}, 'slow');
	  	return false;
	  },
	  descending:true,
	  startkey: [pd_data._id,userinfo.user_id,section_name,0,{}],
	  endkey: [pd_data._id,userinfo.user_id,section_name,0],
	  limit:1
	});
}

function getObjectivePriorDetails($obj,section_name){
	$.couch.db(db).view("tamsa/getObjectivePriorChoices",{
	  success:function(data){
	  	if(data.rows.length > 0){
	  		for(var i=0;i<data.rows[0].value.length;i++){
	  			$obj.parent().parent().find(".complaints ul").append("<li>"+data.rows[0].value[i]+"</li>");
		  		removeRecentDetails($obj,data.rows[0].value[i]);
	  		}
	  	}else{
	  		console.log("debug :: in else");	
	  	}
	  },
	  error:function(data,error,reason){
	  	newAlert('danger',reason);
	  	$('html, body').animate({scrollTop: 0}, 'slow');
	  	return false;
	  },
	  descending:true,
	  startkey: [pd_data._id,userinfo.user_id,section_name,1,{}],
	  endkey: [pd_data._id,userinfo.user_id,section_name,1],
	  limit:1
	});
}

function removeRecentDetails($obj,detailval){
	$obj.parent().parent().find(".charting-source li").each(function(){
		if($(this).html() == detailval){
			$(this).remove();
		}
	});
}

function getObjectiveNormalChoices($obj){
	if($obj.hasClass("label-default")){
	  $obj.removeClass("label-default").addClass("label-warning");
	}
	$obj.parent().find(".prior-btn-soapnote").removeClass("label-warning").addClass("label-default");
	$obj.parent().parent().find(".choicelist").find("input").prop("checked",false);
	resetRecentDetails($obj);
}

function resetRecentDetails($obj){
	$obj.parent().parent().find(".charting-target li").each(function(){
		$obj.parent().parent().find(".charting-source").append("<li>"+$(this).html()+"</li>")
		$(this).remove();
	});
}

function openDCChartingTemplate(current_doc_id){
	// $("#search_charting_template_tab").show();
	$("#dc_template_list").hide();
	$("#dc_copy").attr("index",current_doc_id);
	$.couch.db(db).openDoc(current_doc_id, {
	  success: function(data) {
	  	$.couch.db(db).openDoc("soapnote_charting_template", {
	  	  success:function(maindata){
  	  	  $("#selected_dc_charting_template_name").html(data.template_name);
  	  	  var dc_ctemplate_activity_data = '';

  	  	  for (var i = 0; i < data.sections.length; i++) {
  	  	  	dc_ctemplate_activity_data += '<div class="dc-ctemplate-display-sectionlist"><div class = "ctemplate-display-section-parent"><span class = "dc-ctemplate-display-section-name">'+data.sections[i].s_name+'</span><span class="glyphicon glyphicon-minus-sign dc-ctemplate-display-toggle-section"></span></div><div class="ctemplate-display-fieldlist-parent">';
  	  	    for(var j=0;j<data.sections[i].fields.length; j++){
  	  	      dc_ctemplate_activity_data +='<div class="dc-ctemplate-display-fieldlist"><div class="dc-ctemplate-display-fieldname">'+data.sections[i].fields[j].f_name+'</div><div class="ctemplate-display-responselist">';
  	  	      for(var k=0;k<data.sections[i].fields[j].response_format_pair.length; k++){
  	  	        dc_ctemplate_activity_data += generateChartingTemplateResponse(data.sections[i].fields[j].response_format_pair[k],maindata);
  	  	      }
  	  	      dc_ctemplate_activity_data += '</div></div>';
  	  	    }
  	  	    dc_ctemplate_activity_data += '</div></div>';
  	  	  }

  	  	  $("#dc_charting_template_activity_list").html(dc_ctemplate_activity_data);
  	  	  enableSoapNoteDragDrop();
	  	  },
	  	  error: function(data, error, reason) {
	  	    newAlert('error', reason);
	  	    $('html, body').animate({scrollTop: 0}, 'slow');
	  	  } 
		  });
		},
    error: function(data, error, reason) {
			newAlert('error', reason);
			$('html, body').animate({scrollTop: 0}, 'slow');
    }
	});
}

function copyDCChartingTemplate(docid){
	$(".tab-pane").removeClass("active");
	$("#new_charting_template").addClass("active");
	getAllExistingSpecializationList("new_charting_specialization_name");
	editChartingTemplate(docid);
}

function generateUniqueTemplateName(){
	var d = new Date();
	var m = new Number(d.getMonth()) + 1;

	Date.prototype.getMonthName = function() {
	   return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][this.getMonth()]; 
	}

	return d.getDate()+"_"+d.getMonthName()+"_"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
}

function clearChartingTemplatesVitalSings(){
	$("#ct_diastolic_bp").val("");
	$("#ct_systolic_bp").val("");
	$("#ct_heartrate").val("");
	$("#ct_O2").val("");
	$("#ct_respiration_rate").val("");
	$("#ct_Fasting_Glucose").val("");
	// $("#ct_Value_weight").val("");
	$("#ct_OutOfRange").val("No");
	$("#ct_bmi_height, #ct_bmi_weight, #ct_bmi_value").val("");	
	$("#ct_map_value, #ct_temp, #ct_waist").val("");
}

function saveBiometricsAndMedicalHistory(data){
	// var $eleparent = $("div").find("[restype='biometrics']");
	$.couch.db(db).view("tamsa/testPatientsInfo",{
		success:function(meddata){
			// if($eleparent.length > 0){
			// 	if($eleparent.find("[bio-name='procedure']").length > 0){
			// 		meddata.Procedure = $eleparent.find("[bio-name='procedure']").val().split(",");
			// 	}
			// 	if($eleparent.find("[bio-name='condition']").length > 0){
			// 		meddata.Condition = $eleparent.find("[bio-name='condition']").val().split(",");
			// 	}
			// 	if($eleparent.find("[bio-name='medication']").length > 0){
			// 		meddata.Medication = $eleparent.find("[bio-name='medication']").val().split(",");
			// 	}
			// 	if($eleparent.find("[bio-name='allergies']").length > 0){
			// 		meddata.Allergies = $eleparent.find("[bio-name='allergies']").val().split(",");
			// 	}
			// 	if($("#ct_bmi_height").val().trim()){
			// 		meddata.height = $("#ct_bmi_height").val();
			// 	}
   //      if($("#ct_bmi_weight").val().trim()){
   //      	meddata.weight = $("#ct_bmi_weight").val();
   //      }
			// 	$.couch.db(db).saveDoc(meddata,{
			// 		success:function(data){
			// 			$.couch.db(db).openDoc(data.id,{
			// 				success:function(fdata){
			// 					userinfo_medical = fdata;
			// 				},
			// 				error:function(data,error,reason){
			// 					newAlert('danger',reason);
			// 					$('html, body').animate({scrollTop: 0}, 'slow');
			// 					return false;
			// 				}
			// 			});
			// 			userinfo.medical = meddata
			// 		},
			// 		error:function(data,error,reason){
			// 			newAlert('danger',reason);
			// 			$('html, body').animate({scrollTop: 0}, 'slow');
			// 			return false;
			// 		}
			// 	});
			// }
			if(meddata.rows.length > 0){
				userinfo_medical = meddata.rows[0].value;	
			}
			
		},
		error:function(data,error,reason){
			newAlert('danger',reason);
			$('html, body').animate({scrollTop: 0}, 'slow');
			return false;
		},
		key:userinfo.user_id
	});
}

function updateMedicationWithChartNote(docids,chartnote_id) {
	for(var i=0;i<docids.length;i++){
		$.couch.db(db).openDoc(docids[i].id, {
			success:function(data) {
				saveUpdatedMedicationWithChartingID(data,chartnote_id);
			},
			error:function(data,error,reason) {
				newAlert("danger",reason);
				$("html, body").animate({scrollTop: 0}, 'slow');
				return false;
			}
		});
	}
}

function saveUpdatedMedicationWithChartingID(data,chartnote_id) {
	var newdata = data;
	newdata.medication_chart_note = chartnote_id;
	$.couch.db(db).saveDoc(newdata, {
		error:function(data,error,reason){
			newAlert("danger",reason);
			$("html, body").animate({scrollTop: 0}, 'slow');
			return false;
		}
	});
}

function printPatientChartingTemplate($obj) {
	$.couch.db(db).openDoc($obj.attr("doc_id"), {
	  success:function(data) {
	    var d               = new Date();
	    var vital_active    = data.vital_signs_active;

	    var patient_charting_template_doc = {
	      doctor_id:                  pd_data._id,
	      dhp_code:                   pd_data.dhp_code,
	      practice_code:              pd_data.random_code,
	     	doctor_name:                pd_data.first_name+" "+pd_data.first_name,
	      template_name:              data.template_name,
	      doctype:                    "patient_charting_template",
	      update_ts:                  d,
	      publish:                    data.publish,
	      specialization:             data.specialization,
	      user_id:                    userinfo.user_id,
	      visit_type:                 $("#ct_visit_type").val(),
	      sections:                   cTemplateSaveFieldArray($("#choose_charting_template_list")),
	      // chief_complaint:            $("#soapnote_chief_complaint").val().trim(),
	      history_of_present_illness: $("#soapnote_history_of_present_illness").val().trim(),
	      patient_first_name:         userinfo.first_nm, 
	      patient_last_name:          userinfo.last_nm,
	      finalize:                   "Yes"
	    };
	    
	    if(vital_active == "Yes"){
	      var selfcare_doc = {
	        Fasting_Glucose:    $("#ct_Fasting_Glucose").val(),
	        HeartRate:          $("#ct_heartrate").val(),
	        O2:                 $("#ct_O2").val(),
	        OutOfRange:         $("#ct_OutOfRange").val(),
	        Respiration_Rate:   $("#ct_respiration_rate").val(),
	        Time_BP:            "Time",
	        Time_Fasting:       "Time",
	        Time_HeartRate:     "Time",
	        Time_Oxygen:        "Time",
	        Time_Respiration:   "Time",
	        Time_Weight:        "Time",
	        Value_Diastolic_BP: $("#ct_diastolic_bp").val(),
	        Value_Systolic_BP:  $("#ct_systolic_bp").val(),
	        Value_MAP:          calculateMAP(Number($("#ct_systolic_bp").val()),Number($("#ct_diastolic_bp").val())),
	        Value_temp:         $("#ct_temp").val(),
	        // Value_weight:    $("#ct_Value_weight").val(),
	        Value_weight:       $("#ct_bmi_weight").val(),
	        height:             $("#ct_bmi_height").val(),
	        bmi:                $("#ct_bmi_value").val(),
	        waist:              $("#ct_waist").val(),
	        doctype:            "SelfCare",
	        insert_ts:          d,
	        insert_ts_int:      "",
	        user_id:            userinfo.user_id
	      };
	    }
    
    	if(vital_active == "Yes" && patient_charting_template_doc.finalize == "Yes" && ($("#ct_Fasting_Glucose").val() || $("#ct_heartrate").val() || $("#ct_O2").val() || $("#ct_temp").val() || $("#ct_respiration_rate").val() || $("#ct_diastolic_bp").val() || $("#ct_systolic_bp").val()))
    	{
    		patient_charting_template_doc.saved_vital_data = selfcare_doc;
    		if($("#save_patient_charting_template").data("meddata")) {
   	 			patient_charting_template_doc.saved_medication_data = $("#save_patient_charting_template").data("meddata");
   	 			patient_charting_template_doc.added_medications_list = $("#save_patient_charting_template").data("meddata_ids");
    		}
    	}else {
		 		if($("#save_patient_charting_template").data("meddata")) {
			 			patient_charting_template_doc.saved_medication_data = $("#save_patient_charting_template").data("meddata");
			 			patient_charting_template_doc.added_medications_list = $("#save_patient_charting_template").data("meddata_ids");
		 		}
    	}
    	generatePrintHTMLForChartingTemplate(patient_charting_template_doc);
	  },
	  error:function(data,error,reason){
	    $("#print_patient_charting_template").removeAttr("disabled");
	    newAlert('danger',error);
	    $('html, body').animate({scrollTop: 0}, 'slow');
	    return false;
	  }
	});
}

function removePartiallySavedChartingTemplate(partdata) {
	$.couch.db(db).view("tamsa/getPartiallySavedChartingTemplateDetails", {
	  success:function (data) {
	    if(data.rows.length > 0) {
	    	var remove_doc = {
	    		_id:data.rows[0].doc._id,
	    		_rev:data.rows[0].doc._rev
	    	};
	    	$.couch.db(db).removeDoc(remove_doc, {
	    		success:function(rdata) {
	    			console.log("partial doc removed.");
	    		},
	    		error:function(data,error,reason){
	    			newAlert("danger",reason);
	    			$("html, body").animate({scrollTop: 0}, 'slow');
	    			return false;
	    		}
	    	});
	    }else {
	    }
	  },
	  error:function(data,error,reason){
	    newAlert("danger",reason);
	    $("html, body").animate({scrollTop: 0}, 'slow');
	    return false;
	  },
	  key:[partdata.dhp_code,partdata.user_id,partdata.template_name,partdata.specialization],
	  include_docs:true
	});
}

function toggleSearchLabel(labelid){
	if(labelid == "ct_click_toggle"){
		if($("#ct_clk_toggle_lbl").html() == "Specialization"){
		  $("#search_practise_charting_template").hide().val("");
		  $("#search_practise_specialization").show().val();
		  $("#ct_clk_toggle_lbl").html("Template name");
		}else{
		  $("#search_practise_charting_template").show().val();
		  $("#search_practise_specialization").hide();
		  $("#ct_clk_toggle_lbl").html("Specialization");
		}
	}else{
		if($("#ct_community_clk_toggle_lbl").html() == "Specialization"){
		  $("#search_community_charting_template").hide().val("");
		  $("#search_community_specialization").show().val();
		  $("#ct_community_clk_toggle_lbl").html("Template name");
		}else{
		  $("#search_community_charting_template").show().val();
		  $("#search_community_specialization").hide();
		  $("#ct_community_clk_toggle_lbl").html("Specialization");
		}
	}
}

function DisplayRecentValuesForChartingTemplateFields($obj){
	$obj.attr("disabled","disabled");
	if($obj.html() == "Show Recent Value"){
	  var recent_value_arr = [];
	  recent_value_arr.push('<table class="table tbl-border recent-values-table" style="margin-top: 5px;"><thead><tr><th>Recent Value</th><th>Updated Date</th></tr></thead><tbody>');
	  $.couch.db(db).openDoc($("#selected_charting_template_name").data("docid"),{
	    success:function(template_data){
	      $.couch.db(db).view("tamsa/getPatientChartingTemplate",{
	        success:function(data){
	          if(data.rows.length > 0){
	            var sname = $obj.attr("sname");
	            var fname = $obj.attr("fname");
	            var resname = $obj.attr("resname");
	            for(var ad=0;ad<data.rows.length;ad++){
	              for(var i=0;i<data.rows[ad].value.sections.length;i++){
	                if(data.rows[ad].value.sections[i].section_name == sname){
	                  for(var j=0;j<data.rows[ad].value.sections[i].fields.length;j++){
	                    if(data.rows[ad].value.sections[i].fields[j].field_name == fname){
	                      for(var k=0;k<data.rows[ad].value.sections[i].fields[j].response_format_pair.length;k++){
	                        if(data.rows[ad].value.sections[i].fields[j].response_format_pair[k].response=="Text" && resname=="Text" && data.rows[ad].value.sections[i].fields[j].response_format_pair[k].values != ""){
	                          recent_value_arr.push('<tr><td>');
	                          recent_value_arr.push(data.rows[ad].value.sections[i].fields[j].response_format_pair[k].values);
	                          recent_value_arr.push('</td><td>');
	                          recent_value_arr.push(data.rows[ad].value.update_ts.substr(0, 10) + " " + data.rows[ad].value.update_ts.substr(11,8));
	                          recent_value_arr.push('</td></tr>');
	                        }else if(data.rows[ad].value.sections[i].fields[j].response_format_pair[k].response == "paragraph" && resname == "paragraph" && data.rows[ad].value.sections[i].fields[j].response_format_pair[k].values != ""){
	                        	
		                          recent_value_arr.push('<tr><td>');
		                          recent_value_arr.push(data.rows[ad].value.sections[i].fields[j].response_format_pair[k].values);
		                          recent_value_arr.push('</td><td>');
		                          recent_value_arr.push(data.rows[ad].value.update_ts.substr(0, 10) + " " + data.rows[ad].value.update_ts.substr(11,8));
		                          recent_value_arr.push('</td></tr>');
	                        }else if(data.rows[ad].value.sections[i].fields[j].response_format_pair[k].response == "table" && resname=="table"){
	                          recent_value_arr.push('<tr><td>');
	                          //console.log(data.rows[ad].value.sections[i].fields[j].response_format_pair[k].values);
	                          //recent_value_arr.push(data.rows[ad].value.sections[i].fields[j].response_format_pair[k].values);
	                          recent_value_arr.push(displayRecentValueForTableInChartingTemplate(data.rows[ad].value.sections[i].fields[j].response_format_pair[k].values[0]));
	                          recent_value_arr.push('</td><td>');
	                          recent_value_arr.push(data.rows[ad].value.update_ts.substr(0, 10) + " " + data.rows[ad].value.update_ts.substr(11,8));
	                          recent_value_arr.push('</td></tr>');
	                        }else if(data.rows[ad].value.sections[i].fields[j].response_format_pair[k].response == "multiple" && resname=="multiple" && (data.rows[ad].value.sections[i].fields[j].response_format_pair[k].values.length > 0)){
	                        	recent_value_arr.push('<tr><td>');
	                          recent_value_arr.push(data.rows[ad].value.sections[i].fields[j].response_format_pair[k].values.join());
	                          recent_value_arr.push('</td><td>');
	                          recent_value_arr.push(data.rows[ad].value.update_ts.substr(0, 10) + " " + data.rows[ad].value.update_ts.substr(11,8));
	                          recent_value_arr.push('</td></tr>');

	                        }else if(data.rows[ad].value.sections[i].fields[j].response_format_pair[k].response == "combobox" && resname=="combobox" && (data.rows[ad].value.sections[i].fields[j].response_format_pair[k].values.length > 0)){
	                        	recent_value_arr.push('<tr><td>');
	                          recent_value_arr.push(data.rows[ad].value.sections[i].fields[j].response_format_pair[k].values.join());
	                          recent_value_arr.push('</td><td>');
	                          recent_value_arr.push(data.rows[ad].value.update_ts.substr(0, 10) + " " + data.rows[ad].value.update_ts.substr(11,8));
	                          recent_value_arr.push('</td></tr>');

	                        }
	                      }
	                    }
	                  } 
	                }
	              }
	            }
	          }else{
	            recent_value_arr.push('<tr><td colspan = "2">No Recent Value Found.</td></tr>');
	          }
	          recent_value_arr.push('</tbody></table>');
	          $obj.parent().append(recent_value_arr.join(''));
	          $obj.removeAttr("disabled");
	        },
	        error:function(data,error,reason){
	          newAlert("danger",reason);
	        },
	        descending: true,
	        startkey:   [userinfo.user_id,template_data.template_name,template_data.specialization,{}],
	        endkey:     [userinfo.user_id,template_data.template_name,template_data.specialization]
	      });
	      $obj.html("Hide Recent Value");          
	    },
	    error:function(data,error,reason){
			newAlert('danger', reason);
			$('html, body').animate({scrollTop: 0}, 'slow');
			return false;
		}
	  });
	}else{
	  $obj.html("Show Recent Value");
	  $obj.parent().find(".recent-values-table").remove();
	}
}

function displayRecentValueForTableInChartingTemplate(recentData){
	retstring = '<table class = "table tbl-border">';

	if(recentData.table_head.length > 0){
		retstring += '<thead>';
		if(recentData.table_rows.length > 0){
			retstring += '<th></th>';
		}
		for(var th=0; th<recentData.table_head.length; th++){
			retstring += '<th>'+recentData.table_head[th]+'</th>';	
		}	
			retstring += '</thead>';
	}
	retstring += '<tbody>';
		if(recentData.table_rows.length > 0){
			for(var rh=0;rh<recentData.table_rows.length;rh++){
				retstring += '<tr><td>'+recentData.table_rows[rh]+'</td>';
				if(recentData.table_head.length > 0){
					//table with row and column header
					for(var tc=0; tc<recentData.table_head.length; tc++){
						retstring += '<td>'+recentData.table_data[rh][tc]+'</td>';
					}
				}else{
					retstring += '<td>'+recentData.table_data[rh][0]+'</td>';
				}
				if(recentData.table_head.length > 0 && recentData.table_rows.length == 0){
					retstring += '<td><span class="label label-warning pointer">Delete</span></td>';
				}
				retstring += '</tr>';
			}
		}else{
				if(recentData.table_head.length > 0){
				retstring += '<tr>';
					//table with row and column header
					for(var td=0;td<recentData.table_data.length;td++){
						for(var tc=0; tc<recentData.table_head.length; tc++){
							retstring += '<td>'+recentData.table_data[td][tc]+'</td>';
						}
						retstring += '</tr>';
					}
				}
		}

		retstring +='</tbody></table>';
		return retstring;
}

function generateConsultantListInCharting(){
	$("#charting_templates_summary .doctor-details-at-charting").html("");
	$.couch.db(db).view("tamsa/getChartingTemplateByDoctorId",{
		success:function(data){
			if(data.rows.length > 0){
				generateChartingSummaryArray(data);
			}else{
				$("#charting_templates_summary .doctor-details-at-charting").html("<tr><td colspan='4'>No Records are found.</td></tr>");
			}
		},
		error:function(data,error,reason){
			newAlert('danger', reason);
			$('html, body').animate({scrollTop: 0}, 'slow');
			return false;
		},
		startkey:[pd_data.dhp_code],
		endkey:[pd_data.dhp_code,{},{},{}],
		reduce:true,
		group:true
	});	
}

function generateChartingSummaryArray(data){
	var charting_array = {} ;
	for(var i=0;i<data.rows.length;i++){
		if(data.rows[i].key[3] != pd_data._id){
			if(charting_array[data.rows[i].key[1]+"|"+data.rows[i].key[2]] == undefined){
				// charting_array.push(data.rows[i].key[1]+"|"+data.rows[i].key[2]);
				charting_array[data.rows[i].key[1]+"|"+data.rows[i].key[2]] = [];
				charting_array[data.rows[i].key[1]+"|"+data.rows[i].key[2]].push({
					doctor_id:data.rows[i].key[3]
				});
			}else{
				charting_array[data.rows[i].key[1]+"|"+data.rows[i].key[2]].push({
					doctor_id:data.rows[i].key[3]
				});
			}
		}
	}
	for(var x in charting_array){
		getDoctorDetailsForCharting(x,charting_array);
	}	
	chartingTemplateDoctorListSummary();
}

function getDoctorDetailsForCharting(index,summary){
	var consultant_in_charting_data= [];
	consultant_in_charting_data.push('<tr class="charting-template-doctor-list-summary-parent"><td class="template-name">'+index.split("|")[0]+'</td><td class="specialization-name">'+index.split("|")[1]+'</td><td><table class="table tbl-border"><thead><tr><th>Name</th><th>Practice Code</th><th>Email</th><th>Phone</th></tr></thead><tbody>');
	for(var k=0;k<summary[index].length;k++){
		consultant_in_charting_data.push('<tr class="charting-template-doctor-list-summary" index="'+summary[index][k].doctor_id+'"></tr>');
	}
	consultant_in_charting_data.push('</tbody></table><td class="last-access-doctor-details"></td></tr>');
	$("#charting_templates_summary .doctor-details-at-charting").append(consultant_in_charting_data.join(''));
}

function chartingTemplateDoctorListSummary(){
	$(".charting-template-doctor-list-summary").each(function(){
		var $obj = $(this);
		$.couch.db(replicated_db).openDoc($obj.attr("index"),{
			success:function(data){
				getTempDoctorDetails($obj,data);
			},
			error:function(data,error,reason){
				newAlert('danger', reason);
				$('html, body').animate({scrollTop: 0}, 'slow');
				return false;
			},
		});	
	});
	$(".charting-template-doctor-list-summary-parent").each(function(){
		var $obj = $(this).find(".last-access-doctor-details");
		getRecentlyAccessedConsultantName($(this).find(".template-name").text(),$(this).find(".specialization-name").text(),0,$obj);
	});
}

function getTempDoctorDetails($obj,data){
	var temp_charting_data = [];
	temp_charting_data.push('<td>'+data.first_name+' '+data.last_name+'</td><td>'+data.random_code+'</td><td>'+data.email+'</td><td>'+data.phone+'</td>');
	$obj.html(temp_charting_data.join(''));	
}

function getRecentlyAccessedConsultantName(template_name,specialization,skip,$ele){
	$.couch.db(db).view("tamsa/getAllChartingTemplateRecentlyAccessedByDoctor",{
		success:function(data){
			if(data.rows.length > 0){
				if(data.rows[0].doc.doctor_id == pd_data._id){
					getRecentlyAccessedConsultantName(template_name,specialization,skip+1,$ele);
				}else{
					var update_time = moment(data.rows[0].doc.update_ts).format("YYYY-MM-DD hh:mm a");
					$.couch.db(replicated_db).openDoc(data.rows[0].doc.doctor_id,{
						success:function(data){
							var email = data.alert_email ? data.alert_email:data.email;
							var phone = data.alert_phone ? data.alert_phone:data.phone;

							$ele.html('<table class="table"><tr><td>'+data.first_name+' '+data.last_name+'</td><td>'+update_time+'</td></tr></table>');
						},
						error:function(data,error,reason){
							newAlert('danger', reason);
							$('html, body').animate({scrollTop: 0}, 'slow');
							return false;				
						}
					});
				}
			}
		},
		error:function(data,error,reason){
			newAlert('danger', reason);
			$('html, body').animate({scrollTop: 0}, 'slow');
			return false;
		},
		startkey:[pd_data.dhp_code,template_name,specialization,{}],
		endkey:[pd_data.dhp_code,template_name,specialization],
		descending:true,
		limit:1,
		skip:skip,
		include_docs:true
	});
}

function showhideVitalsTable(){
	$('#vital_sign_table tbody').slideToggle('slow');
	if($('.vitalsplus_minus').hasClass('glyphicon-plus-sign')){
	  $('.vitalsplus_minus').addClass('glyphicon-minus-sign');
	  $('.vitalsplus_minus').removeClass('glyphicon-plus-sign');
	}else{
	  $('#vital_sign_table tbody').slideUp('slow');
	  $('.vitalsplus_minus').removeClass('glyphicon-minus-sign');
	  $('.vitalsplus_minus').addClass('glyphicon-plus-sign');
	}
}

var cnt_for_medication = 0;
function showhideMedication(){
	cnt_for_medication=cnt_for_medication+1;
  if(cnt_for_medication%2 == 0){
  	$('.show-ct-records').slideDown('slow');
    $('.ctemplate_medication').addClass('glyphicon-minus-sign');
    $('.ctemplate_medication').removeClass('glyphicon-plus-sign');
  }else{
    $('.show-ct-records').slideUp('slow');
    $('.ctemplate_medication').removeClass('glyphicon-minus-sign');
    $('.ctemplate_medication').addClass('glyphicon-plus-sign');
  }
}

var cnt_for_medicalinfo = 0;
var cnt_for_laborder = 0;

function showhideMedicalinfo(){
 	cnt_for_medicalinfo=cnt_for_medicalinfo+1;
  if(cnt_for_medicalinfo%2 == 0){
    $('#medicalinfo').slideDown('slow');
    $('.medicalinfo_show').addClass('glyphicon-minus-sign');
    $('.medicalinfo_show').removeClass('glyphicon-plus-sign');
  }else{
    $('#medicalinfo').slideUp('slow');
    $('.medicalinfo_show').removeClass('glyphicon-minus-sign');
    $('.medicalinfo_show').addClass('glyphicon-plus-sign');
  }
}

function showhideReferredInfo(){
 	cnt_for_medicalinfo=cnt_for_medicalinfo+1;
  if(cnt_for_medicalinfo%2 == 0){
    $('#referred_info').slideDown('slow');
    $('.referred_info_show').addClass('glyphicon-minus-sign');
    $('.referred_info_show').removeClass('glyphicon-plus-sign');
  }else{
    $('#referred_info').slideUp('slow');
    $('.referred_info_show').removeClass('glyphicon-minus-sign');
    $('.referred_info_show').addClass('glyphicon-plus-sign');
  }
}

function showhideLaborder(){
 	cnt_for_laborder=cnt_for_laborder+1;
  if(cnt_for_laborder%2 == 0){
    $('#view_orders_table_charting_parent').slideDown('slow');
    $('.ctemplate_laborder').addClass('glyphicon-minus-sign');
    $('.ctemplate_laborder').removeClass('glyphicon-plus-sign');
  }else{
    $('#view_orders_table_charting_parent').slideUp('slow');
    $('.ctemplate_laborder').removeClass('glyphicon-minus-sign');
    $('.ctemplate_laborder').addClass('glyphicon-plus-sign');
  }
}

function displayChartingCareplan(start,end,data){
  var past_medication_tbody = [];
  for (var i = start; i < end; i++){
    past_medication_tbody.push("<tr>");
		past_medication_tbody.push("<td>"+ moment(data.rows[i].doc.insert_ts).format('DD-MM-YYYY')+"</td>");
		past_medication_tbody.push("<td>Dr. "+data.rows[i].doc.User_firstname+" "+data.rows[i].doc.User_lastname+"</td>");
		past_medication_tbody.push("<td>Dr. "+data.rows[i].doc.sender_doctor+"</td>");
		past_medication_tbody.push("<td>"+data.rows[i].doc.referral_introduction+"</td><td>"+data.rows[i].doc.referral_chart_notes+"</td>");
		past_medication_tbody.push("</tr>");
  };
  $("#charting_referal").html(past_medication_tbody.join(''));
}

function displayChartingLab(start,end,data){
  var past_medication_tbody = [];
  for (var i=start;i<end;i++){
  	 past_medication_tbody.push("<tr>");
  	if(data.rows[i].doc.doctype == "Anual_Exam"){
      past_medication_tbody.push("<td>"+data.rows[i].id+">"+data.rows[i].doc.Exam_Name+"</td>");
    }else{
      past_medication_tbody.push("<td>"+data.rows[i].doc.document_name+"</td>");
    }
    past_medication_tbody.push("</tr>");
  };
  $("#charting_lab").html(past_medication_tbody.join(''));
}

function refreshDCTemplateList(id){
	$.couch.db(db).view("tamsa/getTemplatesFromSpecialization", {
		success: function(data) {
			if (data.rows.length > 0) {
		  	if(id == 'all_community_charting_templates'){	
		  		paginationConfiguration(data,"community_charting_pagination",10,getSearchedTemplate,id);
		  	}else if(id == 'doctor_community_charting_templates_list'){
		  		paginationConfiguration(data,"DC_template_pagination",10,getSearchedTemplate,id);
		  	}
		  	else{
		  		paginationConfiguration(data,"my_practise_charting_pagination",10,getSearchedTemplate,id);
		  	}
			}
		},
		error: function(status) {
		  console.log(status);
		},
		startkey:  [pd_data._id,"Yes"],
		endkey:    [pd_data._id,"Yes",{}],
		reduce: false,
		group:  false,
	});
}

function getChartingTemplatesBySelection($obj){
	var selected_section_name = $obj.val();
    $('.ctemplate-display-section-name').each(function(){
      if($obj.attr('current_section') == selected_section_name){
        $obj.parent().parent().show();
      }else{
        $obj.parent().parent().hide();
      }
    });
}

function displayChartingTemplate(current_doc_id,tamsaFactories,template_name,specialization_name){
	tamsaFactories.blockScreen("Please wait...");
	$("#templatecommunity").hide();
	$("#charting_section_selection ul").find("li").remove();
	$("#dc_copy").attr("index",current_doc_id);

	if($("#dc_charting_flag").val() == "Copy"){
		$(".tab-pane").removeClass("active");
		$("#choose_charting_template_list").addClass("active");
		$("#choose_charting_template_list, #save_charting_template_tab, #dc_copy").show();
		$("#search_charting_template_tab, #update_charting_template_tab").hide();
		$("#charting_template_save_button_parent").hide();
		$('.ctemplate-common-section').show();
		$('#charting_medicalinfo, #patient_medications_charting, #view_orders_content_charting, .critical_toggle, #medicalinfo').hide();
		//$("#dc_template_list_parent").addClass("active");
	}else{
		clearChartingTemplatesVitalSings();
		getChartingAlertsCounts();
		getMedicationDetails("charting_current_medication_list", "", "charting_current_medication_pagination",displayChartingCurrentMedication,"","");
		getAnalyticsRangeForCharting(userinfo.user_id);
		getCriticalConditionStatusFromDoctorNote("charting_critical_checkbox");
		getNSmonitoring("charting_ns_monitor");
		viewLabImagingOrders('charting');
		$("#search_charting_template_tab, #update_charting_template_tab").hide();
		$("#save_charting_template_tab").show();
		$("#charting_template_save_button_parent").show();
		$('#save_charting_template_tab .ctemplate-common-section').show();
		$('#charting_medicalinfo, #patient_medications_charting, #view_orders_content_charting, .critical_toggle, #medicalinfo').show();
		$("#dc_template_list_parent").removeClass("active");
		$("#dc_template_list").hide();
		// $("#soapnote_chief_complaint").val("");
		$("#soapnote_history_of_present_illness").val("");
		$("#soapnote_pmh_procedure, #soapnote_pmh_medication, #soapnote_pmh_condition, #soapnote_pmh_allergies").val("");
		$(".soapnote-fmh-relation, .soapnote-fmh-condition").val("Select");
	}
	$.couch.db(db).view("tamsa/getPartiallySavedChartingTemplateDetails", {
	  success:function (data) {
	  	if(data.rows.length > 0) {
	  		if(data.rows[0].doc.doctor_id == pd_data._id){
	  			displayPartiallySavedChartingTemplate(data.rows[0].doc._id,tamsaFactories);
	  		}else{
	  			$.couch.db(db).view("tamsa/getChartingTemplateSettings",{
		      	success:function(chrtdata){
			        if(chrtdata.rows.length > 0){
			          if(chrtdata.rows[0].value.chartnote_checked){
			          	if($.inArray(pd_data._id,chrtdata.rows[0].value.chartnote_doctor_list) != -1){
			          		displayPartiallySavedChartingTemplate(data.rows[0].doc._id,tamsaFactories);
						    	}else{
						    		displaySelectedChartingTemplate(current_doc_id,tamsaFactories);	
						    	}
						    }else {
						      displaySelectedChartingTemplate(current_doc_id,tamsaFactories);
						    }
						  }else{
		            displaySelectedChartingTemplate(current_doc_id,tamsaFactories);
			        }
				    },
			      error:function(data,error,reason){
			        newAlert("danger",reason);
			        $('body,html').animate({scrollTop: 0}, 'slow');
			        return false;
			      },
			      key:pd_data.dhp_code,
			      include_docs:true
			    });
	  		}
	 		}else{
				displaySelectedChartingTemplate(current_doc_id,tamsaFactories);
			}
	  },
	  error:function(data,error,reason){
	    newAlert("danger",reason);
	    $("html, body").animate({scrollTop: 0}, 'slow');
	    return false;
	  },
	  key:[pd_data.dhp_code,userinfo.user_id,template_name,specialization_name],
	  include_docs:true
	});
}

function displayPartiallySavedChartingTemplate(current_doc_id,tamsaFactories){
	$.couch.db(db).openDoc(current_doc_id, {
	  success: function(data) {
	  	$.couch.db(db).view("tamsa/getPatientChartingTemplate",{
	  		success:function(priordata){
			  	$.couch.db(db).openDoc("soapnote_charting_template", {
			  	  success:function(maindata){
		  	  		if(data.vital_signs_active == "Yes") $("#vital_sign_display, #ct_vital_signs_doctor_note").show()
		  	  		else $("#vital_sign_display, #ct_vital_signs_doctor_note").hide()
		  	  		
		  	  		if(data.visit_type_active && data.visit_type_active == "Yes") $("#ct_visit_type_parent").show()
							else $("#ct_visit_type_parent").hide()

		  	  		if(data.publish == "Yes"){
		  	  			$("#dc_copy").show();
		  	  			$("#dc_publish").hide();
		  	  		}else{
		  	  			$("#dc_copy").hide();
		  	  			$("#dc_publish").show().attr("index",data._id);
		  	  		}
		  	  	  $("#selected_charting_template_name").html(data.template_name);
		  	  	  $("#selected_charting_template_name").data("docid",data._id);
		  	  	  var ctemplate_activity_data = '';
		  	  	  for (var i=0; i<data.sections.length; i++) {
		  	  	  	if(i == 0) var backcolor = "theme-background"
		  	  	  	else var backcolor = ""
		  	  	  	if(data.sections[i].s_name != "History of Presenting Illness" && data.sections[i].s_name != "Past Medical History" && data.sections[i].s_name != "Family History" && data.sections[i].s_name != "") {
		  	  	  		console.log("testing for blank fields");
		  	  	  		console.log(data.sections[i].s_name);
			  	  	  	$('#charting_section_selection').find("ul").append('<li><span section_name="'+data.sections[i].s_name+'"  class="section_link '+backcolor+'">'+data.sections[i].s_name+'</span></li>');
			  	  	  	// $('#charting_section_selection').append("<option>"+data.sections[i].s_name+"</option>");
			  	  	  	ctemplate_activity_data += '<div class="ctemplate-display-sectionlist" style="">';
			  	  	  		ctemplate_activity_data += '<div class = "ctemplate-display-section-parent">';
			  	  	  			ctemplate_activity_data += '<span class="ctemplate-display-section-name" current_section="'+data.sections[i].s_name.trim()+'">'+data.sections[i].s_name.trim()+'</span>';
		  	  	  			ctemplate_activity_data += '</div>';
	  	  	  				ctemplate_activity_data += '<div class="ctemplate-display-fieldlist-parent">';
					  	  	    for(var j=0;j<data.sections[i].fields.length; j++){
					  	  	      ctemplate_activity_data +='<div class="ctemplate-display-fieldlist">';
					  	  	      	ctemplate_activity_data +='<div class="ctemplate-display-fieldname">'+data.sections[i].fields[j].f_name+'</div>';
					  	  	      	ctemplate_activity_data +='<div class="ctemplate-display-responselist">';
					  	  	      	for(var k=0;k<data.sections[i].fields[j].response_format_pair.length; k++){
					  	  	        	ctemplate_activity_data += generatePartialChartingTemplateResponse(data.sections[i].fields[j].response_format_pair[k],maindata,priordata,data.sections[i].s_name,data.sections[i].fields[j].f_name);
					  	  	      	}
					  	  	      	ctemplate_activity_data += '</div>';
				  	  	      	ctemplate_activity_data += '</div>';
					  	  	    }
			  	  	    	ctemplate_activity_data += '</div>';
		  	  	    	ctemplate_activity_data += '</div>';
		  	  	  	}
	  	  	  	}
	  	  	  	ctemplate_activity_data += generateCommonSectionsForChartingTemplates();
		  	  	  $("#charting_template_activity_list").html(ctemplate_activity_data);
	  	  	    getProcedureList("soapnote_pmh_procedure");
	  	  	    getConditionList("soapnote_pmh_condition");
	  	  	    getPastMedicationHistory("soapnote_pmh_medication");
		  	  	  getPastAllegies("charting_current_allergies_list");
		  	  	  getPastFamilyMedicalHistory("soapnote_fmh_parent","soapnote-fmh-parent","soapnote-fmh-relation","soapnote-fmh-condition","add-more-fmh-in-soapnote");
		  	  	  $('#charting_section_selection').find("ul").append('<li><span section_name="History of Presenting Illness" class="section_link">History of Presenting Illness</span></li><li><span section_name="Past Medical History" class="section_link">Past Medical History</span></li><li><span section_name="Family History" class="section_link">Family History</span></li>');
		  	  	  generateScrollPositionForAllSections()
		  	  	  generateSectionScrollForChartingTemplates();
		  	  	  // $('#charting_section_selection').append("<option>History of Presenting Illness</option><option>Past Medical History</option><option>Family History</option>");
		  	  	  // $('#charting_section_selection').append("<option>Chief Complaint</option><option>History of Presenting Illness</option><option>Past Medical History</option><option>Family History</option>");
		  	  	  $("#charting_template_save_button_parent").html('<div class="col-lg-12 col-sm-12 text-center mrgtop2"><button id="partial_save_patient_charting_template" doc_id="'+current_doc_id+'" class="btn btn-warning btnwidth mrgright1" type="button">Save</button><button type="button" class="btn btn-warning btnwidth mrgright1" id="print_patient_charting_template" doc_id="'+current_doc_id+'" doc_rev="" title="Print ChartNote">Print</button><button type="button" class="btn btn-warning btnwidth" id="save_patient_charting_template" doc_id="'+current_doc_id+'" doc_rev="" title="Save and finalize Charting Template">Save & Finalize</button></div>');
		  	  	  $(".ctemplate-display-combobox").multiselect({
		  	  	  	selectedList: 8,
		  	  	  	noneSelectedText: "Select Multiple"
		  	  	  });
		  	  	  $(".ctemplate-display-multiple").multiselect({
		  	  	  	multiple:false,
		  	  	  	selectedList: 1,
		  	  	  	header: "Select Single",
		  	  	  	noneSelectedText: "Select Single"
		  	  	  });
		  	  	  if(data.saved_medication_data && data.saved_medication_data.length > 0 ) {
		  	  	  	$("#save_patient_charting_template").data("meddata",data.saved_medication_data);
		  	  	  }
		  	  	  if(data.added_medications_list && data.added_medications_list.length > 0 ) {
		  	  	  	$("#save_patient_charting_template").data("meddata_ids",data.added_medications_list);
		  	  	  }
		  	  	  getPatientComplaints("charting-source-complaint");
		  	  	  getPatientDiagnoses("charting-source-diagnosis");
		  	  	  getObjectiveDetailsList("charting_template_activity_list");
		  	  	  getChartingTemplateObjectiveDetails();
		  	  	  getChartingTemplatePlans();
		  	  	  enableSoapNoteDragDrop();
		  	  	  setImagesForAnnotation(data);
		  	  	  setPartialValuesForCharting(data);
		  	  	  tamsaFactories.unblockScreen();
			  	  },
			  	  error:function(data,error,reason){
			  	   	newAlert("danger",reason);
			  	   	$("html, body").animate({scrollTop: 0}, 'slow');
			  	   	return false;
		  	    } 
				  });
	  		},
	  		error:function(data,error,reason){
	  			newAlert("danger",reason);
	  			$("html, body").animate({scrollTop: 0}, 'slow');
	  			return false;
	  		},
	  		descending: true,
	  		startkey:   [userinfo.user_id,data.template_name,data.specialization,{}],
	  		endkey:     [userinfo.user_id,data.template_name,data.specialization],
	  		limit:      1
	  	});
		},
    error:function(data,error,reason){
    	newAlert("danger",reason);
    	$("html, body").animate({scrollTop: 0}, 'slow');
    	return false;
    }
	});
}

function generateCommonSectionsForChartingTemplates() {
	var temp_ctemplate_activity_data = "";
	temp_ctemplate_activity_data+='<div class="ctemplate-display-sectionlist">';
   	temp_ctemplate_activity_data += '<div class="common-display-section-parent"><span class="ctemplate-display-section-name" current_section="History of Presenting Illness">History of Presenting Illness</span></div>';
   	temp_ctemplate_activity_data += '<div class="ctemplate-display-fieldlist-parent row">';
     	temp_ctemplate_activity_data += '<div id="soapnote_history_of_present_illness_parent" class="col-md-12">';
        temp_ctemplate_activity_data += '<textarea class="form-control parsley-validated mrg5" placeholder="Includes description of acute problems plus status of important chronic problems like diabetes, hypertension" id="soapnote_history_of_present_illness"></textarea>';
     	temp_ctemplate_activity_data += '</div>';
   	temp_ctemplate_activity_data += '</div>';
 	temp_ctemplate_activity_data+='</div>';
	temp_ctemplate_activity_data+='<div class="ctemplate-display-sectionlist">';
	 temp_ctemplate_activity_data += '<div class="common-display-section-parent"><span class="ctemplate-display-section-name" current_section="Past Medical History">Past Medical History</span></div>';
	 temp_ctemplate_activity_data += '<div class="ctemplate-display-fieldlist-parent row">';
	 	temp_ctemplate_activity_data += '<div class="col-md-12" id="soapnote_pmh_parent">';
	 	  temp_ctemplate_activity_data += '<label for="select-multi-input">';
	 	    temp_ctemplate_activity_data += '<h5 class="theme-color">Procedure ::</h5></label>';
	 	  temp_ctemplate_activity_data += '<div>';
	 	    temp_ctemplate_activity_data += '<select class="form-control parsley-validated mrg5 multiselect-width" multiple="multiple" id="soapnote_pmh_procedure"></select>';
	 	  temp_ctemplate_activity_data += '</div>';
	 	  temp_ctemplate_activity_data += '<label for="select-multi-input">';
	 	    temp_ctemplate_activity_data += '<h5 class="theme-color">Medications ::</h5></label>';
	 	  temp_ctemplate_activity_data += '<textarea class="form-control parsley-validated mrg5" id="soapnote_pmh_medication"></textarea>';
	 	  temp_ctemplate_activity_data += '<label for="select-multi-input">';
	 	    temp_ctemplate_activity_data += '<h5 class="theme-color">Medical History ::</h5></label>';
	 	  temp_ctemplate_activity_data += '<div>';
	 	    temp_ctemplate_activity_data += '<select class="form-control parsley-validated mrg5 multiselect-width" multiple="multiple" id="soapnote_pmh_condition">';
					temp_ctemplate_activity_data += '<option value="Arthritis">Arthritis</option>';
					temp_ctemplate_activity_data += '<option value="Asthama">Asthama</option>';
					temp_ctemplate_activity_data += '<option value="Bladder Control Problem">Bladder Control Problem</option>';
					temp_ctemplate_activity_data += '<option value="Brittol Bones">Brittol Bones</option>';
					temp_ctemplate_activity_data += '<option value="Chest Pain (Angina)">Chest Pain (Angina)</option>';
					temp_ctemplate_activity_data += '<option value="Chrohns Disease">Chrohns Disease</option>';
					temp_ctemplate_activity_data += '<option value="Depression">Depression</option>';
					temp_ctemplate_activity_data += '<option value="Emphysema (COPD, Chronic Bronchitis)">Emphysema (COPD, Chronic Bronchitis)</option>';
					temp_ctemplate_activity_data += '<option value="Enlarged prostate (benign prostatic hyperplasia)">Enlarged prostate (benign prostatic hyperplasia)</option>';
					temp_ctemplate_activity_data += '<option value="Gastric reflux, heat burn or esophagitis(GERD)">Gastric reflux, heat burn or esophagitis(GERD)</option>';
					temp_ctemplate_activity_data += '<option value="Glaucoma">Glaucoma</option>';
					temp_ctemplate_activity_data += '<option value="Heart Attack(myocardia infarction)">Heart Attack(myocardia infarction)</option>';
					temp_ctemplate_activity_data += '<option value="Heart failure (CHF)">Heart failure (CHF)</option>';
					temp_ctemplate_activity_data += '<option value="Hemophilia and Hemophilia like conditions">Hemophilia and Hemophilia like conditions</option>';
					temp_ctemplate_activity_data += '<option value="High blood pressure (hypertension)">High blood pressure (hypertension)</option>';
					temp_ctemplate_activity_data += '<option value="High blood sugar (Diabetes)">High blood sugar (Diabetes)</option>';
					temp_ctemplate_activity_data += '<option value="High Cholesterol">High Cholesterol</option>';
					temp_ctemplate_activity_data += '<option value="Inflammatory bowel disease">Inflammatory bowel disease</option>';
					temp_ctemplate_activity_data += '<option value="Migraine Headache">Migraine Headache</option>';
					temp_ctemplate_activity_data += '<option value="Overactive thyroid (Hyperthyroid)">Overactive thyroid (Hyperthyroid)</option>';
					temp_ctemplate_activity_data += '<option value="Peptic , Stomach or duodenal ulcer">Peptic , Stomach or duodenal ulcer</option>';
					temp_ctemplate_activity_data += '<option value="Poor circulation in legs (Peripheral vascular legs)">Poor circulation in legs (Peripheral vascular legs)</option>';
					temp_ctemplate_activity_data += '<option value="Seizures(Epilepsy)">Seizures(Epilepsy)</option>';
					temp_ctemplate_activity_data += '<option value="Stroke (TIA)">Stroke (TIA)</option>';
					temp_ctemplate_activity_data += '<option value="Underactive thyroid(Hypothyroid)">Underactive thyroid(Hypothyroid)</option>';
	 	    temp_ctemplate_activity_data += '</select>';
	 	  temp_ctemplate_activity_data += '</div>';
	 	  temp_ctemplate_activity_data += '<label for="select-multi-input">';
	 	    temp_ctemplate_activity_data += '<h5 class="theme-color">Allergies ::</h5></label>';
	 	  temp_ctemplate_activity_data += '<h6 class="theme-color" style="float:right;">Add New <span role="button" id="add_new_allergies_charting" text="Allergies" class="glyphicon glyphicon-plus"></span></h6>';
	 	  temp_ctemplate_activity_data += '<div>';
	 	    temp_ctemplate_activity_data += '<table class="table tbl-border" id="charting_current_allergies_list">';
	 	      temp_ctemplate_activity_data += '<thead>';
	 	        temp_ctemplate_activity_data += '<tr>';
	 	          temp_ctemplate_activity_data += '<th>Allergies Name</th>';
	 	          temp_ctemplate_activity_data += '<th>Severe</th>';
	 	          temp_ctemplate_activity_data += '<th>Reaction</th>';
	 	        temp_ctemplate_activity_data += '</tr>';
	 	      temp_ctemplate_activity_data += '</thead>';
	 	      temp_ctemplate_activity_data += '<tbody></tbody>';
	 	    temp_ctemplate_activity_data += '</table>';
	 	    temp_ctemplate_activity_data += '<div class="col-lg-12 pagination-align" id="charting_current_allergies_list_pagination"></div>';
	 	  temp_ctemplate_activity_data += '</div>';
	 	temp_ctemplate_activity_data += '</div>	';
	 temp_ctemplate_activity_data += '</div>';
	temp_ctemplate_activity_data+='</div>';
	temp_ctemplate_activity_data+='<div class="ctemplate-display-sectionlist">';
	 temp_ctemplate_activity_data += '<div class="common-display-section-parent"><span class="ctemplate-display-section-name" current_section="Family History">Family History</span></div>';
	 temp_ctemplate_activity_data += '<div class="ctemplate-display-fieldlist-parent row">';
	 	temp_ctemplate_activity_data += '<div id="soapnote_fmh_parent" class="col-md-12">';
	 	  temp_ctemplate_activity_data += '<div class="soapnote-fmh-parent col-md-12" style="padding-left: 0px;">';
	 	    temp_ctemplate_activity_data += '<div class="col-lg-5 col-md-4 col-sm-4 col-xs-12">';
	 	      temp_ctemplate_activity_data += '<div class="row">';
	 	        temp_ctemplate_activity_data += '<div class="col-md-12">';
	 	          temp_ctemplate_activity_data += '<div class="form-group form-input-set">';
	 	            temp_ctemplate_activity_data += '<label>Relation</label>';
	 	          temp_ctemplate_activity_data += '</div>';
	 	        temp_ctemplate_activity_data += '</div>';
	 	        temp_ctemplate_activity_data += '<div class="col-md-12">';
	 	          temp_ctemplate_activity_data += '<div class="form-group full-input">';
	 	            temp_ctemplate_activity_data += '<select class="form-control soapnote-fmh-relation">';
	 	              temp_ctemplate_activity_data += '<option value="Select">Select</option>';
	 	              temp_ctemplate_activity_data += '<option value="Sister">Sister</option>';
	 	              temp_ctemplate_activity_data += '<option value="Brother">Brother</option>';
	 	              temp_ctemplate_activity_data += '<option value="Father">Father</option>';
	 	              temp_ctemplate_activity_data += '<option value="Mother">Mother</option>';
	 	              temp_ctemplate_activity_data += '<option value="Paternal Grand Father">Paternal Grand Father</option>';
	 	              temp_ctemplate_activity_data += '<option value="Paternal Grand Mother">Paternal Grand Mother</option>';
	 	              temp_ctemplate_activity_data += '<option value="Maternal Grand Father">Maternal Grand Father</option>';
	 	              temp_ctemplate_activity_data += '<option value="Maternal Grand Mother">Maternal Grand Mother</option>';
	 	              temp_ctemplate_activity_data += '<option value="Uncle">Uncle</option>';
	 	              temp_ctemplate_activity_data += '<option value="Aunt">Aunt</option>';
	 	            temp_ctemplate_activity_data += '</select>';
	 	          temp_ctemplate_activity_data += '</div>';
	 	        temp_ctemplate_activity_data += '</div>';
	 	      temp_ctemplate_activity_data += '</div>';
	 	    temp_ctemplate_activity_data += '</div>';
	 	    temp_ctemplate_activity_data += '<div class="col-lg-5 col-md-4 col-sm-4 col-xs-12">';
	 	      temp_ctemplate_activity_data += '<div class="row">';
	 	        temp_ctemplate_activity_data += '<div class="col-md-12">';
	 	          temp_ctemplate_activity_data += '<div class="form-group form-input-set">';
	 	            temp_ctemplate_activity_data += '<label>Condition</label>';
	 	          temp_ctemplate_activity_data += '</div>';
	 	        temp_ctemplate_activity_data += '</div>';
	 	        temp_ctemplate_activity_data += '<div class="col-md-12">';
	 	          temp_ctemplate_activity_data += '<div class="form-group full-input">';
	 	            temp_ctemplate_activity_data += '<select class="form-control soapnote-fmh-condition">';
	 	              temp_ctemplate_activity_data += '<option value="Select">Select</option>';
	 	              temp_ctemplate_activity_data += '<option value="Cancer">Cancer</option>';
	 	              temp_ctemplate_activity_data += '<option value="Clotting Disorder">Clotting Disorder</option>';
	 	              temp_ctemplate_activity_data += '<option value="Diabetes">Diabetes</option>';
	 	              temp_ctemplate_activity_data += '<option value="Dementia/Alzheimers">Dementia/Alzheimers</option>';
	 	              temp_ctemplate_activity_data += '<option value="Heart Disease">Heart Disease</option>';
	 	              temp_ctemplate_activity_data += '<option value="Gastro Intestinal Disorders">Gastro Intestinal Disorders</option>';
	 	              temp_ctemplate_activity_data += '<option value="High Cholesterol">High Cholesterol</option>';
	 	              temp_ctemplate_activity_data += '<option value="Hypertension">Hypertension</option>';
	 	              temp_ctemplate_activity_data += '<option value="Kidney Disease">Kidney Disease</option>';
	 	              temp_ctemplate_activity_data += '<option value="Lung Disease">Lung Disease</option>';
	 	              temp_ctemplate_activity_data += '<option value="Osteoporosis">Osteoporosis</option>';
	 	              temp_ctemplate_activity_data += '<option value="Psychological Disorders">Psychological Disorders</option>';
	 	              temp_ctemplate_activity_data += '<option value="Stroke/Brain attack">Stroke/Brain attack</option>';
	 	              temp_ctemplate_activity_data += '<option value="Sudden Death Infant Syndrome (SIDS)">Sudden Death Infant Syndrome (SIDS)</option>';
	 	              temp_ctemplate_activity_data += '<option value="Unknown Disease">Unknown Disease</option>';
	 	            temp_ctemplate_activity_data += '</select>';
	 	          temp_ctemplate_activity_data += '</div>';
	 	        temp_ctemplate_activity_data += '</div>';
	 	      temp_ctemplate_activity_data += '</div>';
	 	    temp_ctemplate_activity_data += '</div>';
	 	  temp_ctemplate_activity_data += '</div>';
	 	  temp_ctemplate_activity_data += '<div style="" class="col-md-12">';
	 	    temp_ctemplate_activity_data += '<label class="label label-warning add-more-fmh-in-soapnote pointer rght-float">Add More</label>';
	 	  temp_ctemplate_activity_data += '</div>';
	 	temp_ctemplate_activity_data += '</div>';
	 temp_ctemplate_activity_data += '</div>';
	temp_ctemplate_activity_data+='</div>';
	return temp_ctemplate_activity_data;
}

function generateSectionScrollForChartingTemplates() {
	var aArray = [];
	$(".ctemplate-display-sectionlist").each(function() {
	    aArray.push($(this));
	});

	$("#charting_template_activity_list").scroll(function(){
	  // var offtop = $("#charting_template_activity_list").scrollTop();
	  var offtop = Number(($("#charting_section_selection").offset().top).toFixed());
	  // var windowHeight = $(window).height();
	  // var docHeight = $(document).height();
	  for (var i=0; i<aArray.length; i++) {
	    var theID  = aArray[i];
	    var divPos = Number((theID.offset().top).toFixed());
	    if(divPos >= offtop && divPos <= (Number(offtop.toFixed())+ 500)) {
	    // var divHeight = theID.height();
	    // if (offtop >= divPos && offtop < (divPos + divHeight)) {
	      // if(theID.find(".common-display-section-name").length > 0) {
	      //   var secname = theID.find(".common-display-section-name").text();
	      // }else {
	        var secname = theID.find(".ctemplate-display-section-name").text();
	      // }
	      $(".section_link").removeClass("theme-background");
	      $("span[section_name='"+secname+"']").addClass("theme-background");
	      break;
	    } else {
	      //console.log("else");
	    }
	  }
	  var divtop = $("#charting_template_activity_list").scrollTop();
	  var divoffset = document.getElementById("charting_template_activity_list").offsetHeight;
	  var divscroll = document.getElementById("charting_template_activity_list").scrollHeight;
	  if(divtop + divoffset == divscroll) {
	    if (!($("nav li:last-child span").hasClass("theme-background"))) {
	      $("nav li").find("span").removeClass("theme-background");
	      $("nav li:last-child span").addClass("theme-background");
	    }
	  }
	});
}

function setPartialValuesForCharting(data){
	if(data.vital_sings_data){
		$("#ct_systolic_bp").val(data.vital_sings_data.systolic_bp);
		$("#ct_diastolic_bp").val(data.vital_sings_data.diastolic_bp);
		$("#ct_heartrate").val(data.vital_sings_data.heart_rate);
		$("#ct_Fasting_Glucose").val(data.vital_sings_data.fasting_glucose);
		$("#ct_O2").val(data.vital_sings_data.o2);
		$("#ct_OutOfRange").val(data.vital_sings_data.normal_condition);
		// $("#ct_Value_weight").val(data.vital_sings_data.value_weight);
		$("#ct_temp").val(data.vital_sings_data.temprature);
		$("#ct_respiration_rate").val(data.vital_sings_data.respiration);
		$("#ct_bmi_weight").val(data.vital_sings_data.value_weight);
		$("#ct_bmi_height").val(data.vital_sings_data.height);
		$("#ct_waist").val(data.vital_sings_data.waist);
		$("#ct_map_value").val(calculateMAP(data.vital_sings_data.systolic_bp,data.vital_sings_data.diastolic_bp));
		$("#ct_bmi_value").val(calculatePatientBMI($("#ct_bmi_height").val(),$("#ct_bmi_weight").val()));
	}
	$("#partial_save_patient_charting_template").data("index",data._id);
	$("#partial_save_patient_charting_template").data("rev",data._rev);
	// $("#soapnote_chief_complaint").val((data.chief_complaint ? data.chief_complaint : ""));
	$("#soapnote_history_of_present_illness").val((data.history_of_present_illness ? data.history_of_present_illness : ""));
}

function generatePartialChartingTemplateResponse(responseArray,data,priordata,sname,fname){
	var retstring = "";
	if(responseArray.response == "Text"){
		retstring = '<div  restype = "Text" class="ctemplate-display-response-value"><span style="float: right;margin-top:10px;" class="label label-default pointer txt-recent-value" resname = "Text" sname="'+sname+'" fname="'+fname+'">Show Recent Value</span><input type="text" class="form-control tp-fixed-wdth" placeholder = "Enter text here" value="'+(responseArray.values[0] ? responseArray.values[0] : "")+'"></div>';
		return retstring;
	}else if(responseArray.response == "paragraph"){
		retstring = '<div restype="paragraph" class="ctemplate-display-response-value"><span style="float: right;margin-top:10px;" class="label label-default pointer txt-recent-value" resname = "paragraph" sname="'+sname+'" fname="'+fname+'">Show Recent Value</span><textarea class="form-control tp-fixed-wdth" placeholder="Enter text here">'+(responseArray.values[0] ? responseArray.values[0] : "")+'</textarea></div>';
		return retstring;
	}else if(responseArray.response == "checkbox"){
		retstring = '<div restype="checkbox" class="ctemplate-display-response-value">';
		for(var fi=0; fi<responseArray.format.length > 0; fi++) {
			retstring += '<input type="checkbox" frmtval = "'+responseArray.format[fi]+'" class="checkshow ctemplate-display-chkbox"> &nbsp;'+responseArray.format[fi]+'&nbsp;';	
		}
		retstring += '</div>';
		return retstring;
	}else if(responseArray.response == "multiple"){
		retstring = '<div restype="multiple" class="ctemplate-display-response-value"><div class="overflow-override"><table class="table tbl-border charting-multiple-area-parent"><tbody>';

			var charting_count  = getPcode(3,"numeric");
			for(var fi=0; fi<responseArray.format.length;fi++){
				if(fi%3 == 0) retstring += '<tr>'
				retstring += '<td><input type="radio" ';
			if($.inArray(responseArray.format[fi],responseArray.values) >= 0) retstring += 'checked="checked" '
			retstring += 'name="single-select'+charting_count+'" myval="'+responseArray.format[fi]+'">&nbsp;&nbsp;<span>'+responseArray.format[fi]+'</span></td>';
		    if(fi%3 == 2 || fi+1 == responseArray.format.length) retstring +='</tr>'
		  }  
	  retstring += '</tbody></table></div><span style="float: right;" class="label label-default pointer txt-recent-value" resname = "multiple" sname="'+sname+'" fname="'+fname+'">Show Recent Value</span></div>';
		return retstring;
	}else if(responseArray.response == "combobox"){
		retstring = '<div restype="combobox" class="ctemplate-display-response-value"><div class="overflow-override"><table class="table tbl-border charting-multiple-area-parent"><tbody>';
			for(var fi=0; fi<responseArray.format.length; fi++){
				if(fi%3 == 0) retstring += '<tr>'
				retstring += '<td><input type="checkbox" ';
				if($.inArray(responseArray.format[fi],responseArray.values) >= 0) retstring += 'checked="checked" '
			  retstring += 'class="checkshow multiple-value" value="'+responseArray.format[fi]+'">&nbsp;&nbsp;<span>'+responseArray.format[fi]+'</span></td>';
		    if(fi%3 == 2 || fi+1 == responseArray.format.length) retstring +='</tr>'
		  }  
	  retstring += '</tbody></table></div><span style="float: right;" class="label label-default pointer txt-recent-value" resname = "combobox" sname="'+sname+'" fname="'+fname+'">Show Recent Value</span></div>';
		return retstring;
	}else if(responseArray.response == "date"){
		retstring = '<div restype="date" class="ctemplate-display-response-value"><input type="text" placeholder = "DD/MM/YYYY" value="'+(responseArray.values[0] ? responseArray.values[0] : "")+'" class="form-control datetime"></div>';
		return retstring;
	}else if(responseArray.response == "scale"){
 		retstring  = '<div restype = "scale" class="ctemplate-display-response-value"><table class="table tbl-border"><tbody><tr>';
 		var count  = getPcode(3,"numeric");
 		var min    = responseArray.format[0].min;
 		var max    = responseArray.format[0].max;
 		for(var fi = min; fi<max; fi++){
 			retstring += '<td class=" text-align"><span>'+fi+'</span><br><input type="radio" ';
 			if(fi == responseArray.values[0]) retstring += 'checked="checked" '
 			retstring +='value = "'+fi+'" name = "scale'+count+'" class="form-control scale-radio"></td>';
 		}
 		retstring +='</tr></tbody></table></div>';
 		return retstring;
	}else if(responseArray.response == "table"){

		retstring = '<div restype="table" class="ctemplate-display-response-value table-scroll" tclen="'+responseArray.format[0].table_columns.length+'" trlen="'+responseArray.format[0].table_rows.length+'"  ><span style="float: right;margin-top:10px;" class="label label-default pointer txt-recent-value" resname = "table" sname="'+sname+'" fname="'+fname+'">Show Recent Value</span>';
		retstring += '<table class = "form-table-response table tbl-border">';
		if(responseArray.format[0].table_columns.length > 0){
			retstring += '<thead>';
			if(responseArray.format[0].table_rows.length > 0){
				retstring += '<th></th>';
			}
			for(var th=0; th<responseArray.format[0].table_columns.length; th++){
				retstring += '<th class = "tbl-head">'+responseArray.format[0].table_columns[th]+'</th>';	
			}	
			if(responseArray.format[0].table_columns.length > 0 && responseArray.format[0].table_rows.length == 0){
				retstring += '<th></th>';	
			}
			retstring += '</thead>';
		}
		retstring += '<tbody>';

		if(responseArray.format[0].table_rows.length > 0){
			for(var rh=0;rh<responseArray.format[0].table_rows.length;rh++){
				retstring += '<tr class = "trows-count" count = "0"><td class="tbl-rows">'+responseArray.format[0].table_rows[rh]+'</td>';
				if(responseArray.format[0].table_columns.length > 0){
					//table with row and column header
					for(var tc=0; tc<responseArray.format[0].table_columns.length; tc++){
						retstring += '<td class="tbl-data0"><input class="table-rows-input" value="'+(responseArray.values[0].table_data[rh][tc] ? responseArray.values[0].table_data[rh][tc] : "")+'" type="text"></td>';
					}
				}else{
					retstring += '<td class="tbl-data0"><input class="table-rows-input" value="'+(responseArray.values[0].table_data[rh][0] ? responseArray.values[0].table_data[rh][0] : "")+'" type="text"></td>';
				}
				if(responseArray.format[0].table_columns.length > 0 && responseArray.format[0].table_rows.length == 0){
					retstring += '<td><span count="0" class="label label-warning pointer remove-form-table-row">Delete</span></td>';
				}
				retstring += '</tr>';
			}
		}else{
			if(responseArray.values[0].table_head.length > 0){
				for(var td=0; td<responseArray.values[0].table_data.length; td++){
					retstring +='<tr class="trows-count" count="'+td+'">';
					for(var tc=0; tc<responseArray.values[0].table_head.length; tc++){
						retstring += '<td class="tbl-data'+td+'"><input class="table-rows-input" value="'+(responseArray.values[0].table_data[td][tc] ? responseArray.values[0].table_data[td][tc] : "")+'" type="text"></td>';
					}
					retstring += '<td><span count="'+td+'" class="label label-warning pointer remove-form-table-row">Delete</span></td></tr>';	
				}
			}
		}
		retstring +='</tbody></table>';
		if(responseArray.format[0].table_rows.length == 0){
			retstring +='<div><span count="0" class="label label-warning pointer add-rows-table-form">Add Rows</span></div>';
		}
		retstring += '</div><br><br>';
		return retstring;
	}else if(responseArray.response == "image"){
		retstring = '<div  restype="image" class="ctemplate-display-response-value row"><form role="form" enctype="multipart/form-data" method="post" action="">';
		retstring += '<input type="file" placeholder="Enter text here" class="form-control form-image" name="_attachments" style="display:none;">';

		retstring += '<div class="row"><div class="col-lg-6"><select class="form-control canvas_images"></select></div><div class="col-lg-6"></div></div>';
		retstring += '<input type="hidden" name="_id" value=""><input type="hidden" name="_rev" value=""><input type="hidden" name="imagenote" class="imagenote" value=""><input type="hidden" name="image_postion_top" class="image_postion_top" value=""><input class="image_postion_left" type="hidden" name="image_postion_left" value=""></form></div>';
		return retstring;
	}else if(responseArray.response == "grid"){
		retstring = '<div restype = "grid" class="ctemplate-display-response-value table-scroll" gridlen="'+responseArray.format[0].grid_columns.length+'" trlen="'+responseArray.format[0].grid_rows.length+'"><table class = "form-table-response table tbl-border"><thead><th></th>';

		for(var th=0; th<responseArray.format[0].grid_columns.length; th++){
			retstring += '<th class="grid-head">'+responseArray.format[0].grid_columns[th]+'</th>';	
		}	

		retstring += '<th>Notes</th></thead><tbody>';
		var columnlen = Number(responseArray.format[0].grid_columns.length);
		for(var rh=0;rh<responseArray.format[0].grid_rows.length;rh++){
			retstring += '<tr class="grid-rows-count" count="0"><td class="grid-rows">'+responseArray.format[0].grid_rows[rh]+'</td>';
			var grpcount = getPcode(3,"numeric");
				for(var tc=0; tc<responseArray.format[0].grid_columns.length; tc++) {
					retstring += '<td class="grid-data"><input class="grid-rows-input" '
					if(responseArray.values[0].grid_data[rh][tc]) {
						retstring += 'checked="checked" ';
					}
					retstring += 'type="radio" name="grpradio'+grpcount+'"></td>';
				}
			retstring += '<td class="grid-data"><input class="grid-rows-value" value="'+(responseArray.values[0].grid_data[rh][columnlen] ? responseArray.values[0].grid_data[rh][columnlen] : "")+'" type="text"></td></tr>';
		}
		retstring +='</tbody></table></div><br><br>';
		return retstring;
	}else if(responseArray.response == "soapnote"){
		retstring = generateSoapNote(data,responseArray);
		return retstring;					
	}else if(responseArray.response == "biometrics"){
		var tdata = '<div restype="biometrics" class="ctemplate-display-response-value">';

		for(var i=0;i<responseArray.format.length;i++){
			tdata += '<div class="col-lg-2 mrg-top5 theme-color biometrics-label">'+responseArray.format[i]+'</div>';
			tdata += '<div class="col-lg-10 mrg-top5">';
	  	tdata += '<textarea class= "ctemplate-biometric-textbox" bio-name="'+responseArray.format[i]+'">'+getBiometricsAndMedicationHistory(responseArray.format[i])+'</textarea>';
			tdata += '</div>';
		}
		tdata +='</div>';
		return tdata;
	}else{
		retstring = "no response found"; 
		return retstring;
	}
}

function displaySelectedChartingTemplate(current_doc_id,tamsaFactories){
	$.couch.db(db).openDoc(current_doc_id, {
	  success: function(data) {
	  	$.couch.db(db).view("tamsa/getPatientChartingTemplate",{
	  		success:function(priordata){
			  	$.couch.db(db).openDoc("soapnote_charting_template", {
			  	  success:function(maindata){
		  	  		if(data.vital_signs_active == "Yes") $("#vital_sign_display, #ct_vital_signs_doctor_note").show()
		  	  		else $("#vital_sign_display, #ct_vital_signs_doctor_note").hide()
		  	  		
		  	  		if(data.visit_type_active && data.visit_type_active == "Yes") $("#ct_visit_type_parent").show()
							else $("#ct_visit_type_parent").hide()

		  	  		if(data.publish == "Yes"){
		  	  			$("#dc_copy").show();
		  	  			$("#dc_publish").hide();
		  	  		}else{
		  	  			$("#dc_copy").hide();
		  	  			$("#dc_publish").show().attr("index",data._id);
		  	  		}
		  	  	  $("#selected_charting_template_name").html(data.template_name);
		  	  	  $("#selected_charting_template_name").data("docid",data._id);
		  	  	  var ctemplate_activity_data = '';

		  	  	  for (var i = 0; i < data.sections.length; i++) {
		  	  	  	if(i == 0) var backcolor = "theme-background"
		  	  	  	else var backcolor = ""
		  	  	  	$('#charting_section_selection').find("ul").append('<li><span section_name="'+data.sections[i].s_name+'" class="section_link '+backcolor+'">'+data.sections[i].s_name+'</span></li>');
		  	  	  	// $('#charting_section_selection').append("<option>"+data.sections[i].s_name+"</option>");
		  	  	  	ctemplate_activity_data += '<div class="ctemplate-display-sectionlist" style=""><div class = "ctemplate-display-section-parent"><span class = "ctemplate-display-section-name" current_section="'+data.sections[i].s_name.trim()+'">'+data.sections[i].s_name.trim()+'</span></div><div class="ctemplate-display-fieldlist-parent">';
		  	  	    for(var j=0;j<data.sections[i].fields.length; j++){
		  	  	      ctemplate_activity_data +='<div class="ctemplate-display-fieldlist"><div class="ctemplate-display-fieldname">'+data.sections[i].fields[j].f_name+'</div><div class="ctemplate-display-responselist">';
		  	  	      for(var k=0;k<data.sections[i].fields[j].response_format_pair.length; k++){
		  	  	        ctemplate_activity_data += generateChartingTemplateResponse(data.sections[i].fields[j].response_format_pair[k],maindata,priordata,data.sections[i].s_name,data.sections[i].fields[j].f_name);
		  	  	      }
		  	  	      ctemplate_activity_data += '</div></div>';
		  	  	    }
		  	  	    ctemplate_activity_data += '</div></div>';
		  	  	  }
		  	  	  ctemplate_activity_data += generateCommonSectionsForChartingTemplates();
		  	  	  $("#charting_template_activity_list").html(ctemplate_activity_data);
		  	  	  $('#charting_section_selection').find("ul").append('<li><span section_name="History of Presenting Illness" class="section_link">History of Presenting Illness</span></li><li><span section_name="Past Medical History" class="section_link">Past Medical History</span></li><li><span section_name="Family History" class="section_link">Family History</span></li>');
    	  	    getProcedureList("soapnote_pmh_procedure");
    	  	    getConditionList("soapnote_pmh_condition");
    	  	    getPastMedicationHistory("soapnote_pmh_medication");
  	  	  	  getPastAllegies("charting_current_allergies_list");
  	  	  	  getPastFamilyMedicalHistory("soapnote_fmh_parent","soapnote-fmh-parent","soapnote-fmh-relation","soapnote-fmh-condition","add-more-fmh-in-soapnote");
		  	  	  generateScrollPositionForAllSections();
		  	  	  generateSectionScrollForChartingTemplates();
		  	  	  // $('#charting_section_selection').append("<option>Chief Complaint</option><option>History of Presenting Illness</option><option>Past Medical History</option><option>Family History</option>");
		  	  	  var btn_output = [];
		  	  	  btn_output.push('<div class="col-lg-12 col-sm-12 text-center mrgtop2"><button id="partial_save_patient_charting_template" doc_id="'+current_doc_id+'" class="btn btn-warning btnwidth mrgright1" type="button">Save</button><button type="button" class="btn btn-warning btnwidth mrgright1" id="print_patient_charting_template" doc_id="'+current_doc_id+'" doc_rev="" title="Print ChartNote">Print</button>');
		  	  	  if(pd_data.level == "Doctor") {
		  	  	  	btn_output.push('<button type="button" class="btn btn-warning btnwidth" id="save_patient_charting_template" doc_id="'+current_doc_id+'" doc_rev="" title="Save and finalize Charting Template">Save & Finalize</button>')
		  	  	  }
		  	  	  btn_output.push('</div>');
		  	  	  $("#charting_template_save_button_parent").html(btn_output.join(''));
		  	  	  $(".ctemplate-display-combobox").multiselect({
		  	  	  	selectedList: 8,
		  	  	  	noneSelectedText: "Select Multiple"
		  	  	  });
		  	  	  $(".ctemplate-display-multiple").multiselect({
		  	  	  	multiple:false,
		  	  	  	selectedList: 1,
		  	  	  	header: "Select Single",
		  	  	  	noneSelectedText: "Select Single"
		  	  	  });
		  	  	  getPatientComplaints("charting-source-complaint");
		  	  	  getPatientDiagnoses("charting-source-diagnosis");
		  	  	  getObjectiveDetailsList("charting_template_activity_list");
		  	  	  getChartingTemplateObjectiveDetails();
		  	  	  getChartingTemplatePlans();
		  	  	  enableSoapNoteDragDrop();
		  	  	  setImagesForAnnotation();
		  	  	  tamsaFactories.unblockScreen();
			  	  },
			  	  error:function(status){
			  	    console.log(status);
			  	  } 
				  });
	  		},
	  		error:function(data,error,reason){
	  			console.log(reason);
	  		},
	  		descending: true,
	  		startkey:   [userinfo.user_id,data.template_name,data.specialization,{}],
	  		endkey:     [userinfo.user_id,data.template_name,data.specialization],
	  		limit:      1
	  	});
		},
    error:function(data,error,reason){
    	newAlert("danger",reason);
    	$("html, body").animate({scrollTop: 0}, 'slow');
    	return false;
    }
	});
}

function generateScrollPositionForAllSections() {
	var offset_top = Number(($("#charting_template_activity_list").offset().top).toFixed());
	$(".section_link").each(function() {
		var section_name = $(this).text();
		var numtest = Number(($("#charting_template_activity_list").find(".ctemplate-display-section-name[current_section='"+section_name+"']").closest(".ctemplate-display-sectionlist").offset().top).toFixed());
		$(this).data("scrollval", (numtest - offset_top));
	})
}

function setImagesForAnnotation(partialdata){
	$.couch.db(db).view("tamsa/getChartingTemplateSettings",{
		success:function(data) {
			if(data.rows.length > 0){
				$(".canvas_images option").remove();
				$(".canvas_images").append('<option>Select Image</option>');
				for(var i=0;i<data.rows[0].doc.image_details.length;i++){
					var file_name = data.rows[0].doc.image_details[i].doc_id+"."+data.rows[0].doc.image_details[i].image_type.split("/").pop();
					if(data.rows[0].doc._attachments[file_name]){
						var url ="/api/attachment?attachment_name="+file_name+"&db="+db+"&id="+data.rows[0].doc._id,
							type = data.rows[0].doc.image_details[i].image_type,
							height = data.rows[0].doc.image_details[i].image_height,
							width = data.rows[0].doc.image_details[i].image_width,
							name = data.rows[0].doc.image_details[i].image_name,
							image = new Image(),
							data_urls;
						image.onload = function () {
					    var canvas = document.createElement('canvas');
					    canvas.width = this.naturalWidth;
					    canvas.height = this.naturalHeight;
							canvas.getContext('2d').drawImage(this, 0, 0);
							data_urls = canvas.toDataURL(type);
							if(data_urls){
								$(".canvas_images").append('<option data-height="'+height+'" data-type="dental-image" data-width="'+width+'" value="'+data_urls+'">'+name+'</option>');
							}
						};
						image.src = url;
					}
				}
			}else{
				$(".canvas_images").html('<option>No Images availabel.</option>');
			}
		},
		error:function(data,error,reason){
			newAlert("danger",reason);
			$("html, body").animate({scrollTop: 0}, 'slow');
			return false;
		},
		key:pd_data.dhp_code,
		include_docs:true
	});
}
function addMoreFMHInChartingTemplate(){
	var add_more_soapnote_fmh_data = '<div style="padding-left: 0px;" class="soapnote-fmh-parent col-md-12"><div class="col-lg-5 col-md-4 col-sm-4 col-xs-12"><div class="row"><div class="col-md-12"><div class="form-group full-input"><select class="form-control soapnote-fmh-relation"><option selected="selected">Select Condition</option><option>Sister</option><option>Brother</option><option>Father</option><option>Mother</option><option>Paternal Grand Father</option><option>Paternal Grand Mother</option><option>Maternal Grand Father</option><option>Maternal Grand Mother</option><option>Uncle</option><option>Aunt</option></select></div></div></div></div><div class="col-lg-5 col-md-4 col-sm-4 col-xs-12"><div class="row"><div class="col-md-12"><div class="form-group full-input"><select class="form-control soapnote-fmh-condition"><option selected="selected">Select Condition</option><option>Cancer</option><option>Clotting Disorder</option><option>Diabetes</option><option>Dementia/Alzheimers</option><option>Heart Disease</option><option>Gastro Intestinal Disorders</option><option>High Cholesterol</option><option>Hypertension</option><option>Kidney Disease</option><option>Lung Disease</option><option>Osteoporosis</option><option>Psychological Disorders</option><option>Stroke/Brain attack</option><option>Sudden Death Infant Syndrome (SIDS)</option><option>Unknown Disease</option></select></div></div></div></div><div style="padding-left: 15px; padding-top: 0px;" class="col-lg-2 col-md-4 col-sm-4 col-xs-12"><div class="row"><div style="padding-top: 0px;" class="col-md-12"><div style="margin-bottom: 0px;" class="form-group full-input"><label class="label label-warning remove-soapnote-fmh pointer">Remove</label></div></div></div></div></div>';

	$(".soapnote-fmh-parent:last").after(add_more_soapnote_fmh_data);
}

function generatePrintHTMLForChartingTemplate(doc) {
	$.couch.db(db).view("tamsa/getPrintSetting",{
	  success:function(hdata){
	  	if(hdata.rows.length > 0) {
		    $.couch.db(personal_details_db).view("tamsa/getPatientInformation",{
		    	success:function(pdata) {
		    		var all_print = [];
		    		all_print.push('<div class="container connew" style="padding-top: 0px;">');
		    		var printdata = getPrintCommonDetails(hdata,doc,pdata);
		    		var contentdata = contentForChartingPrint(hdata,doc,pdata);
		    		var printSign = "";
						
						if(hdata.rows[0].doc.is_display_chartnote_logo){
							printSign += '<div style="font-size: 15px;text-align:right;"><span>Authorised signatory</span></div><div style="font-size: 15px;text-align:right;"><span>'+(hdata.rows[0].doc.authorised_signatory ? hdata.rows[0].doc.authorised_signatory : "")+'</span></div>';
						}
						var temp = printdata.concat(contentdata);
						var temp_join = temp.concat(printSign);
		    		all_print.push(temp_join);
		    		all_print.push("</div>")
		    		var temp2 = all_print.join('');
		    		$("#print_area_temp").html(temp2);
		    		$("#print_area_temp").find("th, td, .print_template_name").css("font-size", "15px");
		    		$("#print_area_temp").find(".response_header").remove();
		    		printNewHtml($("#print_area_temp").html());
		    	},error:function(data,error,reason){
		    		newAlert("danger",reason);
		    		$("html, body").animate({scrollTop: 0}, 'slow');
		    		return false;
		    	},
		    	key:doc.user_id,
		    	include_docs:true
		    });
	  	}else {
	  		newAlert("danger", "Please Set Invoice Setting First.");
		    $("#savebill, #savebill_print").removeAttr("disabled");
		    $('html, body').animate({scrollTop: 0}, 1000);
		    return false;
	  	}
	  },
	  error:function(data,error,reason){
    	newAlert("danger",reason);
    	$("html, body").animate({scrollTop: 0}, 'slow');
    	return false;
    },
    key:pd_data.dhp_code,
    include_docs:true
  });
}

function contentForChartingPrint(hdata,doc,pdata) {
	var print_bill_data = [];

	print_bill_data.push('<div class="row">');
	  print_bill_data.push('<div style="padding-left:30px;padding-right:5px;!important">');
	    print_bill_data.push('<table class="table tbl-border" style="padding: 0px; margin: 0px auto;">');
	      print_bill_data.push('<tbody>');
	        print_bill_data.push('<tr>');
	          print_bill_data.push('<td style="line-height: 0.45 !important">');
	            print_bill_data.push('<table class="table tbl-border" width="990" style="margin: 4px auto;">');
	              print_bill_data.push('<tbody>');
	                print_bill_data.push('<tr>');
	                  print_bill_data.push('<td style="line-height: 0.45 !important">');
			                  print_bill_data.push(generateChartingTemplateData(doc,undefined,"print"));
	                    // print_bill_data.push('<table cellspacing="0" cellpadding="0" border="0" width="765" style="margin-top: 5px;" class="mrg-top medication-table">');
	                    //   print_bill_data.push('<tbody>');
	                      
	                    //   print_bill_data.push('<tr>');
	                    //     print_bill_data.push('<td valign="top" height="22" align="left" style="font-size:14px; color:#000; font-family:arial; font-weight:bold; width:100%">');
	                    //       print_bill_data.push('<table class="table invoice-display-table">');
	                    //         print_bill_data.push('<tbody>');
	                    //           print_bill_data.push('<tr>');
	                    //             // print_bill_data.push('<td style="font-size:14px; color:#000; font-family:arial;font-weight:bold;" align="left"><span>Doctor Name:: '+doc[0].doctor_name+'</span></td>');
	                    //             // print_bill_data.push('<td style="font-size:14px; color:#000; font-family:arial;font-weight:bold;" align="right"><span>Date :: '+(doc[0].update_ts ? moment(doc[0].update_ts).format("YYYY-MM-DD") : moment(doc[0].insert_ts).format("YYYY-MM-DD"))+'</span></td>');
	                    //           print_bill_data.push('</tr>');
	                    //         print_bill_data.push('</tbody>');
	                    //       print_bill_data.push('</table>');
	                    //     print_bill_data.push('</td>');
	                    //   print_bill_data.push('</tr>');

	                    //     print_bill_data.push('<tr>');
	                    //       print_bill_data.push('<td valign="top" height="22" align="left" style="font-size:14px; color:#000; font-family:arial; font-weight:bold;">');
	                    //         print_bill_data.push('<table class="table invoice-display-table">');
	                    //           // print_bill_data.push('<thead>');
	                    //           //   print_bill_data.push('<tr>');
	                    //           //     print_bill_data.push('<th>No</th><th>Medication Name</th><th>Quantity</th><th>Time</th><th>Patient Instruction</th><th>Start Date</th><th>End Date</th>');
	                    //           //   print_bill_data.push('</tr>');
	                    //           // print_bill_data.push('</thead>');
	                    //           print_bill_data.push('<tbody>');

	                    //           // for(var i=0;i<doc.length;i++) {
	                    //           //   print_bill_data.push('<tr>');
	                    //           //     print_bill_data.push('<td><span>'+(i+1)+'</span></td>');
	                    //           //     print_bill_data.push('<td>'+doc[i].drug+'</td>');
	                    //           //     print_bill_data.push('<td>'+doc[i].drug_quantity+'</td>');
	                    //           //     print_bill_data.push('<td>'+doc[i].medication_time+'</td>');
	                    //           //     print_bill_data.push('<td>'+doc[i].medication_instructions+'</td>');
	                    //           //     print_bill_data.push('<td>'+doc[i].drug_start_date+'</td>');
	                    //           //     print_bill_data.push('<td>'+doc[i].drug_end_date+'</td>');
	                    //           //   print_bill_data.push('</tr>');
	                    //           // }
	                    //           print_bill_data.push('</tbody>');
	                    //         print_bill_data.push('</table>');
	                    //       print_bill_data.push('</td>');
	                    //     print_bill_data.push('</tr>');

	                    //     // if(doc[0].pharmacy || doc[0].pharmacy_name) {
	                    //     //   print_bill_data.push('<tr>');
	                    //     //     print_bill_data.push('<td valign="top" align="left" style="font-size: 14px; color: rgb(0, 0, 0); font-family: arial; font-weight: bold; padding-top: 17px; float: left; width: 100%;">');
	                    //     //         print_bill_data.push('<h5>Pharmacy Name:: '+doc[0].pharmacy_name +'</h5>');
	                    //     //         print_bill_data.push('<h5>Pharmacy Contact No:'+doc[0].pharmacy_phone+'</h5>');
	                    //     //     print_bill_data.push('</td>');
	                    //     //   print_bill_data.push('</tr>');  
	                    //     // }

	                    //   print_bill_data.push('</tbody>');
	                    // print_bill_data.push('</table>');
	                  print_bill_data.push('</td>');
	                print_bill_data.push('</tr>');
	              print_bill_data.push('</tbody>');
	            print_bill_data.push('</table>');
	          print_bill_data.push('</td>');
	        print_bill_data.push('</tr>');
	      print_bill_data.push('</tbody>');
	    print_bill_data.push('</table>');
	  print_bill_data.push('</div>');
	print_bill_data.push('</div>');
	return print_bill_data.join('');
}
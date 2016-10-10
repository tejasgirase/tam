function(head, req) {
	var row,
			rows                  = [],
			medical_rows          = [],
			finalrows             = [],
			patient_suffering     = [],
			bmi_under             = [],
			bmi_over              = [],
			bmi_normal            = [],
			temp_bmi              = [],
			total_bmi_count       = 0,
			total_suffering_count = 0,
			hypertension_count    = 0,
			diabetes_count        = 0,
			cholesterol_count     = 0,
			hypertension          = [],
			diabetes              = [],
			cholesterol           = [];


	while(row = getRow()) {
		if(row.key[1] == 1 && row.value.dhp_code == req.query.dhp_code){
			if(rows.map(function(e) { return e.value.user_id; }).indexOf(row.value.user_id) == -1) {
				rows.push(row);
			}
		}
		if(row.key[1] == 2){
			medical_rows.push(row);
		}
	}

	for(var i=0;i<rows.length;i++) {
		for(var j=0;j<medical_rows.length;j++) {
			if(rows[i].value.user_id == medical_rows[j].value.user_id) {
				if(medical_rows[j].value.Condition && medical_rows[j].value.Condition.length > 0) {
					total_suffering_count++;
					if(medical_rows[j].value.Condition.indexOf("High blood pressure (hypertension)") >= 0) {
						hypertension.push(medical_rows[j]);
						hypertension_count++;
					}
					if(medical_rows[j].value.Condition.indexOf("High Cholesterol") >= 0) {
						cholesterol.push(medical_rows[j]);
						cholesterol_count++;
					}
					if(medical_rows[j].value.Condition.indexOf("High blood sugar (Diabetes)") >= 0) {
						diabetes.push(medical_rows[j]);
						diabetes_count++;
					}
				}
				if(medical_rows[j].value.height && medical_rows[j].value.weight && medical_rows[j].value.height != "" && medical_rows[j].value.weight != "") {
					var weight = Number(medical_rows[j].value.weight);
					var height = Number(medical_rows[j].value.height);
					var BMI = (weight/Math.pow(height,2))*10000;
					BMI = BMI.toFixed(2);
					if(BMI) total_bmi_count++;
					if(BMI < 18) {
						bmi_under.push({
							user_id: medical_rows[j].value.user_id,
							bmi:     BMI,
							height:  height,
							weight:  weight
						});
					}else if(BMI >= 18 && BMI <= 25) {
						bmi_normal.push({
							user_id: medical_rows[j].value.user_id,
							bmi: BMI,
							height:  height,
							weight:  weight
						});
					}else if(BMI > 25){
						bmi_over.push({
							user_id: medical_rows[j].value.user_id,
							bmi: BMI,
							height:  height,
							weight:  weight
						});
					}else {
						temp_bmi.push({
							user_id: medical_rows[j].value.user_id,
							bmi: BMI,
							height:  height,
							weight:  weight
						});
					}
				}
			}
		}
	}

	if(bmi_under.length > 0) {
		var under_percent = (bmi_under.length/total_bmi_count) * 100;
	}else {var under_percent = 0;}

	if(bmi_normal.length > 0) {
		var normal_percent = (bmi_normal.length/total_bmi_count) * 100;
	}else {var normal_percent = 0;}

	if(bmi_over.length > 0) {
		var over_percent = (bmi_over.length/total_bmi_count) * 100;
	}else {var over_percent = 0;}

	var hypertension_percentage = ((hypertension_count / total_suffering_count) * 100).toFixed(0);
	var diabetes_percentage = ((diabetes_count / total_suffering_count) * 100).toFixed(0);
	var cholesterol_percentage = ((cholesterol_count / total_suffering_count) * 100).toFixed(0);

	patient_suffering.push({percent:Math.round(hypertension_percentage), label:'Hypertension'}, {percent:Math.round(cholesterol_percentage),label:'Cholesterol'},{percent:Math.round(diabetes_percentage),label:'A1C > 6'});

	finalrows.push({ "percent":under_percent.toFixed(2), "label":"<18", "color":"#E6B91E"},
	  { "percent":normal_percent.toFixed(2), "label":"18-25", "color":"#54A021"},
	  { "percent":over_percent.toFixed(2), "label":">25", "color":"#90C226"}
	);
	send(JSON.stringify({"rows" : finalrows,"patient_data": patient_suffering, "hypertension_visualize_data":hypertension, "diabetes_visualize_data":diabetes, "cholesterol_visualize_data":cholesterol, "underweight":bmi_under, "normal":bmi_normal, "overweight":bmi_over,"under_count": bmi_under.length,"normal_count": bmi_normal.length,"over_count": bmi_over.length, "total_bmi_count": total_bmi_count, "temp_bmi": temp_bmi}));
}
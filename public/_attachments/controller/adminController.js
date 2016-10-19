var d    = new Date();
var pd_data = {};
var userinfo = {};
var userinfo_medical = {};

app.controller("adminController",function($scope,$state,$stateParams,tamsaFactories){
  // $.couch.session({
  //   success: function(data) {
  //     if(data.userCtx.name === null)
  //        window.location.href = "index.html";
  //     else {
        $.couch.db("_users").openDoc("org.couchdb.user:"+data.userCtx.name+"", {
          success: function(data) {
            pd_data = data;
            $scope.level = data.level;
            $scope.$apply();
            tamsaFactories.pdBack();
            tamsaFactories.sharedBindings();
            tamsaFactories.displayDoctorInformation(data);
            adminInterface.adminBindings();
            adminInterface.activateCarePlan("admin_configer_link",configuration_links.getActiveConfigTab);
          },
          error: function(status) {
            console.log(status);
          }
        });
  //     }
  //   }
  // });
  
  var adminInterface = (function(){
    var activateCarePlan = function(showid,getCallBack) {
      $(".remove_hide").removeClass("ChoiceTextActive");
      $("#"+showid).addClass("ChoiceTextActive");
      getCallBack();
    };
    var adminBindings = function(){
      $("#admin_interface").on("click","#admin_telemedicine_link",function(){
        activateCarePlan("admin_telemedicine_link",telemecineInquiries.activateTelemedicineInquiries);
      });
      $("#admin_interface").on("click","#admin_patient_tag_link",function(){
        activateCarePlan("admin_patient_tag_link",patientTagSections.activatePatientCategorizetionTags);
      });
      $("#admin_interface").on("click","#admin_remove_patient_link",function(){
        activateCarePlan("admin_remove_patient_link",removePatients.getRemovePatientTab);
      });
      $("#admin_interface").on("click","#admin_configer_link",function(){
        activateCarePlan("admin_configer_link",configuration_links.getActiveConfigTab);
      });
      configuration_links.getActiveConfigTabBindigs();
      removePatients.removePatientBindings();
      telemecineInquiries.telemedicineBindings();
      configuration_links.careplanSectionBindings();
      patientTagSections.patientTagSectionBindings();
    };
    return {
      adminBindings:adminBindings,
      activateCarePlan:activateCarePlan
    };
  })();

  var patientTagSections = (function() {
    var clearTagCaterizationTab = function () {
      if($(".token").length > 0) $("#patient_tags").tokenfield("setTokens", []);
    };

    var activatePatientCategorizetionTags = function() {
      clearTagCaterizationTab();
      $(".tab-pane").removeClass("active");
      $("#admin_patient_tag_tab").addClass("active");
      $("#patient_tags").tokenfield({"maxWidth":100,"beautify":false});
      $(".tokenfield").find(".close").css("visibility","hidden");
      $("#admin_hospitals_for_patient_tags").val("");
      getPatientTagsForAllHospital();
      configuration_links.getAllHospitalsDhpcode("admin_hospitals_for_patient_tags");
      // $.couch.db(replicated_db).view("tamsa/getAllHospitals", {
      //   success:function(data) {
      //     $("#admin_hospitals_for_patient_tags").html("<option value=''>All Hospitals</option>");
      //     if(data.rows.length > 0 ) {
      //       for(var i=0;i<data.rows.length;i++) {
      //         $("#admin_hospitals_for_patient_tags").append("<option value='"+data.rows[i].key[0]+"'>"+data.rows[i].key[0] + " -- "+data.rows[i].key[1]+"</option>");
      //       }
      //       getPatientTagsForAllHospital();
      //     }else {
      //       $("#admin_hospitals_for_patient_tags").html("<option value=''>No Hospital Found.</option>");
      //       console.log("OMG !!! Not a single hospital. HCTBP?");
      //     }
      //   },
      //   error:function(data,error,reason){
      //     newAlert("danger",reason);
      //     $("html, body").animate({scrollTop: 0}, 'slow');
      //     return false;
      //   },
      //   reduce:true,
      //   group:true
      // });
    };

    var getPatientTagsForSelectedHospital = function (dhp_code) {
      $.couch.db(db).view("tamsa/getPatientCategoryTags", {
          success:function(data) {
            if(data.rows.length > 0) {
              $("#patient_tags").tokenfield("setTokens",data.rows[0].doc.tag_list);
              $(".tokenfield").find(".close").css("visibility","hidden");
            }else {
              newAlert("danger","No Category found for selected Hospitals.");
              $("#patient_tags").tokenfield("setTokens",[]);
              return false;
            }
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          key:dhp_code,
          include_docs:true
      });
    };

    var getPatientTagsForAllHospital = function() {
      $.couch.db(db).view("tamsa/getAllPatientCategoryTags", {
        success:function(data) {
          if(data.rows.length > 0) {
            var arr = [];
            for(var i=0;i<data.rows.length;i++){
              arr.push(data.rows[i].key);
            }
            $("#patient_tags").tokenfield("setTokens",arr);
            $(".tokenfield").find(".close").css("visibility","hidden");
            tamsaFactories.unblockScreen();
          }else {
            newAlert("danger","No Category found for selected Hospitals.");
            $("#patient_tags").tokenfield("setTokens",[]);
            // $("#admin_hospitals_for_patient_tags").val("").trigger("click");
            return false;
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        reduce:true,
        group:true
      });
    };

    // var getPatientTags = function() {
    //   if($("#admin_hospitals_for_patient_tags").val()) {
    //     var hname = $("#admin_hospitals_for_patient_tags").find(":selected").text().split(" -- ");
    //     $("#hospital_label_name").html(hname[1]);
    //     getPatientTagsForSelectedHospital();
    //   }else {
    //     $("#hospital_label_name").html("All Hospitals");
    //     getPatientTagsForAllHospital();
    //   }
    // };
    
    var toggleTokenLabel= function($obj) {
      if($obj.hasClass("theme-background")) {
        $obj.removeClass("theme-background");
      }else {
        $obj.addClass("theme-background");
      }
    };

    var exportPatientTagsReports = function(final_list,display_list) {
      if(final_list.length > 0) {
        $scope.ptagdata  = display_list;
        // $("#admin_patient_category_list tbody").html("");
        $scope.$apply();
        var header = ["Patient Name","Email","Phone","Patient DHP ID","Tags"];
        final_list.unshift(header);
        var csvContent = "data:text/csv;charset=utf-8,";
        final_list.forEach(function(infoArray, index){
           dataString = infoArray.join(",");
           csvContent += index < final_list.length ? dataString+ "\n" : dataString;
        });
        var encodedUri = encodeURI(csvContent);
        $("#export_patient_by_categories_link, #admin_patient_category_list").removeClass("no-display");
        $("#export_patient_by_categories_link").attr("href",encodedUri);
        $("#export_patient_by_categories_link").attr("download", "patientList.csv");
        // document.getElementById("export_patient_by_categories_link").click();  
      }else {
        $("#export_patient_by_categories_link, #admin_patient_category_list").addClass("no-display");
        newAlert("danger","No Records Found with selected Tags");
        // $("#admin_patient_category_list tbody").html("<tr><td colspan='4'>No Records Found.</td></tr>");
      }
    };

    var getPersonalInformationForTagReports = function(tagdata,final_list,display_list) {
      $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
        success:function(pdata) {
          if(pdata.rows.length > 0) {
            var patient_arr = [];
            patient_arr.push((pdata.rows[0].doc.first_nm + " "+pdata.rows[0].doc.last_nm));
            patient_arr.push(pdata.rows[0].doc.user_email);
            patient_arr.push(pdata.rows[0].doc.phone);
            patient_arr.push(pdata.rows[0].doc.patient_dhp_id);
            patient_arr.push(tagdata.tags);
            final_list.push(patient_arr);
            display_list.push({
              patient_name: pdata.rows[0].doc.first_nm +" "+pdata.rows[0].doc.last_nm,
              email: pdata.rows[0].doc.user_email,
              phone: pdata.rows[0].doc.phone,
              patient_dhp_id: pdata.rows[0].doc.patient_dhp_id,
              tags:(tagdata.tags).toString()
            });
            var clen = Number($("#export_patient_by_categories").data("total_len"));
            clen = clen -1;
            $("#export_patient_by_categories").data("total_len",clen);
            if(clen === 0) {
              exportPatientTagsReports(final_list,display_list);
            }
          }else {
            console.log("no patient personal information found.");
          }
          
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        key:tagdata.user_id,
        include_docs:true
      });
    };

    var exportPatientBySelectedCategory = function() {
      if(validatePatientTags()) {
        var patient_tags = '';
        $("#patient_tag_parent").find(".theme-background").each(function(i){
          if(i !== 0) {
            patient_tags += ',';
          }
          patient_tags += $(this).find(".token-label").text();
        });
        // var patient_tags = patient_tag_array.toString();
        tamsaFactories.blockScreen("Please Wait....","#f2bb5c");
        $.couch.db(db).list("tamsa/getPatientByCategoryList", "getPatientListByCategory",{
          dhp_code:$("#admin_hospitals_for_patient_tags").val(),
          patient_tags:patient_tags
        }).success(function(data) {
          tamsaFactories.unblockScreen();
          if(data.rows.length > 0) {
            var final_list = [],
            display_list = [];
            $("#export_patient_by_categories").data("total_len", data.rows.length);
            for(var i=0;i<data.rows.length;i++){
              getPersonalInformationForTagReports(data.rows[i],final_list,display_list);
            }
          }else {
            $("#export_patient_by_categories_link, #admin_patient_category_list").addClass("no-display");
            // $("#admin_patient_category_list tbody").html("<tr><td colspan='4'>No Records Found.</td></tr>");
            newAlert("danger","No Records Found with selected Tags");
          }
        }).error(function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
        });
      }
    };

    var patientTagSectionBindings = function() {
      $("#admin_interface").on("click",".token",function(){
        toggleTokenLabel($(this));
      });
      $("#admin_interface").on("click","#export_patient_by_categories",function(){
        exportPatientBySelectedCategory();
      });
      $("#admin_interface").on("focusout","#admin_hospitals_for_patient_tags",function(){
        if($(this).val() == ""){
          getPatientTagsForAllHospital();
        }
      });
      $('#patient_tags').on('tokenfield:removetoken', function () {
        return false;
      });
      $("#admin_interface").on("keydown","#patient_tag_parent",function(e){
        return false;
      }); 
    };

    return {
      patientTagSectionBindings:patientTagSectionBindings,
      activatePatientCategorizetionTags:activatePatientCategorizetionTags,
      getPatientTagsForAllHospital:getPatientTagsForAllHospital,
      getPatientTagsForSelectedHospital:getPatientTagsForSelectedHospital
    };
  })();

  var removePatients = (function() {
    var clearRemovePatientInputs = function() {
      if($("#remove_patient_subscribed_doctor").parent().find("button").length > 0) {
        $("#remove_patient_subscribed_doctor").multiselect("uncheckAll");
      }
      $("#remove_subscribed_doctor_lbl,#remove_reason_parent").addClass("no-display");
      $("#remove_patient_subscribed_doctor").parent().addClass("no-display");
      $("#remove_patient").val("");
      $("#remove_patient_default").show();
      $("#remove_patient_details").hide();
    };

    var removeSubscribers = function(user_id,dhp_code,doctor_id) {
      $.couch.db(db).view("tamsa/removeSubscribers", {
        success:function(data) {
          if(data.rows.length > 0 ) {
            var remove_bulk = [];
            for(var i=0;i<data.rows.length;i++){
              remove_bulk.push({
                "_id":data.rows[i].doc._id,
                "_rev":data.rows[i].doc._rev
              });
            }
            var doctors = [];

            var save_doc = {
              doctype:              "removed_patient",
              patient_name:         $("#remove_patient_name").val(),
              patient_email:        $("#remove_patient_emailid").val(),
              patient_phone:        $("#remove_patient_phone").val(),
              patient_dhp_id:       $("#remove_patient_dhp_id").val(),
              user_id:              $("#remove_patient_emailid").data("user_id"),
              doctors:              $("#remove_patient_subscribed_doctor").val(),
              dhp_code:             $("#remove_patient_hospital_id").val(),
              reasone_for_deletion: $("#remove_reason").val(),
              insert_ts:            new Date(),
              deleted_by_id:        pd_data._id,
              deleted_by_name:      pd_data.first_name + " " +pd_data.last_name
            };
            $.couch.db(db).saveDoc(save_doc, {
              success:function(sdata){
                $.couch.db(db).bulkRemove({"docs":remove_bulk},{
                  success: function(data){
                    newAlert("success","Patient Information removed.");
                    $("html, body").animate({scrollTop: 0}, 'slow');
                    clearRemovePatientInputs();
                    return false;
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
              }
            });
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        key:[user_id,doctor_id,dhp_code],
        include_docs:true
      });      
    };

    var requestForRemovingSubscriber = function() {
      if(validateRemovingSubscriber()) {
        var doctor_arr = $("#remove_patient_subscribed_doctor").val();
        for(var i=0;i<doctor_arr.length;i++){
          removeSubscribers($("#remove_patient_emailid").data("user_id"),$("#remove_patient_hospital_id").val(),doctor_arr[i]);
        }
      }
    };

    var removePatientBindings = function() {
      $("#admin_interface").on("change","#remove_patient_hospital_id",function(){
        createDoctorList($(this).val(),$("#remove_patient_emailid").data("user_id"));
      });

      $("#admin_interface").on("click","#remove_patient_profile",function(){
        requestForRemovingSubscriber();
      });
    };

    var createDoctorList = function(hval,user_id) {
      if($("#remove_patient_hospital_id").val()) {
        $.couch.db(db).view("tamsa/getAllDoctorsFromUserId", {
          success:function(ddata) {
            if(ddata.rows.length > 0 ) {
              var output = [];
              $("#remove_patient_subscribed_doctor").html("");
              output.push('<optgroup label="'+hval+'">');
              for(var i=0;i<ddata.rows.length;i++){
                output.push("<option value='"+ddata.rows[i].key[2]+"'>"+ddata.rows[i].key[3]+"</option>");              
              }
              output.push('</optgroup>');
              $("#remove_patient_subscribed_doctor").append(output.join(''));
              $("#remove_patient_subscribed_doctor").multiselect({
                selectedList: 20,
                noneSelectedText: "Select Doctors"
              });
              $("#remove_patient_subscribed_doctor").multiselect("refresh");
              $("#remove_subscribed_doctor_lbl,#remove_reason_parent").removeClass("no-display");
              $("#remove_patient_subscribed_doctor").parent().removeClass("no-display");
            }else {
              if($("#remove_patient_subscribed_doctor").parent().find("button").length > 0) {
                $("#remove_patient_subscribed_doctor").multiselect("uncheckAll");
              }
              $("#remove_subscribed_doctor_lbl,#remove_reason_parent").addClass("no-display");
              $("#remove_patient_subscribed_doctor").parent().addClass("no-display");
              console.log("something is wrong !!!!. selected patient is not subscribed to any Doctor.");
            }
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          startkey:[user_id,hval],
          endkey:[user_id,hval,{},{}],
          reduce:true,
          group:true
        });
      }else {
        if($("#remove_patient_subscribed_doctor").parent().find("button").length > 0) {
          $("#remove_patient_subscribed_doctor").multiselect("uncheckAll");
        }
        $("#remove_subscribed_doctor_lbl,#remove_reason_parent").addClass("no-display");
        $("#remove_patient_subscribed_doctor").parent().addClass("no-display");
        console.log("something is wrong !!!!. selected patient is not subscribed to any Doctor.");
      }
    };

    var displayPatientProfileForRemove = function(user_id) {
      $.blockUI({
        message: '<h1>Please Wait........</h1>',
        css:{
          color: "#f2bb5c"
        }
      });
      $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
        success:function(pdata) {
          if(pdata.rows.length > 0) {
            $("#remove_patient_default").hide();
            $("#remove_patient_details").show();
            $("#remove_patient_name").val(pdata.rows[0].doc.first_nm + " "+ pdata.rows[0].doc.last_nm);
            $("#remove_patient_dhp_id").val(pdata.rows[0].doc.patient_dhp_id);
            $("#remove_patient_emailid").val(pdata.rows[0].doc.user_email);
            $("#remove_patient_emailid").data("user_id",pdata.rows[0].doc.user_id);
            $("#remove_patient_phone").val(pdata.rows[0].doc.phone);
            $("#remove_subscribed_doctor_lbl,#remove_reason_parent").addClass("no-display");
            $("#remove_patient_subscribed_doctor").parent().addClass("no-display");
            $("#remove_patient_subscribed_doctor").html("");
            if($("#remove_patient_subscribed_doctor").parent().find("button").length > 0) {
              $("#remove_patient_subscribed_doctor").multiselect("uncheckAll");
            }

            if(pdata.rows[0].value.imgblob){
              $("#remove_patient_profile_pic").attr("src", pdata.rows[0].value.imgblob);
            }else if(pdata.rows[0].value._attachments){
              url = $.couch.urlPrefix+'/'+personal_details_db+'/'+pdata.rows[0].id+'/'+Object.keys(pdata.rows[0].value._attachments)[0];
              $("#remove_patient_profile_pic").attr("src",url);
            }else {
              $("#remove_patient_profile_pic").attr("src","images/profile-pic.png");
            }
            $.couch.db(db).view("tamsa/getAllHospitalFromUserId", {
              success:function(hdata){
                if(hdata.rows.length > 0) {
                  $("#remove_patient_hospital_id").html("<option value=''>Select Hospital</option>");
                  for(var i=0;i<hdata.rows.length;i++){
                    $("#remove_patient_hospital_id").append("<option>"+hdata.rows[i].key[1]+"</option>");
                  }
                  // $("#remove_patient_hospital_id").multiselect({
                  //   header:false,
                  //   selectedList: 4,
                  //   noneSelectedText: "Select Hospitals",
                  //   click: function(event, ui){
                  //     var chk = ui.checked ? 'checked' : 'unchecked';
                  //     if(chk == "checked"){
                  //       createDoctorList(ui.value,user_id);
                  //       // ui.value
                  //       // ui.text
                  //     }else{
                  //       createDoctorList(ui.value,user_id);
                  //     }
                  //   }
                  // });
                }else {
                  $("#remove_patient_hospital_id").html("<option value=''>Select Hospital</option>");
                  console.log("Something is Wrong. No Hospital found for selected patient.");
                }
                $.unblockUI();
              },
              error:function(data,error,reason){
                newAlert("danger",reason);
                $("html, body").animate({scrollTop: 0}, 'slow');
                return false;
              },
              startkey:[user_id],
              endkey:[user_id, {}],
              reduce:true,
              group:true
            });
          }else {
            $("#remove_patient_emailid").data("user_id","");
            console.log("Something is Wrong. Personal Info for selected patient not selected.");
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        key:user_id,
        include_docs:true
      });
    };

    var searchPatientsByNameOrDHPIdAutocompleter = function(ui,search_id) {
      $("#remove_patient").autocomplete({
        search: function(event, ui) { 
           $("#remove_patient").addClass('myloader');
        },
        source: function( request, response ) {
          $.couch.db(db).view("tamsa/getAllSubscribers", {
            success: function(data) {
              response(data.rows);
              $("#remove_patient").removeClass('myloader');
            },
            error: function(status) {
              console.log(status);
            },
            startkey: [$("#remove_patient").val().trim()],
            endkey: [$("#remove_patient").val().trim()+"\u9999", {}, {}],
            reduce:true,
            group:true,
            limit:5
          });
        },
        focus: function(event, ui) {
          // $("#remove_patient").val('');
          return false;
        },
        minLength: 1,
        select: function( event, ui ) {
          if(ui.item.key[1] == "No results found"){
            return false;
          }else{
            $(this).val(ui.item.key[0]);
            displayPatientProfileForRemove(ui.item.key[1]);
          }
          return false;
        },
        response: function(event, ui) {
          if (!ui.content.length) {
            $("#remove_patient_emailid").data("user_id", "");
            var noResult = { key: ['','No results found'],label:"No results found" };
            ui.content.push(noResult);
            //$("#message").text("No results found");
          }
        },
        open: function() {
          //$("#"+search_id).removeClass('myloader');
          $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
          $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        }
      }).
      data("uiAutocomplete")._renderItem = function(ul, item) {
        if (item.key[1] == "No results found") {
          return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a>" + item.key[1]+ "</a>")
            .appendTo(ul);
        }
        else {
          getAutoCompleteImages(item.key[1],"remove_patientsearch_pic_");
          return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a><img class='patient_image_link img-responsive' style='height:50px; width:50px;'  src='images/profile-pic.png' id='remove_patientsearch_pic_"+item.key[1]+"'>  " + item.key[0] + "<small class='rght-float pdhp-search-box'>"+item.key[2]+"</small></a>")
            .appendTo(ul);
        }
      };
    };

    var getRemovePatientTab = function() {
      $(".tab-pane").removeClass("active");
      $("#admin_remove_patient_tab").addClass("active");
      clearRemovePatientInputs();
      searchPatientsByNameOrDHPIdAutocompleter();
    };
    return {
      getRemovePatientTab:getRemovePatientTab,
      removePatientBindings:removePatientBindings
    };
  })();

  var telemecineInquiries = (function(){
    var getPersonalInformation = function(data,teledata,hospital_list) {
      $.couch.db(personal_details_db).view("tamsa/getPatientInformation", {
        success:function(pdata) {
          if(pdata.rows.length > 0) {
            data.patient_name  = pdata.rows[0].doc.first_nm + " " +pdata.rows[0].doc.last_nm;
            data.patient_email = pdata.rows[0].doc.user_email;
            data.patient_phone = pdata.rows[0].doc.phone;
            data.hospital_list = hospital_list;
            teledata.push(data);
            var len = Number($("#admin_telemedicine_inquiry_list").data("total_len"));
            len = len - 1;
            $("#admin_telemedicine_inquiry_list").data("total_len",len);
            if(len === 0) {
              tamsaFactories.unblockScreen();
              teledata.sort(function(a,b) {
                var ts1 = ((a.update_ts ? a.update_ts : a.insert_ts));
                var ts2 = ((b.update_ts ? b.update_ts : b.insert_ts));
                return moment(ts2).diff(moment(ts1));
              });
              $scope.teleinquiries = teledata;
              $scope.$apply();
              $(".assign_hospital").each(function() {
                if($(this).data("hospital") != pd_data.dhp_code){
                  $(this).closest("tr").addClass("warning");
                  $(this).val($(this).data("hospital"));
                  if($(this).data("doctor")) {
                    getDoctorsToAssignForSelectedHospital($(this),$(this).data("doctor"));
                  }
                }
              });
            }
          }else {
            tamsaFactories.unblockScreen();
            console.log("Patient personal information not Found. USer id --> " + data.user_id);
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        key:data.user_id,
        include_docs:true
      });
    };
    var getTelemedicineInquiries = function() {
      $.couch.db(replicated_db).view("tamsa/getAllHospitals", {
        success:function(hdata) {
          if(hdata.rows.length > 0) {
            var hospital_list = [];
            for(var i=0;i<hdata.rows.length;i++){
              hospital_list.push({
                dhp_code:hdata.rows[i].key[0],
                name:hdata.rows[i].key[1]
              });
            }
            $.couch.db(db).view("tamsa/getAdminTelemedicineInquiries", {
              success:function(data) {
                tamsaFactories.blockScreen("Please Wait.....", "#f2bb5c");
                  var teledata = [];
                if(data.rows.length > 0) {
                  $("#admin_telemedicine_inquiry_list").data("total_len",data.rows.length);
                  for(var i=0;i<data.rows.length;i++){
                    getPersonalInformation(data.rows[i].doc,teledata,hospital_list);
                  }
                }else {
                  $scope.teleinquiries = teledata;
                  $scope.$apply();
                  tamsaFactories.unblockScreen();
                  // var telemedicine_inq = [];
                  // telemedicine_inq.push('<tr><td  class="text-center" colspan="6">No Inquiries are Found.</td></tr>');
                  // $("#admin_telemedicine_inquiry_list tbody").html(telemedicine_inq.join('')); 
                }
              },
              error:function(data,error,reason){
                newAlert("danger",reason);
                $("html, body").animate({scrollTop: 0}, 'slow');
                return false;
              },
              key: pd_data.dhp_code,
              include_docs: true
            });
          }else {
            tamsaFactories.unblockScreen();
            console.log("No a single Hospital in DB. Hurry. Contact Admin.");
          }
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        },
        reduce:true,
        group:true
      });
    };
    var getDoctorsToAssignForSelectedHospital = function($obj,selected_val) {
      if($obj.val() !== "") {
        $.couch.db(replicated_db).view("tamsa/getAllDHPUsers", {
          success:function(data) {
            if(data.rows.length > 0) {
              $obj.closest("td").find(".assign_doctor").html("<option value=''>Select Doctors</option>");
              for(var i=0;i<data.rows.length;i++){
                $obj.closest("td").find(".assign_doctor").append("<option value='"+data.rows[i].doc._id+"'>"+data.rows[i].doc.first_name + " " + data.rows[i].doc.last_name + " -- "+ data.rows[i].doc.random_code+"</option>");
              }
              if(selected_val) $obj.closest("td").find(".assign_doctor").val(selected_val);
            }else {
              $obj.closest("td").find(".assign_doctor").html("<option value=''>No Doctors for selected Hospital.</option>");
            }
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          startkey:[$obj.val()],
          endkey:[$obj.val(),{}],
          include_docs:true
        });
      }else {
        $obj.closest("td").find(".assign_doctor").html("<option value=''>No Doctors for selected Hospital.</option>");
      }
      $obj.closest("td").find(".assign_doctor").removeClass("no-display");
      // $obj.closest("td").find(".assign_teleinquiry").removeClass("no-display");
    };
    var assignTelemedicineInquiryToSelectedHospital = function($obj) {
      if(validateAssigningForTelemedicineInquiries($obj)) {
        $.couch.db(db).openDoc($obj.data("index"), {
          success:function(data) {
            data.dhp_code = $obj.closest("tr").find(".assignee-parent").find(".assign_hospital").val();
            data.update_ts = new Date();
            data.admin_dhp_code = pd_data.dhp_code;
            if($obj.closest("tr").find(".assignee-parent").find(".assign_doctor").val()) {
              data.doctor_id            = $obj.closest("tr").find(".assignee-parent").find(".assign_doctor").val();
              var hname                 = $obj.closest("tr").find(".assign_doctor").find(":selected").text().split(" -- ");
              if(hname.length == 2) {
                data.doctor_name = hname[0];
                data.practice_id = hname[1];
              }else {
                data.doctor_name = "";
                data.practice_id = "";
              }
            }else {
              data.doctor_id = "";
              data.practice_id = "";
            }
           
            $.couch.db(db).saveDoc(data, {
              success:function(sdata) {
                newAlert("success","Inquiry Successfuylly assigned to selected Hospital.");
                getTelemedicineInquiries();
                $("html, body").animate({scrollTop: 0}, 'slow');
                return false;
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
          }
        });
      }else {
        return false;
      }
    };
    
    var openTelemedicineInquiryReplyModal = function ($obj) {
      createModal("telemedicine_inquiry_reply_modal");
      $("#reply_patient_name").html($obj.closest("tr").find(".patient_name").html());
      $("#reply_patient_email").html("("+$obj.closest("tr").find(".patient_email").val()+")");
      $("#send_reply_teleinquiry").data("index",$obj.data("index"));
    };

    var replyTelemedicineInquiry = function() {
      // patient_email:            $("#reply_patient_email").html,
      // patient_name:             $("#reply_patient_name").html(),
      if(validateReplyTeleInquiry()) {
        var cron_data = {
          doctype:                  'cronRecords',
          operation_case:           '27',
          processed:                'No',
          telemedicine_inquiriy_id: $("#send_reply_teleinquiry").data("index"),
          message:                  $("#message_to_patient").val(),
          insert_ts:                new Date(),
        };
        $.couch.db(db).saveDoc(cron_data, {
          success:function(data) {
            newAlert("success","Message Successfully sent to Patient.");
            $("#telemedicine_inquiry_reply_modal").modal("hide");
            return false;
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
        });
      }
    };

    var telemedicineBindings = function() {
      $("#admin_interface").on("change",".assign_hospital",function(){
        getDoctorsToAssignForSelectedHospital($(this));
      });

      $('#telemedicine_inquiry_reply_modal').on('hide.bs.modal', function (e) {
        $("#message_to_patient").val("");
        $("#reply_patient_name").val("");
        $("#reply_patient_email").val("");
      });

      $("#admin_interface").on("click",".assign_teleinquiry",function(){
        assignTelemedicineInquiryToSelectedHospital($(this));
      });

      $("#admin_interface").on("click",".reply_teleinquiry",function(){
        openTelemedicineInquiryReplyModal($(this));
      });

      $("#admin_interface").on("click","#send_reply_teleinquiry",function(){
        replyTelemedicineInquiry();
      });
    };

    var activateTelemedicineInquiries = function () {
      $(".tab-pane").removeClass("active");
      $("#admin_telemedicine_tab").addClass("active");
      getTelemedicineInquiries();
    };

    return {
      activateTelemedicineInquiries: activateTelemedicineInquiries,
      telemedicineBindings:telemedicineBindings
    };
  })();

  var configuration_links = (function(){
    var getSectionList = function(selected_val) {
      $.couch.db(db).openDoc("careplan_section_list", {
        success:function(data) {
          $("#current_sections").html('<option value="">Select Sections From Here</option>');
          for(var i=0;i<data.sections.length;i++){
            $("#current_sections").append("<option>"+data.sections[i].name+"</option>");
          }
          if(selected_val) $("#current_sections").val(selected_val).trigger("change");
        },
        error:function(data,error,reason){
          if(data == 404) {
            $("#current_sections").html("<option value=''>No Sections is availabel.</option>"); 
          }else {
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          }
        }
      });
    };
    var clearSectionField = function() {
      $("#current_sections").val("");
      $("#new_section_val").val("");
      $("#response_freq").prop("checked",false);
      $("#response_bool").prop("checked",false);
      $("#response_notes").prop("checked",false);
    };
    var careplanSectionBindings = function() {
      $("#admin_interface").on("change","#current_sections",function(){
        addFieldsinCareplanSectionList();
      });

      $("#admin_interface").on("click","#save_section_fields_for_admin",function(){
        saveFieldsinCareplanSectionList();
      });

      $("#admin_interface").on("focusout","#new_section_val",function(){
        createNewSection();
      });
      $("#admin_interface").on("keypress","#new_section_val",function(e){
        if(e.which == 13) createNewSection();
      });
    };
    var addFieldsinCareplanSectionList = function() {
      if($("#current_sections").val().trim() !== "") {
        $("#new_section_val").val("");
        $("#section_label_name").html($("#current_sections").val().trim());
        $("#create_new_prop").removeClass("no-display");
        $.couch.db(db).openDoc("careplan_section_list", {
          success:function(data) {
            for(var i=0;i<data.sections.length;i++){
              if(data.sections[i].name == $("#current_sections").val()) {
                var fielddata = data.sections[i].fields;
                $("#response_freq").prop("checked",(data.sections[i].response_type.indexOf("frequency") > -1));
                $("#response_bool").prop("checked",(data.sections[i].response_type.indexOf("boolean") > -1));
                $("#response_notes").prop("checked",(data.sections[i].response_type.indexOf("notes") > -1));
                $("#tokenfield_parent").removeClass("no-display");
                $('#tokenfield').tokenfield({"maxWidth":100,"beautify":false});
                $('#tokenfield').tokenfield('setTokens', fielddata);
                break;
              }
            }
          },
          error:function(data,error,reason){
            if(data == 404) {
              $("#current_sections").append("<option value=''>No Sections is availabel.</option>"); 
              console.log("What !!! change in section without any sections leads u here.");
            }else {
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            }
          }
        });
      }else {
        $("#tokenfield_parent").addClass("no-display");
        $("#create_new_prop").addClass("no-display");
        $('#tokenfield').tokenfield('setTokens',[]);
      }
    };
    var updateCarePlanDocument = function(data) {
      $.couch.db(db).saveDoc(data, {
        success:function(sdata) {
          newAlert("success","Successfuylly Updated");
          $("html, body").animate({scrollTop: 0}, 'slow');
          var lastsection = ($("#current_sections").val() || $("#new_section_val").val().trim());
          clearSectionField();
          getSectionList(lastsection);
          return false;
        },
        error:function(data,error,reason){
          newAlert("danger",reason);
          $("html, body").animate({scrollTop: 0}, 'slow');
          return false;
        }
      });
    };
    var saveFieldsinCareplanSectionList = function() {
      if(validateSectionInput()) {
        $.couch.db(db).openDoc("careplan_section_list", {
          success:function(data) {
            if($("#current_sections").val() !== "") {
              for(var i=0; i<data.sections.length; i++){
                if(data.sections[i].name == $("#current_sections").val()) {
                  var response_temp = [];
                  if($("#response_freq").prop("checked")) response_temp.push("frequency");
                  if($("#response_bool").prop("checked")) response_temp.push("boolean");
                  if($("#response_notes").prop("checked")) response_temp.push("notes");
                  data.sections[i].response_type = response_temp;
                  data.sections[i].fields = ($('#tokenfield').tokenfield('getTokensList')).split(",");
                  updateCarePlanDocument(data);
                }else{
                  console.log("crazy!!! no section name mentioned in DB.");
                }
              }  
            }else if($("#new_section_val").val().trim() !== ""){
              var response = [], caredata = {};
              if($("#response_freq").prop("checked")) response.push("frequency");
              if($("#response_bool").prop("checked")) response.push("boolean");
              if($("#response_notes").prop("checked")) response.push("notes");
              caredata.name = $("#new_section_val").val();
              caredata.response_type = response;
              caredata.fields = ($('#tokenfield').tokenfield('getTokensList')).split(",");
              data.sections.push(caredata);
              console.log(data);
              updateCarePlanDocument(data);
            }else {
              console.log("OMG:: Section is not selected.");
            }
          },
          error:function(code,error,reason){
            if(code == 404) {
              var newdata={},tempsections=[],response=[],fields=[];
              if($("#response_freq").prop("checked")) response.push("frequency");
              if($("#response_bool").prop("checked")) response.push("boolean");
              if($("#response_notes").prop("checked")) response.push("notes");
              fields = ($('#tokenfield').tokenfield('getTokensList')).split(",");
              tempsections.push({
                name:$("#new_section_val").val().trim(),
                response_type:response,
                fields:fields
              });
              newdata._id = "careplan_section_list";
              newdata.sections = tempsections;
              updateCarePlanDocument(newdata);
            }else {
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            }
          }
        });
      }else {
        console.log("OHHH!!! Validation. fuhhhh.");
      }
    };
    var createNewSection = function() {
      if($("#new_section_val").val().trim() !== "") {
        $("#current_sections").val("");
        $("#create_new_prop").removeClass("no-display");
        $('#tokenfield_parent').removeClass('no-display');
        $('#tokenfield').tokenfield({"maxWidth":100,"beautify":false});
        $('#tokenfield').tokenfield('setTokens', []);
      }
    };
    var getActiveConfigTabBindigs = function (){
      $("#admin_config_tab").on("click","#careplan_link_tab",function(){
        getActiveCarePlanTab();
      });
      $("#admin_config_tab").on("click","#specialization_tab",function(){
        getActiveSpecializationTab();
      });
      $("#admin_config_tab").on("click","#pharmacy_tab",function(){
        getActivePharmacyTab();
      });
      $("#admin_config_tab").on("click","#labtest_tab",function(){
        getActiveLabtestTab();
      });
      $("#admin_config_tab").on("click","#medication_tab",function(){
        getActiveMedicationTab();
      });
      $("#admin_config_tab").on("click","#hospital_tab",function(){
        getActiveHospitalTab();
      });
      $("#admin_config_tab").on("click","#save_specialization_for_admin",function(){
        getSaveSpecializationAdmin();
      });
      // $("#admin_config_tab").on("change","#hospital_dhp_specialization",function(){
      //   if($("#hospital_dhp_specialization").val() != "Select DHP CODE"){
      //     getSpecializationForDHPCode($(this).val());
      //   }else{
      //     $("#token_hospital_parent").css("display","none");
      //     $("#save_specialization_for_admin").attr("index","");
      //     $("#save_specialization_for_admin").attr("rev","");
      //   }
      // });

      $("#admin_config_tab").on("change","#pharmacy_list_state", function() {
        getCities($("#pharmacy_list_state").val(), "pharmacy_list_city", "select city");
      });

      $("#admin_config_tab").on("change","#lab_state_admin", function() {
         getCities($("#lab_state_admin").val(), "lab_city_admin", "select city");
      });

      $("#admin_config_tab").on("change","#lab_test", function() {
         if($(this).val().trim() != ""){
            getLabTestValues($(this).val().trim());
         }
      });
      // $("#admin_config_tab").on("change","#hospital_dhp_lab", function() {
      //   if($("#hospital_dhp_lab").val().trim() != "Select DHP CODE" && $("#hospital_dhp_lab").val().trim() != ""){
      //    getLabTestContent($("#hospital_dhp_lab").val());
      //   } 
      // });

      // $("#admin_config_tab").on("change","#dhp_code_medication", function() {
      //   if($("#dhp_code_medication").val().trim() != "Select DHP CODE" && $("#dhp_code_medication").val().trim() != ""){
      //    getMedicationListDetails($("#dhp_code_medication").val());
      //   } 
      // });

      // $("#admin_config_tab").on("change","#dhp_code_pharmacy", function() {
      //   if($("#dhp_code_pharmacy").val().trim() != "Select DHP CODE" && $("#dhp_code_pharmacy").val().trim() != ""){
      //    getPharmacyContent($("#dhp_code_pharmacy").val());
      //   } 
      // });

      // $("#admin_config_tab").on("change","#lab_city_admin", function() {
      //   if($("#lab_state_admin").val().trim() != "Select state" && $("#lab_city_admin").val().trim() != "Select city" && $("#lab_city_admin").val().trim() != "" && $("#lab_state_admin").val().trim() != ""){
      //    getLabTestContent($("#lab_state_admin").val(),$("#lab_city_admin").val());
      //   }
      // });

      $("#admin_config_tab").on("click","#import_lab_imging",function(){
        if($("#dhp_code_lab").val().trim() != "Select DHP CODE" && $("#dhp_code_lab").val().trim() != ""){
          importLabAndImagingFromCSV();
        }else{
          newAlert('danger', "Please Select hospital DHP CODE.");
          $("#dhp_code_lab").focus();
          $('html, body').animate({scrollTop: 0}, 'slow');
        }
      });

      $("#admin_config_tab").on("click","#import_medication_list",function(){
        if($("#dhp_code_medication").val() != "Select DHP CODE" && $("#dhp_code_medication").val().trim() != ""){
          importMedicationFromCSV($("#dhp_code_medication").val());
        }else{
          newAlert('danger', "Please Select hospital DHP CODE.");
          $("#dhp_code_medication").focus();
          $('html, body').animate({scrollTop: 0}, 'slow');
        }
      });

      $("#admin_config_tab").on("click","#import_pharmacy",function(){
        importPharmacyFromCSV($("#dhp_code_medication").val());
      });

      $("#admin_config_tab").on("click","#skipped_pharmacy_link",function(){
        $("#skipped_pharmacy_link_parent").hide();
      });

      $("#admin_config_tab").on("click","#skipped_lab_link",function(){
        getSkippedRowsFromCSV($(this).data("skip_row"));
      });

      $("#admin_config_tab").on("click","#skipped_medication_link",function(){
        $("#skipped_medication_list_parent").hide();
      });

      $("#admin_config_tab").on("click","#pharmacy_list_save",function(){
        savePharmacyList();
      });
    };
    var getSpecializationForDHPCode = function(dhp_code){
      $("#token_hospital_parent").css("display","block");
      $(".dhp-select-title").html("Add Hospital("+dhp_code+") Specialization Fields");
      $.couch.db(db).view("tamsa/getExitstingSpecializationDocByDhpcode",{
        success:function(data){
          var data_specialization;
          if(data.rows.length> 0){
            $('#specialization_hospital_tokenfield').tokenfield({"maxWidth":100,"beautify":false});
            data_specialization = data.rows[0].doc.specialization_list;
            $('#specialization_hospital_tokenfield').tokenfield('setTokens',data_specialization );
            $("#save_specialization_for_admin").attr("index",data.rows[0].doc._id);
            $("#save_specialization_for_admin").attr("rev",data.rows[0].doc._rev);
          }else{
            $('#specialization_hospital_tokenfield').tokenfield({"maxWidth":100,"beautify":false});
            data_specialization = $('#specialization_tokenfield').tokenfield('getTokensList').split(",");
            $('#specialization_hospital_tokenfield').tokenfield('setTokens',data_specialization );
          }
        },
        error:function(data){
          console.log(data);
        },
        key:dhp_code,
        include_docs:true
      });
    };
    var getActiveConfigTab = function() {
      $(".tab-pane").removeClass("active");
      $("#admin_config_tab").addClass("active");
      if($("#tokenfield_parent").find(".token").length > 0) {
        $("#tokenfield").tokenfield("setTokens", []);
      }
      clearSectionField();
      getActiveCarePlanTab();
    };
    var getActiveCarePlanTab = function(){
      $(".tab-pane").removeClass("active");
      $("#admin_config_tab").addClass("active");
      $(".content_tab").hide();
      $(".rmv_tab").removeClass("CategTextActive");
      $("#careplan_link_tab").addClass("CategTextActive");
      $("#admin_careplan_tab").show();
      getSectionList();
    };
    var getActiveSpecializationTab = function() {
      $(".tab-pane").removeClass("active");
      $("#admin_config_tab").addClass("active");
      $(".content_tab").hide();
      $(".rmv_tab").removeClass("CategTextActive");
      $("#specialization_tab").addClass("CategTextActive");
      $("#specialization_content").show();
      getSpecializationAll();
      $("#hospital_dhp_specialization").val("");
      getAllHospitalsDhpcode("hospital_dhp_specialization");
    };
    var getSpecializationAll = function(){
      $("#save_specialization_for_admin").attr("index","");
      $("#save_specialization_for_admin").attr("rev","");
      $("#token_hospital_parent").css("display","none");
      $.couch.db(db).openDoc("specialization_list",{
        success:function(data){
          $('#specialization_tokenfield').tokenfield({"maxWidth":100,"beautify":false});
          $('#specialization_tokenfield').tokenfield('setTokens', data.specialization);
        },
        error:function(data){
          if(data == 404) {
            $('#specialization_tokenfield').tokenfield({"maxWidth":100,"beautify":false});
          }else {
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          }
        }
      });
    };
    var getAllHospitalsDhpcode = function(id){
      $("#"+id).autocomplete({
        search: function(event, ui) { 
           $("#"+id).addClass('myloader');
        },
        source: function( request, response ) {
          $.couch.db(replicated_db).view("tamsa/getAllHospitals", {
            success: function(data) {
              response(data.rows);
              $("#"+id).removeClass('myloader');
            },
            error: function(status) {
              console.log(status);
            },
            startkey: [$("#"+id).val().trim()],
            endkey: [$("#"+id).val().trim()+"\u9999", {}],
            reduce:true,
            group:true,
            limit:5
          });
        },
        focus: function(event, ui) {
          return false;
        },
        minLength: 1,
        select: function( event, ui ) {
          if(ui.item.key[1] == "No results found"){
            if(id == "hospital_dhp_specialization"){
              $("#token_hospital_parent").css("display","none");
              $("#save_specialization_for_admin").attr("index","");
              $("#save_specialization_for_admin").attr("rev","");
            }else if(id == "dhp_code_pharmacy"){

            }else if(id == "dhp_code_lab"){
              
            }else if(id == "dhp_code_medication"){
              
            }else if(id == "admin_hospitals_for_patient_tags"){
              patientTagSections.getPatientTagsForAllHospital();
            }
            return false;
          }else{
            $(this).val(ui.item.key[2]);
            if(id == "hospital_dhp_specialization"){
              getSpecializationForDHPCode(ui.item.key[2]);
            }else if(id == "dhp_code_pharmacy"){
              getPharmacyContent(ui.item.key[2]);
            }else if(id == "dhp_code_lab"){
              // getSpecializationForDHPCode(ui.item.key[2]);
            }else if(id == "dhp_code_medication"){
              getMedicationListDetails(ui.item.key[2]);
            }else if(id == "admin_hospitals_for_patient_tags"){
              $("#hospital_label_name").html(ui.item.key[0]);
              patientTagSections.getPatientTagsForSelectedHospital(ui.item.key[2]);
            }
          }
          return false;
        },
        response: function(event, ui) {
          if (!ui.content.length) {
            $("#remove_patient_emailid").data("user_id", "");
            var noResult = { key: ['','No results found'],label:"No results found" };
            ui.content.push(noResult);
            //$("#message").text("No results found");
          }
        },
        open: function() {
          //$("#"+search_id).removeClass('myloader');
          $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
          $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        }
      }).
      data("uiAutocomplete")._renderItem = function(ul, item) {
        if (item.key[1] == "No results found") {
          return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a>" + item.key[1]+ "</a>")
            .appendTo(ul);
        }
        else {
          return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a><img class='patient_image_link img-responsive' style='height:50px; width:50px;'  src='images/profile-pic.png' id='remove_patientsearch_pic_"+item.key[1]+"'>  " + item.key[0] + "<small class='rght-float pdhp-search-box'>"+item.key[1]+"</small></a>")
            .appendTo(ul);
        }
      };    
    };
    var getSaveSpecializationAdmin = function(){
      $.blockUI();
      if(validationOnSaveSpecialization()){
        $.couch.db(db).openDoc("specialization_list",{
          success:function(data){
            data.specialization = $('#specialization_tokenfield').tokenfield('getTokensList').split(",");
            $.couch.db(db).saveDoc(data,{
              success:function(data){
                $.unblockUI();
              },
              error:function(data){
                newAlert("danger",reason);
                $("html, body").animate({scrollTop: 0}, 'slow');
                return false;
              }
            });
          },
          error:function(data){
            if(data == 404) {
              $('#specialization_tokenfield').tokenfield({"maxWidth":100,"beautify":false});
            }else {
              newAlert("danger",reason);
              $("html, body").animate({scrollTop: 0}, 'slow');
              return false;
            }
          }
        });
        if($("#token_hospital_parent").css("display") != "none"){
          var specialization_doc;
          if($("#save_specialization_for_admin").attr("index") && $("#save_specialization_for_admin").attr("rev")){
            specialization_doc = {
              doctype:            "hospital_specialization_list",
              added_by_id:        pd_data._id,
              indesrt_ts:         d,
              dhp_code:         $("#hospital_dhp_specialization").val(),
              added_by_name:      pd_data.first_name+" "+pd_data.last_name,
              specialization_list: $("#specialization_hospital_tokenfield").tokenfield('getTokensList').split(","),
              _id:                $("#save_specialization_for_admin").attr("index"),
              _rev:               $("#save_specialization_for_admin").attr("rev")
            };
            getSaveSpecializationAdminDhpcode(specialization_doc);
          }else{
            specialization_doc  = {
              doctype:            "hospital_specialization_list",
              added_by_id:        pd_data._id,
              indesrt_ts:         d,
              dhp_code:         $("#hospital_dhp_specialization").val(),
              added_by_name:      pd_data.first_name+" "+pd_data.last_name,
              specialization_list: $("#specialization_hospital_tokenfield").tokenfield('getTokensList').split(",")
            };
            getSaveSpecializationAdminDhpcode(specialization_doc);
          }
        }else{
          newAlert("success","Save Successfuylly....");
          $('html, body').animate({scrollTop: $("body").offset().top - 100}, 1000);
          getSpecializationAll();
        }
      }
    };
    var getSaveSpecializationAdminDhpcode = function(specialization_doc){
      $.couch.db(db).saveDoc(specialization_doc,{
        success:function(data){
          newAlert("success","Save Successfuylly....");
          $('html, body').animate({scrollTop: $("body").offset().top - 100}, 1000);
          getSpecializationAll();
        },
        error:function(data){
          console.log(data);
        }
      });
    };
    var getActivePharmacyTab = function() {
      $(".tab-pane").removeClass("active");
      $("#admin_config_tab").addClass("active");
      $(".content_tab").hide();
      $(".rmv_tab").removeClass("CategTextActive");
      $("#pharmacy_tab").addClass("CategTextActive");
      $("#pharmacy_content").show();
      // clearPharmacyForm();
      $("#dhp_code_pharmacy").val("");
      getAllHospitalsDhpcode("dhp_code_pharmacy");
      // getStates("pharmacy_list_state");
    };
    var getActiveMedicationTab = function() {
      $(".tab-pane").removeClass("active");
      $("#admin_config_tab").addClass("active");
      $(".content_tab").hide();
      $(".rmv_tab").removeClass("CategTextActive");
      $("#medication_tab").addClass("CategTextActive");
      $("#medication_content").show();
      $("#dhp_code_medication").val("");
      getAllHospitalsDhpcode("dhp_code_medication");
    };

    var getActiveLabtestTab = function() {
      $(".tab-pane").removeClass("active");
      $("#admin_config_tab").addClass("active");
      $(".content_tab").hide();
      $(".rmv_tab").removeClass("CategTextActive");
      $("#labtest_tab").addClass("CategTextActive");
      $("#labtest_content").show();
      $("#dhp_code_lab").val("");
      getAllHospitalsDhpcode("dhp_code_lab");
      getLabTestContent();
    };

    // var clearPharmacyForm = function(){
    //   $("#dhp_code_pharmacy").val("Select DHP CODE");
    //   $("#pharmacy_list_name").val("");
    //   $("#pharmacy_list_phone").val("");
    //   $("#pharmacy_list_fax").val("");
    //   $("#pharmacy_list_email").val("");
    //   $("#pharmacy_list_street").val("");
    //   $("#pharmacy_list_city").val("select city");
    //   $("#pharmacy_list_state").val("Select State");
    //   $("#pharmacy_list_zip").val("");
    // }

    var savePharmacyList = function(){
      if(validatePharmacy()){
        var d  = new Date();
        var pharmacy_doc = {
          insert_ts:       d,
          doctype:         "pharmacy",
          dhp_code:        $("#dhp_code_pharmacy").val(),
          pharmacy_name:   $("#pharmacy_list_name").val(),
          pharmacy_phone:  $("#pharmacy_list_phone").val(),
          pharmacy_fax:    $("#pharmacy_list_fax").val(),
          pharmacy_email:  $("#pharmacy_list_email").val(),
          pharmacy_street: $("#pharmacy_list_street").val(),
          pharmacy_city:   $("#pharmacy_list_city").val(),
          pharmacy_state:  $("#pharmacy_list_state").val(),
          pharmacy_zip:    $("#pharmacy_list_zip").val()
        };

        var cron_pharmacy_doc = {
          doctype:         'cronRecords',
          operation_case:  '8',
          processed:       'No',
          dhp_code:        $("#dhp_code_pharmacy").val(),
          pharmacy_name:   $("#pharmacy_list_name").val(),
          pharmacy_phone:  $("#pharmacy_list_phone").val(),
          pharmacy_fax:    $("#pharmacy_list_fax").val(),
          pharmacy_email:  $("#pharmacy_list_email").val(),
          pharmacy_street: $("#pharmacy_list_street").val(),
          pharmacy_city:   $("#pharmacy_list_city").val(),
          pharmacy_state:  $("#pharmacy_list_state").val(),
          pharmacy_zip:    $("#pharmacy_list_zip").val()
        };

        $.couch.db(db).saveDoc(pharmacy_doc, {
          success: function(data) {
            $.couch.db(db).saveDoc(cron_pharmacy_doc,{
              success: function(data){
                newAlert('success', 'Pharmacy added successfully !');
                $('html, body').animate({scrollTop: 0}, 'slow');
                clearPharmacyForm();
              },
              error:function(data) {
                $("#pharmacy_save").removeAttr("disabled");
                newAlert('error', reason);
                $('html, body').animate({scrollTop: 0}, 'slow');
              }
            })
          },
          error: function(data, error, reason) {
            $("#pharmacy_save").removeAttr("disabled");
            newAlert('danger', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');
          }
        })
      }
    }

    // var validatePharmacy = function(){
    //   if($('#pharmacy_list_name').val() == ""){
    //     newAlert("danger","Please enter Pharmacy name Name.");
    //     return false;
    //   }else if($('#pharmacy_list_phone').val() == ""){
    //     newAlert("danger","Please enter Phone.");
    //     return false;
    //   }else if($('#dhp_code_pharmacy').val() == "Select DHP CODE" || $('#dhp_code_pharmacy').val() == ""){
    //     newAlert("danger","Please select Dhp code.");
    //     return false;
    //   }else if($("#pharmacy_list_street").val().trim() == ""){
    //     newAlert("danger","Please enter street.");
    //     return false;
    //   }else if($("#pharmacy_list_state").val() == "Select State" || $("#pharmacy_list_state").val() == ""){
    //     newAlert("danger","Please select state.");
    //     return false;
    //   }else if($("#pharmacy_list_city").val() == "select city" || $("#pharmacy_list_city").val() == ""){
    //     newAlert("danger","Please select city.");
    //     return false;
    //   }else if($("#pharmacy_list_zip").val().trim() == ""){
    //     newAlert("danger","Please enter zip code.");
    //     return false;
    //   }else{
    //     return true;
    //   }
    // }

    var getActiveHospitalTab = function() {
      $(".tab-pane").removeClass("active");
      $("#admin_config_tab").addClass("active");
      $(".content_tab").hide();
      $(".rmv_tab").removeClass("CategTextActive");
      $("#hospital_tab").addClass("CategTextActive");
      $("#hospital_content").show();
    };

    var getMedicationListDetails = function(id){
      $("#medication_list_table tbody").html('');
      $.couch.db(db).view("tamsa/getMedicationList", {
        success: function(data) {
          if(data.rows.length > 0){
            var skip_row = 0;
            var html = [];
            paginationConfigurationMedication(data.rows.length,"medication_list_pagination",15,displayMedicationList,id);
            for (var i = 0; i < 15; i++) {
              if(i == data.rows.length){
                break;
              }
              html.push('<tr><td class="text-center name_medication">'+data.rows[i].key[1]+'</td><td class="text-center disperse_medication">'+(data.rows[i].key[4] ? data.rows[i].key[4] : "NA")+'</td><td class="text-center dose_medication">'+(data.rows[i].key[2] ? data.rows[i].key[2] : "NA")+'</td><td class="text-center unit_medication">'+(data.rows[i].key[3] ? data.rows[i].key[3] : "NA")+'</td><td class="text-center route_medication">'+(data.rows[i].key[5] ? data.rows[i].key[5] : "NA")+'</td></tr>');
            };         
            $("#medication_list_table tbody").html(html.join(''));
          }else{
            $("#medication_list_table tbody").html("<tr><td colspan='6'>No record found</td></tr>");
          }
        },
        error: function(status) {
          console.log(status);
        },
        startkey: [id],
        endkey:   [id,{}, {}, {}],
        reduce:   true,
        group:    true
      });    
    }

    var displayMedicationList = function(skip_row,limit,id){
      var html = [];
      $.couch.db(db).view("tamsa/getMedicationList", {
        success: function(data) {
          if(data.rows.length > 0){
            for (var i = 0; i < data.rows.length; i++) {
              html.push('<tr><td class="text-center name_medication">'+data.rows[i].key[1]+'</td><td class="text-center disperse_medication">'+(data.rows[i].key[4] ? data.rows[i].key[4] : "NA")+'</td><td class="text-center dose_medication">'+(data.rows[i].key[2] ? data.rows[i].key[2] : "NA")+'</td><td class="text-center unit_medication">'+(data.rows[i].key[3] ? data.rows[i].key[3] : "NA")+'</td><td class="text-center route_medication">'+(data.rows[i].key[5] ? data.rows[i].key[5] : "NA")+'</td></tr>');
            };         
            $("#medication_list_table tbody").html(html.join(''));
          }
        },
        error:function(data){
          console.log(data);
        },
        startkey: [id],
        endkey:   [id,{}, {}, {}],
        skip:     skip_row,
        limit:    limit,
        reduce:   true,
        group:    true
      });
    }

    var getLabTestContent =  function(dhp_code){
      $.blockUI();
      $("#lab_table tbody").html("");
      $.couch.db(db).view("tamsa/getAllLabDetails", {
        success: function(data) {
          if(data.rows.length > 0){
            // var img = "<optgroup label='Imaging'>";
            // var lab = "<optgroup label='Lab'>";
            // var total = "";
            // for (var i = 0; i < data.rows.length; i++) {
            //   if(data.rows[i].key[2] == "Imaging"){
            //     img +="<option value='"+data.rows[i].value._id+"'>"+data.rows[i].value.imaging_name+"</option>";
            //   }else{
            //     lab +="<option value='"+data.rows[i].value._id+"'>"+data.rows[i].value.lab_name+"</option>";
            //   }
            // };
            // lab +="</optgroup>"
            // img +="</optgroup>"
            // total = img+lab;
            // $("#lab_test").html(total);
            paginationConfigurationMedication(data.rows.length,"lab_records_pagination",10,displayLabAndImaging);
            var data_lab = [];
            for (var i = 0; i < 10; i++) {
              if(i == data.rows.length){
                break;
              }
              if(data.rows[i].value.imaging_name){
                data_lab.push('<tr><td>'+data.rows[i].value.imaging_name+'</td>');
              }else{
                data_lab.push('<tr><td>'+data.rows[i].value.lab_name+'</td>');
              }
              data_lab.push('<td>'+(data.rows[i].value.contact_person_phone ? data.rows[i].value.contact_person_phone : "NA" )+'</td><td>'+(data.rows[i].value.contact_person_mobile ? data.rows[i].value.contact_person_mobile : "NA")+'</td><td>'+(data.rows[i].value.contact_person_email ? data.rows[i].value.contact_person_email : "NA")+'</td><td>'+(data.rows[i].value.Services ? data.rows[i].value.Services : "NA")+'</td><td>'+(data.rows[i].value.website ? data.rows[i].value.website : "NA")+'</td></tr>');
              $("#lab_table tbody").html(data_lab.join(''));
            }
            $.unblockUI();
          }else{
            $.unblockUI();
            console.log("not found any d");
            total = '<option value="">Select Lab or Imaging</option>';
            $("#lab_test").html(total);
            $("#lab_table tbody").html("<tr><td colspan='9'>No record found</td></tr>");
          }
        },
        error: function(status) {
          console.log(status);
        },
        desending:true
      });
    };
    var paginationConfigurationMedication = function (len,pagination_div_id,rows_per_page,displayWithPagination,id){
      var limit = rows_per_page;
      $("#"+pagination_div_id).unbind('page');
      var total_rows = parseInt(len / rows_per_page);
      if(len % rows_per_page > 0) total_rows += 1;
      $("#"+pagination_div_id).bootpag({
        total: total_rows,
        maxVisible: rows_per_page
      }).on("page", function(event, /* page number here */ num){
        event.stopPropagation();
        if(id){
          displayWithPagination(rows_per_page*(num -1),rows_per_page,id);
        }else{
          displayWithPagination(rows_per_page*(num -1),rows_per_page);
        }
      });
    };
    var displayLabAndImaging = function(skip,limit){
      var data_lab=[];
      $.blockUI();
      $.couch.db(db).view("tamsa/getAllLabDetails", {
        success: function(data) {
          if(data.rows.length > 0){
            for (var i = 0; i <data.rows.length; i++) {
              if(data.rows[i].value.imaging_name){
                data_lab.push('<tr><td>'+data.rows[i].value.imaging_name+'</td>');
              }else{
                data_lab.push('<tr><td>'+data.rows[i].value.lab_name+'</td>');
              }
              data_lab.push('<td>'+(data.rows[i].value.contact_person_phone ? data.rows[i].value.contact_person_phone : "NA" )+'</td><td>'+(data.rows[i].value.contact_person_mobile ? data.rows[i].value.contact_person_mobile : "NA")+'</td><td>'+(data.rows[i].value.contact_person_email ? data.rows[i].value.contact_person_email : "NA")+'</td><td>'+(data.rows[i].value.Services ? data.rows[i].value.Services : "NA")+'</td><td>'+(data.rows[i].value.website ? data.rows[i].value.website : "NA")+'</td></tr>');
            }
            $("#lab_table tbody").html(data_lab.join(''));
            $.unblockUI();
          }else{
            $.unblockUI();
            $("#lab_table tbody").html("<tr><td colspan='9'>No record found</td></tr>");
          }
        },
        error: function(status) {
          console.log(status);
        },
        skip:skip,
        limit:limit,
        desending:true
      });
    };
    var getLabTestValues = function(id){
      $("#lab_test_tokefield_parent").css("display","block");
      $.couch.db(db).openDoc(id,{
        success:function(data){
          console.log(data);
          if(data.services && data.services != ""){
          $('#lab_test_tokefield').tokenfield({"maxWidth":100,"beautify":false});
          $('#lab_test_tokefield').tokenfield('setTokens', data.services.split(','));
        }
        // }else if(data.Services){
        //   $('#lab_test_tokefield').tokenfield({"maxWidth":100,"beautify":false});
        //   $('#lab_test_tokefield').tokenfield('setTokens', data.services.split(','));
        // }
        },
        error:function(data){
          console.log(data);
        }
      });
    };
    var importLabAndImagingFromCSV = function(){
      if($("#import_lab_imging_file").val()){
        var filedata = $("#import_lab_imging_file").prop('files')[0];
        if(filedata.name.slice(-3) == "csv"){
          getLabAndImagingDetailsFromCsv(filedata);
        }else{
          newAlert("danger","Importing file is not csv, Please select csv file")
        }
      }else{
        newAlert("danger","No file Select to import");
        $("html, body").animate({scrollTop: 0},'slow');
      }
    };
    var getLabAndImagingDetailsFromCsv = function(filedata){
      var reader = new FileReader();
      reader.readAsText(filedata);
      reader.onload = function(event){
        var csv = event.target.result;
        var data = $.csv.toArrays(csv);
        if(validationImportLabAndImagingDetails(data)){
          var bulk_records = [];
          var skip_records = [];
          $("#import_lab_imging").data("total_rows",data.length -1);
          for(var i = 1;i<data.length;i++){
            validationExistingLabAndImaging(data,i,bulk_records,skip_records);
          }
        }
      }
    };
    var validationExistingLabAndImaging = function(data,i,bulk_records,skip_records){
      if(data[i][0] == "" || data[i][1] == "" || data[i][2] == "" || data[i][3]  == "" || data[i][6] == "" || data[i][7] == "" || data[i][8] == "" || data[i][9] == ""){
        data[i].push("One of the Required filed is Blank.");
        skip_records.push(data[i]);
        $("#import_lab_imging").data("total_rows",$("#import_lab_imging").data("total_rows")-1);
        if($("#import_lab_imging").data("total_rows") == "0"){
          saveLabAndImagingDetailsFromCSV(bulk_records,skip_records);
        }
      }else if(i!= 1){
        for(var j=i-1;j>0;j--){
          if(data[j][0] == data[i][0] && data[j][1] == data[i][1] && data[j][2] == data[i][2] && data[j][3] == data[i][3] && data[j][4] == data[i][4]){
            var error = true;
            break;
          }
        }
        if(error){
          data[i].push("Inventory Already Exists within importing File.")
          skip_records.push(data[i]);
          $("#import_lab_imging").data("total_rows",$("#import_lab_imging").data("total_rows")-1);
          if($("#import_lab_imging").data("total_rows") == "0"){
            saveLabAndImagingDetailsFromCSV(bulk_records,skip_records);
          }
        }else{
          validationForAlreadyExistsLabAndImagingInDB(data,i,bulk_records,skip_records);
        }
      }else{
        validationForAlreadyExistsLabAndImagingInDB(data,i,bulk_records,skip_records);
      }
    };
    var saveLabAndImagingDetailsFromCSV = function(bulk_records,skip_records){
      if(bulk_records.length > 0){
        $.couch.db(db).bulkSave({"docs":bulk_records},{
          success:function(data){
            if(skip_records.length > 0){
              $("#skipped_lab_link_parent").show();
              $("#skipped_lab_link").data("skip_row",skip_records);
              newAlert('warning', "Lab and Imaging partially imported with skipped Rows.");
            }else{
              $("#skipped_lab_link_parent").hide();
              $("#skipped_lab_link").data("skip_row","");
              newAlert('success', "Lab and Imaging  successfully Imported.");
            }
            $("#import_lab_imging_file").val("");
            $('html, body').animate({scrollTop: 0}, 'slow');
            
          },
          error:function(data,error,reason){
            newAlert('danger', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');       
          }
        });    
      }else{
        if(skip_records.length > 0){
          $("#skipped_lab_link_parent").show();
          $("#skipped_lab_link").data("skip_row",skip_records);
          newAlert('danger', "Lab and Imaging  Details are invalid.");
        }else{
          $("#skipped_lab_link_parent").hide();
          $("#skipped_lab_link").data("skip_row","");
          newAlert('danger', "No Lab and Imaging Details are found in importing File.");
        }
        $("#import_lab_imging_file").val("");
        $('html, body').animate({scrollTop: 0}, 'slow');
      }
    };
    var validationForAlreadyExistsLabAndImagingInDB = function(data,i,bulk_records,skip_records){
      $.couch.db(db).view("tamsa/getAllLabDetails", {
        success: function(udata){
          if(udata.rows.length > 0){
            data[i].push("Lab and Imaging Details already exists.");
            skip_records.push(data[i]);
          }else{  
            var d          = new Date();
            var lab_dhp_id = "SHS-L"+getInvitationcode();
            var lab_doc    = {
              _id:                          "SHS-L"+getInvitationcode(),
              insert_ts:                    d,
              // doctor_id:                 data[i][],
              dhp_code:                    $("#dhp_code_lab").val(),
              state:                        data[i][2],
              city:                         data[i][3],
              address:                      data[i][4],
              doctor_reference_id_with_lab: data[i][5],
              contact_person_name:          data[i][6],
              contact_person_email:         data[i][7],
              contact_person_phone:         data[i][8],
              lab_dhp_id:                   lab_dhp_id,
              website:                      data[i][10],
              services:                     data[i][9]
            };

            var cron_lab_record = {
              processed:                    "No",
              doctype:                      "cronRecords",
              dhp_code:                     $("#dhp_code_lab").val(),
              city:                         data[i][2],
              state:                        data[i][1],
              address:                      data[i][3],
              doctor_reference_id_with_lab: data[i][4],
              contact_person_name:          data[i][5],
              contact_person_email:         data[i][6],
              contact_person_phone:         data[i][7],
              lab_dhp_id:                   lab_dhp_id,
              website:                      data[i][9],
              services:                     data[i][8]
            }

            if(data[i][0] == "Lab"){
              cron_lab_record.operation_case = "3";
              lab_doc.lab_name               = data[i][1];
              lab_doc.doctype               = data[i][0];
              cron_lab_record.lab_name       = data[i][1];
            }else {
              cron_lab_record.operation_case = "4";
              lab_doc.imaging_name           = data[i][1];
              lab_doc.doctype                = data[i][0];
              cron_lab_record.imaging_name   = data[i][1];
            }
            bulk_records.push(lab_doc);
            bulk_records.push(cron_lab_record);
          }
          $("#import_lab_imging").data("total_rows",$("#import_lab_imging").data("total_rows")-1);
          if($("#import_lab_imging").data("total_rows") == "0"){
            saveLabAndImagingDetailsFromCSV(bulk_records,skip_records);
          }
        },
        error: function(data,error,reason){
          console.log(data);
        },
        key: [0,data[i][0],data[i][8]],
        reduce : false
      });
    };

    var validationImportLabAndImagingDetails = function(data){
      if(data.length == 0 || data.length ==1){
         newAlert('danger', "Invalid CSV file. Please import valid csv file.");
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }else if(data[0][0] != "Type" || data[0][1] != "Lab/Imaging Name" || data[0][2]  != "State" || data[0][3]  != "City" || data[0][4]  != "Address if known" || data[0][5]  != "Your account number or reference id with the lab" || data[0][6]  != "Contact Person name" || data[0][7]  != "Contact Person email" || data[0][8]  != "Contact Person Phone" || data[0][9]  != "Services" || data[0][10]  != "Website"){
        newAlert('danger', "Invalid CSV file. Please import valid csv file.");
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }else{
        return true;
      } 
    };

    var getSkippedRowsFromCSV = function(skip_records){
      var header = ["Type","Lab/Imaging Name","State","City","Address if known","Your account number or reference id with the lab","Contact Person name","Contact Person email","Contact Person Phone","Services","Website"];
      skip_records.unshift(header);
      var csvContent = "data:text/csv;charset=utf-8,";
      skip_records.forEach(function(infoArray, index){
         dataString = infoArray.join(",");
         csvContent += index < skip_records.length ? dataString+ "\n" : dataString;
      });
      var encodedUri = encodeURI(csvContent);
      $("#skipped_lab_link").attr("href",encodedUri);
      $("#skipped_lab_link").attr("download", "error.csv");
      $("#f").hide();
    };

    var importMedicationFromCSV = function(dhp_code){
      if($("#import_medication_list_file").val()){
        var filedata = $("#import_medication_list_file").prop('files')[0];
        if(filedata.name.slice(-3) == "csv"){
          $.blockUI();
          getMedicationDetailsFromCsv(filedata,dhp_code);
          $.unblockUI();
        }else{
          newAlert("danger","Importing file is not csv, Please select csv file")
        }
      }else{
        newAlert("danger","No file Select to import");
        $("html, body").animate({scrollTop: 0},'slow');
      }
    };
    var getMedicationDetailsFromCsv = function(filedata,dhp_code){
      var reader = new FileReader();
      reader.readAsText(filedata);
      reader.onload = function(event){
        var csv = event.target.result;
        var data = $.csv.toArrays(csv);
        if(validationImportMedicationDetails(data)){
          $.blockUI();
          var bulk_records = [];
          var skip_records = [];
          $("#import_medication_list").data("total_rows",data.length -1);
          for(var i = 1;i<data.length;i++){
            validationExistingMedication(data,i,bulk_records,skip_records,dhp_code);
          }
        }
      }
    };
    var validationExistingMedication = function(data,i,bulk_records,skip_records,dhp_code){
      if(data[i][0] == "" || data[i][1] == "" || data[i][2] == "" || data[i][3] == ""){
        data[i].push("One of the Required filed is Blank.");
        skip_records.push(data[i]);
        $("#import_medication_list").data("total_rows",$("#import_medication_list").data("total_rows")-1);
        if($("#import_medication_list").data("total_rows") == "0"){
          saveMedicationDetailsFromCSV(bulk_records,skip_records,dhp_code);
        }
      }else if(i!= 1){
        for(var j=i-1;j>0;j--){
          if(data[j][0] == data[i][0] && data[j][1] == data[i][1] && data[j][2] == data[i][2] && data[j][3] == data[i][3] && data[j][4] == data[i][4]){
            var error = true;
            break;
          }
        }
        if(error){
          data[i].push("Inventory Already Exists within importing File.")
          skip_records.push(data[i]);
          $("#import_medication_list").data("total_rows",$("#import_medication_list").data("total_rows")-1);
          if($("#import_medication_list").data("total_rows") == "0"){
            saveMedicationDetailsFromCSV(bulk_records,skip_records,dhp_code);
          }
        }else{
          validationForAlreadyExistsMedicationInDB(data,i,bulk_records,skip_records,dhp_code);
        }
      }else{
        validationForAlreadyExistsMedicationInDB(data,i,bulk_records,skip_records,dhp_code);
      }
    };
    var saveMedicationDetailsFromCSV = function(bulk_records,skip_records,dhp_code){
      if(bulk_records.length > 0){
        $.couch.db(db).view("tamsa/getMedicationList", {
          success: function(data) {
            if(data.rows.length > 0) {
              var medicationslist = data.rows[0].doc.medication_list.concat(bulk_records);
              var docSave = {
                _id:             data.rows[0].doc._id,
                _rev:            data.rows[0].doc._rev,
                dhp_code:        data.rows[0].doc.dhp_code,
                doctype:         data.rows[0].doc.doctype,
                medication_list: medicationslist
              }
              saveMedicationListFinal(docSave,skip_records);
            }else{
              var docSave = {
                dhp_code:dhp_code,
                doctype: "medication_list",
                medication_list: bulk_records
              }
              saveMedicationListFinal(docSave,skip_records);
            }
          },
          error:function(status){
            console.log(status);
          },
          startkey: [dhp_code],
          endkey:   [dhp_code,{}, {}, {}],
          reduce : false,
          include_docs:true
        }); 
      }else{
        $.unblockUI();
        if(skip_records.length > 0){
          $("#skipped_medication_list_parent").show();
          $("#skipped_medication_link").data("skip_row",skip_records);
          newAlert('danger', "Lab and Imaging  Details are invalid.");
          getSkippedRowsFromCSVMedication(skip_records);
        }else{
          $("#skipped_medication_list_parent").hide();
          $("#skipped_medication_link").data("skip_row","");
          newAlert('danger', "No Lab and Imaging Details are found in importing File.");
        }
        $("#import_medication_list_file").val("");
        $('html, body').animate({scrollTop: 0}, 'slow');
      }
    };

    var saveMedicationListFinal = function(docSave,skip_records){
      $.couch.db(db).saveDoc(docSave,{
        success:function(data){
          if(skip_records.length > 0){
            $("#skipped_medication_list_parent").show();
            $("#skipped_medication_link").data("skip_row",skip_records);
            getSkippedRowsFromCSVMedication(skip_records);
            newAlert('warning', "Medication partially imported with skipped Rows.");
          }else{
            $("#skipped_medication_list_parent").hide();
            $("#skipped_medication_link").data("skip_row","");
            newAlert('success', "Medication successfully Imported.");
          }
          $.unblockUI();
          $("#import_medication_list_file").val("");
          $('html, body').animate({scrollTop: 0}, 'slow');
          
        },
        error:function(data,error,reason){
          newAlert('danger', reason);
          $('html, body').animate({scrollTop: 0}, 'slow');       
        }
      });
    }

    var validationForAlreadyExistsMedicationInDB = function(data,i,bulk_records,skip_records,dhp_code){
      $.couch.db(db).view("tamsa/getMedicationList", {
        success: function(mdata) {
          if(mdata.rows.length > 0) {
            var store = false;
            for (var j = 0; j < mdata.rows[0].doc.medication_list.length; j++) {
              if(mdata.rows[0].doc.medication_list[j].drug_name == data[i][0] && mdata.rows[0].doc.medication_list[j].strength == data[i][2] && mdata.rows[0].doc.medication_list[j].units == data[i][3] && mdata.rows[0].doc.medication_list[j].type == data[i][1]){ 
                data[i].push("Medication Details already exists.");
                skip_records.push(data[i]);
                store = false;
                break;
              }else{
                store = true;
              }
            }
            if(store){
              var medication_doc = {
                drug_name: data[i][0],
                type:      data[i][1],
                strength:  data[i][2],
                units:     data[i][3],
                route:     data[i][4]
              };
              bulk_records.push(medication_doc);  
            }
          }else{
            var medication_doc = {
              drug_name: data[i][0],
              type:      data[i][1],
              strength:  data[i][2],
              units:     data[i][3],
              route:     data[i][4]
            };
            bulk_records.push(medication_doc);
          }
          $("#import_medication_list").data("total_rows",$("#import_medication_list").data("total_rows")-1);
          if($("#import_medication_list").data("total_rows") == "0"){
            saveMedicationDetailsFromCSV(bulk_records,skip_records,dhp_code);
          }
        },
        error:function(status){
          console.log(status);
        },
        startkey: [dhp_code],
        endkey:   [dhp_code,{}, {}, {}],
        reduce : false,
        include_docs:true
      });
    };
    var validationImportMedicationDetails = function(data){
      if(data.length == 0 || data.length ==1){
         newAlert('danger', "Invalid CSV file. Please import valid csv file.");
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }else if(data[0][0] != "Medication name" || data[0][1] != "Disperse Form" || data[0][2]  != "Dose" || data[0][3]  != "Units" || data[0][4]  != "Route"){
        newAlert('danger', "Invalid CSV file. Please import valid csv file.");
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }else{
        return true;
      } 
    };
    var getSkippedRowsFromCSVMedication = function(skip_records){
      var header = ["Medication name","Disperse Form","Dose","Units","Route"];
      skip_records.unshift(header);
      var csvContent = "data:text/csv;charset=utf-8,";
      skip_records.forEach(function(infoArray, index){
         dataString = infoArray.join(",");
         csvContent += index < skip_records.length ? dataString+ "\n" : dataString;
      });
      var encodedUri = encodeURI(csvContent);
      $("#skipped_medication_link").attr("href",encodedUri);
      $("#skipped_medication_link").attr("download", "error.csv");
    };

    //For Pharmacy testing
    var getPharmacyContent =  function(dhp_code){
      $.blockUI();
      $("#pharmacy_list_table tbody").html("");
      $.couch.db(db).view("tamsa/getPharmacy", {
        success: function(data) {
          if(data.rows.length > 0){
            paginationConfigurationMedication(data.rows.length,"pharmacy_list_pagination",10,displayAllPharmacy,dhp_code);
            var data_lab = [];
            for (var i = 0; i < 10; i++) {
              if(i == data.rows.length){
                break;
              }
              data_lab.push('<tr><td>'+data.rows[i].value.pharmacy_name+'</td><td>'+(data.rows[i].value.pharmacy_phone ? data.rows[i].value.pharmacy_phone : "NA" )+'</td><td>'+(data.rows[i].value.pharmacy_fax ? data.rows[i].value.pharmacy_fax : "NA" )+'</td><td>'+(data.rows[i].value.pharmacy_email ? data.rows[i].value.pharmacy_email : "NA")+'</td><td>'+(data.rows[i].value.pharmacy_street ? data.rows[i].value.pharmacy_street : "NA")+'</td><td>'+(data.rows[i].value.pharmacy_state ? data.rows[i].value.pharmacy_state : "NA")+'</td><td>'+(data.rows[i].value.pharmacy_city ? data.rows[i].value.pharmacy_city : "NA")+'</td><td>'+(data.rows[i].value.pharmacy_zip ? data.rows[i].value.pharmacy_zip : "NA")+'</td><td>'+(data.rows[i].value.dhp_code ? data.rows[i].value.dhp_code : "NA")+'</td></tr>');
              $("#pharmacy_list_table tbody").html(data_lab.join(''));
            }
            $.unblockUI();
          }else{
            $.unblockUI();
            console.log("not found any d");
            total = '<option value="">Select Lab or Imaging</option>';
            $("#lab_test").html(total);
            $("#pharmacy_list_table tbody").html("<tr><td colspan='9'>No record found</td></tr>");
          }
        },
        error: function(status) {
          console.log(status);
        },
        startkey:[dhp_code],
        endkey:[dhp_code,{}],
      });
    };
    
    var displayAllPharmacy = function(skip,limit,dhp_code){
      var data_lab=[];
      $.blockUI();
      $.couch.db(db).view("tamsa/getPharmacy", {
        success: function(data) {
          if(data.rows.length > 0){
            for (var i = 0; i <data.rows.length; i++) {
              if(data.rows[i].value.imaging_name){
                data_lab.push('<tr><td>'+data.rows[i].value.imaging_name+'</td>');
              }else{
                data_lab.push('<tr><td>'+data.rows[i].value.lab_name+'</td>');
              }
              data_lab.push('<td>'+(data.rows[i].value.contact_person_phone ? data.rows[i].value.contact_person_phone : "NA" )+'</td><td>'+(data.rows[i].value.contact_person_mobile ? data.rows[i].value.contact_person_mobile : "NA")+'</td><td>'+(data.rows[i].value.contact_person_email ? data.rows[i].value.contact_person_email : "NA")+'</td><td>'+(data.rows[i].value.Services ? data.rows[i].value.Services : "NA")+'</td><td>'+(data.rows[i].value.website ? data.rows[i].value.website : "NA")+'</td></tr>');
            }
            $("#pharmacy_list_table tbody").html(data_lab.join(''));
            $.unblockUI();
          }
        },
        error: function(status) {
          console.log(status);
        },
        startkey:[dhp_code],
        endkey:[dhp_code,{}],
        skip:skip,
        limit:limit,
      });
    };
    var importPharmacyFromCSV = function(){
      if($("#import_pharmacy_file").val()){
        var filedata = $("#import_pharmacy_file").prop('files')[0];
        if(filedata.name.slice(-3) == "csv"){
          getPharmacyDetailsFromCsv(filedata);
        }else{
          newAlert("danger","Importing file is not csv, Please select csv file")
        }
      }else{
        newAlert("danger","No file Select to import");
        $("html, body").animate({scrollTop: 0},'slow');
      }
    };
    var getPharmacyDetailsFromCsv = function(filedata){
      var reader = new FileReader();
      reader.readAsText(filedata);
      reader.onload = function(event){
        var csv = event.target.result;
        var data = $.csv.toArrays(csv);
        if(validationImportPharmacyDetails(data)){
          var bulk_records = [];
          var skip_records = [];
          $("#import_pharmacy").data("total_rows",data.length -1);
          for(var i = 1;i<data.length;i++){
            validationExistingPharmacy(data,i,bulk_records,skip_records);
          }
        }
      }
    };
    var validationExistingPharmacy = function(data,i,bulk_records,skip_records){
      if(data[i][0] == "" || data[i][1] == "" || data[i][4]  == "" || data[i][5] == "" || data[i][6] == "" || data[i][7] == ""){
        data[i].push("One of the Required filed is Blank.");
        skip_records.push(data[i]);
        $("#import_pharmacy").data("total_rows",$("#import_pharmacy").data("total_rows")-1);
        if($("#import_pharmacy").data("total_rows") == "0"){
          savePharmacyDetailsFromCSV(bulk_records,skip_records);
        }
      }else if(i!= 1){
        for(var j=i-1;j>0;j--){
          if(data[j][0] == data[i][0] && data[j][1] == data[i][1] && data[j][4] == data[i][4] && data[j][5] == data[i][5] && data[j][6] == data[i][6] && data[j][7] == data[i][7]){
            var error = true;
            break;
          }
        }
        if(error){
          data[i].push("Pharmacy Already Exists within importing File.")
          skip_records.push(data[i]);
          $("#import_pharmacy").data("total_rows",$("#import_pharmacy").data("total_rows")-1);
          if($("#import_pharmacy").data("total_rows") == "0"){
            savePharmacyDetailsFromCSV(bulk_records,skip_records);
          }
        }else{
          validationForAlreadyExistsPharmacyInDB(data,i,bulk_records,skip_records);
        }
      }else{
        validationForAlreadyExistsPharmacyInDB(data,i,bulk_records,skip_records);
      }
    };
    var savePharmacyDetailsFromCSV = function(bulk_records,skip_records){
      if(bulk_records.length > 0){
        $.couch.db(db).bulkSave({"docs":bulk_records},{
          success:function(data){
            if(skip_records.length > 0){
              $("#skipped_pharmacy_link_parent").show();
              $("#skipped_pharmacy_link").data("skip_row",skip_records);
              getPharmacySkippedRowsFromCSV(skip_records);
              newAlert('warning', "Lab and Imaging partially imported with skipped Rows.");
            }else{
              $("#skipped_pharmacy_link_parent").hide();
              $("#skipped_pharmacy_link").data("skip_row","");
              newAlert('success', "Lab and Imaging  successfully Imported.");
            }
            $("#import_pharmacy_file").val("");
            $('html, body').animate({scrollTop: 0}, 'slow');
            
          },
          error:function(data,error,reason){
            newAlert('danger', reason);
            $('html, body').animate({scrollTop: 0}, 'slow');       
          }
        });    
      }else{
        if(skip_records.length > 0){
          $("#skipped_pharmacy_link_parent").show();
          $("#skipped_pharmacy_link").data("skip_row",skip_records);
          newAlert('danger', "Lab and Imaging  Details are invalid.");
          getPharmacySkippedRowsFromCSV(skip_records);
        }else{
          $("#skipped_pharmacy_link_parent").hide();
          $("#skipped_pharmacy_link").data("skip_row","");
          newAlert('danger', "No Lab and Imaging Details are found in importing File.");
        }
        $("#import_pharmacy_file").val("");
        $('html, body').animate({scrollTop: 0}, 'slow');
      }
    };
    var validationForAlreadyExistsPharmacyInDB = function(data,i,bulk_records,skip_records){
      $.couch.db(db).view("tamsa/getPharmacy", {
        success: function(udata){
          if(udata.rows.length > 0){
            console.log(udata);
            var store = false;
            for (var j = 0; j < udata.rows.length; j++) {
              if(udata.rows[j].value.pharmacy_name == data[i][0] && udata.rows[j].value.pharmacy_phone == data[i][1] && udata.rows[j].value.pharmacy_street == data[i][4] && udata.rows[j].value.pharmacy_state == data[i][5] && udata.rows[j].value.pharmacy_city == data[i][6] &&udata.rows[j].value.pharmacy_zip == data[i][7]){
                store = false;
                break;
              }else{
                store = true;
              }
            };
            if(store){
              var d  = new Date();
              var pharmacy_doc = {
                insert_ts:       d,
                doctype:         "pharmacy",
                dhp_code:        data[i][8],
                pharmacy_name:   data[i][0],
                pharmacy_phone:  data[i][1],
                pharmacy_fax:    data[i][2],
                pharmacy_email:  data[i][3],
                pharmacy_street: data[i][4],
                pharmacy_city:   data[i][5],
                pharmacy_state:  data[i][6],
                pharmacy_zip:    data[i][7]
              };

              var cron_pharmacy_doc = {
                doctype:         'cronRecords',
                operation_case:  '8',
                processed:       'No',
                dhp_code:        data[i][8],
                pharmacy_name:   data[i][0],
                pharmacy_phone:  data[i][1],
                pharmacy_fax:    data[i][2],
                pharmacy_email:  data[i][3],
                pharmacy_street: data[i][4],
                pharmacy_city:   data[i][5],
                pharmacy_state:  data[i][6],
                pharmacy_zip:    data[i][7]
              };
              bulk_records.push(cron_pharmacy_doc);
              bulk_records.push(pharmacy_doc);
            }else{
              data[i].push("Lab and Imaging Details already exists.");
              skip_records.push(data[i]);
            }
          }else{  
            var d  = new Date();
            var pharmacy_doc = {
              insert_ts:       d,
              doctype:         "pharmacy",
              dhp_code:        data[i][8],
              pharmacy_name:   data[i][0],
              pharmacy_phone:  data[i][1],
              pharmacy_fax:    data[i][2],
              pharmacy_email:  data[i][3],
              pharmacy_street: data[i][4],
              pharmacy_city:   data[i][5],
              pharmacy_state:  data[i][6],
              pharmacy_zip:    data[i][7]
            };

            var cron_pharmacy_doc = {
              doctype:         'cronRecords',
              operation_case:  '8',
              processed:       'No',
              dhp_code:        data[i][8],
              pharmacy_name:   data[i][0],
              pharmacy_phone:  data[i][1],
              pharmacy_fax:    data[i][2],
              pharmacy_email:  data[i][3],
              pharmacy_street: data[i][4],
              pharmacy_city:   data[i][5],
              pharmacy_state:  data[i][6],
              pharmacy_zip:    data[i][7]
            };
            bulk_records.push(cron_pharmacy_doc);
            bulk_records.push(pharmacy_doc);
          }
          $("#import_pharmacy").data("total_rows",$("#import_pharmacy").data("total_rows")-1);
          if($("#import_pharmacy").data("total_rows") == "0"){
            savePharmacyDetailsFromCSV(bulk_records,skip_records);
          }
        },
        error: function(data,error,reason){
          console.log(data);
        },
        startkey: [data[i][8]],
        endkey: [data[i][8],{}],
      });
    };

    var savePharmacyForList = function(data,i,bulk_records,skip_records){
       var d  = new Date();
        var pharmacy_doc = {
          insert_ts:       d,
          doctype:         "pharmacy",
          dhp_code:        data[i][8],
          pharmacy_name:   data[i][0],
          pharmacy_phone:  data[i][1],
          pharmacy_fax:    data[i][2],
          pharmacy_email:  data[i][3],
          pharmacy_street: data[i][4],
          pharmacy_city:   data[i][5],
          pharmacy_state:  data[i][6],
          pharmacy_zip:    data[i][7]
        };

        var cron_pharmacy_doc = {
          doctype:         'cronRecords',
          operation_case:  '8',
          processed:       'No',
          dhp_code:        data[i][8],
          pharmacy_name:   data[i][0],
          pharmacy_phone:  data[i][1],
          pharmacy_fax:    data[i][2],
          pharmacy_email:  data[i][3],
          pharmacy_street: data[i][4],
          pharmacy_city:   data[i][5],
          pharmacy_state:  data[i][6],
          pharmacy_zip:    data[i][7]
        };
        bulk_records.push(cron_pharmacy_doc);
        bulk_records.push(pharmacy_doc);
    }

    var validationImportPharmacyDetails = function(data){
      if(data.length == 0 || data.length ==1){
         newAlert('danger', "Invalid CSV file. Please import valid csv file.");
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }else if(data[0][0] != "Pharmacy name" || data[0][1] != "Phone" || data[0][2]  != "Fax" || data[0][3]  != "Email" || data[0][4]  != "Street" || data[0][5]  != "State" || data[0][6]  != "city" || data[0][7]  != "zip" || data[0][8]  != "Dhp code"){
        newAlert('danger', "Invalid CSV file. Please import valid csv file.");
        $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
      }else{
        return true;
      } 
    };

    var getPharmacySkippedRowsFromCSV = function(skip_records){
      var header = ["Pharmacy name","Phone","Fax","Email","Street","State","city","zip","Dhp code"];
      skip_records.unshift(header);
      var csvContent = "data:text/csv;charset=utf-8,";
      skip_records.forEach(function(infoArray, index){
         dataString = infoArray.join(",");
         csvContent += index < skip_records.length ? dataString+ "\n" : dataString;
      });
      var encodedUri = encodeURI(csvContent);
      $("#skipped_pharmacy_link").attr("href",encodedUri);
      $("#skipped_pharmacy_link").attr("download", "error.csv");
    };


    return{
      getActiveSpecializationTab:getActiveSpecializationTab,
      getActivePharmacyTab:getActivePharmacyTab,
      getActiveMedicationTab:getActiveMedicationTab,
      getActiveLabtestTab:getActiveLabtestTab,
      getActiveHospitalTab:getActiveHospitalTab,
      getAllHospitalsDhpcode:getAllHospitalsDhpcode,
      getActiveConfigTabBindigs:getActiveConfigTabBindigs,
      getSpecializationAll:getSpecializationAll,
      getActiveConfigTab:getActiveConfigTab,
      getActiveCarePlanTab:getActiveCarePlanTab,
      addFieldsinCareplanSectionList:addFieldsinCareplanSectionList,
      saveFieldsinCareplanSectionList:saveFieldsinCareplanSectionList,
      createNewSection:createNewSection,
      displayLabAndImaging:displayLabAndImaging,
      careplanSectionBindings:careplanSectionBindings
    };
  })();  
});
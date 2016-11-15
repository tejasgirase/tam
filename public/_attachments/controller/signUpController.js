  var d    = new Date();
var pd_data = {};
var userinfo = {};
var userinfo_medical = {};

app.controller("signUpController",function($scope,$state,$stateParams){
  var document_added_from;
  $(document).ready(function(){
    // $("#hospital_display").hide();

    $("#hospital_name").autocomplete({
      search: function(event, ui) { 
         $("#hospital_name").addClass('myloader');
      },
      source: function( request, response ) {
        $.couch.db(replicated_db).view("tamsa/getDhpCodeSearch", {
          success: function(data) {
            $("#hospital_name").removeClass('myloader');
            response(data.rows);
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
          startkey: [$("#hospital_type").val(),$("#hospital_name").val()],
          endkey: [$("#hospital_type").val(),$("#hospital_name").val() + "\u9999",{},{},{},{},{},{}],
          limit: 5,
          reduce:true,
          group:true
        });
      },
      minLength: 3,
      focus: function(event, ui) {
        return false;
      },
      select: function( event, ui ) {
        if(ui.item.key[1].substring(0,12) == "Add as a new"){
          $("#hospital_type, #City, #State").removeAttr("disabled");
          $("#hospital_phone, #hospital_email").removeAttr("readonly");
        }else{
          $(this).val(ui.item.key[8]);
          $("#hospital_type").val(ui.item.key[0]);
          $("#State").val(ui.item.key[4]).attr("disabled","disabled");
          $("#Country").val(ui.item.key[5]).attr("readonly","readonly");
          // $("#hospital_phone").attr("readonly","readonly");
          // $("#hospital_email").attr("readonly","readonly");
          $("#dhp_code").val(ui.item.key[9]).attr("readonly","readonly");
          $("#hospital_phone").val(ui.item.key[6]).attr("readonly","readonly");
          $("#hospital_email").val(ui.item.key[7]).attr("readonly","readonly");
          //setTimeout(function(){
          $.couch.db(db).view("tamsa/getCitiesByState", {
            success:function(data){
              if(data.rows.length > 0){
                for(var i = 0; i<data.rows[0].value.length; i++){
                  $("#City").append("<option>"+data.rows[0].value[i]+"</option>");  
                } 
                $("#City").val(ui.item.key[3]).attr("disabled","disabled"); 
              }
            },
            error:function(data,error,reason){
              console.log(reason);
            },
            key:ui.item.key[4],
            reduce:false,
            group:false
          });
        }
        return false;
      },
      response: function(event, ui) {
        if (!ui.content.length) {
          var noResult = { key:['','Add as a new ' +$("#hospital_type").val(),'','','',''],label:"Add as a new Hospital" };
          ui.content.push(noResult);
          //$("#message").text("No results found");
        }
      }
    }).
    data("uiAutocomplete")._renderItem = function(ul, item) {
      return $("<li></li>")
        .data("item.autocomplete", item)
        .append("<a><span style=''> "+item.key[1]+"</span><span style='float:right'> "+item.key[2]+"</span></a>")
        .appendTo(ul);
    };

    getExistingSpecializationList("Specialization");

    function getExistingSpecializationList(id,width_len,selected_List){
      $.couch.db(db).view("tamsa/getSpecializationList", {
        success:function(data){
          var list = '';
          list += '<option value="Select Specialization">Select Specialization</option>';
          for (var i = 0; i < data.rows[0].value.specialization.length; i++) {
            list += '<option value="'+data.rows[0].value.specialization[i]+'">'+data.rows[0].value.specialization[i]+'</option>';
          }
          $("#"+id).html(list);
        },
        error:function(status){
          console.log(status);
        }
      }); 
    } 
    
    $("#toggle_click").click(function(){
      if($("#click_toggle_label").html() == "to add new specialization"){
        $("#new_specialization").show().val("");
        $("#Specialization").hide();
        $("#click_toggle_label").html("select specialization form list");
      }else{
        $("#Specialization").show();
        $("#new_specialization").hide().val("");
        $("#click_toggle_label").html("to add new specialization");
      }
    });

    $("body").on("keypress" , "#Phonealerts",function(e){
      return allowOnlyTenNumbersSignUp(e,$(this));
    });
      
    $("#dhp_code").autocomplete({
      search: function(event, ui) { 
         $(this).addClass('myloader');
      },
      source: function( request, response ) {
        $.couch.db(replicated_db).view("tamsa/getDhpHospital", {
          success: function(data) {
            $("#dhp_code").removeClass('myloader');
            response(data.rows);
          },
          error: function(status) {
            console.log(status);
          },
          startkey: [request.term],
          endkey: [request.term + "\u9999",{},{},{},{},{},{},{}],
          limit: 5,
          reduce:true,
          group:true
        });
      },
      minLength: 2,
      focus: function(event, ui) {
        return false;
      },
      select: function( event, ui ) {
        if(ui.item.key[0] == "DHP Code not found"){
          $(this).val("");
          $("#hospital_name").removeAttr("readonly").val("");
        }else{
          $(this).val(ui.item.key[0]);
          $("#hospital_type, #City, #State").removeAttr("disabled");
          $("#hospital_type").val(ui.item.key[2]).attr("disabled","disabled");
          $("#hospital_name").val(ui.item.key[1]).attr("readonly","readonly");
          $("#State").val(ui.item.key[4]).attr("disabled","disabled");
          $("#Country").val(ui.item.key[5]);
          $("#hospital_phone").val(ui.item.key[6]).attr("readonly","readonly");
          $("#hospital_email").val(ui.item.key[7]).attr("readonly","readonly");
          $("#hospital_display").show();
          $("#hospital_link_parent").hide();
          $.couch.db(db).view("tamsa/getCitiesByState", {
            success:function(data){
              if(data.rows.length > 0){
                for(var i = 0; i<data.rows[0].value.length; i++){
                  $("#City").append("<option>"+data.rows[0].value[i]+"</option>");  
                }
                $("#City").val(ui.item.key[3]).attr("disabled","disabled"); 
              }
            },
            error:function(data,error,reason){
              console.log(reason);
            },
            key:ui.item.key[4],
            reduce:false,
            group:false
          });
        }
        return false;
      },
      response: function(event, ui) {
        if (!ui.content.length) {
          var noResult = { key:['DHP Code not found','','','','',''],label:"DHP Code not found" };
          ui.content.push(noResult);
          $("#hospital_name").removeAttr('readonly');
          //$("#message").text("No results found");
        }
      }
    }).
    data("uiAutocomplete")._renderItem = function(ul, item) {
      return $("<li></li>")
        .data("item.autocomplete", item)
        .append("<a>" + item.key[0] + "</a>")
        .appendTo(ul);
    };

    $("#Signup").click(function(){
      if (validateSignUp()) {
        activateAgreementTab();
        // var admin;
        // if($("#dhp_display").css("display") == "none"){
        //     $.couch.db(replicated_db).view("tamsa/getDhpHospital", {
        //       success: function(data) {
        //         $("#hospital_name").removeClass('myloader');
        //         if($("#Email").val() == "dhpadmin@sensoryhealth.com") {
        //           $("#dhp_code").val("H-0000000000");
        //         }else {
        //           if(data.rows.length > 0){
        //             $("#dhp_code").val(data.rows[0].key[2]);  
        //           }else{
        //             $("#dhp_code").val("H-"+getPcode(10,"alphabetic"));
        //           }  
        //         }
        //         signupNewUser();
        //       },
        //       error: function(status) {
        //         console.log(status);
        //       },
        //       startkey: [$("#hospital_type").val(),$("#hospital_name").val()],
        //       endkey: [$("#hospital_type").val(),$("#hospital_name").val(),{},{},{},{}],
        //       limit: 5,
        //       reduce:true,
        //       group:true
        //     });
        // }else{
        //       $.couch.db(replicated_db).view("tamsa/getDhpHospital", {
        //         success: function(data) {
        //           if(data.rows.length > 0){
        //             $("#dhp_code").removeClass('myloader');
        //             signupNewUser();
        //           }else{
        //             $("#validationtext").text("Invalid DHP Code...!!!");
        //             $('html, body').animate({scrollTop: 0}, 'slow');
        //             return;
        //           }
                  
        //         },
        //         error: function(status) {
        //           console.log(status);
        //         },
        //         startkey: [$("#dhp_code").val()],
        //         endkey: [$("#dhp_code").val(),{},{},{},{},{}],
        //         limit: 5,
        //         reduce:true,
        //         group:true
        //       });
        // }
        // return;
      }else {

      }
    });
    
    $("#agreement_flag").click(function(){
      if($(this).prop("checked")) {
        $("#next_from_agreement_plan").removeAttr("disabled");
      }else {
        $("#next_from_agreement_plan").attr("disabled","disabled");
      }
    });
    
    $("#dhp_code").on("keydown",function(e){
      var charCode = e.charCode || e.keyCode || e.which;
      if (charCode == 27){
        //alert("Escape is not allowed!");
        return false;
      }
    });

    $("#dhp_code").on("keyup",function(e){
      if($(this).val() === ""){
        $("#hospital_name").val('').removeAttr("readonly");
        $("#State").removeAttr('disabled').val("Select State");
        $("#City").removeAttr('disabled').val("Select City");
        $("#hospital_display").hide("slow");
        $("#hospital_type").removeAttr('disabled');
        $("#hospital_link_parent").show("slow");
      }
    });

    $("#hospital_name").on("keyup",function(e){
      if($(this).val() === ""){
        $("#dhp_code").val('');
        $("#State").removeAttr('disabled').val("Select State");
        $("#City").removeAttr('disabled').val("Select City");
        $("#hospital_phone, #hospital_email").val("").removeAttr("readonly");
        $("#hospital_type").removeAttr('disabled');
      }
    });

    $("#hospital_link").on("click",function(){
      $(".dhp-link-parent").removeClass("no-display");
      $(".hospital-link-parent").addClass("no-display");
      $("#hospital_name").val('').removeAttr('readonly');
      $("#State").removeAttr('disabled').val('Select State');
      $("#City").removeAttr('disabled').val('Select City');
      $("#hospital_phone").removeAttr("readonly");
      $("#hospital_email").removeAttr("readonly");
      $("#hospital_type").removeAttr('disabled');
      $("#dhp_code").val("");
      //$("#hospital_name").autocomplete("destroy");
    });

    $("#dhp_link").on("click", function(){
      $("#dhp_code").val("");
      $(".hospital-link-parent").removeClass("no-display");
      $(".dhp-link-parent").addClass("no-display");
      $("#hospital_name").val('').attr('readonly', 'readonly');
    });
    
    $("body").on("change","#State",function(){
      var selected_state = $(this).val();
      getCities(selected_state);
    });

    getStates();

    $("#hospital_name").on("focusout",function(){
      $.couch.db(replicated_db).view("tamsa/getDhpHospital", {
        success: function(data) {
          $("#hospital_name").removeClass('myloader');
          if(data.rows.length > 0){
            $("#State, #City").attr("disabled","disabled");
            $("#hospital_phone, #hospital_email").attr('readonly', 'readonly');
          }else{
            $("#State, #City").removeAttr("disabled");
            $("#hospital_phone, #hospital_email").val("").removeAttr('readonly');
          }
        },
        error: function(status) {
          console.log(status);
        },
        startkey: [$("#hospital_name").val(),$("#hospital_type").val()],
        endkey: [$("#hospital_name").val(),$("#hospital_type").val(),{},{},{},{},{},{}],
        limit: 5,
        reduce:true,
        group:true
      });
    });

    $("#dhp_code").on("focusout",function(){
      $.couch.db(replicated_db).view("tamsa/getDhpHospital", {
        success: function(data) {
          if(data.rows.length < 1 && $("#dhp_code").val() != ""){
            $("#validationtext").text("DHP Code not Found");
            $('html, body').animate({scrollTop: 0}, 'slow');
            $("#dhp_link").trigger('click');
            $("#dhp_code").focus();
          }
        },
        error: function(status) {
          console.log(status);
        },
        startkey: [$("#dhp_code").val()],
        endkey: [$("#dhp_code").val(),{},{},{},{},{}],
        limit: 5,
        reduce:true,
        group:true
      });
    });

    $("#hospital_type").on("change",function(){
      $("#hospital_name").val("").removeAttr("readonly");
      $("#hospital_phone").val("").removeAttr("readonly");
      $("#hospital_email").val("").removeAttr("readonly");
      $("#State, #City").val("Select State").removeAttr('disabled');
      $("#City").empty().removeAttr('disabled');
    });

    $("#signup_account_info_link").on("click",function(){
      activateAccountInfoTab();
    });

    $("#signup_agreement_link").on("click",function(){
      activateAgreementTab();
    });

    $("#signup_subscription_plan_link").on("click",function(){
      activateSubscriptionTab();
    });

    $("#signup_billing_info_link").on("click",function(){
      activateBillingTab();
    });

    $("#signup_practice_info_link").on("click",function(){
      activatePracticeInfoTab();
    });
  });

  function activateAccountInfoTab() {
    $("#signup_account_info_link").parent().find("div").removeClass("CategTextActive");
    $("#signup_account_info_link").addClass("CategTextActive");
    $("#signup_agreement_tab, #signup_subscription_plan_tab, #signup_billing_info_tab, #signup_practice_info_tab").addClass("no-display");
    $("#signup_account_info_tab").removeClass("no-display");
  }

  function activateAgreementTab() {
    if(validateSignUp()) {
      $("#signup_agreement_link").parent().find("div").removeClass("CategTextActive");
      $("#signup_agreement_link").addClass("CategTextActive");
      $("#signup_account_info_tab, #signup_subscription_plan_tab, #signup_billing_info_tab, #signup_practice_info_tab").addClass("no-display");
      $("#signup_agreement_tab").removeClass("no-display");
    }
  }

  function activateSubscriptionTab() {
    // if(validateSignUp() && validateAgreementAtSignUP() && validateSubscriptionTabAtSignUP()) {
    if(validateSignUp() && validateAgreementAtSignUP()) {
      $("#signup_subscription_plan_link").parent().find("div").removeClass("CategTextActive");
      $("#signup_subscription_plan_link").addClass("CategTextActive");
      $("#signup_agreement_tab, #signup_account_info_tab, #signup_billing_info_tab, #signup_practice_info_tab").addClass("no-display");
      $("#signup_subscription_plan_tab").removeClass("no-display");
      getSubscriptionPlans();
    }
  }

  function activateBillingTab() {
    $("#signup_billing_info_link").parent().find("div").removeClass("CategTextActive");
    $("#signup_billing_info_link").addClass("CategTextActive");
    $("#signup_agreement_tab, #signup_subscription_plan_tab, #signup_account_info_tab, #signup_practice_info_tab").addClass("no-display");
    $("#signup_billing_info_tab").removeClass("no-display");
  }

  function activatePracticeInfoTab() {
    if(validateSignUp() && validateAgreementAtSignUP() && validateSubscriptionTabAtSignUP()) {
      $("#signup_practice_info_link").parent().find("div").removeClass("CategTextActive");
      $("#signup_practice_info_link").addClass("CategTextActive");
      $("#signup_agreement_tab, #signup_subscription_plan_tab, #signup_billing_info_tab, #signup_account_info_tab").addClass("no-display");
      $("#signup_practice_info_tab").removeClass("no-display");  
    }
  }

  function getSubscriptionPlans() {
    $("#subscription_plan_list_parent, #additional_plan_list_parent").find(".plan-list").remove();
    $.couch.db(db).view("tamsa/getSubscriptionList", {
      success:function(data) {
        if(data.rows.length > 0) {
          $("#additional_plan_list_parent").removeClass("no-display");
          var sub_str=[],add_str=[];
          for(var i=0;i<data.rows.length;i++){
            if(data.rows[i].key[0] === "default") {
              sub_str.push('<div class="row plan-list">');
                sub_str.push('<div class="col-lg-12 col-sm-12 paddside30">');
                  sub_str.push('<label>');
                  sub_str.push('<input class="checkshow" id="" checked="true" type="checkbox">'+data.rows[i].value.subscription_tag);
                  sub_str.push('</label>');
                sub_str.push('</div>');
              sub_str.push('</div>');
            }else {
              add_str.push('<div class="row plan-list">');
                add_str.push('<div class="col-lg-12 col-sm-12 paddside30">');
                  add_str.push('<label>');
                  add_str.push('<input class="checkshow" id="" checked="true" type="checkbox">'+data.rows[i].value.subscription_tag);
                  add_str.push('</label>');
                add_str.push('</div>');
              add_str.push('</div>');
            }
          }
          $("#subscription_plan_list_parent").append(sub_str.join(''));
          $("#additional_plan_list_parent").append(add_str.join(''));
        }else {
          console.log("There is no subscription plan configured.Contact Admin.");
          $("#subscription_plan_list_parent").html("There is no subscription plan configured.Contact Admin.");
          $("#additional_plan_list_parent").addClass("no-display");
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });
  }

  function getStates(){
    $.couch.db(db).view("tamsa/getCitiesByState", {
      success:function(data){
        for(var i = 0; i<data.rows.length; i++ ){
          $("#State").append("<option>"+data.rows[i].key+"</option>");
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
  }

  function getCities(selectedstate){
    $.couch.db(db).view("tamsa/getCitiesByState", {
      success:function(data){
        if(data.rows.length > 0){
          $("#City").empty();
          for(var i = 0; i<data.rows[0].value.length; i++){
            $("#City").append("<option>"+data.rows[0].value[i]+"</option>");
          }
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      },
      key:selectedstate,
      reduce:false,
      group:false
    });
  }

  function signupNewUser(){
    if($("#Specialization").val() == "Select Specialization"){
      if($("#new_specialization").val !== ""){
      var specialization_value = $("#new_specialization").val();
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
                };
                $.couch.db(db).saveDoc(doc,{
                  success:function(data){
                  },
                  error:function(status){
                    console.log(status);
                  }
                });
              }else{
                $("#validationtext").text("Specialization name already exist");
                $('html, body').animate({scrollTop: 0}, 'slow');
                $("#new_specialization").focus();
              }    
            }
          },
          error:function(status){
            console.log(status);
          },
          key:"specialization_list",
          include_docs:true 
        });  
      }
    }else{
     var specialization_value = $("#Specialization").val();
    }
    var userDoc = {
      name:                   $("#Email").val(),
      first_name:             $("#first_name").val(),
      last_name:              $("#last_name").val(),
      email:                  $("#Email").val(),
      alert_email:            $("#Emailalerts").val(),
      phone:                  $("#Phone").val(),
      alert_phone:            $("#Phonealerts").val(),
      specialization:         specialization_value,
      document_added_from:    "test",
      qualification:          $("#qualification").val(),
      experience:             $("#experience").val(),
      city:                   $("#City").val(),
      state:                  $("#State").val(),
      country:                $("#Country").val(),
      dhp_code:               $("#dhp_code").val(),
      hospital_affiliated:    $("#hospital_name").val(),
      hospital_type:          $("#hospital_type").val(),
      hospital_phone:         $("#hospital_phone").val(),
      hospital_email:         $("#hospital_email").val(),
      doctors_network:        $('#Network').is(':checked'),
      critical_alerts_medium: $('#critical_alerts_medium').val(),
      reports_medium:         $('#reports_medium').val(),
      random_code:            getPcode(6,"alphabetic")
    };
    $.couch.db(replicated_db).view("tamsa/getDhpHospital",{
      success:function(data){
        if(data.rows.length > 0){
          userDoc.admin = "No";
        }else{
          userDoc.admin = "Yes";
        }

        userDoc.password       = $("#Password").val();
        userDoc.doctype        = "cronRecords";
        userDoc.operation_case = "21";
        userDoc.processed      = 'No';

        // $.couch.signup(userDoc, $("#Password").val(), {
        //   success: function(data) {
        //     $.cookie('pm[message]', "Signed Up successfully. Please Log in.");
        //     window.location = "index.html";
        //   },
        //   error: function(data, error, reason) {
        //     if (data == '409') {
        //       $("#validationtext").text("User already exist");
        //       $('html, body').animate({scrollTop: 0}, 'slow');
        //     }
        //     else {
        //       $("#validationtext").text(reason);
        //       $('html, body').animate({scrollTop: 0}, 'slow');
        //     }
        //   }
        // });
        $.couch.db(replicated_db).view("tamsa/getUserPhone",{
          success: function (data){
            if(data.rows.length > 0){
              $("#validationtext").text("User with given Phone number is already exist.");
              $('html, body').animate({scrollTop: 0}, 'slow');
              $("#Phone").focus();
              return false;
            }else{
              var tempdocid = "org.couchdb.user:"+$("#Email").val().trim();
              $.couch.db(replicated_db).openDoc(tempdocid, {
                success: function(data){
                   $("#validationtext").text("User with given email is already exist.");
                   $('html, body').animate({scrollTop: 0}, 'slow');
                   return false;
                },
                error: function(data, error, reason) {
                  if(data == 500){
                    $.couch.signup(userDoc,$("#Password").val(), {
                      success: function(data) {
                        $.cookie('pm[message]', "Signed Up successfully. Please Log in.");
                        window.location = "/";
                      },
                      error: function(data, error, reason) {
                        if (data == '409') {
                          $("#validationtext").text("User already exist");
                          $('html, body').animate({scrollTop: 0}, 'slow');
                        }
                        else {
                          $("#validationtext").text(reason);
                          $('html, body').animate({scrollTop: 0}, 'slow');
                        }
                      }
                    });
                  }
                  // if(data == "404"){
                  //   $.couch.db(db).saveDoc(userDoc, {
                  //     success: function(data) {
                  //       $.cookie('pm[message]', "Thank you for sign up. You will shorlty receive confirmation mail.");
                  //       window.location = "index.html";
                  //     },
                  //     error: function(data,error,reason) {
                  //       $("#validationtext").text(reason);
                  //       $('html, body').animate({scrollTop: 0}, 'slow');
                  //     }
                  //   });      
                  // }
                  else{
                    $("#validationtext").text(reason);
                    $('html, body').animate({scrollTop: 0}, 'slow');
                    return false;
                  }
                }
              });
            }
          },
          error: function (data,error,reason){
            newAlertForModal('danger',reason,'add_sub_user_modal');
            $('html, body, #add_sub_user_modal').animate({scrollTop: 0}, 'slow');
            return false;
          },
          key:$("#Phone").val().trim()
        });
      },
      error:function(error,reason){
        console.log(error,reason);
      },
      startkey:[$("#dhp_code").val()],
      endkey:[$("#dhp_code").val(),{},{},{},{},{}],
      reduce:true,
      group:true
    });
  }

  function validateSignUp() {
    return true;
    var email_filter       = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    var phone_filter       = /^(\+\d{1,3}[- ]?)?\d{10}$|^(\+\d{1,3}[- ]?)?\d{11}$/;
    var pwd = $("#Password").val();

    if($("#first_name").val().trim() === "") {
      $("#validationtext").text("First Name can not be empty.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#first_name").focus();
      return false;
    }else if($("#first_name").val().trim() === "") {
      $("#validationtext").text("First Name can not be empty.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#first_name").focus();
      return false;
    }else if($("#last_name").val().trim() === "") {
      $("#validationtext").text("Last Name can not be empty.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#last_name").focus();
      return false;
    }else if (pwd.trim().length === 0) {
      $("#validationtext").text("Password Can not be blank");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#Password").focus();
      return false;
    }else if($("#Password").val() !== $("#ConfirmPassword").val()) {
      $("#validationtext").text("Password Doesn't match.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#Password").focus();
      return false;
    }else if($("#Email").val().trim() === "") {
      $("#validationtext").text("Email can not be empty.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#Email").focus();
      return false;
    }else if (!email_filter.test($("#Email").val().trim())) {
      $("#validationtext").text("Not a valid email address.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#Email").focus();
      return false;
    // }else if ($("#Emailalerts").val().trim() === "") {
    //   $("#validationtext").text("Alert Email can not be empty.");
    //   $('html, body').animate({scrollTop: 0}, 'slow');
    //   $("#Emailalerts").focus();
    //   return false;
    // }else if (!email_filter.test($("#Emailalerts").val().trim())) {
    //   $("#validationtext").text("Alert email address is not valid.");
    //   $('html, body').animate({scrollTop: 0}, 'slow');
    //   $("#Emailalerts").focus();
    //   return false;
    }else if (!$("#qualification").val() && $("#qualification").val().trim() === "" ) {
      $("#validationtext").text("Qualification can not be empty.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#qualification").focus();
      return false;
    }else if ($("#Specialization").val() === "Select Specialization" && $("#new_specialization").val().trim() === "" ) {
      $("#validationtext").text("Specialization can not be empty.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#Specialization").focus();
      return false;
    }else if (!$("#experience").val() && $("#experience").val().trim() === "" ) {
      $("#validationtext").text("Experience can not be empty.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#experience").focus();
      return false;
    }else if ($("#Phone").val().trim() === "") {
      $("#validationtext").text("Phone can not be empty.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#Phone").focus();
      return false;
    }else if (!phone_filter.test($("#Phone").val().trim())) {
      $("#validationtext").text("Not a valid phone number");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#Phone").focus();
      return false;
    // }else if ($("#Phonealerts").val().trim() === "") {
    //   $("#validationtext").text("Alert phone can not be empty.");
    //   $('html, body').animate({scrollTop: 0}, 'slow');
    //   $("#Phonealerts").focus();
    //   return false;
    // }else if (!phone_filter.test($("#Phonealerts").val().trim())) {
    //   $("#validationtext").text("Alert phone number is not valid.");
    //   $('html, body').animate({scrollTop: 0}, 'slow');
    //   $("#Phonealerts").focus();
    //   return false;
    }else {
      $("#validationtext").text("");
      return true; 
    }
  }

  function validatePracticeInfoTabAtSignUP() {
    if ($("#State").val() == "Select State") {
      $("#validationtext").text("Please Select State.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#State").focus();
      return false;
    }else if ($("#State").val().trim().length < 2) {
      $("#validationtext").text("Not a valid state.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#State").focus();
      return false;
    }else if ($("#City").val() == "Select City") {
      $("#validationtext").text("Please Select City.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#City").focus();
      return false;
    }else if ($("#City").val().trim().length < 2) {
      $("#validationtext").text("Not a valid city.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#City").focus();
      return false;
    }else if ($("#Country").val().trim() === "") {
      $("#validationtext").text("Country can not be empty.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#Country").focus();
      return false;
    }else if ($("#Country").val().trim().length < 2) {
      $("#validationtext").text("Not a valid country name.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#Country").focus();
      return false;
    }else if (!phone_filter.test($("#hospital_phone").val().trim()) && $("#hospital_phone").val().trim() !== "") {
      $("#validationtext").text("Please enter valid phone number.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#hospital_email").focus();
      return false;
    }else if (!email_filter.test($("#hospital_email").val().trim()) && $("#hospital_email").val().trim() !== "") {
      $("#validationtext").text("Please enter valid email address.");
      $('html, body').animate({scrollTop: 0}, 'slow');
      $("#hospital_email").focus();
      return false;
    }else {
      $("#validationtext").text("");
      return true;
    }
  }

  function validateAgreementAtSignUP() {
    return true;
  }

  function validateSubscriptionTabAtSignUP() {
    return true;
  }

  function allowOnlyTenNumbersSignUp(e,$obj){
    if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
      return false;
    }else{
      if($obj.val().trim().length > 9){
        if(e.which != 8 && e.which != 0 && e.which != 46){
          return false;  
        }else{
          return true;  
        }  
      }else{
        return true;    
      }
    }
  }
});
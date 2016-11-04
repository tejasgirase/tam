var d    = new Date();
var pd_data = {};
var userinfo = {};
var userinfo_medical = {};

app.controller("indexAppController",function($scope,$state,$stateParams){
  var document_added_from;
  $(document).ready(function(){
    // $.couch.session({
    //   success: function(data) {
    //     if(data.userCtx.name)
    //        window.location = "my-account.html";
    //   }
    // });

    // window.location.href = window.location.href.split('#')[0];
    $('#username').focus();

    $('.enter').on('keydown', function(e) {
      if (e.keyCode == 13) {
        $("#Login").click();
      }
    });
  
    var remember = $.cookie('pm[remember]');
    var message  = $.cookie('pm[message]');

    if (message !== 'null') {
      $("#validationtext").text(message);
      $.cookie('pm[message]', null);
    }
    else if (remember != 'false') {
      $('#username').val($.cookie('pm[uname]'));
      $('#Password').val($.cookie('pm[password]'));
      $('#rememberme').attr("checked", true);
    }
    
    $("#Login").click(function(){
      $("#Login").addClass("ajax-loader-large");
      var userdata = {
        "username": $("#username").val(),
        "password": $("#Password").val()
      };
      $.ajax({
        url:"/api/login",
        type:"POST",
        crossDomain: true,
        data:userdata,
        success: function(data){
          if(data) {
            var expires_day = 365;
            if ($('#rememberme').is(':checked')) {
              $.cookie('pm[uname]', userdata.username, { expires: expires_day });
              $.cookie('pm[password]', userdata.password, { expires: expires_day });
              $.cookie('pm[remember]', true, { expires: expires_day });
            }
            else {
              // reset cookies.
              $.cookie('pm[uname]', null);
              $.cookie('pm[password]', null);
              $.cookie('pm[remember]', false);
            }
            renderAccountPage(data);
          }else {
            $("#Login").removeClass("ajax-loader-large");
            $("#validationtext").text("Credentials are not valid.");
          }
        },
        error: function(data,error,reason) {
          $("#Login").removeClass("ajax-loader-large");
          if(data.status == 401) {
            $("#validationtext").text("Email or Passowrd is wrong."); 
          }else {
            console.log(data.responseText);
            $("#validationtext").text("Email or Passowrd is wrong.");
          }
        }
      });
      // $.couch.login({
      //     name: uname,
      //     password: password,
      //     success: function(data) {   
      //       var expires_day = 365;
      //       if ($('#rememberme').is(':checked')) {
      //         $.cookie('pm[uname]', uname, { expires: expires_day });
      //         $.cookie('pm[password]', password, { expires: expires_day });
      //         $.cookie('pm[remember]', true, { expires: expires_day });
      //       }
      //       else {
      //         // reset cookies.
      //         $.cookie('pm[uname]', null);
      //         $.cookie('pm[password]', null);
      //         $.cookie('pm[remember]', false);
      //       }
      //       window.location = "my-account.html";
      //     },
      //     error: function(data, error, reason) {
      //       $("#validationtext").text("Email or Password is incorrect.");
      //       $("#Login").removeClass("ajax-loader-large");
      //     }
      // });
    });

    $("#forgot_password_link").on("click",function(){
      $("#forgot_password").modal("show");
      $("#forgot_password_email").val("");
    });

    $("#forgot_password_save").click(function() {
      if(validateForgotPassWord()) {
        $.ajax({
          url:"/api/forgot",
          type:"GET",
          data:{
            emailid:$("#forgot_password_email").val(),
            db:replicated_db
          },
          success:function(data) {
            if(data) {
              $("#validationtext").text("You will shortly receive your new password on your email address.");
              $('#forgot_password').modal("hide");
              $("#forgot_password_email").val("");
            }else {
              newAlertForModal('danger', 'No User Found with provided Email Id.','forgot_password');
              $('html, body, #forgot_password').animate({scrollTop: 0}, 'slow');
              $("#forgot_password_email").focus();
              return false;
            }
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $('#forgot_password').modal("hide");
            $("#forgot_password_email").val("");
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          }
        });
      }else {
        console.log("In Else for forgot password validation");
      }
      // $.couch.db(replicated_db).openDoc("org.couchdb.user:"+$("#forgot_password_email").val(), {
      //   success: function(data) {
      //     var fp_user  = {
      //       operation_case: "2",
      //       new_password:   getPcode(6, "alphabetic"),
      //       user_id:        data._id,
      //       processed:      "No",
      //       doctype:        "cronRecords",
      //     };

      //     $.couch.db(db).saveDoc(fp_user, {
      //       success: function(data) {
      //         $("#validationtext").text("You will shortly receive your new password on your email address.");
      //       },
      //       error: function(data, error, reason) {
      //         newAlert('error', reason);
      //         $('html, body').animate({scrollTop: 0}, 'slow');
      //       }
      //     });
      //   },
      //   error: function(status) {
      //     $("#validationtext").text("Invalid Email Id");
      //   }
      // });
    });
  });

  function renderAccountPage(data) {
    $.ajax({
      url:"/myaccount",
      type:"GET",
      data:data,
      success:function(data) {
        if(data) {
          window.location = "/myaccount";
          // $.couch.db(db).openDoc(data.id, {
          //   success:function(resdata) {

          //   },
          //   error:function(data,error,reason){
          //     newAlert("danger",reason);
          //     $("html, body").animate({scrollTop: 0}, 'slow');
          //     return false;
          //   }
          // });
        }
      },
      error:function(data,error,reason){
        newAlert("danger",reason);
        $("html, body").animate({scrollTop: 0}, 'slow');
        return false;
      }
    });  
  }

  function validateForgotPassWord() {
    var email_filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if($("#forgot_password_email").val() === "") {
      console.log("1");
      newAlertForModal('danger', 'Email Id can not be empty.','forgot_password');
      $('html, body, #forgot_password').animate({scrollTop: 0}, 'slow');
      $("#forgot_password_email").focus();
      return false;
    }else if(!email_filter.test($("#forgot_password_email").val())) {
      console.log("2");
      newAlertForModal('danger', 'Invalid Email Id.','forgot_password');
      $('html, body, #forgot_password').animate({scrollTop: 0}, 'slow');
      $("#forgot_password_email").focus();
      return false;
    }else {
      return true;
    }
  }

  function newAlert (type, message) {
    $("#alert-area").html("");
    $("#alert-area").append($("<div class='suc-err-msg alert alert-"+type+" fade in' data-alert><a class='close' data-dismiss='alert'>&times;</a><p> " + message + " </p></div>"));
    $(".alert").delay(4000).fadeOut("slow", function () { $(this).remove(); });
  }

  function newAlertForModal (type, message, id) {
    if($(".alert-test").length){
      return;
    }else{
      $("#" + id).find(".alert-msg-box").append($("<div class='alert-test alert-"+type+" fade in' data-alert><p style = 'color:red'> " + message + " </p></div>"));
      $(".alert-test").delay(6000).fadeOut("slow", function () { $(this).remove(); });  
    }
  }

});
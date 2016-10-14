var d    = new Date();
var pd_data = {};
app.controller("templateCommunityController",function($scope,$state,$stateParams,tamsaFactories){
  // $.couch.session({
  //   success: function(data) {
  //     if(data.userCtx.name == null)
  //        window.location.href = "index.html";
  //     else {
        $.couch.db("_users").openDoc("org.couchdb.user:"+data.userCtx.name+"", {
          success: function(data) {
            pd_data = data;
            $scope.level = data.level;
            $scope.$apply();
            tamsaFactories.pdBack();
            tamsaFactories.sharedBindings();
            getCommunityTemplates();
            CommunityTemplatesEventBindings($state,$stateParams);
          },
          error: function(status) {
            console.log(status);
          }
        });
  //     }
  //   }
  // });

  function getCommunityTemplates(){
    $(".tab-pane").removeClass("active");
    $("#dc_template_list_parent").addClass("active");
    $("#dc_template_list").show();
    $("#save_dc_charting_template_tab").hide();
    $("#dc_charting_flag").val("Copy");
    $('#templatecommunity').show();
    getDCTemplateList();
  }

  function CommunityTemplatesEventBindings($state,$stateParams){
    getAllExistingSpecializationList("dc_search_template_from_specialization");
    $("body").on("click",".dc-charting-template",function(){
      var index = $(this).attr("doc_id");
      $state.go("patient_charting_templates",{user_id:$stateParams.user_id,template_id:index});
    });

    $("#dc_template_list").on("change" , "#dc_search_template_from_specialization" , function(){
      if($(this).val() == "Select Specialization"){
        getDCTemplateList();
      }else{
        getDCTemplateListBySpecialization($(this).val());  
      }  
    });

    $("#search_practise_charting_template_out").autocomplete({
      search: function(event, ui) { 
        $(this).addClass('myloader');
      },
      source: function( request, response ) {
        $.couch.db(db).view("tamsa/getCommunityChartingTemplates", {
          success: function(data) {
            $("#search_practise_charting_template_out").removeClass('myloader');
            response(data.rows);
          },
          error: function(status) {
              console.log(status);
          },
          startkey:     [request.term],
          endkey:       [request.term + "\u9999", {}],
          limit:        5,
          include_docs: true
        });
      },
      minLength: 1,
      focus: function(event, ui) {
        return false;
      },
      select: function( event, ui ) {
        $(this).val(ui.item.doc.template_name);
        $state.go("patient_charting_templates",{user_id:$stateParams.user_id,template_id:ui.item.doc._id});
        return false;
      },
      response: function(event, ui) {
        if (!ui.content.length) {
          var noResult = { doc:{template_name: 'No results found'},label:"No results found" };
          ui.content.push(noResult);
          //$("#message").text("No results found");
        }
      },
      open: function() {
          $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function() {
          $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
      }
    }).
    data("uiAutocomplete")._renderItem = function(ul, item) {
      return $("<li></li>")
        .data("item.autocomplete", item)
        .append("<a>" + item.doc.template_name + "</a>")
        .appendTo(ul);
    };

    // $("#dc_search_template_from_specialization").autocomplete({
    //   search: function(event, ui) { 
    //      $(this).addClass('myloader');
    //   },
    //   source: function( request, response ) {
    //     $.couch.db(db).view("tamsa/getCommunityTemplatesFromSpecialization", {
    //       success: function(data) {
    //         $("#dc_search_template_from_specialization").removeClass('myloader');
    //         response(data.rows);
    //       },
    //       error: function(status) {
    //           console.log(status);
    //       },
    //       startkey: ["Yes",request.term],
    //       endkey:   ["Yes",request.term + "\u9999"],
    //       reduce:   true,
    //       group:    true
    //     });
    //   },
    //   minLength: 1,
    //   focus: function(event, ui) {
    //     return false;
    //   },
    //   select: function( event, ui ) {
    //     $(this).val(ui.item.key[1]);
    //     if(ui.item.key[1] == 'No results found'){
    //       //refreshDCTemplateList("doctor_community_charting_templates_list");
    //     }else{
    //       getDCTemplateListBySpecialization(ui.item.key[1]);
    //     }
        
    //     return false;
    //   },
    //   response: function(event, ui) {
    //     if (!ui.content.length) {
    //       var noResult = { key:['','No results found'],label:"No results found" };
    //       ui.content.push(noResult);
    //       //$("#message").text("No results found");
    //     }
    //   },
    //   open: function() {
    //       $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
    //   },
    //   close: function() {
    //       $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
    //   }
    // }).
    // data("uiAutocomplete")._renderItem = function(ul, item) {
    //   return $("<li></li>")
    //     .data("item.autocomplete", item)
    //     .append("<a>" + item.key[1] + "</a>")
    //     .appendTo(ul);
    // };

    $("body").on("keydown","#dc_search_template_from_specialization",function(e){
      // if(e.keyCode == 8 && $(this).val().length == 1){
      //   getDCTemplateList();
      // }    
    });
  }

  function getDCTemplateList(){
    clearDCTemplateList();
    $("#doctor_community_charting_templates_list tbody").css('display','');
    $("#no_record_found_msd").hide();
    $('#DC_template_pagination').css('display','');
    showhideloader('show');
    $.couch.db(db).view("tamsa/getCommunityChartingTemplates",{
      success:function(data){
        showhideloader('hide');
        if(data.rows.length>0){
        $scope.lists = data.rows;
          $scope.$apply();
          // console.log($scope.template_data);
          // paginationConfiguration(data,"DC_template_pagination",10,displayDCTemplateList);
        }else{
          var tmpl_row = [];
          tmpl_row.push('<tr><td colspan="2">No Community Charting Template are Found.</td></tr>');
          $("#no_record_found_msd").show();
          $("#no_record_found_msd").html(tmpl_row.join(''));
          $("#doctor_community_charting_templates_list tbody").css('display','none');
          $('#DC_template_pagination').css('display','none');
        }
      },
      error: function(data,error,reason) {
        showhideloader('hide');
        newAlert('danger', reason);
        $('html, body').animate({scrollTop: 0}, 'slow');
      },
      include_docs: true
    });
  }

  function getDCTemplateListBySpecialization(specialization){
    clearDCTemplateList();
    showhideloader('show');
    $("#doctor_community_charting_templates_list tbody").css('display','');
    $('#DC_template_pagination').css('display','');
    $("#no_record_found_msd").hide();
    $.couch.db(db).view("tamsa/getTemplatesFromSpecialization", {
      success: function(data) {
        if(data.rows.length > 0) {
          $scope.template_data = data.rows;
          $scope.$apply();
          showhideloader('hide');
        }else{
          var tmpl_row = [];
          tmpl_row.push('<tr><td colspan="2">No Community Charting Template are Found.</td></tr>');
          $("#no_record_found_msd").show();
          $("#no_record_found_msd").html(tmpl_row.join(''));
          $("#doctor_community_charting_templates_list tbody").css('display','none');  
          $('#DC_template_pagination').css('display','none');
          showhideloader('hide');
        }
      },
      error: function(status) {
        console.log(status);
      },
      key:    [pd_data.dhp_code,"Yes",specialization],
      reduce: false,
      group:  false,
      include_docs:true
    }); 
  }

  function clearDCTemplateList(){
    $('#search_practise_charting_template_out').val('');
    $("#DC_template_pagination").find("ul").remove();
  }
});
var d    = new Date();
var pd_data = {};
var userinfo = {};
var userinfo_medical = {};

app.controller("billingController",function($scope,$state,$stateParams,tamsaFactories){
  console.log("2");
  // $.couch.session({
  //   success: function(data) {
  //     if(data.userCtx.name == null)
  //        window.location.href = "index.html";
  //     else {
        $.couch.db(replicate_db).openDoc("org.couchdb.user:n@n.com", {
          success: function(data) {
            pd_data = data;
            $scope.level = data.level;
            $scope.$apply();
            getEbilling();
            tamsaFactories.pdBack();
            tamsaFactories.sharedBindings();
          	displayDashboardBilling();
            tamsaFactories.displayDoctorInformation(data);
          },
          error: function(status) {
            console.log(status);
          }
        });
  //     }
  //   }
  // });
});

function displayDashboardBilling(){
  $(".tab-pane").removeClass("active");
  $("#e_billing, #ebill_preference").addClass("active");
  $("#ebill_preference_tab_link").addClass("active");
  $("#ebill_invoice_summary_link").removeClass("active");
  getEbillList();
  $('#e_billing_template').show();
  eventBindingsForDashboardBilling();
}

function eventBindingsForDashboardBilling(){
  $("#dashboard_billing_parent").on("click", ".bill_view", function() {
    getInvoiceSummaryView($(this).attr("index"));
  });

  $("#dashboard_billing_parent").on("click", ".bill_edit", function() {
    getInvoiceSummaryEdit($(this).attr("index"));
  });

  $("#dashboard_billing_parent").on("click","#back_to_bill_summary_list",function(){
    $(".tab-pane").removeClass("active");
    $("#e_billing").addClass("active");
    getEbillList();
  });
}
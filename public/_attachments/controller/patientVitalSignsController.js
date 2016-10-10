var d    = new Date();
var pd_data = {};
var userinfo = {};
var userinfo_medical = {};

app.controller("patientVitalSignsController",function($scope,$state,$stateParams,tamsaFactories){
  // $.couch.session({
  //   success: function(data) {
  //     if(data.userCtx.name == null)
  //        window.location.href = "index.html";
  //     else {
        $.couch.db(replicated_db).openDoc("org.couchdb.user:n@n.com", {
          success: function(data) {
            pd_data = data;
            // getAnalyticsRangeForCharting();
            eventBindingsForVitalSigns();
          },
          error:function(data,error,reason){
            newAlert("danger",reason);
            $("html, body").animate({scrollTop: 0}, 'slow');
            return false;
          },
        });
  //     }
  //   }
  // });
});

function eventBindingsForVitalSigns(){
	
}
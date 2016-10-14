var pd_data = {};

app.controller("doctorMenuController",function($scope,$state,$stateParams,tamsaFactories){
  // $.couch.session({
    // success: function(data) {
    //   if(data.userCtx.name == null)
    //      window.location.href = "index.html";
    //   else {
        $.couch.db("_users").openDoc("org.couchdb.user:"+data.userCtx.name+"", {
          success: function(data) {
            console.log("called");
            $scope.level = data.level;
            $scope.$apply();
          },
          error: function(status) {
            console.log(status);
          }
        });
  //     }
  //   }
  // });
});

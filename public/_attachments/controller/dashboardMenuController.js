app.controller("dashboardMenuController",function($scope,$state,$stateParams,$location,tamsaFactories){
  $scope.getCurrentActiveStatus = function (path) {
    return ($location.path().substr(0, path.length) === path) ? 'active' : '';
  }
});
var app = angular.module('tamsa_pedi', ['ui.router','angularUtils.directives.dirPagination']);

app.config(function($stateProvider, $urlRouterProvider, paginationTemplateProvider,$locationProvider){
  paginationTemplateProvider.setPath('template/dirPagination.tpl.html');
  console.log("tejas");
  // $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('/', {
    url: '/',
    views: {
      'index-view': {
        templateUrl: 'template/header.html',
      }
    }
  }).state('/signup', {
    url: '/signup',
    views: {
      'index-view': {
        templateUrl: 'template/sign-up.html',
        controller: 'signUpController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  });
});
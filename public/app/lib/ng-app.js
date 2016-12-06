var app = angular.module('tamsa_pediatric', ['ui.router','angularUtils.directives.dirPagination']);

app.config(function($stateProvider, $urlRouterProvider, paginationTemplateProvider,$locationProvider){
  paginationTemplateProvider.setPath('template/dirPagination.tpl.html');
  // $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('/', {
    url: '/',
    views: {
      'index-view': {
        templateUrl: 'dashboard/dashboard.html',
        controller: 'dashboardTelepeadiatricController as vm'
      }
    }
  }).state('/signup', {
    url: '/signup',
    views: {
      'index-view': {
        templateUrl: 'partials/header.html'
      }
    }
  });
});
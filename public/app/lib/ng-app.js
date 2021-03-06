var app = angular.module('tamsa_pediatric', ['ui.router','angularUtils.directives.dirPagination']);

app.config(function($stateProvider, $urlRouterProvider, paginationTemplateProvider,$locationProvider){
  paginationTemplateProvider.setPath('template/dirPagination.tpl.html');
  // $locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('/', {
    url: '/',
    views: {
      'header-view':{
        templateUrl: 'partials/header.html',
        controller: 'headerController as vm'
      },
      'index-view': {
        templateUrl: 'dashboard/dashboard.html',
        controller: 'dashboardTelepeadiatricController as vm'
      },'footer-view':{
        templateUrl: 'partials/footer.html'
      }
    }
  }).state('patientinfo', {
    url: '/patientinfo/:user_id',
    params: {
      user_id: null,
    },
    views: {
      'header-view':{
        templateUrl: 'partials/header.html',
        controller: 'headerController as vm'
      },
      'index-view': {
        templateUrl: 'dashboard/dashboard.html',
        controller: 'dashboardTelepeadiatricController as vm'
      },
      'main-content@patientinfo':{
        templateUrl: 'partials/patient_info/patient-info.html'
      },
      'footer-view':{
        templateUrl: 'partials/footer.html'
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
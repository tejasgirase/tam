var app = angular.module('tamsa_index', ['ui.router','angularUtils.directives.dirPagination']);

app.config(function($stateProvider, $urlRouterProvider, paginationTemplateProvider){
  paginationTemplateProvider.setPath('template/dirPagination.tpl.html');
  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('/', {
    url: '',
    views: {
      'index-view': {
        templateUrl: 'template/login.html',
        controller: 'indexAppController'
      },
      'footer':{
        templateUrl: 'template/footer.html',
      }
    }
  }).state('/sign_up', {
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
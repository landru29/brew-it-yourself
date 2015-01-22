/*global angular */

angular.module('BrewItYourself', [
    'ngRoute',
    'xeditable',
    'ui.sortable',
    'ngStorage',
    'ui.bootstrap',
    'pascalprecht.translate',
    'ngAnimate'
]);

angular.module('BrewItYourself').config(['$routeProvider', '$translateProvider', function ($routeProvider, $translateProvider) {
    'use strict';
    $routeProvider.when('/', {
        templateUrl: 'views/editor.html',
        controller: 'EditorCtrl'
    }).otherwise({
        redirectTo: '/'
    });
    
    $translateProvider.useStaticFilesLoader({
      prefix: '/data/',
      suffix: '.json'
    });
    
    $translateProvider.preferredLanguage('en');
}]);

angular.module('BrewItYourself').run(['editableOptions', 'ingredient', function (editableOptions, ingredient) {
    'use strict';
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    ingredient.loadData('data/beer-database.json');
}]);
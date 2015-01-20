/*global angular */

angular.module('BrewItYourself', [
    'ngRoute',
    'xeditable',
    'ui.sortable',
    'ngStorage',
    'ui.bootstrap',
    'ngAnimate'
]);

angular.module('BrewItYourself').config(['$routeProvider', function ($routeProvider) {
    'use strict';
    $routeProvider.when('/', {
        templateUrl: 'views/editor.html',
        controller: 'EditorCtrl'
    }).otherwise({
        redirectTo: '/'
    });
}]);

angular.module('BrewItYourself').run(['editableOptions', 'ingredient', function (editableOptions, ingredient) {
    'use strict';
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    ingredient.loadData('data/beer-database.json');
}]);
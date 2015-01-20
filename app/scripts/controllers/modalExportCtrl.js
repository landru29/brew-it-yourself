/*global angular */
angular.module('BrewItYourself').controller('ModalExportCtrl', ['$scope', '$filter', '$modalInstance', 'unitsConversion', 'util', 'thisRecipe',
    function ($scope, $filter, $modalInstance, unitsConversion, util, thisRecipe) {
        'use strict';

        $scope.recipe = util.cleanObject(JSON.parse(JSON.stringify(thisRecipe)));
        delete $scope.recipe.uuid;
        $scope.jsonRecipe = JSON.stringify($scope.recipe);
        
        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

    }]);

angular.module('BrewItYourself').directive('selectOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
        }
    };
});
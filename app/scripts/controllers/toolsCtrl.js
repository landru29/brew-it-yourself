/*global angular */
angular.module('BrewItYourself').controller('ToolsCtrl', ['$scope', '$modal',
    function ($scope, $modal) {
        "use strict";

        $scope.openToolbox = function () {
            $modal.open({
                templateUrl: 'views/modal-toolbox.html',
                controller: 'ModalToolboxCtrl'
            });
        };

        $scope.$on('menu-trigger', function (event, args) {
            switch (args.action) {
            case 'tools':
                $scope.openToolbox();
                break;
            default:
                break;
            }
        });
}]);
/*global angular */
angular.module('BrewItYourself').controller('ToolsCtrl', ['$scope', '$rootScope', '$modal', '$localStorage',
    function ($scope, $rootScope, $modal, $localStorage) {
        "use strict";

        $scope.openToolbox = function () {
            $modal.open({
                templateUrl: 'views/modal-toolbox.html',
                controller: 'ModalToolboxCtrl'
            });
        };
        
        $scope.openProperties = function () {
            var modalInstance = $modal.open({
                templateUrl: 'views/modal-properties.html',
                controller: 'ModalPropertiesCtrl'
            });
            modalInstance.result.then(function (data) {
                $localStorage.properties = data;
                //$rootScope.$broadcast('menu-trigger', {action:'reload-recipe'});
            });
        };

        $scope.$on('menu-trigger', function (event, args) {
            switch (args.action) {
            case 'tools':
                $scope.openToolbox();
                break;
            case 'properties':
                $scope.openProperties();
                break;
            default:
                break;
            }
        });
}]);
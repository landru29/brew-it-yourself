/*global angular */
angular.module('BrewItYourself').controller('ModalMessageCtrl', ['$scope', '$modalInstance', 'options', function ($scope, $modalInstance, options) {
    'use strict';
    $scope.message = options.message;
    $scope.title = options.title;
    $scope.okButton = options.okButton;
    $scope.cancelButton = options.cancelButton;
    
    $scope.ok = function () {
        $modalInstance.close('ok');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

angular.module('BrewItYourself').service('messageService', ['$modal', function ($modal) {
    this.confirm = function (title, message) {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal-message.html',
            controller: 'ModalMessageCtrl',
            resolve: {
                options: function () {
                    return  {
                        message: message,
                        title: title,
                        okButton: 'Ok',
                        cancelButton: 'cancel'
                    };
                }
            }
        });
        return modalInstance.result;
    };
    this.inform = function (title, message) {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal-message.html',
            controller: 'ModalMessageCtrl',
            resolve: {
                options: function () {
                    return  {
                        message: message,
                        title: title,
                        okButton: 'Ok'
                    };
                }
            }
        });
        return modalInstance.result;
    };
}]);
/*global angular */
angular.module('BrewItYourself').directive('lastingEditable', ['$compile', '$document', function ($compile, $document) {
    'use strict';

    var elementClass = 'editable-hide';

    var buttons =
        '<span class="editable-buttons">' +
        '<button type="button" class="btn btn-primary" ng-click="submit()">' +
        '<span class="glyphicon glyphicon-ok"></span>' +
        '</button>' +
        '<button type="button" class="btn btn-default" ng-click="cancel()">' +
        '<span class="glyphicon glyphicon-remove"></span>' +
        '</button>' +
        '</span>';

    var errorContainer = '<div class="editable-error help-block ng-binding ng-hide" ng-show="$error" ng-bind="$error" style=""></div>';

    var template = '<div class="editable-controls form-group" ng-class="{\'has-error\': $error}">' +
        '<input type="number" min="0" class="editable-has-buttons editable-input form-control ng-pristine ng-untouched ng-valid" ng-model="$data.days" style="border: none;width: 50px;padding-left: 2px;">' +
        '<input type="number" min="0" class="editable-has-buttons editable-input form-control ng-pristine ng-untouched ng-valid" ng-model="$data.hours" style="border: none;width: 50px;padding-left: 2px;">' +
        '<input type="number" min="0" class="editable-has-buttons editable-input form-control ng-pristine ng-untouched ng-valid" ng-model="$data.minutes" style="border: none;width: 50px;padding-left: 2px;">';

    var getTemplate = function () {
        return '<form class="form-inline editable-wrap editable-lasting ng-pristine ng-valid ng-scope" role="form" blur="cancel">' +
            template +
            buttons +
            errorContainer +
            '</div>' +
            '</form>';
    };

    return {
        restrict: 'A',
        scope: {
            'lastingEditable': '='
        },
        controller: ['$scope', function ($scope) {
            var days = Math.floor($scope.lastingEditable / (60*24));
            var hours = Math.floor(($scope.lastingEditable - days * 24 * 60) / 60);
            var minutes = $scope.lastingEditable - days * 24 * 60 - hours * 60;
            $scope.$data = {
                days: days,
                hours: hours,
                minutes: minutes
            };
            $scope.cancel = function () {
                if ($scope.editableElement) {
                    $scope.editableElement.remove();
                    $scope.mainElement.removeClass(elementClass);
                }
                $scope.editableElement = null;
                $document.unbind('click', $scope.documentBinding);
            };
            $scope.submit = function () {
                $scope.lastingEditable = $scope.$data.days * 24 * 60 + $scope.$data.hours * 60 + $scope.$data.minutes;
                $scope.cancel();
            };
        }],
        link: function (scope, element, attrs) {
            scope.documentBinding = function(e) {
                // ignore right/middle button click
                if (e.which !== 1) {
                  return;
                }
                if (angular.element(e.target).parents('.form-inline').length === 0) {
                    scope.cancel();
                } 
            };
            scope.mainElement = element;
            element.addClass('editable-click');
            element.bind('click', function (e) {
                e.preventDefault();
                element.addClass(elementClass);
                scope.editableElement = angular.element(getTemplate());
                element.after($compile(scope.editableElement)(scope));
                e.stopPropagation();
                $document.bind('click', scope.documentBinding);
            });
        }
    };
}]);
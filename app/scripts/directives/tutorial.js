/*global angular */
angular.module('BrewItYourself').directive('tutorial', ['$compile', '$document', function ($compile, $document) {
    'use strict';
    
    var mainElement;
    
    var ids = [];
    
    var OPENED_MODAL_CLASS = 'modal-open';
    var body = $document.find('body').eq(0);
    
    var setState = function (state) {
        if (state) {
            body.addClass(OPENED_MODAL_CLASS);
        } else {
            body.toggleClass(OPENED_MODAL_CLASS, false);
        }
    };
    
    var setMainElement = function (element) {
        mainElement = element.find('div.main').eq(0);
    };
    
    var addSlide = function (id, htmlData) {
        mainElement.append('<div ng-show="currentId==\'' + id + '\'">' + htmlData + '</div>');
        ids.push(id);
    };
    
    return {
        restrict: 'A',
        scope: {
            'tutorial': '@',
            'tutorialEnd': '&',
            'tutorialStep': '&'
        },
        template: '<div ng-click="off()" ng-class="{tutorial:active, layer:active}" ng-show="active"></div>' +
        '<div ng-show="active" ng-class="{tutorial:tutorial}">' +
        '<div class="main">' +
        '</div>' +
        '</div>',
        controller: ['$scope', function($scope) {
            
            $scope.setSlide=function(slideId) {
                $scope.active = (ids.indexOf(slideId) > -1);
                setState($scope.active);
                $scope.currentId=slideId;
            };
            
            $scope.off = function() {
                if (ids.indexOf($scope.currentId) == ids.length-1) {
                    $scope.tutorialEnd();
                }
                var lastId = $scope.currentId;
                $scope.setSlide('none');
                if (lastId !== 'none') {
                    $scope.tutorialStep({ID: lastId});
                }
            };
            
            $scope.setSlide($scope.tutorial);
            
            $scope.$watch('tutorial', function(newVal, oldVal) {
                $scope.setSlide($scope.tutorial);
            });
        }],
        link: function (scope, element, attrs) {
            setMainElement(element);
            addSlide('start', '<div class="landru slide-landru"><span>{{\'Welcome to Brew It Yourself ! I will, now, teach you the basics.\' | translate}}</span></div>');
            addSlide('name-edit', '<div class="bulle slide1"><span>{{\'Edit the name, author and date of your recipe\' | translate}}</span></div>');
            addSlide('new-step', '<div class="bulle slide2"><span>{{\'Click to add a new step\' | translate}}</span></div>');
            addSlide('add-malt', '<div class="bulle slide3"><span>{{\'Click and add malt\' | translate}}</span></div>');
            addSlide('mass-malt', '<div class="bulle slide4"><span>{{\'Specify the quantity\' | translate}}</span></div>');
            addSlide('step-properties', '<div class="bulle slide5"><span>{{\'Specify the lasting and the temperature of the step\' | translate}}</span></div>');
            addSlide('go-on', '<div class="landru slide-landru"><span>{{\'Now, you are able to edit a complete recipe. Have fun !\' | translate}}</span></div>');
            
            scope.setSlide(attrs.tutorial);
            $compile(element.contents())(scope);
        }
    };
    
}]);
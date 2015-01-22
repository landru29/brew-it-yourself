/*global angular */
angular.module('BrewItYourself').directive('ingredientItem', ['$compile', function ($compile) {
    'use strict';
    
    var getIcon = function(ingredient) {
        var iconHtml='';
        switch (ingredient.type.toLowerCase()) {
            case 'fermentable':
                iconHtml = '<i class="fermentable-icon"></i>';
                break;
            case 'hop':
                iconHtml = '<i class="hop-icon"></i>';
                break;
            case 'misc':
                iconHtml = '<i class="misc-icon"></i>';
                break;
            case 'yeast':
                iconHtml = '<i class="yeast-icon"></i>';
                break;
            case 'water':
                iconHtml = '<i class="water-icon"></i>';
                break;
            default:
                break;
        }
        return iconHtml;
    };
    
    
    
    var getCaption = function(ingredient) {
        var captionHtml='';
        switch (ingredient.type.toLowerCase()) {
            case 'fermentable':
                captionHtml = '<span class="caption">' +
                '<a href="#" editable-text="ingredientItem.name" title="{{\'Name\' | translate}}" >{{ ingredientItem.name }}</a> ' +
                '(EBC:<a href="#" editable-text="ingredientItem.color" title="EBC" onbeforesave="checkFloat($data)">{{ ingredientItem.color }}</a> - ' +
                '{{\'yield\' | translate}}: <a href="#" editable-text="ingredientItem.yield" title="{{\'Sugar extraction max yield\' | translate}}" onbeforesave="checkFloat($data)">{{ ingredientItem.yield }}</a>%)' +
                '<span class="ebc-sample" style="background: {{loviToRgb(ingredientItem.color)}}" title="{{\'Malt color\' | translate}}"></span>' +
                '</span>';
                break;
            case 'hop':
                captionHtml = '<span class="caption">' +
                '<a href="#" editable-text="ingredientItem.name" title="{{\'Name\' | translate}}" >{{ ingredientItem.name }}</a> ' +
                '(&alpha;: <a href="#" editable-text="ingredientItem.alpha" title="{{\'Alpha acidity\' | translate}}" onbeforesave="checkFloat($data)">{{ ingredientItem.alpha }}</a>)' +
                '</span>';
                break;
            case 'misc':
                captionHtml = '<span class="caption">' +
                '<a href="#" editable-text="ingredientItem.name" title="{{\'Name\' | translate}}" >{{ ingredientItem.name }}</a>' +
                '</span>';
                break;
            case 'yeast':
                captionHtml = '<span class="caption">' +
                '<a href="#" editable-text="ingredientItem.name" title="{{\'Name\' | translate}}" >{{ ingredientItem.name }}</a>' +
                '</span>';
                break;
            case 'water':
                captionHtml = '<span class="caption">' +
                '<a href="#" editable-text="ingredientItem.name" title="{{\'Name\' | translate}}" >{{ ingredientItem.name }}</a>' +
                '</span>';
                break;
            default:
                break;
        }
        return captionHtml;
    };
    
    var getQuantity = function(ingredient) {
        var qtyHtml = '';
        switch (ingredient.type.toLowerCase()) {
            case 'fermentable':
                ingredient.qty = angular.extend({
                    value: 0,
                    unit: {
                        name: 'Kg',
                        type: 'mass.kg'
                    }
                }, ingredient.qty);
                qtyHtml = '<a href="#" editable-text="ingredientItem.qty.value" title="{{\'Quantity\' | translate}}" onbeforesave="checkFloat($data)" onaftersave="forceFloat(ingredientItem.qty)">{{ ingredientItem.qty.value }} {{ingredientItem.qty.unit.name}}</a>';
                break;
            case 'hop':
                ingredient.qty = angular.extend({
                    value: 0,
                    unit: {
                        name: 'g',
                        type: 'mass.g'
                    }
                }, ingredient.qty);
                qtyHtml = '<a href="#" editable-text="ingredientItem.qty.value" title="{{\'Quantity\' | translate}}" onbeforesave="checkFloat($data)" onaftersave="forceFloat(ingredientItem.qty)">{{ ingredientItem.qty.value }} {{ingredientItem.qty.unit.name}}</a>';
                break;
            case 'misc':
                ingredient.qty = angular.extend({
                    value: 0,
                    unit: {
                        name: 'g',
                        type: 'mass.g'
                    }
                }, ingredient.qty);
                qtyHtml = '<a href="#" editable-text="ingredientItem.qty.value" title="{{\'Quantity\' | translate}}" onbeforesave="checkFloat($data)" onaftersave="forceFloat(ingredientItem.qty)">{{ ingredientItem.qty.value }} {{ingredientItem.qty.unit.name}}</a>';
                break;
            case 'yeast':
                ingredient.qty = angular.extend({
                    value: 0,
                    unit: {
                        name: 'g',
                        type: 'mass.g'
                    }
                }, ingredient.qty);
                qtyHtml = '<a href="#" editable-text="ingredientItem.qty.value" title="{{\'Quantity\' | translate}}" onbeforesave="checkFloat($data)" onaftersave="forceFloat(ingredientItem.qty)">{{ ingredientItem.qty.value }} {{ingredientItem.qty.unit.name}}</a>';
                break;
            case 'water':
                ingredient.qty = angular.extend({
                    value: 0,
                    unit: {
                        name: 'L',
                        type: 'volume.l'
                    }
                }, ingredient.qty);
                qtyHtml = '<a href="#" editable-text="ingredientItem.qty.value" title="{{\'Quantity\' | translate}}" onbeforesave="checkFloat($data)" onaftersave="forceFloat(ingredientItem.qty)">{{ ingredientItem.qty.value }} {{ingredientItem.qty.unit.name}}</a>';
                break;
            default:
                break;
        }
        return qtyHtml;
        
    };
    
    return {
        restrict: 'A',
        scope: {
            ingredientItem: '='
        },
        controller: ['$scope', 'unitsConversion', function($scope, unitsConversion) {
            $scope.checkFloat = function(value) {
                if (isNaN(parseFloat(value))) {
                    return 'Should be a number ("." is decimal separator)';
                }
            };
            
            $scope.forceFloat = function(qty) {
                qty.value = parseFloat(qty.value);
            };
            
            $scope.loviToRgb = function(ebc) {
                return unitsConversion.fromTo(ebc, 'color.lovibond', 'rgb');
            };
        }],
        link: function (scope, element, attrs) {
            var ingredient = scope.ingredientItem;
            var icon = getIcon(ingredient);
            var caption = getCaption(ingredient);
            var qty = getQuantity(ingredient);
            
            var template = icon + qty + caption;

            element.html('').prepend($compile(template)(scope));
        }
    };
    
}]);
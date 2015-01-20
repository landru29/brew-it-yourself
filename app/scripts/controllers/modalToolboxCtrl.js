/*global angular */
angular.module('BrewItYourself').controller('ModalToolboxCtrl', ['$scope', '$filter', '$modalInstance', 'unitsConversion',
    function ($scope, $filter, $modalInstance, unitsConversion) {
        'use strict';

        $scope.accordeonStatus = {
            isFirstOpen: true,
            isFirstDisabled: false
        };
        $scope.oneAtATime = true;

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.gravity = {
            data: {
                initUnit: 'sg',
                finalUnit: 'sg',
            },
            showUnit: function (unit) {
                var selected = $filter('filter')(this.unit, {
                    value: unit
                });
                return selected[0].text;
            },
            unit: [
                {
                    value: 'sg',
                    text: 'Specific gravity'
                },
                {
                    value: 'brix',
                    text: '° brix'
                },
                {
                    value: 'plato',
                    text: '° plato'
                }
            ],
            displayAlcohol: function () {
                return Math.round(this.alcohol * 1000) / 10 + ' % Alc.';
            },
            computeAlcohol: function(data) {
                var initialgravity, finalgravity, alcohol, calculated = true;
                
                // Get initial gravity
                try {
                    initialgravity = unitsConversion.fromTo(data.init, 'sugar.' + data.initUnit, 'sg');
                } catch (e) {
                    calculated = false;
                }
                
                // Get the final gravity
                if (data.final) {
                    try {
                        finalgravity = unitsConversion.fromTo(data.final, 'sugar.' + data.finalUnit, 'sg');
                    } catch (e) {
                        calculated = false;
                    }
                } else {
                    finalgravity = 1;
                }
                
                // Check inconsistencies
                if (finalgravity < initialgravity) {
                    try {
                        alcohol = unitsConversion.fromTo(1 + initialgravity - finalgravity, 'sugar.sg', 'alcohol');
                    } catch (e) {
                        calculated = false;
                    }
                } else {
                    calculated = false;
                }
                
                // render computation
                if (calculated) {
                    this.alcohol = alcohol;
                } else {
                    this.alcohol = 0;
                }
                
            }
        };

        $scope.$watch('gravity.data', function (newVal, oldVal) {
            
            // If unit change, convert the value => initial gravity
            if (newVal.initUnit !== oldVal.initUnit) {
                try {
                    newVal.init = Math.round(unitsConversion.fromTo(newVal.init, 'sugar.' + oldVal.initUnit, newVal.initUnit)*1000)/1000;
                } catch (e) {
                    newVal.init=0;
                }
                return;
            }
            
            // If unit change, convert the value => final gravity
            if (newVal.finalUnit !== oldVal.finalUnit) {
                try {
                    newVal.final = Math.round(unitsConversion.fromTo(newVal.final, 'sugar.' + oldVal.finalUnit, newVal.finalUnit)*1000)/1000;
                } catch (e) {
                    newVal.final=0;
                }
                return;
            }
            
            // Compute alcohol
            $scope.gravity.computeAlcohol(newVal);
        }, true);

    }]);
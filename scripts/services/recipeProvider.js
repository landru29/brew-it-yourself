/*global angular*/
angular.module('BrewItYourself').provider('recipe', [ function () {
    'use strict';

    this.$get = ['$http', '$q', function ($http, $q) {
        return {
            Step: function (data) {
                this.name = '';
                this.lasting = {
                    minutes: 0,
                    hours: 0,
                    days: 0
                };
                this.temperature = 20;
                this.ingredients = [];
                angular.extend(this, data);
            },
            Recipe: function (data) {
                this.name = '';
                this.date = new Date();
                this.author = '';
                this.uuid = new Date().getTime().toString(16).toUpperCase();
                this.steps = [];
                angular.extend(this, data);
            }
        };
    }];
}]);
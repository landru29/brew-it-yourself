/*global angular*/
angular.module('BrewItYourself').filter('lasting', ['$filter', function ($filter) {
    'use strict';
    return function (text, trad) {
        if (!trad) {
            trad = {
                day: 'day(s)'
            };
        }
        var data = parseInt(text, 10);
        var days = Math.floor(data / (60 * 24));
        var hours = '00' + (Math.floor((data - days * 24 * 60) / 60));
        var minutes = '00' + (data - days * 24 * 60 - hours * 60);
        var result = [];
        if (days || hours || minutes) {
            if (days) {
                result.push(days + ' ' + $filter('translate')(trad.day));
            }
            if (parseInt(hours, 10) || parseInt(minutes, 10)) {
                result.push(hours.substr(hours.length-2, 2) + ':' + minutes.substr(minutes.length-2, 2));
            }
            return result.join(' - ');
        } else {
            result.push('00:00');
        }
        return result.join(' - ');
    };
}]);
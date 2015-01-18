/*global angular */
angular.module('BrewItYourself').factory('util', [function () {
    'use strict';
    
    var cleanObject = function (obj) {
        for (var i in obj) {
            if (i[0] === '$') {
                delete obj[i];
            } else if ('object' === typeof obj[i]) {
                cleanObject(obj[i]);
            }
        }
        return obj;
    };
    
    return {
        deleteFromArray : function (array, index) {
            var rest = array.slice(index + 1);
            array.length = index;
            return array.push.apply(array, rest);
        },
        cleanObject: cleanObject,
        duplicate: function (obj) {
            return cleanObject(JSON.parse(JSON.stringify(obj)));
        }
    };
}]);
/*global angular*/
angular.module('BrewItYourself').provider('ingredient', [ function () {
    'use strict';
    
    var database = {};
    
    var treeData = [];
    
    var computeTreeIngredient = function () {
        for (var chapter in  database) {
            for( var index in database[chapter]) {
                database[chapter][index].type = chapter;
            }
            treeData.push({
                name: chapter,
                collapsed:true,
                children: database[chapter]
            });
        }
    };

    this.$get = ['$http', '$q', function ($http, $q) {
        return {
            loadData: function (path) {
                var defered = $q.defer();
                $http.get(path)
                    .then(function (res) {
                        database = res.data;
                        computeTreeIngredient();
                        defered.resolve();
                    }, function (err) {
                        defered.reject(err);
                    });
                return defered.promise;
            },
            getChapters: function () {
                return Object.keys(database);
            },
            getDatabase: function () {
                return database;
            },
            getTreeIngredients: function () {
                if (treeData.length === 0) {
                    computeTreeIngredient();
                }
                return treeData;
            },
            getIngredients: function (chapter) {
                if (database[chapter]) {
                    return angular.extend(JSON.parse(JSON.stringify(database[chapter])), {type: chapter});
                }
                return null;
            }
        };
    }];
}]);
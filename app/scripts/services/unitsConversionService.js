/*global angular*/
angular.module('BrewItYourself').provider('unitsConversion', [

    function () {
        'use strict';

        var polynome = function (data, value) {
            var coef = {};
            var keys = Object.keys(data).sort();
            for (var i in keys) {
                var key = (('' + keys[i]).match(/[^\d]*(\d)/))[1];
                coef[key] = data[keys[i]];
            }

            return {
                coef: coef,
                compute: function (value) {
                    var result = 0;
                    for (var i in this.coef) {
                        result += Math.pow(value, parseInt(i, 10)) * this.coef[i];
                    }
                    return result;
                },
                solve: function (value) {
                    var _this = this;
                    var cubeRoot = function (a) {
                        var sign = a < 0 ? -1 : 1;
                        return sign * Math.pow(Math.abs(a), 1 / 3);
                    };
                    var thirdDegree = function (value) {
                        var a = _this.coef['3'];
                        var b = _this.coef['2'];
                        var c = _this.coef['1'];
                        var d = _this.coef['0'] - value;
                        var p = c / a - Math.pow(b, 2) / (3 * Math.pow(a, 2));
                        var q = 2 * Math.pow(b, 3) / (27 * Math.pow(a, 3)) + d / a - b * c / (3 * Math.pow(a, 2));
                        var D = Math.pow(q, 2) + 4 * Math.pow(p, 3) / 27;
                        if (D === 0) {
                            if ((p === 0) && (q === 0)) {
                                return 0;
                            } else {
                                return [
                                    2 * cubeRoot(-q / 2), -cubeRoot(-q / 2)
                                ];
                            }
                        }
                        if (D > 0) {
                            var u = cubeRoot((-q + Math.sqrt(D)) / 2);
                            var v = cubeRoot((-q - Math.sqrt(D)) / 2);
                            return u + v - b / (3 * a);
                        }
                        return [];
                    };

                    var secondDegree = function (value) {
                        var a = _this.coef['2'];
                        var b = _this.coef['1'];
                        var c = _this.coef['0'];
                        var D = Math.pow(b, 2) - 4 * a * c;
                        if (D === 0) {
                            return -b / (2 * a);
                        }
                        if (D > 0) {
                            return [
                                (-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)
                            ];
                        }
                        return [];
                    };

                    var firstDegree = function (value) {
                        var a0 = value - (_this.coef['0'] ? _this.coef['0'] : 0);
                        return a0 / _this.coef['1'];
                    };

                    if (this.coef['3']) {
                        return thirdDegree(value);
                    }
                    if (this.coef['2']) {
                        return secondDegree(value);
                    }
                    return firstDegree(value);
                }
            };
        };

        var conversionObject = {
            temperature: {
                celcius: polynome({ // kelvin -> celcius
                    a0: -273.15,
                    a1: 1
                }),
                fahrenheit: polynome({ // kelvin -> fahrenheit
                    a0: -459.67,
                    a1: 9 / 5
                }),
                kelvin: polynome({ // kelvin -> kelvin
                    a1: 1
                })
            },
            color: {
                ebc: polynome({
                    a1: 1
                }),
                srm: polynome({
                    a1: 1 / 1.97
                }),
                lovibond: polynome({
                    a0: 0.561051,
                    a1: 0.374734
                }),
                mcu: {
                    compute: function (ebc) {
                        if (ebc / 1.97 >= 10) {
                            return (ebc / 1.97 - (50 / 7)) * 3.5;
                        } else {
                            return 10 - Math.sqrt(100.0 - ebc * 5.0761421);
                        }
                    },
                    solve: function (mcu) {
                        if (mcu >= 10) {
                            return 3.94 * (mcu + 25) / 7;
                        } else {
                            return (100 - Math.pow(10 - mcu, 2)) / 5.0761421;
                        }
                    }
                },
                rgb: {
                    compute: function (ebc) {
                        var toHex = function(i) {
                            var s = '00' + i.toString(16);
                            return s.substring(s.length-2);
                        };
                        var r = Math.round(Math.min(255, Math.max(0, 255 * Math.pow(0.975, ebc/1.97))));
                        var g = Math.round(Math.min(255, Math.max(0, 245 * Math.pow(0.88, ebc/1.97))));
                        var b = Math.round(Math.min(255, Math.max(0, 220 * Math.pow(0.7, ebc/1.97))));
                        return '#' + toHex(r) + toHex(g) + toHex(b);
                    },
                    solve: function (rgb) {
                        var color = rgb.match(/#(.{2})(.{2})(.{2})/);
                        if (color.length === 4) {
                            var r = parseInt(color[1], 16);
                            var g = parseInt(color[1], 16);
                            var b = parseInt(color[1], 16);
                        }
                        return 0;
                    }
                }
            },
            sugar: {
                plato: polynome({ // sg -> plato
                    a3: 135.997,
                    a2: -630.272,
                    a1: 1111.14,
                    a0: -616.868
                }),
                brix: polynome({ // sg -> brix
                    a3: 182.4601,
                    a2: -775.6821,
                    a1: 1262.7794,
                    a0: -669.5622
                }),
                alcohol: polynome({ // sg -> alcohol
                    a1: 1 / 0.76,
                    a0: -1 / 0.76
                }),
                sg: polynome({ // sg -> sg
                    a1: 1
                }),
                /*gPerLiter: polynome({
                    a0: -5881.25865,
                    a1: 9098.641778,
                    a2: -3216.783128
                })*/
                gPerLiter: polynome({
                    a0: -2503.6363636389,
                    a1: 2503.6363636389
                })
            },
            mass: {
                kg: polynome({ // kg->kg
                    a1: 1
                }),
                g: polynome({ // kg->g
                    a1: 1000
                }),
                t: polynome({ // kg->T
                    a1: 0.001
                }),
                mg: polynome({ // kg->mg
                    a1: 1000000
                })
            },
            volume: {
                l: polynome({ // L -> L
                    a1: 1
                }),
                ml: polynome({ // L -> ml
                    a1: 1000
                }),
                dl: polynome({ // L -> dl
                    a1: 10
                }),
                cl: polynome({ // L -> cl
                    a1: 100
                }),
                'dm3': polynome({ // L -> dm3
                    a1: 1
                }),
                'm3': polynome({ // L -> m3
                    a1: 0.001
                }),
                'cm3': polynome({ // L -> cm3
                    a1: 1000
                }),
                'mm3': polynome({ // L -> mm3
                    a1: 1000000
                }),
                'gal-us': polynome({ // L -> gal-us
                    a1: 0.220
                }),
                'gal-en': polynome({ // L -> gal-en
                    a1: 0.264
                }),
                pinte: polynome({ // L -> pinte
                    a1: 1.760
                }),
            }
        };

        var UnitException = function (origin, message) {
            this.origin = origin;
            this.message = message;
        };

        var fromTo = function (value, from, to, type) {
            var decodeFrom = from.match(/(([\w-]*)\.)?(.*)/);
            var decodeTo = to.match(/(([\w-]*)\.)?(.*)/);
            var unitTo = decodeTo[3];
            var unitFrom = decodeFrom[3];
            if ('string' === typeof value) {
                value = parseFloat(value);
            }
            if (!type) {
                type = decodeFrom[2];
            }

            if (!conversionObject[type]) {
                throw new UnitException('from', 'Type ' + type + ' does not exist in the unit conversion system');
            }
            if (!conversionObject[type][unitFrom]) {
                throw new UnitException('from', 'Unit ' + unitFrom + ' does not exist for type ' + type);
            }
            if (!conversionObject[type][unitTo]) {
                throw new UnitException('to', 'Unit ' + unitTo + ' does not exist for type ' + type);
            }
            var SiValue = conversionObject[type][unitFrom].solve(value);
            if ('number' !== typeof SiValue) {
                throw new UnitException('from', 'Value ' + value + ' is out of bounce in unit ' + unitFrom + ', type ' + type);
            }
            return conversionObject[type][unitTo].compute(SiValue);
        };

        this.registerConversion = function (polynomeCoef, unit, type) {
            var decode = unit.match(/([\w-]*\.)?(.*)/);
            var thisUnitTo = decode[3];
            if (!type) {
                type = decode[2];
            }
            if (!conversionObject[type]) {
                conversionObject[type] = {};
            }
            conversionObject[type][thisUnit] = polynome(polynomeCoef);
        };

        this.fromTo = fromTo;

        this.$get = [

            function () {
                return {
                    fromTo: fromTo,
                    getPhysicalType: function() {
                        return Object.keys(conversionObject);
                    },
                    getPhysicalUnits: function(physicalType) {
                        return Object.keys(conversionObject[physicalType]);
                    }
                        
                };
        }];
            }]);
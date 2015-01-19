(function() {
	var beerLib = require('./beer-lib.js');

	var shouldBe = function(expected, value, message) {
		var arrondi = function(data) {
			return Math.round(data * 1000) / 1000;
		};
		message += ': ' + arrondi(value) + ' should be ' + arrondi(expected);
		console.log((arrondi(value) === arrondi(expected) ? '[OK] ' : '[ERROR] ') + message);
	};


	shouldBe(283.15, beerLib.conversion.temperature.fromCelcius(10).toKelvin(), 'Celcius to Kelvin');
	shouldBe(15.556, beerLib.conversion.temperature.fromFahrenheit(60).toCelcius(), 'Fahrenheit to Celcius');
	shouldBe(60, beerLib.conversion.temperature.fromCelcius(15.555555555555557).toFahrenheit(), 'Celcius to Fahrenheit');

	shouldBe(22.014, beerLib.conversion.sugar.fromSg(1.092).toBrix(), 'Sg to Brix');
	shouldBe(21.568, beerLib.conversion.sugar.fromSg(1.090).toPlato(), 'Sg to Plato');
	shouldBe(0.066, beerLib.conversion.sugar.fromSg(1.050).toAlcohol(), 'Sg to Alcohol');

	shouldBe(1.092, beerLib.conversion.sugar.fromBrix(22.014).toSg(), 'Brix to Sg');
	shouldBe(1.090, beerLib.conversion.sugar.fromPlato(21.57).toSg(), 'Plato to Sg');
	shouldBe(1.050, beerLib.conversion.sugar.fromAlcohol(0.066).toSg(), 'Alcohol to Sg');

})();

describe('BrewItYourself.unitsConversionService', function () {

    var service;

    beforeEach(module('BrewItYourself'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('unitsConversion');
    }));

    it('Should find all functions', function () {
        expect(service.fromTo).toBeDefined();
        expect(service.getPhysicalType).toBeDefined();
        expect(service.getPhysicalUnits).toBeDefined();
    });
    
    it('Should find physical types', function() {
        expect(service.getPhysicalType()).toContain('temperature');
        expect(service.getPhysicalType()).toContain('color');
        expect(service.getPhysicalType()).toContain('sugar');
        expect(service.getPhysicalType()).toContain('mass');
        expect(service.getPhysicalType()).toContain('volume');
    });
    
    it('Should find physical units', function() {
        expect(service.getPhysicalUnits('temperature')).toContain('celcius');
        expect(service.getPhysicalUnits('temperature')).toContain('kelvin');
        expect(service.getPhysicalUnits('temperature')).toContain('fahrenheit');
        expect(service.getPhysicalUnits('color')).toContain('ebc');
        expect(service.getPhysicalUnits('color')).toContain('srm');
        expect(service.getPhysicalUnits('color')).toContain('rgb');
        expect(service.getPhysicalUnits('color')).toContain('lovibond');
        expect(service.getPhysicalUnits('color')).toContain('mcu');
        expect(service.getPhysicalUnits('sugar')).toContain('plato');
        expect(service.getPhysicalUnits('sugar')).toContain('brix');
        expect(service.getPhysicalUnits('sugar')).toContain('sg');
        expect(service.getPhysicalUnits('sugar')).toContain('alcohol');
        expect(service.getPhysicalUnits('sugar')).toContain('gPerLiter');
        expect(service.getPhysicalUnits('mass')).toContain('g');
        expect(service.getPhysicalUnits('mass')).toContain('kg');
        expect(service.getPhysicalUnits('mass')).toContain('t');
        expect(service.getPhysicalUnits('mass')).toContain('mg');
        expect(service.getPhysicalUnits('volume')).toContain('l');
        expect(service.getPhysicalUnits('volume')).toContain('ml');
        expect(service.getPhysicalUnits('volume')).toContain('cl');
        expect(service.getPhysicalUnits('volume')).toContain('dm3');
        expect(service.getPhysicalUnits('volume')).toContain('m3');
        expect(service.getPhysicalUnits('volume')).toContain('cm3');
        expect(service.getPhysicalUnits('volume')).toContain('mm3');
        expect(service.getPhysicalUnits('volume')).toContain('gal-us');
        expect(service.getPhysicalUnits('volume')).toContain('gal-en');
        expect(service.getPhysicalUnits('volume')).toContain('pinte');
    });
    
    it('Should convert temperature', function() {
        expect(service.fromTo(10, 'celcius', 'kelvin', {type:'temperature'})).toBe(283.15);
        expect(service.fromTo(10, 'temperature.celcius', 'fahrenheit', {precision:3})).toBe(50);
        expect(service.fromTo(60, 'temperature.fahrenheit', 'kelvin', {precision:3})).toBe(288.706);
    });
    
    it('Should convert color', function() {
        expect(service.fromTo(30, 'color.ebc', 'srm', {precision:3})).toBe(15.228);
        expect(service.fromTo(10, 'color.ebc', 'rgb', {precision:3})).toBe('#e08024');
        expect(service.fromTo(30, 'color.ebc', 'lovibond', {precision:3})).toBe(11.803);
        expect(service.fromTo(30, 'color.ebc', 'mcu', {precision:3})).toBe(28.299);
    
    });
    
    it('Should convert sugar', function() {
        expect(service.fromTo(30, 'sugar.plato', 'brix', {precision:3})).toBe(30.025);
        expect(service.fromTo(30, 'sugar.plato', 'sg', {precision:3})).toBe(1.129);
        expect(service.fromTo(30, 'sugar.plato', 'alcohol', {precision:3})).toBe(0.17);
        expect(service.fromTo(30, 'sugar.plato', 'gPerLiter', {precision:3})).toBe(300.249);
    });
    
    it('Should convert mass', function() {
        expect(service.fromTo(10, 'mass.kg', 'g')).toBe(10000);
        expect(service.fromTo(10, 'mass.t', 'kg')).toBe(10000);
        expect(service.fromTo(10, 'mass.mg', 'g')).toBe(0.01);
    });
    
    it('Should convert volume', function() {
        expect(service.fromTo(10, 'volume.l', 'ml')).toBe(10000);
        expect(service.fromTo(10, 'volume.l', 'cl')).toBe(1000);
        expect(service.fromTo(1000, 'volume.ml', 'dm3')).toBe(1);
        expect(service.fromTo(1000, 'volume.l', 'm3')).toBe(1);
        expect(service.fromTo(10, 'volume.l', 'cm3')).toBe(10000);
        expect(service.fromTo(10, 'volume.ml', 'mm3')).toBe(10000);
        expect(service.fromTo(10, 'volume.gal-en', 'l', {precision:3})).toBe(37.879);
        expect(service.fromTo(10, 'volume.gal-us', 'l', {precision:3})).toBe(45.455);
        expect(service.fromTo(10, 'volume.pinte', 'l', {precision:3})).toBe(5.682);
    });

});
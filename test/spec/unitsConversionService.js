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
    
    it('Should convert color', function() {});
    
    it('Should convert sugar', function() {});
    
    it('Should convert mass', function() {
        expect(service.fromTo(10, 'mass.kg', 'g')).toBe(10000);
        expect(service.fromTo(10, 'mass.t', 'kg')).toBe(10000);
        expect(service.fromTo(10, 'mass.mg', 'g')).toBe(0.01);
    });
    
    it('Should convert volume', function() {});

});
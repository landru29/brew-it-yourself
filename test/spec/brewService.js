describe('BrewItYourself.recipeService', function () {

    var service;

    beforeEach(module('BrewItYourself'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('brew');
    }));

    it('Should find all functions', function () {
        expect(service.mashingVolume).toBeDefined();
        expect(service.liquidEstimation).toBeDefined();
        expect(service.sugarEstimation).toBeDefined();
        expect(service.gravityEstimation).toBeDefined();
        expect(service.ibuEstimation).toBeDefined();
        expect(service.getAlcohol).toBeDefined();
        expect(service.estimateSRM).toBeDefined();
    });
    
    it('Should estimate mashing volume', function(){
        expect(service.mashingVolume(fixture.fermentables, 3)).toBe(24);
    });
    
    it('Should estimate liquide', function(){
        expect(service.liquidEstimation(50, fixture.fermentables, 1)).toBe(42);
    });
    
    it('Should estimate sugar', function(){
        expect(Math.round(service.sugarEstimation(fixture.fermentables)*1000)/1000).toBe(Math.round((5 * 0.81 + 3 * 0.50) * 0.9*1000)/1000);
    });
    
    it('Should estimate gravity', function(){
        expect(Math.round(service.gravityEstimation(fixture.fermentables, 50)*1000)/1000).toBe(1.040);
    });
    
    it('Should estimate Bitterness', function(){
        expect(Math.round(service.ibuEstimation(fixture.hops, 1.050, 35)*1000)/1000).toBe(24.55);
    });
    
    it('Should estimate alcohol', function(){
        expect(Math.round(service.getAlcohol(1.050, 1.015)*1000)/10).toBe(4.6);
    });
    
    it('Should estimate color', function(){
        expect(service.estimateSRM(fixture.fermentables, 50).color).toBeDefined();
        expect(service.estimateSRM(fixture.fermentables, 50).srm).toBeDefined();
        expect(service.estimateSRM(fixture.fermentables, 50).color).toBe('#e3882b');
    });
    
    
});
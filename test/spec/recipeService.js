describe('BrewItYourself.recipeService', function () {

    var service;

    beforeEach(module('BrewItYourself'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('recipe');
    }));

    it('Should find all functions', function () {
        expect(service.Step).toBeDefined();
        expect(service.Recipe).toBeDefined();
        expect(service.generateUUID).toBeDefined();
        expect(service.getIngredient).toBeDefined();
        expect(service.getFermentableMass).toBeDefined();
        expect(service.getHops).toBeDefined();
        expect(service.getLiquidVolume).toBeDefined();
    });

    it('Should create a step', function () {
        var step = new service.Step();
        expect(Object.keys(step)).toContain('name');
        expect(Object.keys(step)).toContain('lasting');
        expect(Object.keys(step)).toContain('temperature');
        expect(Object.keys(step)).toContain('ingredients');
    });

    it('Should create a Recipe', function () {
        var recipe = new service.Recipe();
        expect(Object.keys(recipe)).toContain('name');
        expect(Object.keys(recipe)).toContain('date');
        expect(Object.keys(recipe)).toContain('author');
        expect(Object.keys(recipe)).toContain('uuid');
        expect(Object.keys(recipe)).toContain('steps');
    });

    it('Liquid volume', function () {
        expect(service.getLiquidVolume(fixture.recipe)).toBe(35);
    });

    it('Hops detail', function () {
        expect(service.getHops(fixture.recipe).length).toBe(2);
        expect(service.getHops(fixture.recipe)[0].alpha).toBeDefined();
        expect(service.getHops(fixture.recipe)[0].mass).toBeDefined();
        expect(service.getHops(fixture.recipe)[0].lasting).toBeDefined();
    });

    it('Fermentable detail', function () {
        expect(service.getFermentableMass(fixture.recipe).length).toBe(1);
        expect(service.getFermentableMass(fixture.recipe)[0].mass).toBeDefined();
        expect(service.getFermentableMass(fixture.recipe)[0].yield).toBeDefined();
        expect(service.getFermentableMass(fixture.recipe)[0].color).toBeDefined();
    });

    it('Ingredient detail', function () {
        expect(service.getIngredient(fixture.recipe, {
            type: 'water'
        }).length).toBe(2);
        expect(service.getIngredient(fixture.recipe, {
            type: 'water'
        })[0].type).toBe('water');
    });

});
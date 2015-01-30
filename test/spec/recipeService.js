describe('BrewItYourself.recipeService', function () {

    var service;

    beforeEach(module('BrewItYourself'));
    beforeEach(inject(function ($injector) {
        service = $injector.get('recipe');
    }));

    it('Should find all functions', function () {
        expect(service.Ingredient).toBeDefined();
        expect(service.Step).toBeDefined();
        expect(service.Recipe).toBeDefined();
        expect(service.generateUUID).toBeDefined();
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
    
    it('Should load a recipe', function() {
        var recipe = new service.Recipe(fixture.recipe);
        expect(recipe.steps.length).toBe(7);
        expect(recipe.steps[0].ingredients.length).toBe(2);
    });
    
    it('Should create an Ingredient', function () {
        var ingredient = new service.Ingredient();
    });

    it('Liquid volume', function () {
        var recipe = new service.Recipe(fixture.recipe);
        expect(recipe.getLiquidVolume()).toBe(35);
    });

    it('Hops detail', function () {
        var recipe = new service.Recipe(fixture.recipe);
        expect(recipe.getHops().length).toBe(2);
        expect(recipe.getHops()[0].alpha).toBeDefined();
        expect(recipe.getHops()[0].mass).toBeDefined();
        expect(recipe.getHops()[0].lasting).toBeDefined();
    });

    it('Fermentable detail', function () {
        var recipe = new service.Recipe(fixture.recipe);
        expect(recipe.getFermentableMass().length).toBe(1);
        expect(recipe.getFermentableMass()[0].mass).toBeDefined();
        expect(recipe.getFermentableMass()[0].yield).toBeDefined();
        expect(recipe.getFermentableMass()[0].color).toBeDefined();
    });

    it('Ingredient detail', function () {
        var recipe = new service.Recipe(fixture.recipe);
        expect(recipe.getIngredients({
            type: 'water'
        }).length).toBe(2);
        expect(recipe.getIngredients({
            type: 'water'
        })[0].type).toBe('water');
    });
    
    it('Should compute mashing volume', function () {
        var recipe = new service.Recipe(fixture.recipe);
        expect(recipe.mashingVolume()).toBe(15);
    });
    
    it('Should compute liquid retention', function () {
        var recipe = new service.Recipe(fixture.recipe);
        expect(recipe.liquidRetention()).toBe(5);
    });
    
    it('Should compute sugar mass', function () {
        var recipe = new service.Recipe(fixture.recipe);
        expect(Math.round(recipe.sugarMassEstimation() * 1000) / 1000).toBe(3.645);
    });
    
    it('Should compute gravity', function () {
        var recipe = new service.Recipe(fixture.recipe);
        expect(Math.round(recipe.gravity() * 1000) / 1000).toBe(1.042);
    });
    
    it('Should compute IBU', function () {
        var recipe = new service.Recipe(fixture.recipe);
        expect(Math.round(recipe.ibuEstimation() * 10) / 10).toBe(27.2);
    });
    
    it('Should compute Alcohol', function () {
        var recipe = new service.Recipe(fixture.recipe);
        expect(Math.round(recipe.getAlcohol() * 1000) / 10).toBe(3.5);
    });

    it('Should estimate color', function () {
        var recipe = new service.Recipe(fixture.recipe);
        var color = recipe.estimateColor();
        expect(color.rgb).toBe('#f2bd6b');
        expect(Math.round(color.srm * 1000) / 1000).toBe(2.027);
    });
    
     it('Should compute remaining time', function () {
        var recipe = new service.Recipe(fixture.recipe);
        expect(recipe.getTime(recipe.steps[0], recipe.steps[recipe.steps.length-2])).toBe(205);
    });
    
});
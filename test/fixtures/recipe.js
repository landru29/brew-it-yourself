fixture.recipe = {
    "name": "Brew it !",
    "date": "2015-01-20T12:16:40.281Z",
    "author": "Landru",
    "uuid": "0000",
    "steps": [{
        "name": "Mashing",
        "lasting": {
            "minutes": 15,
            "hours": 0,
            "days": 0
        },
        "temperature": 45,
        "ingredients": [{
            "name": "Pilsner",
            "type": "fermentable",
            "yield": "81",
            "color": "2",
            "recommendMash": "true",
            "qty": {
                "value": 5,
                "unit": {
                    "name": "Kg",
                    "type": "mass.kg"
                }
            }
        }, {
            "name": "Tap water",
            "type": "water",
            "qty": {
                "value": 15,
                "unit": {
                    "name": "L",
                    "type": "volume.l"
                }
            }
        }],
        "reduced": false
    }, {
        "name": "First step",
        "lasting": {
            "minutes": 30,
            "hours": 0,
            "days": 0
        },
        "temperature": 62,
        "ingredients": [],
        "reduced": false
    }, {
        "name": "Second step",
        "lasting": {
            "minutes": 30,
            "hours": 0,
            "days": 0
        },
        "temperature": 68,
        "ingredients": [],
        "reduced": false
    }, {
        "name": "Rinsing",
        "lasting": {
            "minutes": 0,
            "hours": 1,
            "days": 0
        },
        "temperature": 80,
        "ingredients": [{
            "name": "Tap water",
            "type": "water",
            "qty": {
                "value": 20,
                "unit": {
                    "name": "L",
                    "type": "volume.l"
                }
            }
        }],
        "reduced": false
    }, {
        "name": "Boiling",
        "lasting": {
            "minutes": 0,
            "hours": 1,
            "days": 0
        },
        "temperature": 100,
        "ingredients": [{
            "name": "Cascade",
            "alpha": "6",
            "form": "Leaf",
            "type": "hop",
            "qty": {
                "value": 50,
                "unit": {
                    "name": "g",
                    "type": "mass.g"
                }
            }
        }],
        "reduced": false
    }, {
        "name": "Aromatic hops",
        "lasting": {
            "minutes": 10,
            "hours": 0,
            "days": 0
        },
        "temperature": 100,
        "ingredients": [{
            "name": "Saaz",
            "alpha": "4",
            "form": "Leaf",
            "type": "hop",
            "qty": {
                "value": 50,
                "unit": {
                    "name": "g",
                    "type": "mass.g"
                }
            }
        }],
        "reduced": false
    }, {
        "name": "Fermentation",
        "lasting": {
            "minutes": 0,
            "hours": 0,
            "days": 30
        },
        "temperature": 12,
        "ingredients": [{
            "name": "Belgian Abbey",
            "form": "Liquid",
            "laboratory": "Wyeast",
            "productId": "1214",
            "attenuation": "76",
            "type": "yeast",
            "qty": {
                "value": 15,
                "unit": {
                    "name": "g",
                    "type": "mass.g"
                }
            }
        }],
        "reduced": false
    }]
};
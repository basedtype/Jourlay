const tool = require('./tools');

const information = {
    'ibis': {
        class: 1,
        shield: 200,
        armor: 125,
        freeCapacity: 125,
        damage: 14,
        timeToRegenerate: [tool.ConvertTime({minutes: 20}), tool.ConvertTime({minutes: 40})],
        timeToComplete: [tool.ConvertTime({minutes: 40}), tool.ConvertTime({minutes: 60})],
        price: 0,
    },
    'condor': {
        class: 2,
        shield: 400,
        armor: 250,
        freeCapacity: 130,
        damage: 32,
        timeToRegenerate: [tool.ConvertTime({minutes: 40}), tool.ConvertTime({minutes: 60})],
        timeToComplete: [tool.ConvertTime({minutes: 60}), tool.ConvertTime({minutes: 145})],
        price: 250000,
    },
    'corax': {
        class: 3,
        shield: 1000,
        armor: 750,
        freeCapacity: 450,
        damage: 140,
        timeToRegenerate: [tool.ConvertTime({minutes: 60}), tool.ConvertTime({minutes: 80})],
        timeToComplete: [tool.ConvertTime({minutes: 40}), tool.ConvertTime({minutes: 170})],
        price: 1400000,
    },
    'moa': {
        class: 4,
        shield: 2500,
        armor: 1000,
        freeCapacity: 450,
        damage: 100,
        timeToRegenerate: [tool.ConvertTime({minutes: 100}), tool.ConvertTime({minutes: 150})],
        timeToComplete: [tool.ConvertTime({minutes: 60}), tool.ConvertTime({minutes: 200})],
        price: 10700000,
    },
    'naga': {
        class: 5,
        shield: 2160,
        armor: 1575,
        freeCapacity: 575,
        damage: 400,
        timeToRegenerate: [tool.ConvertTime({minutes: 120}), tool.ConvertTime({minutes: 180})],
        timeToComplete: [tool.ConvertTime({minutes: 50}), tool.ConvertTime({minutes: 167})],
        price: 70700000,
    }
};


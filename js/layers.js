addLayer("p", {
    name: "problem solved", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "orange",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "problem solved", // Name of prestige currency
    baseResource: "thoughts", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('p',24)) mult=mult.mul(upgradeEffect('p',24))
        if(hasUpgrade('p',31)) mult=mult.mul(upgradeEffect('p',31))
        if(hasUpgrade('r', 11)) mult=mult.mul(upgradeEffect('r',11))
        if(hasUpgrade('c', 11)) mult=mult.mul(upgradeEffect('c',11))
        if(hasUpgrade('g', 11)) mult=mult.mul(upgradeEffect('g',11))
        if(hasUpgrade('d', 11)) mult=mult.mul(upgradeEffect('d',11))
        if(hasAchievement('a',41)) mult=mult.mul(achievementEffect('a',41))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for problem solved", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades:{
        11:{
            title: "The beginning",
            description: "Gain 1 thought per second.",
            cost: new Decimal(1)
        },
        12:{
            title: "Another upgrade",
            description: "Gain 1 more thought per second.",
            unlocked(){return hasUpgrade('p', 11)},
            cost: new Decimal(1)
        },
        13:{
            title: "The third upgrade",
            description: "Gain 1 more thought per second, again.",
            unlocked(){return hasUpgrade('p', 12)},
            cost: new Decimal(1)
        },
        14:{
            title: "Being tired of add 1",
            description: "Gain 1 more thought per second for the last time.",
            unlocked(){return hasUpgrade('p', 13)},
            cost: new Decimal(2)
        },
        21:{
            title: "Another beginning",
            description: "Double your thoughts gain per second.",
            unlocked(){return hasUpgrade('p', 14)},
            cost: new Decimal(3)
        },
        22:{
            title: "WARNING: INFLATION",
            description: "Gain more thoughts per second based on problem solved.",
            unlocked(){return hasUpgrade('p', 21)},
            effect(){return player[this.layer].points.add(1).pow(0.3)},
            effectDisplay(){return hasUpgrade('p', 22)?format(upgradeEffect('p',22))+'x':'1x'},
            cost: new Decimal(5)
        },
        23:{
            title: "Not really inflation",
            description: "Gain more thoughts per second based on thoughts.",
            unlocked(){return hasUpgrade('p', 22)},
            effect(){return player.points.add(1).pow(0.2)},
            effectDisplay(){return hasUpgrade('p', 23)?format(upgradeEffect('p',23))+'x':'1x'},
            cost: new Decimal(10)
        },
        24:{
            title: "Maybe inflation",
            description: "Gain more problem solved on reset based on thoughts.",
            unlocked(){return hasUpgrade('p', 23)},
            effect(){return player.points.add(1).pow(0.2)},
            effectDisplay(){return hasUpgrade('p', 24)?format(upgradeEffect('p',24))+'x':'1x'},
            cost: new Decimal(25)
        },
        31:{
            title: "Meta Upgrade",
            description: "Gain more problem solved on reset based on problem solved.",
            unlocked(){return hasUpgrade('p', 24)},
            effect(){return player[this.layer].points.add(1).log2().add(1).pow(0.8)},
            effectDisplay(){return hasUpgrade('p', 31)?format(upgradeEffect('p',31))+'x':'1x'},
            cost: new Decimal(80)
        },
        32:{
            title: "Final Upgrade",
            description: "Unlock the next 2 layers.",
            unlocked(){return hasUpgrade('p', 31)},
            cost: new Decimal(500)
        },
        41:{
            title: "Legendary problem solver",
            description: "Get the orange key.",
            unlocked(){return hasAchievement('a', 34)},
            cost: new Decimal(1e40)
        }
    },
    doReset(resettingLayer){
        let keep=[];
        if (hasAchievement('a',24)) keep.push("upgrades");
        if (layers[resettingLayer].row > this.row) {layerDataReset('p', keep);
        if(resettingLayer=='r')
        {
            if(hasMilestone('r',0)) player[this.layer].upgrades = player[this.layer].upgrades.concat([11,12,13,14]);
            if(hasMilestone('r',1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([21,22,23,24]);
            if(hasMilestone('r',2)) player[this.layer].upgrades = player[this.layer].upgrades.concat([31,32]);
        }
        if(resettingLayer=='c')
        {
            if(hasMilestone('c',0)) player[this.layer].upgrades = player[this.layer].upgrades.concat([11,12,13,14]);
            if(hasMilestone('c',1)) player[this.layer].upgrades = player[this.layer].upgrades.concat([21,22,23,24]);
            if(hasMilestone('c',2)) player[this.layer].upgrades = player[this.layer].upgrades.concat([31,32]);
        }
        };
    },
    passiveGeneration(){
        ret=0
        if(hasMilestone('c',3)) ret+=0.25
        if(hasMilestone('r',3)) ret+=0.25
        return ret
    }
})
addLayer("r", {
    name: "rating", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "R", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches:['p'],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "green",
    requires: ()=>{return !hasAchievement('a',31)&&hasMilestone('c',0)&&!hasMilestone('r',1)?new Decimal(1e5):new Decimal(2000)}, // Can be a function that takes requirement increases into account
    resource: "rating", // Name of prestige currency
    baseResource: "thoughts", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    base:1.5,
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('c',13)) mult=mult.div(upgradeEffect('c',13))
        if(hasUpgrade('r',12)) mult=mult.div(upgradeEffect('r',12))
        if(hasUpgrade('g',12)) mult=mult.div(upgradeEffect('g',12))
        if(hasUpgrade('d',12)) mult=mult.div(upgradeEffect('d',12))
        if(hasUpgrade('pc',12)) mult=mult.div(upgradeEffect('pc',12))
        if(hasAchievement('a',41)) mult=mult.div(achievementEffect('a',41))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "r", description: "R: Reset for rating", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones:{
        0: {
            requirementDescription: "1 rating",
            effectDescription: "Keep the first row of P upgrade on R reset",
            done() { return player.r.points.gte(1) }
        },
        1: {
            requirementDescription: "2 rating",
            effectDescription: "Keep the second row of P upgrade on R reset, and this layer behaves as it's unlocked first",
            done() { return player.r.points.gte(2) }
        },
        2: {
            requirementDescription: "4 rating",
            effectDescription: "Keep the third row of P upgrade on R reset",
            done() { return player.r.points.gte(4) }
        },
        3: {
            requirementDescription: "6 rating",
            effectDescription: "Gain 25% of problem solved on reset every second",
            done() { return player.r.points.gte(6) }
        }
    },
    layerShown(){return hasUpgrade('p',32)||hasMilestone('r',0)||hasAchievement('a',24)},
    upgrades:{
        11:{
            title: "More practice",
            description: "Gain more problem solved and thoughts based on rating.",
            effect(){return player.r.points.add(1).pow(1.2)},
            effectDisplay(){return hasUpgrade('r', 11)?format(upgradeEffect('r',11))+'x':'1x'},
            cost: new Decimal(1)
        },
        12:{
            title: "More and more practice",
            description: "Gain more rating based on rating.",
            effect(){return player.r.points.add(1).log2().add(1)},
            effectDisplay(){return hasUpgrade('r', 12)?format(upgradeEffect('r',12))+'x':'1x'},
            cost: new Decimal(3)
        },
        13:{
            title: "Even more practice",
            description: "Gain more contests completed based on rating.",
            effect(){return player.r.points.add(1).log2().add(1)},
            effectDisplay(){return hasUpgrade('r', 13)?format(upgradeEffect('r',13))+'x':'1x'},
            cost: new Decimal(6)
        },
        14:{
            title: "Infinity practice",
            description: "Get the green key.",
            unlocked(){return hasAchievement('a', 34)},
            cost: new Decimal(36)
        },
    },
    doReset(resettingLayer){
        let keep=[];
        if (hasMilestone('g',0)||(hasMilestone('pc',0)&&resettingLayer=='pc')) keep.push("milestones");
        if (hasMilestone('g',1)||(hasMilestone('pc',1)&&resettingLayer=='pc')) keep.push("upgrades");
        if (layers[resettingLayer].row > this.row) {layerDataReset('r', keep);};
    },
    resetsNothing(){return hasMilestone('g',2);},
    autoPrestige(){return hasMilestone('g',2);},
    canBuyMax(){
        return hasMilestone('g',3)
    }
})
addLayer("c", {
    name: "contests completed", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches:['p'],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "red",
    requires: ()=>{return !hasAchievement('a',31)&&hasMilestone('r',0)&&!hasMilestone('c',1)?new Decimal(5e4):new Decimal(1500)}, // Can be a function that takes requirement increases into account
    resource: "contests completed", // Name of prestige currency
    baseResource: "problem solved", // Name of resource prestige is based on
    baseAmount() {return player['p'].points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if(hasUpgrade('r',13)) mult=mult.mul(upgradeEffect('r',13))
        if(hasUpgrade('c',12)) mult=mult.mul(upgradeEffect('c',12))
        if(hasUpgrade('g',12)) mult=mult.mul(upgradeEffect('g',12))
        if(hasUpgrade('d',12)) mult=mult.mul(upgradeEffect('d',12))
        if(hasUpgrade('pc',12)) mult=mult.mul(upgradeEffect('pc',12))
        if(hasAchievement('a',41)) mult=mult.mul(achievementEffect('a',41))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "c", description: "C: Reset for contests completed", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    milestones:{
        0: {
            requirementDescription: "1 contests completed",
            effectDescription: "Keep the first row of P upgrade on C reset",
            done() { return player.c.points.gte(1) }
        },
        1: {
            requirementDescription: "3 contests completed",
            effectDescription: "Keep the second row of P upgrade on C reset, and this layer behaves as it's unlocked first",
            done() { return player.c.points.gte(3) }
        },
        2: {
            requirementDescription: "5 contests completed",
            effectDescription: "Keep the third row of P upgrade on C reset",
            done() { return player.c.points.gte(5) }
        },
        3: {
            requirementDescription: "10 contests completed",
            effectDescription: "Gain 25% of problem solved on reset every second",
            done() { return player.c.points.gte(10) }
        }
    },
    layerShown(){return hasUpgrade('p',32)||hasMilestone('c',0)||hasAchievement('a',24)},
    upgrades:{
        11:{
            title: "Passing a contest",
            description: "Gain more problem solved and thoughts based on contests completed.",
            effect(){return player.c.points.pow(0.5).add(1)},
            effectDisplay(){return hasUpgrade('c', 11)?format(upgradeEffect('c',11))+'x':'1x'},
            cost: new Decimal(1)
        },
        12:{
            title: "Passing more contest",
            description: "Gain more contests completed based on contests completed.",
            effect(){return player.c.points.add(1).log2().add(1).pow(0.8)},
            effectDisplay(){return hasUpgrade('c', 12)?format(upgradeEffect('c',12))+'x':'1x'},
            cost: new Decimal(3)
        },
        13:{
            title: "Passing more and more contest",
            description: "Gain more rating based on contests completed.",
            effect(){return player.c.points.add(1).log2().add(1)},
            effectDisplay(){return hasUpgrade('c', 13)?format(upgradeEffect('c',13))+'x':'1x'},
            cost: new Decimal(15)
        },
        14:{
            title: "Passing every contest",
            description: "Get the red key.",
            unlocked(){return hasAchievement('a', 34)},
            cost: new Decimal(1e15)
        },
    },
    doReset(resettingLayer){
        let keep=[];
        if (hasMilestone('d',0)||(hasMilestone('pc',0)&&resettingLayer=='pc')) keep.push("milestones");
        if (hasMilestone('d',1)||(hasMilestone('pc',1)&&resettingLayer=='pc')) keep.push("upgrades");
        if (layers[resettingLayer].row > this.row) {layerDataReset('c', keep);};
    },
    passiveGeneration()
    {
        c=0
        if(hasMilestone('d',2)) c+=1
        if(hasMilestone('pc',2)) c+=1
        return c
    },
})
addLayer("g", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    branches:['r'],
position: 0,
    color: "blue",                       // The color for this layer, which affects many elements.
    resource: "Gu points",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "rating",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.r.points },  // A function to return the current amount of baseResource.

    requires(){
        if(hasAchievement('a',34)) return new Decimal(10);
        if(hasMilestone('pc',0)) return hasMilestone('d',0)?new Decimal(15):new Decimal(13);
        else return hasMilestone('d',0)?new Decimal(14):new Decimal(10);
    },              // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 3,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        mult=new Decimal(1)               // Factor in any bonuses multiplying gain here.
        if(hasAchievement('a',41)) mult=mult.mul(achievementEffect('a',41))
        return mult
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    hotkeys: [
        {key: "g", description: "G: Reset for Gu points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],

    layerShown() { return hasAchievement('a',25) },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11:{
            title: "Becoming blue-colored",
            description: "Gain more problem solved and thoughts based on Gu points.",
            effect(){return player.g.points.add(1).pow(0.7)},
            effectDisplay(){return hasUpgrade('g', 11)?format(upgradeEffect('g',11))+'x':'1x'},
            cost: new Decimal(1)
        },
        12:{
            title: "Becoming green-colored",
            description: "The prievous upgrade also affects rating and contests completed at a reduced rate.",
            effect(){return upgradeEffect('g',11).pow(0.7)},
            effectDisplay(){return hasUpgrade('g', 12)?format(upgradeEffect('g',12))+'x':'1x'},
            cost: new Decimal(4)
        },
        13:{
            title: "Becoming red-colored",
            description: "Get the blue key.",
            unlocked(){return hasAchievement('a', 24)},
            cost: new Decimal(300)
        },
        // Look in the upgrades docs to see what goes here!
    },
    milestones:{
        0: {
            requirementDescription: "1 Gu points",
            effectDescription: "Keep all R milestones on all reset.",
            done() { return player.g.points.gte(1) }
        },
        1: {
            requirementDescription: "3 Gu points",
            effectDescription: "Keep all R upgrades on all reset.",
            done() { return player.g.points.gte(3) }
        },
        2: {
            requirementDescription: "4 Gu points",
            effectDescription: "Rating resets nothing and automatically reset for rating.",
            done() { return player.g.points.gte(4) }
        },
        3: {
            requirementDescription: "25 Gu points",
            effectDescription: "You can reset for max rating.",
            done() { return player.g.points.gte(25) }
        },
    }
})
addLayer("pc", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    symbol:'PC',
    branches:['r','c'],
position: 1,
    color: "yellow",                       // The color for this layer, which affects many elements.
    resource: "problem created",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "problem solved",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.p.points },  // A function to return the current amount of baseResource.

    hotkeys: [
        {key: "P", description: "Shift+P : Reset for problem created", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    requires(){
        if(hasAchievement('a',34)) return new Decimal(2e8);
        if(hasMilestone('g',0)) return hasMilestone('d',0)?new Decimal(1e23):new Decimal(1e11);
        else return hasMilestone('d',0)?new Decimal(1e17):new Decimal(2e8);
    },               // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.2,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        mult=new Decimal(1)               // Factor in any bonuses multiplying gain here.
        if(hasAchievement('a',41)) mult=mult.mul(achievementEffect('a',41))
        return mult
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() {return hasAchievement('a',25) },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11:{
            title: "Produce problems",
            description: "Gain more problem solved and thoughts based on problem created.",
            effect(){return player.pc.points.add(1).pow(0.4)},
            effectDisplay(){return hasUpgrade('pc', 11)?format(upgradeEffect('pc',11))+'x':'1x'},
            cost: new Decimal(1)
        },
        12:{
            title: "Extreme problem producer",
            description: "The prievous upgrade also affects rating and contests completed at a reduced rate.",
            effect(){return upgradeEffect('pc',11).pow(0.4)},
            effectDisplay(){return hasUpgrade('pc', 12)?format(upgradeEffect('pc',12))+'x':'1x'},
            cost: new Decimal(5)
        },
        13:{
            title: "Mega problem producer",
            description: "Get the yellow key.",
            unlocked(){return hasAchievement('a', 34)},
            cost: new Decimal(1e6)
        },
        // Look in the upgrades docs to see what goes here!
    },
    milestones:{
        0: {
            requirementDescription: "1 problem created",
            effectDescription: "Keep all R&C milestones on PC reset.",
            done() { return player.pc.points.gte(1) }
        },
        1: {
            requirementDescription: "5 problem created",
            effectDescription: "Keep all R&C upgrades on PC reset.",
            done() { return player.pc.points.gte(5) }
        },
        2: {
            requirementDescription: "15 problem created",
            effectDescription: "Gain 100% of contests completed on reset every second.",
            done() { return player.pc.points.gte(15) }
        },
    },
})
addLayer("d", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},
    symbol:'D',
    branches:['c'],
position: 2,
    color: "pink",                       // The color for this layer, which affects many elements.
    resource: "discuss released",            // The name of this layer's main prestige resource.
    row: 2,                                 // The row this layer is on (0 is the first row).

    baseResource: "contests completed",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.c.points },  // A function to return the current amount of baseResource.

    hotkeys: [
        {key: "d", description: "D :Reset for discuss released", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    requires(){
        if(hasAchievement('a',34)) return new Decimal(1500);
        if(hasMilestone('g',0)) return hasMilestone('pc',0)?new Decimal(5e6):new Decimal(30000);
        else return hasMilestone('pc',0)?new Decimal(5e5):new Decimal(1500);
    },                 // The amount of the base needed to  gain 1 of the prestige currency.
                                            // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.7,base:1.2,                          // "normal" prestige gain is (currency^exponent).

    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        mult=new Decimal(1)               // Factor in any bonuses multiplying gain here.
        if(hasAchievement('a',41)) mult=mult.div(achievementEffect('a',41))
        return mult
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() {return hasAchievement('a',25) },          // Returns a bool for if this layer's node should be visible in the tree.

    upgrades: {
        11:{
            title: "Talking is improving",
            description: "Gain more problem solved and thoughts based on discuss released.",
            effect(){return player.d.points.add(1).pow(0.7)},
            effectDisplay(){return hasUpgrade('d', 11)?format(upgradeEffect('d',11))+'x':'1x'},
            cost: new Decimal(1)
        },
        12:{
            title: "Improving is talking",
            description: "The prievous upgrade also affects rating and contests completed at a reduced rate.",
            effect(){return upgradeEffect('d',11).pow(0.7)},
            effectDisplay(){return hasUpgrade('d', 12)?format(upgradeEffect('d',12))+'x':'1x'},
            cost: new Decimal(3)
        },
        13:{
            title: "The famous discusser",
            description: "Get the pink key.",
            unlocked(){return hasAchievement('a', 34)},
            cost: new Decimal(1000)
        },
        // Look in the upgrades docs to see what goes here!
    },
    milestones:{
        0: {
            requirementDescription: "1 discuss released",
            effectDescription: "Keep all C milestones on all reset.",
            done() { return player.d.points.gte(1) }
        },
        1: {
            requirementDescription: "2 discuss released",
            effectDescription: "Keep all C upgrades on all reset.",
            done() { return player.d.points.gte(2) }
        },
        2: {
            requirementDescription: "3 discuss released",
            effectDescription: "Gain 100% of contests completed on reset every second",
            done() { return player.d.points.gte(3) }
        },
        3: {
            requirementDescription: "4 discuss released",
            effectDescription: "You can reset for max discuss released",
            done() { return player.d.points.gte(4) }
        },
    },
    canBuyMax(){
        return hasMilestone('d',3)
    }
})

addLayer("gm", {
    name: "gm", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "Gm", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    branches:['g','pc','d'],
    startData() { return {
        unlocked: false,
        points: new Decimal(0),
    }},
    color: "white",
    resource: "games completed", // Name of prestige currency
     requires: new Decimal(6), // Can be a function that takes requirement increases into account
     type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
     exponent: 0.5, // Prestige currency exponent
    baseResource: "keys",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return new Decimal(hasUpgrade('p',41)+hasUpgrade('r',14)+hasUpgrade('c',14)
    +hasUpgrade('g',13)+hasUpgrade('pc',13)+hasUpgrade('d',13)) },  // A function to return the current amount of baseResource.
    row: 3, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "G", description: "Shift+G: Reset for game completed", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasAchievement('a',35)}
})
addLayer("a", {
    startData() { return {
        unlocked: true,
    }},
    color: "yellow",
    row: "side",
    layerShown() {return true}, 
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievements: {
        11: {
            name: "The beginning",
            done() { return player.p.points.gte(1) },
            tooltip: "Get at least 1 problem solved.",
        },
        12: {
            name: "No more Add 1",
            done() { return hasUpgrade('p',14) },
            tooltip: "Buy the first 4 P upgrades.",
        },
        13: {
            name: "Exponential",
            done() { return hasUpgrade('p',22) },
            tooltip: "Buy the 6th P upgrade.",
        },
        14: {
            name: "Boost from all to all",
            done() { return hasUpgrade('p',31) },
            tooltip: "Buy the 6th,7th,8th,9th P upgrade.",
        },
        15: {
            name: "A completion",
            done() { return hasUpgrade('p',32) },
            tooltip: "Buy the first 10 P upgrades.",
        },
        21: {
            name: "Back to the beginning",
            done() { return hasMilestone('r',0)||hasMilestone('c',0) },
            tooltip: "Perform a R or C reset.",
        },
        22: {
            name: "Deep boost",
            done() { return hasUpgrade('r',11)||hasUpgrade('c',11) },
            tooltip: "Buy the first upgrade of R or C.",
        },
        23: {
            name: "Another completion",
            done() { return hasMilestone('r',3)||hasMilestone('c',3) },
            tooltip: "Reach all milestones of R or C.",
        },
        24: {
            name: "I have both!",
            done() { return hasMilestone('r',0)&&hasMilestone('c',0) },
            tooltip: "Unlock both R and C layers.<br>Reward: All P upgrades are kept on all resets.",
        },
        25: {
            name: "Is it RATED?",
            done() { return player.r.points.gte(9)&&player.c.points.gte(300) },
            tooltip: "Have at least 9 rating and 300 contests completed.<br>Reward: Unlock the next row of layers.",
        },
        31: {
            name: "Back to the beginning AGAIN",
            done() { return player.g.points.gte(1)||player.pc.points.gte(1)||player.d.points.gte(1) },
            tooltip: "Perform a G or PC or D reset.<br>Reward: R and C always behaves as they are unlocked first.",
        },
        32: {
            name: "Automation",
            done() { return hasMilestone('g',2)||hasMilestone('pc',2)||hasMilestone('d',2)},
            tooltip: "Reach the third milestone of G or PC or D.",
        },
        33: {
            name: "Multiple boost",
            done() { return (hasMilestone('g',0)+hasMilestone('pc',0)+hasMilestone('d',0))>=2},
            tooltip: "Unlock at least two of G, PC and D.",
        },
        34: {
            name: "I have all!",
            done() { return player.g.points.gte(1)&&player.pc.points.gte(1)&&player.d.points.gte(1) },
            tooltip: "Unlock G, PC and D.<br>Reward: They all behave as unlocked first,and unlock the keys.",
        },
        35: {
            name: "The key to the door",
            done() { return hasUpgrade('p',41)||hasUpgrade('r',14)||hasUpgrade('c',14)||hasUpgrade('g',13)||hasUpgrade('pc',13)||hasUpgrade('d',13) },
            tooltip: "Get at least one key.<br>Reward: Unlock the final layer.",
        },
       41: {
            name: "Brand new beginning",
            done() { return player.gm.points.gte(1) },
            effect(){return (new Decimal(1.5)).pow(player.gm.points)},
            tooltip(){return "Perform a Gm reset.<br>Reward: Boost all the prievous layers based on Game completed.<br>Currently:"
            +(hasAchievement('a',41)?format(achievementEffect('a',41))+'x':'1x')},
        },
       42: {
            name: "You are here again",
            done() { return player.gm.points.gte(2) },
            tooltip: "Have 2 game completed.",
        },
       43: {
            name: "Faster and Faster",
            done() { return player.gm.points.gte(4) },
            tooltip: "Have 4 game completed.",
        },
       44: {
            name: "Buying upgrades is boring",
            done() { return player.gm.points.gte(8) },
            tooltip: "Have 8 game completed.",
        },
       45: {
            name: "The true ENDgame",
            done() { return player.gm.points.gte(10) },
            tooltip: "Complete 10 games.<br>Reward: Beat the game.",
        },
    },
    tabFormat: [
        "blank",  
        ["display-text", function() { return "Achievements: "+player.a.achievements.length+"/"+(Object.keys(tmp.a.achievements).length-2) }], 
        "blank", "blank",
        "achievements",
    ],
})

// addLayer("p", {
//     name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
//     symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
//     position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
//     startData() { return {
//         unlocked: true,
//         points: new Decimal(0),
//     }},
//     color: "#4BDC13",
//     requires: new Decimal(10), // Can be a function that takes requirement increases into account
//     resource: "prestige points", // Name of prestige currency
//     baseResource: "points", // Name of resource prestige is based on
//     baseAmount() {return player.points}, // Get the current amount of baseResource
//     type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
//     exponent: 0.5, // Prestige currency exponent
//     gainMult() { // Calculate the multiplier for main currency from bonuses
//         mult = new Decimal(1)
//         return mult
//     },
//     gainExp() { // Calculate the exponent on main currency from bonuses
//         return new Decimal(1)
//     },
//     row: 0, // Row the layer is in on the tree (0 is the first row)
//     hotkeys: [
//         {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
//     ],
//     layerShown(){return true}
// })

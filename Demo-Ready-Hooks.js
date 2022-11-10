const actorsToRemove = ["Voo7V2dvjq8OB72O"];  // This can be added in the script with the other actors
const targets = ['8EdIT1rTFAjaQYc9'];
let tokenIdToRemove = ["8EdIT1rTFAjaQYc9"];


Hooks.on("canvasReady", () => {
    canvas.tokens.releaseAll()
    console.log("released")
	
	// Look at this for error relating to "Cannot read properties of undefined (reading 'mouseInteractionManager')"
	for (const targetId of targets) {
    token = canvas.tokens.get(targetId);
    if (token) token.mouseInteractionManager.callbacks.clickRight2 = () => {
        token.setTarget(!token.isTargeted, game.user, true, false);
		}
	}
})

Hooks.once('ready', () => {
    if (game.paused) {
        game.togglePause(false, true);
        console.log("unpaused")
    }
})

// Double click macro

Hooks.on("renderBasePlaceableHUD", (a, b, tokenData) => {
    if (game.user.role === 1) {
        if (tokenData.actorId && actorsToRemove.includes(tokenData.actorId)) {
            $(b).hide();
            new Promise(r => setTimeout(() => {
                canvas.tokens.releaseAll();
                r(true);
            }, 1));
        }
    }
});


/*
actorsToRemove.forEach(a => {
    //if (a === "sIuLzxlBNc18qs6V") console.log(a); else return
    let actor = document.querySelector(`[data-document-id="${a}"]`)
    actor.style.display = "none"
})
*/

Hooks.on("renderActorSheet", (a, b, token) => {
    if (game.user.role === 1) {
        if (token.actor._id && actorsToRemove.includes(token.actor._id)) {

            $(b).hide()
            new Promise(r => setTimeout(() => {
                a.close()
                r(true);

            }, 10))
        }
    }
});

Hooks.once('setup', function () {
    game.triggers.registerEffect('sceneTransition');
    game.triggers.registerEffect('sceneTransition');
    game.triggers.registerEffect('panCamera');
    game.triggers.registerEffect('moveToken');
    game.triggers.registerEffect('popMessage');
    game.triggers.registerEffect('playAudio');
    game.triggers.registerEffect('tiles');
    game.triggers.registerEffect('volume');
    game.triggers.registerEffect('dialogWizard');
});

Hooks.on('TriggerHappy', async (key, args) => {
    console.log(`TriggerHappy custom effect: ${key} with args: ${JSON.stringify(args)}`)
    // 'key' is the reference name of the custom effect without the initial @
    // 'args' is the array of string to use like arguments for your code
    // TriggerHappy args are already read as strings, so don't give them quotation marks in journal ""
    switch (key) {
        case 'sceneTransition':
            // TriggerHappy does split(" ") so we rejoin the args to form a string to pass as transition content
            // /Transition2 "Display this as text"
            await game.macros.getName("Transition2").execute(args.join(" "));
            break;
        case 'panCamera':
            // /pan-camera x y scale
            await game.macros.getName("pan-camera").execute(...args);
            break;
        case 'moveToken':
            // args passed in as strings, split on " ". If string, join together to get scene and pass as first arg
            const targetScene = args.filter(a => isNaN(a)).join(" ");
            const targetCoords = args.filter(a => !isNaN(a)).map(a => Number(a));
            // /MoveToken "Scene name" x y
            // In this case, x and y need to be numbers
            await game.macros.getName("MoveToken").execute(targetScene, targetCoords[0], targetCoords[1]);
            break;
        case 'popMessage': 
            // /PopMessage "Locked"
            // v10 introduces pages, so all PopMessage journal pages' content will be concatenated before shown to user
            // TriggerHappy does split(" ") so we rejoin the args to form a string to pass as transition content
            await game.macros.getName("PopMessage").execute(args.join(" "));
            break;
        case 'playAudio':
            // /play-audio "path/to/audioURL" pushAudioToAllPlayersBool
            await game.macros.getName("play-audio").execute(...args);
            break;
        case 'tiles':
            // /tiles "tileId"
            // Show and hide a tile after a little while
            await game.macros.getName("Tiles").execute(args);
            break;
        case 'volume':
            // /Volume 0.1
            // Parse argument as number and pass it into Volume macro
            await game.macros.getName("Volume").execute(Number(args[0] || 0));
            break;
        case 'dialogWizard':
            await game.macros.getName("Dialog Wizard").execute(...args);
            break;
        // case 'genericMacro':
        //     // It's possible to pass string arguments to macros in this way with a generic macro event
        //     // Might need a little tweaking, depending on inputs. String args not wrapped in "" should work fine.
        //     await game.macros.getName(args[0]).execute(...args.slice(1));
        //     break;
        default:
            console.warn("TriggerHappy unknown custom effect");
            break;
    }
})
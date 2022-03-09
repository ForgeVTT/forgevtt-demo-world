Hooks.on("canvasReady", () => {
    canvas.tokens.releaseAll()
    console.log("released")
})

Hooks.once('ready', () => {
    if (game.paused) {
        game.togglePause(false, true);
        console.log("unpaused")
    }
})

// Double click macro
const actorsToRemove = ["Voo7V2dvjq8OB72O"];  // This can be added in the script with the other actors
const targets = ['8EdIT1rTFAjaQYc9'];
let tokenIdToRemove = ["8EdIT1rTFAjaQYc9"];

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

Hooks.once(`ready`, () => { // Look at this for error relating to "Cannot read properties of undefined (reading 'mouseInteractionManager')"
    for (const targetId of targets) {
        token = canvas.tokens.get(targetId);
        token.mouseInteractionManager.callbacks.clickRight2 = () => {
            token.setTarget(!token.isTargeted, game.user, true, false);
        }
    }
})

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
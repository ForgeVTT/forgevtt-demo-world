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
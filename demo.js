Hooks.on("ready", () => {
    const journal = game.journal.entities.find(j => j.name === "Triggers")
    if (!journal) return;
    const triggerLines = journal.data.content.split("\n");
    game.triggers = {}
    for (const trigger of triggerLines) {
        const entityTypes = CONST.ENTITY_LINK_TYPES.concat("Macro")
        const entityMatchRgx = `@(${entityTypes.join("|")})\\[([^\\]]+)\\](?:{([^}]+)})?`;
        const rgx = new RegExp(entityMatchRgx, 'g');
        let actor = null;
        const links = []
        for (let match of trigger.matchAll(rgx)) {
            if (!actor && match[1] !== "Actor") break;
            if (!actor) {
                actor = match[2];
                continue;
            }
            const config = CONFIG[match[1]]
            if (!config) continue;
            const link = config.entityClass.collection.get(match[2])
            if (!link) continue;
            links.push(link)
        }
        if (actor)
            game.triggers[actor] = links;
    }
});

Hooks.on('hoverToken', (token, hovered) => {
    token.off('click');
    if (!hovered) return;
    token.on('click', ev => {
        const links = game.triggers[token.data.actorId];
        if (!links) return;
        for (let link of links) {
            if (link.constructor.name === "Scene") {
                link.view();
            } else if (link.constructor.name === "Macro") {
                link.execute();
            } else {
                link.sheet.render(true);
            }
        }
    });
});

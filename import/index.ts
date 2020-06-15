import * as fs from "fs";
import * as path from "path";
import * as itch from "./games-itch";
import * as steam from "./v2-steam";
import removeAccents from "remove-accents";

const bundle = itch.loadBundleGames();

bundle.games.forEach(game => {
    game.steamAppId = steam.getSteamAppId(game.title);
    game.category = guessCategory(game)
});

bundle.games.sort((a, b) => {
    return b.ratings_count - a.ratings_count;
});

fs.writeFileSync(path.resolve(__dirname, "../static/dist/games.json"), JSON.stringify(bundle.games, null, 2));
fs.writeFileSync(path.resolve(__dirname, "../static/dist/games.js"), "window.GAMES = " + JSON.stringify(bundle.games));

function guessCategory(game: itch.Game) {
    const title = removeAccents(game.title).toLowerCase().replace(/[^a-z ]+/g, '');
    const fullText = removeAccents(game.title + '_' + game.short_text).toLowerCase().replace(/[^a-z_ ]+/g, '');
    if (game.steamAppId) {
        return 'game';
    }
    if (title.includes('asset') || title.includes(' pack') || title.includes('font')
        || title.includes('video') || title.includes('texture') || title.includes('sfx') || title.includes('tileset')
        || title.endsWith(' kit') || fullText.includes(' tool')) {
        return 'assets';
    }
    if (title.includes('soundtrack') || title.includes('sountrack') || title.includes(' ost')) {
        return 'soundtrack';
    }
    return 'game';
}

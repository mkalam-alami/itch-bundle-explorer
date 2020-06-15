import * as fs from "fs";
import * as path from "path";
import * as itch from "./games-itch";
import * as steam from "./v2-steam";

const bundle = itch.loadBundleGames();

bundle.games.forEach(game => {
     game.steamAppId = steam.getSteamAppId(game.title)
});

bundle.games.sort((a, b) => {
    return b.ratings_count - a.ratings_count;
});

fs.writeFileSync(path.resolve(__dirname, "../static/dist/games.json"), JSON.stringify(bundle.games, null, 2));
fs.writeFileSync(path.resolve(__dirname, "../static/dist/games.js"), "window.GAMES = " + JSON.stringify(bundle.games));

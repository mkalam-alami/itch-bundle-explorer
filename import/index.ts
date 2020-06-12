import * as fs from "fs";
import * as path from "path";

export interface Game {
    id: number;
    cover_color: string;
    ratings_count: number;
    user: {
        url: string;
        name: string;
        id: number;
    }
    flag?: "free" | "web";
    title: string;
    cover: string;
    url: string;
    platforms: string[];
    short_text: string;
    price: string;
}

interface Games {
    games: Game[];
}

const bundle = JSON.parse(fs.readFileSync(path.resolve(__dirname, "games.json")).toString()) as Games;

bundle.games.sort((a, b) => {
    return b.ratings_count - a.ratings_count;
})

fs.writeFileSync(path.resolve(__dirname, "../static/dist/games.json"), JSON.stringify(bundle.games, null, 2));
fs.writeFileSync(path.resolve(__dirname, "../static/dist/games.js"), "window.GAMES = " + JSON.stringify(bundle.games));

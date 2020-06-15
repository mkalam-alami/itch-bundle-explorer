import * as fs from "fs";
import * as path from "path";

// Source: https://itch.io/bundle/520/games.json

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
    steamAppId?: string;
}

export interface Games {
    games: Game[];
}

export function loadBundleGames() {
    return JSON.parse(fs.readFileSync(path.resolve(__dirname, "games.json")).toString()) as Games;
}

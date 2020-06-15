import * as fs from "fs";
import * as path from "path";

// Source: https://api.steampowered.com/ISteamApps/GetAppList/v2/

interface SteamGames {
    applist: {
        apps: Array<{
            appid: string;
            name: string;
        }>
    }
}

const steamGames = JSON.parse(fs.readFileSync(path.resolve(__dirname, "v2.json")).toString()) as SteamGames;

export function getSteamAppId(name: string) {
    return steamGames.applist.apps.find(app => app.name === name)?.appid;
}

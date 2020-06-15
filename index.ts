import download from "download";
import * as fs from "fs";
import { Game } from "import/games-itch";
import Koa from "koa";
import koaStatic from "koa-static";
import * as path from "path";

const PICS_FOLDER = path.resolve(__dirname, "static/pics");
const GAMES = JSON.parse(fs.readFileSync(path.resolve(__dirname, "static/dist/games.json")).toString()) as Game[];

const app = new Koa();

app.use(koaStatic("."))

app.use(async (ctx) => {
    if (ctx.url.startsWith("/static/pics/")) {
        // Cache game pics locally
        // TODO Download them on import
        const picFile = ctx.url.replace("/static/pics/", "");
        const picId = parseInt(picFile.split(".")[0], 10);
        if (!isNaN(picId)) {
            const matchingGame = GAMES.find(game => game.id === picId);
            if (matchingGame && matchingGame.cover) {
                const localPicPath = path.resolve(__dirname, `static/pics/${picId}.png`)
                if (!fs.existsSync(localPicPath)) {
                    console.log("Downloading pic for " + matchingGame.title);
                    fs.writeFileSync(path.resolve(PICS_FOLDER, localPicPath), await download(matchingGame.cover));
                }
                if (fs.existsSync(localPicPath)) {
                    ctx.body = fs.readFileSync(localPicPath);
                    ctx.type = "image/png";
                }

            }
        }
    }
});

app.listen(8080, () => console.log("Server started"));

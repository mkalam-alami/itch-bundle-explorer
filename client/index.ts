import Vue from "vue";
import { Game } from "import";

const games = (window as any).GAMES as Game[];

new Vue({
    el: "#app",
    data: {
        games
    }
})

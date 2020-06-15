import LazyloadVue from "lazyload-vue";
import { debounce } from "lodash-es";
import removeAccents from "remove-accents";
import Vue from "vue";
import { Game } from "import/games-itch";

interface SearchEntry {
    searchString: string;
    game: Game;
}

const MAX_GAMES = 30;

const games = (window as any).GAMES as Game[];
const searchIndex = buildSearchIndex(games);

Vue.use(LazyloadVue);

new Vue({
    el: "#app",
    data: {
        results: games.slice(0, 30),
        resultsCount: games.length,
        search: '',
        allResults: false,
        steamOnly: false
    },
    watch: {
        allResults() {
            this.refreshResults();
        },
        steamOnly() {
            this.refreshResults();
        }
    },
    methods: {
        onSearch: debounce(function() {
            this.refreshResults()
        }, 300),
        refreshResults() {
            if (this.search) {
                this.results = matchingGames(searchIndex, this.search);
            } else {
                this.results = games;
            }

            if (this.steamOnly) {
                this.results = this.results.filter(result => Boolean(result.steamAppId));
            }

            this.resultsCount = this.results.length;

            if (!this.allResults) {
                this.results = this.results.slice(0, MAX_GAMES)
            }
        }
    }
})

function matchingGames(searchIndex: SearchEntry[], text: string) {
    const searchString = toSearchString(text);
    return searchIndex
        .filter(entry => entry.searchString.includes(searchString))
        .map(entry => entry.game);
}

function buildSearchIndex(games: Game[]) {
    const index: SearchEntry[] = [];
    games.forEach(game => index.push({ game, searchString: toSearchString(game.title + game.user.name) }))
    return index;
}

function toSearchString(text: string) {
    return removeAccents(text).toLowerCase().replace(/[^a-z]+/g, '');
}
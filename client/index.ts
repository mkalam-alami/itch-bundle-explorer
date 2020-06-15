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
        steamOnly: false,
        categoryGame: true,
        categoryBook: true,
        categoryAssets: true,
        categorySoundtrack: true
    },
    watch: {
        allResults() { this.refreshResults(); },
        steamOnly() { this.refreshResults(); },
        categoryGame() { this.refreshResults(); },
        categoryBook() { this.refreshResults(); },
        categoryAssets() { this.refreshResults(); },
        categorySoundtrack() { this.refreshResults(); },
    },
    methods: {
        onSearch: debounce(function() {
            this.refreshResults()
        }, 300),
        refreshResults() {
            // Text-based search
            if (this.search) {
                this.results = matchingGames(searchIndex, this.search);
            } else {
                this.results = games;
            }
            
            // Filters
            const categoryFilter = [
                ...(this.categoryGame ? ['game'] : []),
                ...(this.categoryBook ? ['book'] : []),
                ...(this.categoryAssets ? ['assets'] : []),
                ...(this.categorySoundtrack ? ['soundtrack'] : [])
            ]
            this.results = this.results.filter(result => categoryFilter.includes(result.category))
            if (this.steamOnly) {
                this.results = this.results.filter(result => Boolean(result.steamAppId));
            }

            // Count
            this.resultsCount = this.results.length;

            // Results limit
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
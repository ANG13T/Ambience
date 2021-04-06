import { getPurifiedInput, getSongsFromData, getSongsForCategory } from "./getCommands.js";
import { categories } from '../index.js';
var songs = getSongsFromData(categories);

function matchSongByName(title) {
    let purifiedTitle = getPurifiedInput(title);
    for (let song of songs) {
        let purifiedSongName = getPurifiedInput(song.name);
        if (purifiedSongName == purifiedTitle) {
            return song.link;
        }
    }
    return false;
}

function matchSongByCategoryIndex(content) {
    let results = content.split(" ");
    console.log("cat index results", results)
    if (matchCategoryByName(results[0])) {
        let categorySongs = getSongsForCategory(results[0]);
        if (categorySongs[results[1] - 1]) {
            return categorySongs[results[1] - 1].link;
        } else {
            // give user a descriptive error message
            return false;
        }
    }
    return false;
}

function matchCategoryByName(name) {
    let purifiedInput = getPurifiedInput(name);

    for (let category of categories) {
        let categoryName = category.name.toLowerCase();
        if (categoryName == purifiedInput) {
            return category;
        }
    }

    return false;
}

module.exports = {
    matchCategoryByName: matchCategoryByName,
    matchSongByCategoryIndex: matchSongByCategoryIndex,
    matchSongByName: matchSongByName
};
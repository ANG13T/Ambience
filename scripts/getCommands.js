import { matchCategoryByName } from "./matchCommands.js";
import songsData from '../data/songs.js';
const categories = songsData.categories;;
var songs = getSongsFromData(categories);


export function getKeyWord(keyword, command) {
    let split = command.split(" ");
    if (split[0] == keyword && split.length > 1) {
        return true;
    }

    return false;
}

export function getSongsFromData(data) {
    let songs = [];
    data.forEach((category) => {
        Array.prototype.push.apply(songs, category.songs);
    })
    return songs;
}

export function getSongFromURL(songLink){
    for(let song of songs){
        if(song.link == songLink){
            return song;
        }
    }
    return false;
}

// lowercase and remove emoji for user song and category name input
// this makes searching for the category or song more accurate and efficent
export function getPurifiedInput(input) {
    let removeEmojiString = input.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    let lowercase = removeEmojiString.replace(/\s/g, "").toLowerCase();
    return lowercase;
}

export function getSongsForCategory(categoryInput) {
    let matchedCategory = matchCategoryByName(categoryInput);
    return matchedCategory.songs;
}

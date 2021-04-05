function getKeyWord(keyword, command) {
    let split = command.split(" ");
    if (split[0] == keyword && split.length > 1) {
        return true;
    }

    return false;
}

function getSongsFromData(data) {
    let songs = [];
    data.forEach((category) => {
        Array.prototype.push.apply(songs, category.songs);
    })
    return songs;
}

// lowercase and remove emoji for user song and category name input
// this makes searching for the category or song more accurate and efficent
function getPurifiedInput(input) {
    let removeEmojiString = input.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
    let lowercase = removeEmojiString.replace(/\s/g, "").toLowerCase();
    return lowercase;
}

function getSongsForCategory(categoryInput) {
    let matchedCategory = matchCategoryByName(categoryInput);
    return matchedCategory.songs;
}

module.exports = {
    getKeyWord: getKeyWord,
    getSongsFromData: getSongsFromData,
    getPurifiedInput: getPurifiedInput,
    getSongsForCategory: getSongsForCategory
};
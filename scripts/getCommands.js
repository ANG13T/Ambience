import { matchCategoryByName } from "./matchCommands.js";
import Discord from 'discord.js';
import songsData from '../data/songs.js';
import commandsData from "../data/commands.js";
import configInput from "../data/config.js";
const categories = songsData.categories;;
var songs = getSongsFromData(categories);
var commands = commandsData.commands;
let prefix = process.env.PREFIX;
// use this for testing
// prefix = configInput["PREFIX"];


export function getKeyWord(keyword, command) {
    let prefixKeyword = prefix + keyword;
    let prompt = command.slice(0, keyword.length + 1);
    if (prompt == prefixKeyword && command.split(" ").length > 1) {
        return true;
    }

    return false;
}

export function getCommandWithPrefix(command){
    let currentPrefix = prefix;
    return currentPrefix + command;
}

export function getPrefix(){
    return prefix;
}

export function changePrefix(newPrefix){
    prefix = newPrefix;
}

export function modifyMessageForMusic(message){
    let refinedText = message.content.slice(6, message.length);
    refinedText = "!play " + refinedText;
    message.content = refinedText;
    console.log("dsahkjadsjksd", message.content )
    return message;
}

export function getQueueEmbed(songs){
    let text = `**Now Playing:** ${songs[0].name} \n`;
    if(songs.length > 1){
        for(let i = 1; i < songs.length; i++){
            if(getSongFromURL(songs[i].requestedBy).name){
                text = text.concat(`\n **#${i}** - ${getSongFromURL(songs[i].requestedBy).name}`)
            }else{
                text = text.concat(`\n **#${i}** - ${songs[i].url}`)
            }
           
        }
    }
    
    const queueEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('🎶 Channel Queue 🎶')
	.setDescription(text);
    return queueEmbed;
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

export function getCommandsForCategory(category){
    let selectedCommands = [];
    commands.forEach((command) => {
        if(command.category == category) selectedCommands.push(command);
    })
    return selectedCommands;
}

export function getCommandByName(commandName){
    for(let command of commands){
        if(command.command == commandName) return command;
    }
    return null;
}

export function getIfValidCommand(input){
    for(let command of commands){
        if(command.command == input) return true;
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

export function getAllSounds(){
    let allSounds = [];
    for(let category of categories){
        let categorySounds = getSongsForCategory(category.name);
        allSounds = allSounds.concat(categorySounds);
    }
    return allSounds;
}

export function getRandomSound(){
    let allSounds = getAllSounds();
    var item = allSounds[Math.floor(Math.random()*allSounds.length)];
    return item;
}

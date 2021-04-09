import { matchCategoryByName } from "./matchCommands.js";
import Discord from 'discord.js';
import { getPurifiedInput, getSongsFromData } from "./getCommands.js";
import commandsInput from '../data/commands.js';
const commandsData = commandsInput.commands;
let commands = commandsData.map(c => c.command);
import songsData from '../data/songs.js';
const categories = songsData.categories;;
var songs = getSongsFromData(categories);

export function listSearchResults(searchResultOutput) {
    let text = `Search Results for ${searchResultOutput[1]}: \n`;
    let results = searchResultOutput[0];
    results.forEach((result) => {
        text = text.concat(`- ${result.name} \n`);
    })
    text = text.concat("\n To play a specific sound type: \n `$play [sound_name]` \n or \n `$play [category_name] [sound_index]`");
    return text;
}

export function listCategorySongs(content) {
    let matchedCategory = matchCategoryByName(content);
    let text = `${matchedCategory.emoji}  Sounds for ${matchedCategory.name} category: `;
    let count = 1;
    matchedCategory.songs.forEach((song) => { text = text.concat(` \n\n ${count})  ${song.name}`); count++ })
    text = text.concat("\n\n To play a specific sound type: \n `$play [sound_name]` \n or \n `$play [category_name] [sound_index]`");
    return text;
}

export function listCategories() {
    let text = "Categories:";
    categories.forEach((category) => { text = text.concat(` \n\n ${category.emoji}  ${category.name}`) })
    text = text.concat("\n\n To see sounds within a category type `$sound [category_name]");
    return text;
}

export function listCommands() {
    let text = "Here is a list of my commands: ";
    commands.forEach((command) => { text = text.concat(` \n - ${command}`) });
    text = text.concat(" \n \n You can send `$help [command name]` to get info on a specific command!")
    return text;
}

export function listHelpSettings(){
    const helpEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Ambience Help')
	.setURL('https://discord.js.org/')
	.setDescription('📄 [Click Here](https://angelina-tsuboi.github.io/Ambience/website/docs.html#section-3) to View All Commands \n\n 🛠 Need Help? Please visit our [Troubleshooting page](https://angelina-tsuboi.github.io/Ambience/website/docs.html#section-6). \n\n 🌌 New to Ambience? [Join our community](https://discord.gg/w3Tp9x88Nw)');
    return helpEmbed;
}

export function listSettings(){
    const settingsEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setDescription('Some description here')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
	)
    return settingsEmbed;
}

export function soundSearch(input) {
    let soundContent = input.split(" ")[1];
    let contentArray = input.split(" ");
    let refinedContent = contentArray.slice(1, contentArray.length);
    soundContent = refinedContent.join(" ");
    let purifiedSoundContent = getPurifiedInput(soundContent);
    const filteredSounds = songs.filter(song => {
      return (
        song.name.toLowerCase().includes(purifiedSoundContent) ||
        purifiedSoundContent.includes(song.name.toLowerCase())
      );
    });
    return [filteredSounds, soundContent]
  }
  
import { matchCategoryByName } from "./matchCommands.js";
import Discord from 'discord.js';
import { getPurifiedInput, getSongsFromData, getCommandsForCategory } from "./getCommands.js";
import commandsInput from '../data/commands.js';
const commandsData = commandsInput.commands;
let commands = commandsData.map(c => c.command);
import songsData from '../data/songs.js';
const categories = songsData.categories;;
var songs = getSongsFromData(categories);

export function listSearchResults(searchResultOutput) {
    let text = "";
    let results = searchResultOutput[0];
    results.forEach((result) => {
        text = text.concat(`- ${result.name} \n`);
    })
    text = text.concat("\n \u200b ");
    const searchEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`🔍 Search Results for "${searchResultOutput[1]}": \n`)
    .setDescription(text)
    .addField(`To play a specific sound type: `,` \`\`\` ${"$play [sound_name]"} \`\`\` or \`\`\` ${"$play [category_name] [sound_index]"} \`\`\``)
    return searchEmbed;
}

export function listCategorySongs(content) {
    let matchedCategory = matchCategoryByName(content);
    let text = "";
    let count = 1;
    matchedCategory.songs.forEach((song) => { text = text.concat(` \n\n ${count})  ${song.name}`); count++ });
    text = text.concat("\n \u200b ");
    const categorySongsEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle(`${matchedCategory.emoji}  Sounds for ${matchedCategory.name} category: `)
    .setDescription(text)
    .addField(`To play a specific sound type: `,` \`\`\` ${"$play [sound_name]"} \`\`\` or \`\`\` ${"$play [category_name] [sound_index]"} \`\`\``)
    return categorySongsEmbed;
}

export function listCategories() {
    let text = "";
    categories.forEach((category) => { text = text.concat(` \n\n ${category.emoji} \u200b ${category.name}`) })
    text = text.concat("\n \u200b ");
    const categoryEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Sound Categories')
    .setDescription(text)
    .addField(`To see sounds within a category type: `,` \`\`\` ${"$sound [category_name]"} \`\`\` `)
    return categoryEmbed;
}

export function listCommands() {
    let text = "Here is a list of my commands: ";
    commands.forEach((command) => { text = text.concat(` \n - ${command}`) });
    const commandsEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Ambience Commands')
    .setDescription(text)
    .addField(`To get more information about a specific command type: `,` \`\`\` ${"$help [command name]"} \`\`\` `)
    // change above to $command [commmand_name]
    return commandsEmbed;
}

export function listHelpSettings(){
    let text = '📄 [Click Here](https://angelina-tsuboi.github.io/Ambience/website/docs.html#section-3) to View All Commands \n\n 🛠 Need Help? Please visit our [Troubleshooting page](https://angelina-tsuboi.github.io/Ambience/website/docs.html#section-6). \n\n 🌌 New to Ambience? [Join our community](https://discord.gg/w3Tp9x88Nw)';
    let queueCommands = getCommandsForCategory("queue");
    let queueText = "";
    queueCommands.forEach((command) => queueText = queueText.concat(command.command + " \n"));
    let musicText = "";
    let musicCommands = getCommandsForCategory("music");
    musicCommands.forEach((command) => musicText = musicText.concat(command.command + " \n"));
    let settingsText = "";
    let settingsCommands = getCommandsForCategory("settings");
    settingsCommands.forEach((command) => settingsText = settingsText.concat(command.command + " \n"));
    let soundText = "";
    let soundCommands = getCommandsForCategory("sound");
    soundCommands.forEach((command) => soundText = soundText.concat(command.command + " \n"));

    const helpEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Ambience Help')
    .setDescription(text)
    .addFields(
        {name: "Music Commands", value: musicText},
        {name: "Sound Commands", value: soundText},
        {name: "Queue Settings", value: queueText},
        {name: "Bot Settings", value: settingsText}
    )
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
  
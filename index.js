var Discord = require('discord.js');
var config = require('./config.json');
var songsData = require('./songs.json');
var categories = songsData.categories;
var songs = getSongsFromData(categories);
var commandsData = require('./commands.json');
commandsData = commandsData.commands;
var bot = new Discord.Client();
const { Player } = require("discord-music-player");
const player = new Player(bot);
bot.player = player;
let commands = commandsData.map(c => c.command);
let descriptions = commandsData.map(c => c.description);

bot.on('guildCreate', guild => {
  const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
  channel.send("Thanks for inviting me")
})

bot.on('error', (message, error) => {
  switch (error) {
    // Thrown when the YouTube search could not find any song with that query.
    case 'SearchIsNull':
      message.channel.send(`No song with that query was found.`);
      break;
    // Thrown when the provided YouTube Playlist could not be found.
    case 'InvalidPlaylist':
      message.channel.send(`No Playlist was found with that link.`);
      break;
    // Thrown when the provided Spotify Song could not be found.
    case 'InvalidSpotify':
      message.channel.send(`No Spotify Song was found with that link.`);
      break;
    // Thrown when the Guild Queue does not exist (no music is playing).
    case 'QueueIsNull':
      message.channel.send(`There is no music playing right now.`);
      break;
    // Thrown when the Members is not in a VoiceChannel.
    case 'VoiceChannelTypeInvalid':
      message.channel.send(`You need to be in a Voice Channel to play music.`);
      break;
    // Thrown when the current playing song was an live transmission (that is unsupported).
    case 'LiveUnsupported':
      message.channel.send(`We do not support YouTube Livestreams.`);
      break;
    // Thrown when the current playing song was unavailable.
    case 'VideoUnavailable':
      message.channel.send(`Something went wrong while playing the current song, skipping...`);
      break;
    // Thrown when provided argument was Not A Number.
    case 'NotANumber':
      message.channel.send(`The provided argument was Not A Number.`);
      break;
    // Thrown when the first method argument was not a Discord Message object.
    case 'MessageTypeInvalid':
      message.channel.send(`The Message object was not provided.`);
      break;
    // Thrown when the Guild Queue does not exist (no music is playing).
    default:
      message.channel.send(`**Unknown Error Ocurred:** ${error}`);
      break;
  }
});

bot.on("ready", () => {
  console.log("I am ready to Play with DMP 🎶");
});

bot.player.on('songAdd', (message, queue, song) =>
  message.channel.send(`**${song.name}** has been added to the queue!`))
  .on('songFirst', (message, song) =>
    message.channel.send(`**${song.name}** is now playing!`));

bot.on('message', async (message) => {
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (getKeyWord('!help', message.content)) {
    let content = message.content.split(" ")[1];
    if (commands.includes(content)) {
      let description = descriptions[commands.indexOf(content)];
      message.channel.send(`The ${content} command: \n ${description}`);
    } else {
      message.channel.send("Command not found for " + content + ". \n Type `$help` to see all command names");
    }

    return;
  }

  if (getKeyWord('!sound', message.content)) {
    let content = message.content.split(" ")[1];
    let contentArray = message.content.split(" ");
    let refinedContent = contentArray.slice(1, contentArray.length);
    content = refinedContent.join(" ");
    // check all songs - compile early
    if (matchSongByName(content)) {
      playAmbienceSong(message, args, matchSongByName(content));
      return;
    }
    // check categories - compile early
    if (matchCategoryByName(content)) {
      message.channel.send(listCategorySongs(content));
      return;
    }
    message.channel.send("Command not found for " + content + ". \n Type `$help` to see all command names");
    return;
  }

  if (getKeyWord('!play', message.content)) {
    console.log("the play command")
    let content = message.content.split(" ")[1];
    let contentArray = message.content.split(" ");
    let refinedContent = contentArray.slice(1, contentArray.length);
    content = refinedContent.join(" ");
    // check all songs - compile early
    if (matchSongByName(content)) {
      playAmbienceSong(message, args, matchSongByName(content));
      return;
    }
    // check categories - compile early
    if (matchCategoryByName(content)) {
      message.channel.send(listCategorySongs(content));
      return;
    }
    message.channel.send("Command not found for " + content + ". \n Type `$help` to see all command names");
    return;
  }

  if (getKeyWord(('!search'), message.content)) {
    console.log("searching")
    message.channel.send(listSearchResults(soundSearch(message.content)));
    return;
  }

  let song;
  switch (command) {

    case 'help':
      message.channel.send(listCommands());
      break;

    case 'categories':
      message.channel.send(listCategories());
      break;

    case 'pause':
      song = bot.player.pause(message);
      if (song) {
        message.channel.send(`${song.name} was paused!`);
      }
      break;

    case 'resume':
      song = bot.player.resume(message);
      if (song) {
        message.channel.send(`${song.name} was resumed!`);
      }
      break;

    case 'skip':
      song = bot.player.skip(message);
      if (song) {
        message.channel.send(`${song.name} was skipped!`);
      }
      break;


    case 'resume':
      song = client.player.resume(message);
      if (song) {
        message.channel.send(`${song.name} was resumed!`);
      }
      break;

    case 'play':
      playCommand(message, args);
  }
});


bot.login(config.token);

// Helper Functions

async function playCommand(message, args) {
  if (bot.player.isPlaying(message)) {
    let song = await bot.player.addToQueue(message, args.join(' '));

    // If there were no errors the Player#songAdd event will fire and the song will not be null.
    if (song)
      console.log(`Added ${song.name} to the queue`);
    return;
  } else {
    let song = await bot.player.play(message, args.join(' '));

    // If there were no errors the Player#songAdd event will fire and the song will not be null.
    if (song)
      console.log(`Started playing ${song.name}`);
    return;
  }
}

async function playAmbienceSong(message, args, musicLink) {
  if (bot.player.isPlaying(message)) {
    console.log("add to queue")
    let song = await bot.player.addToQueue(message, { search: musicLink });
    if (song)
      console.log(`Added ${song.name} to the queue`);
    return;
  } else {
    console.log("playing2", message);
    let song = await bot.player.play(message, {
      search: musicLink
    });

    if (song)
      console.log(`Started playing ${song.name}`);
    return;
  }
}

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
function purifyInput(input) {
  let removeEmojiString = input.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  let lowercase = removeEmojiString.replace(/\s/g, "").toLowerCase();
  return lowercase;
}

function getSongsForCategory(category) {

}

function listCategories() {
  let text = "Categories:";
  categories.forEach((category) => { text = text.concat(` \n\n ${category.emoji}  ${category.name}`) })
  text = text.concat("\n\n To see songs within a category type `$song [category_name]");
  return text;
}

function listCommands() {
  let text = "Here is a list of my commands: ";
  commands.forEach((command) => { text = text.concat(` \n ${command}`) });
  text = text.concat(" \n \n You can send `$help [command name]` to get info on a specific command!")
  return text;
}


function soundSearch(input) {
  let soundContent = input.split(" ")[1];
  let contentArray = input.split(" ");
  let refinedContent = contentArray.slice(1, contentArray.length);
  soundContent = refinedContent.join(" ");
  let purifiedSoundContent = purifyInput(soundContent);
  const filteredSounds = songs.filter(song => {
    return (
      song.name.toLowerCase().includes(purifiedSoundContent) ||
      song.name.toLowerCase().includes(purifiedSoundContent)
    );
  });
  return [filteredSounds, soundContent]
}

function listSearchResults(searchResultOutput) {
  let text = `Search Results for ${searchResultOutput[1]}: \n`;
  let results = searchResultOutput[0];
  results.forEach((result) => {
    text = text.concat(`- ${result.name} \n`);
  })
  text = text.concat("\n To play a specific sound type: \n `$play [sound_name]` \n or \n `$play [category_name] [sound_index]`");
  return text;
}

function listCategorySongs(content) {
  let matchedCategory = matchCategoryByName(content);
  let text = `${matchedCategory.emoji}  Sounds for ${matchedCategory.name} category: `;
  let count = 1;
  matchedCategory.songs.forEach((song) => { text = text.concat(` \n\n ${count})  ${song.name}`); count++ })
  text = text.concat("\n\n To play a specific sound type: \n `$play [sound_name]` \n or \n `$play [category_name] [sound_index]`");
  return text;
}

function matchSongByName(title) {
  let purifiedTitle = purifyInput(title);
  for (let song of songs) {
    let purifiedSongName = purifyInput(song.name);
    if (purifiedSongName == purifiedTitle) {
      return song.link;
    }
  }
  return false;
}

function matchCategoryByName(name) {
  let purifiedInput = purifyInput(name);

  for (let category of categories) {
    let categoryName = category.name.toLowerCase();
    if (categoryName == purifiedInput) {
      return category;
    }
  }

  return false;
}

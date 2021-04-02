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

bot.on('message', async (message) => {
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(getKeyWord('!help', message.content)){
    let content = message.content.split(" ")[1];
    if(commands.includes(content)){
      let description = descriptions[commands.indexOf(content)];
      message.channel.send(`The ${content} command: \n ${description}`);
    }else{
      message.channel.send("Command not found for " + content + ". \n Type `$help` to see all command names");
    }

    return;
  }

  console.log(message.content)

  if(getKeyWord('!song', message.content)){
    let content = message.content.split(" ")[1];
    // check categories - compile early
    if(categories.includes(content)){
      let text = "Categories:";
      categories.forEach((category) => {text = text.concat(` \n\n ${category.emoji}  ${category.name}`)})
      text = text.concat("\n\n To see songs within a category type `$song [category_name]");
      message.channel.send(text);
      return;
    }
    // check all songs - compile early
    if(matchSongByName(content)){
      playCommand(message);
      return;
    }

    message.channel.send("Command not found for " + content + ". \n Type `$help` to see all command names");
    return;
  }

  if(command === 'help'){
    let text = "Here is a list of my commands: ";
    commands.forEach((command) => { text = text.concat(` \n ${command}`)});
    text = text.concat(" \n \n You can send `$help [command name]` to get info on a specific command!")
    message.channel.send(text);
    return;
  }

  if(command == 'categories'){
    let text = "Categories:";
    categories.forEach((category) => {text = text.concat(` \n\n ${category.emoji}  ${category.name}`)})
    text = text.concat("\n\n To see songs within a category type `$song [category_name]");
    message.channel.send(text);
  }

  if(command === 'pause'){
    let song = client.player.pause(message);
    if(song){
      message.channel.send(`${song.name} was paused!`);
    }   
  }

  if(command === 'resume'){
    let song = client.player.resume(message);
    if(song){
      message.channel.send(`${song.name} was resumed!`);
    }   
  } 

  if(command === 'play'){
    playCommand(message);
  }
});


bot.login(config.token);

// Helper Functions

function playCommand(message){
  if(bot.player.isPlaying(message)) {
    let song = await bot.player.addToQueue(message, args.join(' '));

    // If there were no errors the Player#songAdd event will fire and the song will not be null.
    if(song)
        console.log(`Added ${song.name} to the queue`);
    return;
} else {
    let song = await bot.player.play(message, args.join(' '));

    // If there were no errors the Player#songAdd event will fire and the song will not be null.
    if(song)
        console.log(`Started playing ${song.name}`);
    return;
}
}

function getKeyWord(keyword, command){
  let split = command.split(" ");
  if(split[0] == keyword && split.length > 1){
    return true;
  }

  return false;
}

function getSongsFromData(data){
  let songs = [];
  data.forEach((category) => {
    songs.concat(category.songs);
  })
  return songs;
}

function matchSongByName(title){
  songs.forEach((song) => {
    if(song.name == title){
      return true;
    }
  })
  return false;
}
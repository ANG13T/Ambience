var Discord = require('discord.js');
var config = require('./config.json');
var songsData = require('./songs.json');
var bot = new Discord.Client();
const { Player } = require("discord-music-player");
const player = new Player(bot);
bot.player = player;
let commands = ["play", "next", "pause", "stop", "loop", "queue", "categories", "songs", "search", "help"];
let descriptions = ["a","b","c","d","e","f","g","h","i", "j"];

bot.on('guildCreate', guild => {
  const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
  channel.send("Thanks for inviting me")
})

bot.on('message', async (message) => {
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === 'help'){
    message.channel.send("Here is a list of my commands: \n \n play \n next \n pause \n stop \n loop \n queue \n categories \n songs \n search \n help \n \n You can send `$help [command name]` to get info on a specific command!");
    return;
  }

  if(command == 'categories'){
    message.channel.send("Categories: \n\n 🌊  Beach \n\n 🌳  Forest \n\n 🏔  Mountain \n\n 🏠  Home \n\n ✈️  Airlplane \n\n ☕️  Cafe \n\n 🎻  Classical \n\n 🔉  Waves \n\n 🎬  Cinema \n\n 🦄  Fiction \n\n 🎮  Video Games \n\n To see songs within a category type `$song [category_name]`")
  }

  if(command === 'play'){
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

  if(getKeyWord('help', message.content)){
    let content = message.content.split(" ")[1];
    if(commands.includes(content)){
      let description = descriptions[commands.indexOf(content)];
      message.channel.send(`The ${content} command: \n ${description}`);
    }else{
      message.channel.send("Command not found for " + content + ". \n Type `$help` to see all command names");
    }

    return;
  }

});


bot.login(config.token);

// Helper Functions

function getKeyWord(keyword, command){
  let split = command.split(" ");
  if(split[0] == keyword && split.length > 1){
    return true;
  }

  return false;
}
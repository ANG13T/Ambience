import Discord from 'discord.js';
import pkg from 'discord-music-player';
const { Player } = pkg;
import config from './data/config.js';
import commandsInput from './data/commands.js';
import {getKeyWord, getSongFromURL, getQueueEmbed, getCommandByName, getPrefix, modifyMessageForMusic, getAllSounds, getIfValidCommand} from './scripts/getCommands.js';
import {listSearchResults, listCategorySongs, listCategories, listCommands, soundSearch, listSettings, listHelpSettings, getCommandInfo, listValidPrefixes, listInvite, listAllSounds, listCustomSongInformation, listInvalidCommand} from './scripts/listCommands.js';
import {matchSongByName, matchSongByCategoryIndex, matchCategoryByName} from './scripts/matchCommands.js';

const commandsData = commandsInput.commands;
let commands = commandsData.map(c => c.command);
let descriptions = commandsData.map(c => c.description);

var bot = new Discord.Client();
const player = new Player(bot);
bot.player = player;


bot.on('guildCreate', guild => {
  const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
  channel.send(listInvite());
})


bot.on("ready", () => {
  console.log("I am ready to Play with DMP 🎶");
});

bot.player.on('songAdd', (message, queue, song) => {
  let selectedSong = getSongFromURL(song.requestedBy);
  if(selectedSong){
    message.channel.send(`**${selectedSong.name}** has been added to the queue!`);
    return;
  } 
    message.channel.send(`**${song.name}** has been added to the queue!`)
  })
  .on('songFirst', (message, song) => {
    let username = song.queue.initMessage.author.username  + "#" + song.queue.initMessage.author.discriminator;
    let songName = song.name;
    let selectedSong = getSongFromURL(song.requestedBy);   
    if(selectedSong){
      songName = selectedSong.name;
    } 
    
    message.channel.send(listCustomSongInformation(songName, song.url, song.thumbnail, song.queue.volume, song.author, song.duration, username));
  })
    

bot.on('message', async (message) => {
  const args = message.content.slice(getPrefix().length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  if(command && !getIfValidCommand(command)){
    message.channel.send(listInvalidCommand(command));
    return;
  }


  if (getKeyWord('help', message.content) || getKeyWord('command', message.content)) {
    let content = message.content.split(" ")[1];
    if (commands.includes(content)) {
      message.channel.send(getCommandInfo(getCommandByName(content)));
     
    } else {
      message.channel.send("Command not found for " + content + ". \n Type `$help` to see all command names");
    }

    return;
  }

  if (getKeyWord('categories', message.content)) {
   let content = refineContent(message.content);
    // check categories - compile early
    if (matchCategoryByName(content)) {
      message.channel.send(listCategorySongs(content));
      return;
    }
    message.channel.send("Category not found for " + content + ". \n Type `$categories` to see all available categories");
    return;
  }

  if(getKeyWord('custom', message.content)){
    playCustomSong(message, refineContent(message.content));
  }

  if (getKeyWord('play', message.content)) {
    let content = refineContent(message.content);
    // check all songs - compile early
    if (matchSongByName(content)) {
      playAmbienceSong(message, args, matchSongByName(content));
      return;
    }

    if(matchSongByCategoryIndex(content)){
      playAmbienceSong(message, args, matchSongByCategoryIndex(content));
      return;
    }
    // check categories - compile early
    if (matchCategoryByName(content)) {
      message.channel.send(listCategorySongs(content));
      return;
    }
    message.channel.send("Sound not found for " + content + ". \n Type `$sounds` to see all available sounds");
    return;
  }

  if (getKeyWord(('setVolume'), message.content)) {
    let content = message.content.split(" ")[1];
    let contentArray = message.content.split(" ");
    let refinedContent = contentArray.slice(1, contentArray.length);
    content = refinedContent.join(" ");
    let isDone = bot.player.setVolume(message, parseInt(content));
        if(isDone)
            message.channel.send(`🔊 Volume set to ${args[0]}!`);

    return;
  }

  if (getKeyWord(('search'), message.content)) {
    message.channel.send(listSearchResults(soundSearch(message.content)));
    return;
  }

  if(getKeyWord(('prefix'), message.content)){
    console.log("prefs", message.content)
    let content = refineContent(message.content);
    let validPrefixes = ['!', '@', '#', '$', '%', '&', '*', '(', ')', '\\', '/', '.', '~'];
    if(!validPrefixes.includes(content)){
      message.channel.send(listValidPrefixes());
      return;
    }
    message.channel.send(`✅ Prefix set to ${content}`);
  }

  if (getKeyWord(('settings'), message.content)) {
    let content = refineContent(message.content);
    return;
  }

  switch (command) {

    case 'help':
      message.channel.send(listHelpSettings());
      break;

    case 'settings':
        message.channel.send(listSettings());
      break;

    case 'commands':
        message.channel.send(listCommands());
      break;

    case 'categories':
      message.channel.send(listCategories());
      break;

    case 'pause':
      song = bot.player.pause(message);
      if (song) {
        message.channel.send(`⏸ ${song.name} was paused!`);
      }
      break;

    case 'sounds':
      message.channel.send(listAllSounds(getAllSounds()));
      break;
      
    case 'resume':
      song = bot.player.resume(message);
      if (song) {
        message.channel.send(`⏯ ${song.name} was resumed!`);
      }
      break;

    case 'skip':
      song = bot.player.skip(message);
      if (song) {
        message.channel.send(`👉 ${song.name} was skipped!`);
      }
      break;

    case 'stop':
      let isComplete = bot.player.stop(message);
      if(isComplete){
        message.channel.send('🛑 Sounds stopped, the Queue has been cleared');
      }
      break;

    case 'loop':
      let toggle = bot.player.toggleLoop(message);
      if(toggle === null) return;
      else if(toggle) message.channel.send("🔁 The current sound is now on loop")
      else message.channel.send("✋ The current sound will no longer be on loop")
      break;

    case 'progress':
      let progressBar = bot.player.createProgressBar(message, {
        size: 40,
        block: '\u2588',
        arrow: '\u2591'
    });
    if(progressBar)
        message.channel.send(progressBar);
    break;

    case 'repeatqueue':
      let status = bot.player.setQueueRepeatMode(message, true);
        if(status === null)
          break;
        message.channel.send(`🔁 Queue will be repeated!`);
      break;

    
    case 'disablerepeatqueue':
      let result = bot.player.setQueueRepeatMode(message, false);
      if(result === null)
          break;
      message.channel.send(`✋ Queue will not be longer repeated!`);
      break;

    case 'remove':
      let songID = parseInt(args[0])-1; 
        
        let song = bot.player.remove(message, songID);
        if(song)
            message.channel.send(`🗑 Removed song ${song.name} (${args[0]}) from the Queue!`);
      break;

    case 'shuffle':
      let songs = bot.player.shuffle(message);
        if(songs)
            message.channel.send('🔀 Server Queue was shuffled.');
      break;
    
    
    case 'queue':
      let queue = bot.player.getQueue(message);
        if(queue)
            message.channel.send(getQueueEmbed(queue.songs));
      break;

    case 'resume':
      song = client.player.resume(message);
      if (song) {
        message.channel.send(`⏯ ${song.name} was resumed!`);
      }
      break;

    case 'play':
      playCommand(message, args);
    break;

  }
});


bot.login(config.token);

// Helper Functions

async function playCommand(message, args) {
  if (bot.player.isPlaying(message)) {
    let song = await bot.player.addToQueue(modifyMessageForMusic(message), args.join(' '));

    // If there were no errors the Player#songAdd event will fire and the song will not be null.
    if (song)
      console.log(`Added ${song.name} to the queue`);
    return;
  } else {
    let song = await bot.player.play(modifyMessageForMusic(message), args.join(' '));

    // If there were no errors the Player#songAdd event will fire and the song will not be null.
    if (song)
      console.log(`Started playing ${song.name}`);
    return;
  }
}

async function playAmbienceSong(message, args, musicLink) {
  try{
    if (bot.player.isPlaying(message)) {
      await bot.player.addToQueue(message, { search: musicLink, requestedBy: musicLink });
    } else {
      await bot.player.play(message, {
        search: musicLink,
        requestedBy: musicLink
      });
    }
  }catch(err){
    console.log("caught tne erroe");
    message.channel.send("❌ You must be in a voice channel to use this command.");
  }
  
}

async function playCustomSong(message, songValue){
  message.content = `play ${songValue}`;
  let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    if(bot.player.isPlaying(message)) {
      let song = await bot.player.addToQueue(message, args.join(' '));

      // If there were no errors the Player#songAdd event will fire and the song will not be null.
      if(song)
          console.log(`Added ${song.name} to the queue`);
      return;
  } else {

      console.log("befofe", message.content);
      let song = await bot.player.play(message, args.join(' '));

      // If there were no errors the Player#songAdd event will fire and the song will not be null.
      if(song)
          console.log(`Started playing ${song.name}`);
      return;
  }
}

export function refineContent(input){
    let content = input.split(" ")[1];
    let contentArray = input.split(" ");
    let refinedContent = contentArray.slice(1, contentArray.length);
    content = refinedContent.join(" ");
    return content;
}
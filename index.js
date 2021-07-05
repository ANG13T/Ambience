import Discord from 'discord.js';
import pkg from 'discord-music-player';
const { Player } = pkg;
import commandsInput from './data/commands.js';
import playlistTracks from './data/playlist.js';
import configInputs from './data/config.js';
import {getKeyWord, getSongFromURL, getQueueEmbed, getCommandByName, getPrefix, modifyMessageForMusic, getAllSounds, getIfValidCommand, getCommandWithPrefix, getRandomSound} from './scripts/getCommands.js';
import {listSearchResults, listCategorySongs, listCategories, listCommands, soundSearch, listSettings, listHelpSettings, getCommandInfo, listValidPrefixes, listInvite, listAllSounds, listCustomSongInformation, listInvalidCommand, listEasterEggContent, listLoadingMessage} from './scripts/listCommands.js';
import {matchSongByName, matchSongByCategoryIndex, matchCategoryByName} from './scripts/matchCommands.js';

const commandsData = commandsInput.commands;
let commands = commandsData.map(c => c.command);
let configToken = process.env.DJS_TOKEN;
let configPrefix = process.env.PREFIX;
// USE this when running on your own for testing
configToken = configInputs["DJS_TOKEN"];
configPrefix = configInputs["PREFIX"];

var bot = new Discord.Client();
const player = new Player(bot);
bot.player = player;


bot.on('guildCreate', guild => {
  const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
  channel.send(listInvite());
})


bot.on("ready", () => {
  console.log("🎶 I am ready to Play with DMP 🎶");

  bot.user.setStatus('available')
    bot.user.setPresence({
        game: {
            name: 'Type $help for usage!',
            type: "LISTENING TO TUNES"
        }
    });
});

bot.player.on('songAdd', (message, queue, song) => {
    message.channel.send(`**${getProperSoundContent(song)}** has been added to the queue!`);
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

  if(command && !getIfValidCommand(command) && command[0] != "*" && message.content[0] == configPrefix && command != "easter"){
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
    message.channel.send("Category not found for " + content + ". \n Type `" + getCommandWithPrefix('commands') + "` to see all available categories");
    return;
  }

  if(getKeyWord('custom', message.content)){
    playCustomSong(message, refineContent(message.content));
  }

  if(getKeyWord('easter', message.content)){
    let content = refineContent(message.content);
    playCustomSong(message, listEasterEggContent(content));
    return;
  }

  if (getKeyWord('play', message.content)) {
    let content = refineContent(message.content);
    // check all songs - compile early
    if (matchSongByName(content)) {
      playAmbienceSong(message, args, matchSongByName(content));
      return;
    }

    if(matchSongByCategoryIndex(content)){
      console.log(message.content)
      playAmbienceSong(message, args, matchSongByCategoryIndex(content));
      return;
    }
    // check categories - compile early
    if (matchCategoryByName(content)) {
      message.channel.send(listCategorySongs(content));
      return;
    }
    message.channel.send("Sound not found for **" + content + "**. \n Type `" + getCommandWithPrefix('commands') + "` to see all available sounds");
    return;
  }

  if (getKeyWord(('setvolume'), message.content)) {
    let content = message.content.split(" ")[1];
    let contentArray = message.content.split(" ");
    let refinedContent = contentArray.slice(1, contentArray.length);
    content = refinedContent.join(" ");
    try{
      let isDone = await bot.player.setVolume(message, parseInt(content));
      if(isDone)
          message.channel.send(`🔊 Volume set to ${args[0]}!`);
    }catch(err){
      console.log("something went wrong");
      message.channel.send("❌ You must play a sound to use this command.");
    }
    

    return;
  }

  if (getKeyWord(('search'), message.content)) {
    message.channel.send(listSearchResults(soundSearch(message.content)));
    return;
  }

  if(getKeyWord(('prefix'), message.content)){
    let content = refineContent(message.content);
    let validPrefixes = ['!', '@', '#', '$', '%', '&', '*', '(', ')', '\\', '/', '.', '~'];
    if(!validPrefixes.includes(content)){
      message.channel.send(listValidPrefixes());
      return;
    }
    process.env.PREFIX = content;
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
      let chosenSong = bot.player.pause(message);
      if (chosenSong) {
        message.channel.send(`⏸ **${getProperSoundContent(chosenSong)}** was paused!`);
      }
      break;

    case 'sounds':
      message.channel.send(listAllSounds(getAllSounds()));
      break;
      
    case 'random':
      let randomSound = getRandomSound();
      message.content = `!play ${randomSound.link}`
      playAmbienceSong(message, args, randomSound.link);
      break;

    case 'playlist':
      playPlaylist(message)
      break;

    case 'resume':
      let chosenSong2 = bot.player.resume(message);
      if (chosenSong2) {
        message.channel.send(`⏯ **${getProperSoundContent(chosenSong2)}** was resumed!`);
      }
      break;

    case 'skip':
      let chosenSong3 = bot.player.skip(message);
      if (chosenSong3) {
        message.channel.send(`👉 **${getProperSoundContent(chosenSong3)}** was skipped!`);
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
      else if(toggle) message.channel.send(`🔁 ${getProperSoundContent(song)} is now on loop`)
      else message.channel.send(`✋ **${getProperSoundContent(song)}** will no longer be on loop`)
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
        
        let chosenSong4 = bot.player.remove(message, songID);
        if(chosenSong4)
            message.channel.send(`🗑 Removed song **${getProperSoundContent(chosenSong4)}** (${args[0]}) from the Queue!`);
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
      let chosenSong5 = client.player.resume(message);
      if (chosenSong5) {
        message.channel.send(`⏯ **${getProperSoundContent(chosenSong5.name)}** was resumed!`);
      }
      break;

    case 'play':
      playCommand(message, args);
    break;

  }
});


bot.login(configToken);

// Helper Functions

async function playCommand(message, args) {
  if (bot.player.isPlaying(message)) {
    let song = await bot.player.addToQueue(modifyMessageForMusic(message), args.join(' '));
    // If there were no errors the Player#songAdd event will fire and the song will not be null.
    if (song)
      console.log(`Added ${song.name} to the queue`);
    return;
  } else {
    message.channel.send(listLoadingMessage());
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
      message.channel.send(listLoadingMessage());
      await bot.player.play(message, {
        search: musicLink,
        requestedBy: musicLink
      });
    }
  }catch(err){
    console.log("caught the error");
    message.channel.send("❌ You must be in a voice channel to use this command.");
  } 
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

async function playPlaylist(message) {
  let shuffledPlaylist = shuffleArray(playlistTracks);
  try{
    message.content = `!play ${shuffledPlaylist[0]}`
    let args = message.content.slice(configPrefix.length).trim().split(/ +/g);

    if (bot.player.isPlaying(message)) {
      await bot.player.addToQueue(message, args.join(' '));

      if(song)
            console.log(`Added ${song.name} to the queue`);
    }else{
      message.channel.send(listLoadingMessage());
      let song = await bot.player.play(message, args.join(' '));

      // If there were no errors the Player#songAdd event will fire and the song will not be null.
      if(song)
          console.log(`Started playing ${song.name}`);
      return;
    }

    for(let i = 1; i < shuffledPlaylist.length; i++){
      message.content = `!play ${shuffledPlaylist[i]}`;
      await bot.player.addToQueue(message, args.join(' '));
    }

  }catch(err){
    console.log("caught the error");
    message.channel.send("❌ You must be in a voice channel to use this command.");
  } 
}

async function playCustomSong(message, songValue){
  try{
    message.content = `!play ${songValue}`;
    let args = message.content.slice(configPrefix.length).trim().split(/ +/g);
      if(bot.player.isPlaying(message)) {
        let song = await bot.player.addToQueue(message, args.join(' '));
  
        // If there were no errors the Player#songAdd event will fire and the song will not be null.
        if(song)
            console.log(`Added ${song.name} to the queue`);
        return;
    } else {
        message.channel.send(listLoadingMessage());
        let song = await bot.player.play(message, args.join(' '));
  
        // If there were no errors the Player#songAdd event will fire and the song will not be null.
        if(song)
            console.log(`Started playing ${song.name}`);
        return;
    }
  }catch(err){
    console.log("caught tne erroe");
    message.channel.send("❌ You must be in a voice channel to use this command.");
  }
  
}

export function refineContent(input){
    let content = input.split(" ")[1];
    let contentArray = input.split(" ");
    let refinedContent = contentArray.slice(1, contentArray.length);
    content = refinedContent.join(" ");
    return content;
}

export function getProperSoundContent(song){
  let selectedSong = getSongFromURL(song.requestedBy);
  if(selectedSong){
    return selectedSong.name;
  } 
  return song.name;
}
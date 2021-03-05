const ytdl = require("ytdl-core");
const Commmando = require("discord.js-commando");

module.exports = {
  name: "play",
  description: "Play a song in your channel!",
  
  
  async play(message){
    const { voice } = message.member;
    if(!voice.channelID){
      message.reply("You must be inside a voice channel");
      return;
    }

    voice.channel.join();
  }
};
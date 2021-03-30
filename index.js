var Discord = require('discord.js');
var bot = new Discord.Client();
var isReady = true;

bot.on('message', message => {
  if (isReady && message.content === 'play')
  {
  isReady = false;
  var voiceChannel = message.member.voice.channel;
  voiceChannel.join().then(connection =>
  {
    const dispatcher = connection.play(require("path").join(__dirname, './sea_waves.mp3'));
     dispatcher.on("end", end => {
       voiceChannel.leave();
       });
   }).catch(err => console.log(err));
   isReady = true;
  }
});


bot.login('ODE1NzAwMjkzNjA5MzI0NTU1.YDwOGA.3pvscuhrem0Igwm8qO1LQlC7tkY');
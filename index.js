var Discord = require('discord.js');
var config = require('./config.json');
var bot = new Discord.Client();
var isReady = true;

bot.on('guildCreate', guild => {
  const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
  channel.send("Thanks for inviting me")
})

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


bot.login(config.token);
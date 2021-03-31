var Discord = require('discord.js');
var config = require('./config.json');
var SpotifyWebApi = require('spotify-web-api-node');
var spotify = new SpotifyWebApi();
var bot = new Discord.Client();
var isReady = true;
let commands = ["play", "next", "pause", "stop", "loop", "queue", "categories", "songs", "search", "help"];
let descriptions = ["a","b","c","d","e","f","g","h","i", "j"];

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

  if(message.content === 'help'){
    message.channel.send("Here is a list of my commands: \n \n play \n next \n pause \n stop \n loop \n queue \n categories \n songs \n search \n help \n \n You can send `$help [command name]` to get info on a specific command!");
  }

  if(getKeyWord('help', message.content)){
    let content = message.content.split(" ")[1];
    if(commands.includes(content)){
      let description = descriptions[commands.indexOf(content)];
      message.channel.send(`The ${content} command: \n ${description}`);
    }else{
      message.channel.send("Command not found for " + content + ". \n Type `$help` to see all command names");
    }
  }

  if(message.content === "easter"){
    spotify.clientCredentialsGrant().then(
      function(data) {
        console.log('The token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        spotify.setAccessToken(data.body['access_token'])

        spotify.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function (err, data) {
        if (err) console.error(err);
        else console.log('Artist albums', data);
      });
      }
    )
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
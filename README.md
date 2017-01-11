# DiscordBotSpeak
Simple code to have a Discord.js bot play an audio file into a discord voice channel.
STEPS:
In order to do this there are a few things you have to make sure of first.

Have FFMPEG installed & the environment path set for it in Windows [link]
Have Microsoft Visual Studio (VS) installed [link]
Have Node.js installed.[link]
Have Discord.js installed in VS. [link]
From there the steps are quite simple. After making your project index.js you will start typing some code. Here are the steps:

Add the Discord.js dependency to the project;

var Discord = require('discord.js');
Create out client variable called bot;

var bot = new Discord.Client();
Create a Boolean variable to make sure that the system doesn't overload of requests;

var isReady = true;
Next make the function to intercept the correct message;

bot.on('message', message =>{ENTER CODE HERE});
Create an if statement to check if the message is correct & if the bot is ready;

if (isReady && message.content === 'MESSAGE'){ENTER CODE HERE}
Set the bot to unready so that it cannot process events until it finishes;

isReady = false;
Create a variable for the channel that the message-sender is currently in;

var voiceChannel = message.member.voiceChannel;
Join that channel and keep track of all errors;

voiceChannel.join().then(connection =>{ENTER CODE HERE}).catch(err => console.log(err));
Create a refrence to and play the audio file;

const dispatcher = connection.playFile('./audiofile.mp3');
Slot to wait until the audio file is done playing;

dispatcher.on("end", end => {ENTER CODE HERE});
Leave channel after audio is done playing;

voiceChannel.leave();
Login to the application;

bot.login('CLIENT TOKEN HERE');
After you are all finished with this, make sure to check for any un-closed brackets or parentheses. i made this because it took my hours until I finally found a good solution so I just wanted to share it with anybody who is out there looking for something like this.

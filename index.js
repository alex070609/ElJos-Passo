const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));


/* ============================= BOT ============================== */
const Discord = require('discord.js');
const Canvas = require('canvas');
const ytdl = require('ytdl-core');

const { registerFont } = require('canvas');

const Client = new Discord.Client();
registerFont('font/NotoSans-Light.ttf', { family: 'Roboto' });

const prefix = 'el!';

const fs = require('fs');

const queue = new Map();

Client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    Client.commands.set(command.name, command)
}

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	let fontSize = 70;

	do {
		ctx.font = `${fontSize -= 10}px Roboto`;
	} while (ctx.measureText(text).width > canvas.width - 300);

	return ctx.font;
};

Client.once('ready', () => {
    console.log('The bot is online !')
});

Client.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'accueil');
    if (!channel) return;
    
    /*const joinEmbed = new Discord.MessageEmbed()
    .setColor('#FF0000')
    .setTitle('Bienvenue !')
    .setDescription(`Souhaitez la bienvenue à ${member}`)
    .setAuthor('Bacchus🍷')
    .setImage(member.avatarURL)
    .setFooter('Tient toi à carreaux ok !!!');

    channel.send(joinEmbed);*/
    
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('./fond.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#74037b";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.font = '28px Roboto';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Bienvenue sur le serveur,', canvas.width / 2.5, canvas.height / 3.5);

    ctx.font = applyText(canvas, `${member.displayName}!`);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.stroke();

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
    ctx.drawImage(avatar, 25, 25, 200, 200)

    const attachement = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    channel.send(`Oh bah tient voilà quelqu'un !, ${member}!`, attachement);
}
)

Client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    if(message.channel.id !== '799651373045121096') {
      message.channel.send(`Tu doit envoyer ta demande dans le channel #bot`);
      return;
    };

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const serverQueue = queue.get(message.guild.id);

    if(command === 'ping'){
        Client.commands.get('ping').execute(message, args);
    }/*else if(command === 'embeds'){
        Client.commands.get('embeds').execute(message, args, Discord)
    }else if(command === 'avatar'){
        Client.commands.get('avatar').execute(message, args)
    }else if(command === 'join'){
        Client.emit('guildMemberAdd', message.member);
    }*/else if(command === 'play'){
        execute(message, serverQueue);
        return;
    }else if(command === 'stop'){
        stop(message, serverQueue);
        return;
    }else if(command === 'skip'){
        skip(message, serverQueue);
        return;
    }else if(command === 'help'){
        Client.commands.get('help').execute(message, args, Discord)
    }else{
        message.channel.send("Je n'ai pas compris ta demande 😶")
    }
});

async function execute(message, serverQueue) {
    const args = message.content.split(" ");
  
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.channel.send(
        "Tu doit être dans un salon vocal pour que je puisse te rejoindre 🙄"
      );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      return message.channel.send(
        "J'ai pas la permission 😤🤬"
      );
    }
  
    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
     };
  
    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };
  
      queue.set(message.guild.id, queueContruct);
  
      queueContruct.songs.push(song);
  
      try {
        var connection = await voiceChannel.join();
        queueContruct.connection = connection;
        play(message.guild, queueContruct.songs[0]);
      } catch (err) {
        console.log(err);
        queue.delete(message.guild.id);
        return message.channel.send(err);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} à été ajouté à la playlist !`);
    }
  }
  
  function skip(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "Tu doit être dans le même salon que moi pour changer de musique 😂"
      );
    if (!serverQueue)
      return message.channel.send("Aucun sons dans la playlist 😅");
    serverQueue.connection.dispatcher.end();
  }
  
  function stop(message, serverQueue) {
    if (!message.member.voice.channel)
      return message.channel.send(
        "Tu doit être dans le même salon que moi pour stopper la musique 😂"
      );
      
    if (!serverQueue)
      return message.channel.send("Aucun sons dans la playlist 😅");
      
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    message.channel.send(`Qui a éteint la musique ? 😫`);
  }
  
  function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Je joue actuellement: **${song.title}** 😎`);
  }

Client.login(process.env.TOKEN);
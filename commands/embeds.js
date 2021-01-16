module.exports = {
    name : 'embeds',
    description: 'This is a embzded command!',
    execute(message, args, Discord){
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Rules')
        .setURL('https://www.youtube.com')
        .setAuthor('Bacchus')
        .setDescription('This is an embed for the server rules !')
        .addFields(
            {name: 'Rule 1', value: "Be nice !"},
            {name: 'Rule 2', value: "Go on youtube !"},
            {name: 'Rule 3', value: "Have fun !"},
            {name: 'Rule 4', value: "No strong language !"},
            {name: 'Rule 5', value: "Enjoy !"}
        )
        .setImage("https://i.guim.co.uk/img/media/7a633730f5f90db3c12f6efc954a2d5b475c3d4a/0_138_5544_3327/master/5544.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=6d246ca192c6f0c8cf3bdc40f8a43b63")
        .setFooter('Make sur to check out the rules channel');

        message.channel.send(newEmbed);
    }

}
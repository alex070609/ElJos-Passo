module.exports = {
    name : 'help',
    description: 'This is a help command!',
    execute(message, args, Discord){
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Aide')
        .setAuthor('El José Passo')
        .setDescription('Voici la liste des commandes !')
        .addFields(
            {name: 'el!help', value: "Affiche cette liste"},
            {name: 'el!play <url de youtube>', value: "Lance une musique ou la met dans la playlist!"},
            {name: 'el!skip', value: "Permet de changer la musique"},
            {name: 'el!stop', value: "Permet de stopper la musique"},
            {name: 'el!ping', value: "Je rémonds pong !!!"}
        )
        .setImage("https://i.imgur.com/ar8mvs8.png")
        .setFooter('Je suis le meilleur tahu');

        message.channel.send(newEmbed);
    }

}
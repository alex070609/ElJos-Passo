module.exports = {
    name : 'avatar',
    description: 'This is a avatar getting command!',
    execute(message, args){
        message.channel.send(message.author.displayAvatarURL());
    }
}
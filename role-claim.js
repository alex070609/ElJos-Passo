const firstMessage = require('./first-message.js')

module.exports = (Client) => {
  const channelId = '719956555667079168'

  const getEmoji = (emojiName) => Client.emojis.cache.find((emoji) => emoji.name === emojiName)

  const emojis = {
    cs: 'CS:GO',
    five: 'GTA',
    rdr2: 'RDR2',
    osu: 'OSU',
    arcade: 'Jeux Arcade',
    lol: 'Leagues Of Legends',
  };

  const reactions = []

  let emojiText = 'Ajoutez une réaction pour obtenir un rôle \n\n';

  for (const key in emojis) {
    const emoji = getEmoji(key)
    reactions.push(emoji)

    const role = emojis[key]
    emojiText += `${emoji}: \`${role}\`\n\n`
  }

  emojiText += '-';

  firstMessage(Client, channelId, emojiText, reactions)

  const handleReaction = (reaction, user, add) => {
    if (user.id === '799342194887491624') {
      return
    }

    const emoji = reaction._emoji.name

    const { guild } = reaction.message

    const roleName = emojis[emoji]
    if(!roleName){
      return
    }

    const role = guild.roles.cache.find((role) => role.name === roleName)
    const member = guild.members.cache.find((member) => member.id === user.id)

    if (add) {
      member.roles.add(role)
    } else {
      member.roles.remove(role)
    }
  }

  Client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.channel.id === channelId) {
      handleReaction(reaction, user, true)
    }
  })

  Client.on('messageReactionRemove', (reaction, user) => {
    if (reaction.message.channel.id === channelId) {
      handleReaction(reaction, user, false)
    }
  })
  
}
const firstMessage = require('./first-message.js')

module.exports = (Client) => {
  const channelId = '719951859154157568'

  const getEmoji = (emojiName) => Client.emojis.cache.find((emoji) => emoji.name === emojiName)

  const emojis = {
    check: 'Employés',
  };

  const reactions = []

  let emojiText = 'Bienvenue sur le Serveur Multijeux Communautaire !\n\n\nQuelques petites règles :\n-> L\'envois de documents (photo et fichiers) sont autorisé **UNIQUEMENT** dans les salons #média\n-> Insulter les autres est tolété seulement pour prouver un point (exemple \'Ta gueule et écoute\') ou en réalisant une blague, s\'insulter dans le cadre d\'une dispute n\'est **PAS DU TOUT** tolérer (surtout pas les mamans c\'est très méchant)\n-> Amusez vous putain\n\n';

  for (const key in emojis) {
    const emoji = getEmoji(key)
    reactions.push(emoji)

    const role = emojis[key]
    emojiText += `Appuyez sur la réaction ${emoji} pour accepter les règles`
  }

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
    const roleRm = guild.roles.cache.find((role) => role.name === "Demandeurs d'emplois")
    const member = guild.members.cache.find((member) => member.id === user.id)

    if (add) {
      member.roles.add(role)
      member.roles.remove(roleRm)
    }
  }

  Client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.channel.id === channelId) {
      handleReaction(reaction, user, true)
    }
  })
  
}
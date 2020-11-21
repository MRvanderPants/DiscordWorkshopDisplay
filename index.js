const Discord = require('discord.js');
const SteamWorkshop = require('./workshop-helper');

/**
 * Create Discord instance
 */
const client = new Discord.Client();
client.once('ready', () => {
  client.on('message', message => {
    const regex = /^-workshop https:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=[\d]+$/g;
    if(regex.test(message.content)) {

      // Fetch the workshop items data
      const url = message.content.replace('-workshop ', '');
      fetchWorkshop(url, (workshopItem) => {
        if(workshopItem) {
  
          // Create the discord embed
          const embed = createEmbed(workshopItem, message);
          message.channel.send(embed);
          message.delete();
        } else {
          message.channel.send('Oops! Something has gone wrong');
        }
      });
    }
  });
});

client.login('Nzc4MjE5NTA3NDM3MDEwOTg1.X7OzZQ.hSSAOAhGUKhZPI7kSavXL7APSsQ');

// Create an embeded message that dispalys all information
function createEmbed(item, message) {
  const author = message.author
  const avatarUrl = `https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.png`;
  const username = author.username;

  return new Discord.MessageEmbed()
    .setColor('#637dc9')
    .setTitle(item.title)
    .setURL(item.url)
    .setAuthor(`${username} has shared:`)
    .setDescription(item.description)
    .setThumbnail(avatarUrl)
    .addFields(...item.stats)
    .setImage(item.preview_url)
    .setTimestamp()
    .setFooter('WorkshopDisplay by MRvanderPants', 'https://cdn.discordapp.com/app-icons/778219507437010985/b953ff91f2eee1803b4e9a9eedcad8d9.png?size=128');
 }

 // Fetch all workshop related data
function fetchWorkshop(url, callback) {
  const itemId = url.split('?id=')[1];
  const workshop = new SteamWorkshop();
  workshop.getPublishedFileDetails(itemId, (err, files) => {
    if(err) {
      message.channel.send('Oops! Something has gone wrong');
      return;
    }

    const file = files[0];
    file.url = url;
    callback(formatData(file));
  });
}

// Convert the workshop info to a usable format
function formatData(file) {
  return {
    url: file.url,
    title: file.title,
    description: file.description,
    time_created: file.time_created,
    preview_url: file.preview_url,
    stats: [
      nameValue('Subscriptions', file.subscriptions),
      nameValue('Favorites', file.favorited),
      nameValue('Views', file.views)
    ]
  };
}

// Convert to an embeded inline item format
function nameValue(name, value, inline) {
  return { name, value, inline: true };
}

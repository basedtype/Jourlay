/* IMPORTS */
const { client } = require("./Bots/Jourlay");
const Discord = require("discord.js");
const moment = require('moment');

/* PARAMS */
let logChannel = null;
const version = 'v1.3'
const logo = `╔════════════════════════════════════════════════════════════════════╗
║                  ██╗░░░░░░█████╗░░██████╗░░██████╗                 ║
║                  ██║░░░░░██╔══██╗██╔════╝░██╔════╝                 ║
║                  ██║░░░░░██║░░██║██║░░██╗░╚█████╗░                 ║
║                  ██║░░░░░██║░░██║██║░░╚██╗░╚═══██╗                 ║
║                  ███████╗╚█████╔╝╚██████╔╝██████╔╝                 ║
║                  ╚══════╝░╚════╝░░╚═════╝░╚═════╝░                 ║
╚═══╣${version}╠═══════════════════════════════════════════════════════════╝
`
/* INTERVALS */
setInterval(function() {
    if (logChannel === null) {
        client.channels.fetch('818566531486187611').then(channel => {
            if (channel != null) {
                logChannel = channel;
                console.log(logo);
            }
        })
    }
}, 1000);

/* FUNCTIONS */

/* REACTION */
client.on('channelCreate', channel => {
    const embed = new Discord.MessageEmbed()
    .setTitle(`Channel create (<#${channel.id}>`)
    .setTimestamp()
    .addFields(
        { name: 'Channel name', value: `<#${channel.id}>`, inline: true},
        { name: 'Category name', value: channel.parent.name, inline: true},
    )
    .setColor(0x00ff00)
    .setFooter(`id: ${channel.id}`)
    logChannel.send(embed);
})

client.on('channelDelete', channel => {
    const embed = new Discord.MessageEmbed()
    .setTitle('Channel delete')
    .setTimestamp()
    .addFields(
        { name: 'Channel name', value: channel.name, inline: true},
        { name: 'Category name', value: channel.parent.name, inline: true},
    )
    .setColor(0xff0000)
    .setFooter(`id: ${channel.id}`)
    logChannel.send(embed);
})

client.on('channelPinsUpdate', channel => {
    const embed = new Discord.MessageEmbed()
    .setTitle(`Channel pins update`)
    .setTimestamp()
    .addFields(
        { name: 'Channel name', value: `<#${channel.id}>`, inline: true},
        { name: 'Category name', value: channel.parent.name, inline: true},
    )
    .setColor(0xff0000)
    .setFooter(`id: ${channel.id}`)
    logChannel.send(embed);
})

client.on('guildBanAdd', (guild, user) => {
    const embed = new Discord.MessageEmbed()
    .setTitle(`User ban add (${user.username})`)
    .setTimestamp()
    .setColor(0xff0000)
    .setFooter(`id: ${user.id}`)
    logChannel.send(embed);
})

client.on('guildBanRemove', (guild, user) => {
    const embed = new Discord.MessageEmbed()
    .setTitle(`User ban remove (${user.username})`)
    .setTimestamp()
    .setColor(0xff0000)
    .setFooter(`id: ${user.id}`)
    logChannel.send(embed);
})

client.on('guildMemberAdd', (guild, user) => {
    const embed = new Discord.MessageEmbed()
    .setTitle(`New member (<@${user.id}>)`)
    .setTimestamp()
    .setColor(0x00ff00)
    .setFooter(`id: ${user.id}`)
    logChannel.send(embed);
})

client.on('guildMemberRemove', (guild, user) => {
    const embed = new Discord.MessageEmbed()
    .setTitle(`Member remove (${user.username})`)
    .setTimestamp()
    .setColor(0xff0000)
    .setFooter(`id: ${user.id}`)
    logChannel.send(embed);
})

client.on('guildMemberUpdate', (memberOld, member) => {
    if (memberOld.user.username === member.user.username) return
    const embed = new Discord.MessageEmbed()
    .setAuthor(`${member.user.username} update username`, member.user.avatarURL(), null)
    .setTimestamp()
    .addFields(
        { name: 'Before', value: memberOld.user.username, inline: false},
        { name: 'After', value: member.user.username, inline: false}
    )
    .setColor(0xff0000)
    .setFooter(`id: ${member.user.id}`)
    logChannel.send(embed);
})

client.on('messageDelete', message => {
    if (message.channel.name === 'server-logs') return;
    const embed = new Discord.MessageEmbed()
    .setTitle(`Message delete`)
    .setAuthor(message.author.username, message.author.avatarURL(), null)
    .addField('Message:', `${message.content}`)
    .addField('Channel:', `<#${message.channel.id}>`)
    .setTimestamp()
    .setColor(0xff0000)
    .setFooter(`id: ${message.id}`)
    logChannel.send(embed);
})

client.on('messageUpdate', (messageOld, message) => {
    if (message.channel.name === 'server-logs') return;
    if (messageOld.content === message.content) return;
    const embed = new Discord.MessageEmbed()
    .setAuthor(`${message.author.username} update message`, message.author.avatarURL(), null)
    .setTimestamp()
    .addFields(
        { name: 'Before', value: messageOld.content, inline: false},
        { name: 'After', value: message.content, inline: false}
    )
    .addField('Channel:', `<#${message.channel.id}>`)
    .setColor(0xffff00)
    .setFooter(`id: ${message.id}`, null)
    .setURL(message.url)
    logChannel.send(embed);
})

client.on('presenceUpdate', (presenceOld, presence) => {
    if ((presenceOld.status == null && presence.status == null) || (presenceOld.status === presence.status)) return;
    if (presence.status == null) return;
    const embed = new Discord.MessageEmbed()
    .setAuthor(`${presence.user.username} update status`, presence.user.avatarURL(), null)
    .setTimestamp()
    .addFields(
        { name: 'Before', value: presenceOld.status, inline: false},
        { name: 'After', value: presence.status, inline: false}
    )
    .setColor(0xffff00)
    .setFooter(`id: ${message.id}`, null)
    .setURL(message.url)
    logChannel.send(embed);
})
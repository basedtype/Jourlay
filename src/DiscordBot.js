const { Client, MessageEmbed } = require('discord.js');

exports.start = function () {
    const client = new Client();
    client.login('NzM0NjE1ODY5MDExMDAxNDI1.XxUYDw.zH1Q_TGU0u5Sfqf2EnPBJnIt_X0');
    
    return client
}



/* client.on('message', message => {
    // If the message is "how to embed"
    if (message.content === 'how to embed') {
        // We can create embeds using the MessageEmbed constructor
        // Read more about all that you can do with the constructor
        // over at https://discord.js.org/#/docs/main/master/class/MessageEmbed
        const embed = new MessageEmbed()
            // Set the title of the field
            .setTitle('A slick little embed')
            // Set the color of the embed
            .setColor(0xff0000)
            // Set the main content of the embed
            .setDescription('Hello, this is a slick embed!');
        // Send the embed to the same channel as the message
        message.channel.send(embed);
    }
}); */



exports.startBot = function() {
    const tmi = require('tmi.js');
    const options = {
        options: {
            debug: false
        },
        connection: {
            cluster: 'aws',
            reconnect: true
        },
        identity: {
            username: 'JOURLAY',
            password: 'oauth:q88yx70ba1uclc74xhxxv0lw3at9h7'
        },
        channels: ['jourloy']
    };
    const client = new tmi.client(options);
    
    client.on('connected', onConnectedHandler);
    client.connect();
    
    function onConnectedHandler() {
        client.color("Red");
        client.action(options.channels[0], ` приземляется в чат.`);
    }

    return {client: client, channelName: options.channels[0], botName:  options.identity.username}
}


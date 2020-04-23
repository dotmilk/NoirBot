global.Promise = require('bluebird')
global.CoolDowns = require('./cooldown')
const tmi = require('tmi.js')
const DotEnv = require('dotenv')
DotEnv.config({ path: '.env', silent: true})
DotEnv.config({ path: '.safe', silent: true})
const Commands = require('./commands')

// Define configuration options
const opts = {
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN
    },
    channels: [
        process.env.CHANNEL_NAME
    ]
}

// Create a client with our options
const client = new tmi.client(opts)

// Register our event handlers (defined below)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

// Connect to Twitch:
client.connect()

// Called every time a message comes in
function onMessageHandler (channel, user, msg, self) {
    if (self) { return } // Ignore messages from the bot

    // Remove whitespace from chat message
    let cmd = msg.trim(),
        msgPrefix = cmd.substring(0,1)

    // If the command is known, let's execute it
    if (msgPrefix == '!') {
        Commands.handle({cmd: cmd, channel: channel,user: user, client: client})
    } else {
        console.log(`regular message: ${cmd}`)
    }


}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`)
}

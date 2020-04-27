const DotEnv = require('dotenv')
DotEnv.config({ path: '.env', silent: true})
DotEnv.config({ path: '.safe', silent: true})
global.Promise = require('bluebird')

const MongoClient = require('mongodb').MongoClient
const tmi = require('tmi.js')
const Persistence = require('./persistence')
global.UserInfo = require('./user')
global.CoolDowns = require('./cooldown')
console.log(UserInfo)
let Commands = new require('./commands')

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
const mongoClient = new MongoClient(process.env.MONGO_URI, {
    poolSize: 10,
    useUnifiedTopology: true
})

// Register our event handlers (defined below)
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

// Connect to Twitch:
mongoClient.connect().then(()=>{
    console.log('* connected to mongo')
    global.Persist = new Persistence(mongoClient.db(process.env.DB_NAME))
    Commands = new Commands()
    return Commands.init()

}).then(()=>{
    return client.connect()
}).catch((err)=>{
    console.error(err)
})


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

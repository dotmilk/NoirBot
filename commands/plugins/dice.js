const sides = 6
const DICE_CMD = "!dice"
const MULTI_DICE_CMD = "!roll"
const myName = 'dice'
const commands = [ DICE_CMD
                   ,MULTI_DICE_CMD]

function rollDice(){
    return Math.floor(Math.random() * sides) + 1
}

function rollManyDice(n){
    let dice = []
    for (let i = 0; i < n; i++) {
        dice.push(rollDice())
    }
    return dice
}

// Function called when the "dice" command is issued
function handleDie(opts) {
    if (CoolDowns.globalCan(myName,DICE_CMD)){
        CoolDowns.startGlobal(myName,DICE_CMD)
        opts.client.say(opts.channel, `${opts.user.username} rolled a ${rollDice()}`)
        console.log(`* Executed ${opts.cmd} command`)
    }

}

function handleMulti(opts) {
    let user = opts.user.username
    if (CoolDowns.userCan(myName,MULTI_DICE_CMD,user)) {
        CoolDowns.startUser(myName,MULTI_DICE_CMD,user)

        let numDice = parseInt(opts.cmdSplit[1])
        let reply
        if (numDice && (numDice <= 5)) {
            reply = `${opts.user.username} rolled ${numDice} dice and got ${rollManyDice(numDice).join(' - ')}`
            opts.client.say(opts.channel, reply)
        } else {
            opts.client.say(opts.channel, `wtf ${numDice} is nonsense...or too big`)
        }
        console.log(`* Executed ${opts.cmd} command`)
    }
}


function init(){
    CoolDowns.register(myName)
    CoolDowns.globalTimer(myName,10,DICE_CMD)
    CoolDowns.userTimer(myName,5,MULTI_DICE_CMD)
}

function canHandle(cmd) {
    console.log("canHandle",cmd)
    return commands.includes(cmd)
}

function handle(opts) {
    switch(opts.cmdSplit[0]) {
    case DICE_CMD:
        handleDie(opts)
        break
    case MULTI_DICE_CMD:
        console.log('doing it')
        handleMulti(opts)
    }
}




module.exports = {
    canHandle: canHandle,
    handle: handle,
    init: init
}

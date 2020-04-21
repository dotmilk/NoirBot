const sides = 6
const DICE_CMD = "!dice"
const MULTI_DICE_CMD = "!roll"
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
    opts.client.say(opts.channel, `${opts.user.username} rolled a ${rollDice()}`)
    console.log(`* Executed ${opts.cmd} command`)
}

function handleMulti(opts) {
    let numDice = parseInt(opts.cmdSplit[1])

    if (numDice && (numDice <= 5)) {
        opts.client.say(opts.channel, `${opts.user.username} rolled ${numDice} dice and got ${rollManyDice(numDice).join(' - ')}`)
    } else {
       opts.client.say(opts.channel, `wtf ${numDice} is nonsense...or too big`)
    }
    console.log(`* Executed ${opts.cmd} command`)
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
    handle: handle
}

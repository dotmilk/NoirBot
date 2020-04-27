const DICE_CMD = "!dice",
      MULTI_DICE_CMD = "!roll",
      ECHO = "!echo",
      DICE_SEQ_NAME = "dice-rolls"

class DiceStuff {
    static pluginName = 'dice'
    constructor(addHandler,utils){
        this.sides = 6

        this.pluginName = DiceStuff.pluginName
        // need to bind 'this'
        addHandler(DICE_CMD,this.handleSingleDice.bind(this))
        addHandler(MULTI_DICE_CMD,this.handleMulti.bind(this))
        addHandler(ECHO,this.handleBotSay.bind(this))
        CoolDowns.register(this.pluginName)
        CoolDowns.globalTimer(this.pluginName,10,DICE_CMD)
        CoolDowns.userTimer(this.pluginName,5,MULTI_DICE_CMD)
    }

    async init(){
        await Persist.ensureCounter(DICE_SEQ_NAME,this.pluginName)
        this.collection = Persist.getCollection(this.pluginName)
        this.diceIncrementer = Persist.makeIncrementer(DICE_SEQ_NAME,this.pluginName)
        this.diceCountValue = Persist.makeSeqValueGetter(DICE_SEQ_NAME,this.pluginName)
    }

    async handleSingleDice(opts) {
        if (CoolDowns.globalCan(this.pluginName,DICE_CMD)){
            CoolDowns.startGlobal(this.pluginName,DICE_CMD)
            opts.client.say(opts.channel, this.singleDiceMessage(opts))
            let nextId = await this.diceIncrementer()
            let currId = await this.diceCountValue()
            console.log(nextId,"---",currId)
            console.log(`* Executed ${opts.cmd} command for ${JSON.stringify(opts.user)}`)
            return this.collection.insertOne({ _id: nextId,type: 'dice-roll'})
        }
        return false
    }

    handleBotSay(opts) {
        if (UserInfo.isMod(opts.user)) {
            opts.client.say(opts.channel, opts.cmdSplit.slice(1).join(' '))
        }
    }

    handleMulti(opts) {
        let user = opts.user.username
        if (CoolDowns.userCan(this.pluginName,MULTI_DICE_CMD,user)) {
            CoolDowns.startUser(this.pluginName,MULTI_DICE_CMD,user)
            let numDice = parseInt(opts.cmdSplit[1])
            if (numDice && (numDice <= 5)) {
                opts.client.say(opts.channel, this.multiSuccessMessage(opts,numDice))
            } else {
                opts.client.say(opts.channel, this.multiFailureMessage(opts,numDice))
            }
            console.log(`* Executed ${opts.cmd} command`)
        }
    }

    // replies
    singleDiceMessage(opts) {
        return `${opts.user.username} rolled a ${this.rollDice()}`
    }

    multiSuccessMessage(opts,numDice) {
        let results = this.rollManyDice(numDice),
            total = results.reduce((a,c) => a + c)
        return `${opts.user.username} rolled ${numDice} dice and got ${results.join(' - ')}. Which for you lazy fuckers is ${total}`
    }

    multiFailureMessage(opts,numDice) {
        return `wtf ${numDice} is nonsense...or too big`
    }

    // utils
    rollDice(){
        return Math.floor(Math.random() * this.sides) + 1
    }

    rollManyDice(n){
        let dice = []
        for (let i = 0; i < n; i++) {
            dice.push(this.rollDice())
        }
        return dice
    }
}

module.exports = DiceStuff

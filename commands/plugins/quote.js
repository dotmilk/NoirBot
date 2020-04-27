const ADD_QUOTE_CMD = "!add-quote",
      FETCH_CMD = "!quote",
      EDIT_CMD = "!edit-quote",
      QUOTE_SEQ_NAME = "quotes"

class Quotes {
    static pluginName = 'quotes'
    constructor(addHandler,utils) {
        this.pluginName = Quotes.pluginName
        addHandler(ADD_QUOTE_CMD,this.handleAddQuote.bind(this))
        addHandler(EDIT_CMD,this.handleEditQuote.bind(this))
        addHandler(FETCH_CMD,this.handleFetchQuote.bind(this))
        CoolDowns.register(this.pluginName)
        CoolDowns.globalTimer(this.pluginName,1,FETCH_CMD)
    }

    async init(){
        let name = this.pluginName
        await Persist.ensureCounter(QUOTE_SEQ_NAME,name)
        this.collection = Persist.getCollection(name)
        this.quoteInc = Persist.makeIncrementer(QUOTE_SEQ_NAME,name)
        console.log(this.quoteInc)
    }

    async handleFetchQuote(opts) {
        if (CoolDowns.globalCan(this.pluginName,FETCH_CMD)){
            CoolDowns.startGlobal(this.pluginName,FETCH_CMD)
            let quoteToFetch = parseInt(opts.cmdSplit[1]) || false,
                doc

            if (quoteToFetch) {
                doc = await this.collection.findOne({_id: quoteToFetch})
            } else {
                let cursor = await this.collection.aggregate([{
                    $sample:{ size: 1 }}])
                doc = await cursor.toArray()
                doc = doc[0]
                cursor.close()
            }
            if (doc && doc.quote) {
                opts.client.say(opts.channel,`Quote #${doc._id} : ${doc.quote}`)
            } else {
                opts.client.say(opts.channel,"Couldn't find any kind of quote :(")
            }
        }
    }

    async handleEditQuote(opts) {
        if (UserInfo.isMod(opts.user)) {
            let quote = opts.cmdSplit.slice(2).join(' '),
                whichQuote = parseInt(opts.cmdSplit[1]) || false
            if (whichQuote) {
                await this.collection.findOneAndUpdate({ _id: whichQuote},{$set: {quote: quote}})
                opts.client.say(opts.channel,`Edited quote #${whichQuote} "${quote}"`)
            }

        }
    }

    async handleAddQuote(opts) {
        if (UserInfo.isMod(opts.user)) {
            let quote = opts.cmdSplit.slice(1).join(' '),
                nextId= await this.quoteInc()
            await this.collection.insertOne({
                _id: nextId,
                quote: quote
            })
            opts.client.say(opts.channel,`Added quote #${nextId} "${quote}"`)
        }
    }

}

module.exports = Quotes

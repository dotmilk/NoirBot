class Persist {

    constructor(db){
        this.db = db
        this.counters = this.db.collection('counters')
    }

    getCollection(name) {
        return this.db.collection(name)
    }

    async ensureCounter(counterName,pluginName) {
        return this.counters.insertOne({
            _id: Persist.makeSeqName(counterName,pluginName),
            sequence_value: 0})
            .then(()=>{
                return true
            })
            .catch((err)=>{
                if(err.code && err.code === 11000) {
                    return true
                } else {
                    return false
                }
            })}

    makeSeqValueGetter(counterName,pluginName) {
        return async () => {
            let seqDoc = await this.counters.findOne({
                _id: Persist.makeSeqName(counterName,pluginName)
            })
            return seqDoc.sequence_value
        }
    }

    makeIncrementer(counterName,pluginName) {
        return async () =>{
            let seqDoc = await this.counters.findOneAndUpdate(
                { _id: Persist.makeSeqName(counterName,pluginName)},
                { $inc: { sequence_value: 1 }},
                { returnOriginal: false}
            )
            return seqDoc.value.sequence_value
        }
    }

    static makeSeqName(counterName,pluginName) {
        return `${pluginName}:${counterName}`
    }

}

module.exports = Persist

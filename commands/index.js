let reqAll = require('require-all')
class Commands {

    knownHandlers = {}

    constructor(){
        this.commands = reqAll( __dirname + '/plugins')
        for (let key of Object.keys(this.commands)) {
            // console.log(this.commands[key].pluginName)
            this.commands[key] = new this.commands[key]((n,h) => {
                this.registerHandler(n,h)
            })
        }
    }

    async init(){
        for (let key of Object.keys(this.commands)) {
            if (this.commands[key].init) {
                await this.commands[key].init()
            }
        }
    }

    registerHandler(cmdName,handler) {
        // TODO detect if a plugin is overriding another plugin's cmd
        this.knownHandlers[cmdName] = handler
    }

    handle(opts) {
        let cmdSplit = opts.cmd.split(' '),
            cmdName = cmdSplit[0]
        opts.cmdSplit = cmdSplit
        if (this.knownHandlers[cmdName]){
            this.knownHandlers[cmdName](opts).catch((err)=>{
                console.log(err)
            })
            return
        }
        console.log(`* Unknown command ${opts.cmd}`)
    }

}

module.exports = Commands

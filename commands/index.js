let reqAll = require('require-all')
class Commands {

    static initClass(){
        this.commands = reqAll( __dirname + '/plugins')
        for (let key of Object.keys(this.commands)) {
            if (this.commands[key].init) {
                this.commands[key].init()
            }
        }
    }

    static handle(opts) {
        let cmdSplit = opts.cmd.split(' ')
        opts.cmdSplit = cmdSplit
        for (let key of Object.keys(this.commands)) {

            if (this.commands[key].canHandle(cmdSplit[0])) {
                this.commands[key].handle(opts)
                return
            }
        }
        console.log(`* Unknown command ${opts.cmd}`)
    }

}

Commands.initClass()

module.exports = Commands

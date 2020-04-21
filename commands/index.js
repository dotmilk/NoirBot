let reqAll = require('require-all')
class Commands {

    static initClass(){
        this.commands = reqAll( __dirname + '/plugins')
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
        // client.timeout(target,context.username,10,"don't touch")
        //     .then((uh)=>{

        //     }).catch((err) => {
        //         console.log("the error...",err)
        //     })
        console.log(`* Unknown command ${opts.cmd}`)
    }

}

Commands.initClass()

module.exports = Commands

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
class CoolDown {
    constructor() {
        this.cooldowns = {
            global: {},
            user: {}
        }

    }

    register(pluginName){
        this.cooldowns.global[pluginName] = {}
        this.cooldowns.user[pluginName] = {}
    }
    // settimeout will use ms // so we * 1000 so the time argument is in seconds
    globalTimer(pluginName,time,cmd) {
        this.cooldowns.global[pluginName][cmd] = {
            state: true,
            time: time*1000
        }
    }

    userTimer(pluginName,time,cmd) {
        this.cooldowns.user[pluginName][cmd] = {
            users: {},
            time: time*1000
        }
    }

    startGlobal(pluginName,cmd) {
        this.cooldowns.global[pluginName][cmd].state = false
        wait(this.cooldowns.global[pluginName][cmd].time).then(()=>{
            this.cooldowns.global[pluginName][cmd].state = true
        })
    }

    globalCan(pluginName,cmd) {

        return this.cooldowns.global[pluginName][cmd].state
    }

    startUser(pluginName,cmd,user) {
        this.cooldowns.user[pluginName][cmd].users[user] = false
        wait(this.cooldowns.user[pluginName][cmd].time).then(()=>{
            this.cooldowns.user[pluginName][cmd].users[user] = true
        })
    }

    userCan(pluginName,cmd,user) {
        if (this.cooldowns.user[pluginName][cmd].users[user] === undefined) {
            this.cooldowns.user[pluginName][cmd].users[user] = true
        }
        return this.cooldowns.user[pluginName][cmd].users[user]
    }

}

module.exports = new CoolDown()

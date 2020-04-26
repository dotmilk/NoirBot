class User {
    // go contribute to js2-mode and fix this bug https://github.com/mooz/js2-mode/issues/477
    // I hate semi-colons
    static MOD_KEY = "mod";
    static BROADCASTER_KEY = "broadcaster";
    static SUBSCRIBER_KEY = "subscriber";

    static isMod(user) {
        return user[User.MOD_KEY] === true || User.isBroadCaster(user)
    }

    static isBroadCaster(user) {
        return User.BROADCASTER_KEY in user.badges
    }

    static isSubscriber(user) {
        return User.SUBSCRIBER_KEY in user.badges
    }
}

module.exports = User

function createAuthentication(authInfo) {
    return {
        Authentication: {
            UserName: authInfo.username,
            Password: authInfo.password
        }
    }
}


module.exports = {
    createAuthentication
}

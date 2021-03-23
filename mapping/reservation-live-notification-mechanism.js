const createAuthentication = require('./authentication').createAuthentication;

// with descriptions and examples of the types
function enableRLNM(handleUrl, authInfo) {
    console.log(handleUrl, authInfo)
    return {
        LNM_PutHandlerUrl_RQ: {
            ...createAuthentication(authInfo),
            HandlerUrl: handleUrl
        }
    }
}

module.exports = {
    enableRLNM,

}

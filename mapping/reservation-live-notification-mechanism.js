const createAuthentication = require('./authentication').createAuthentication;

// with descriptions and examples of the types
function enableRLNM(handleUrl, authInfo) {
    return {
        LNM_PutHandlerUrl_RQ: {
            ...createAuthentication(authInfo),
            HandleUrl: handleUrl
        }
    }
}





module.exports = {
    enableRLNM,

}

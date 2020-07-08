const createAuthentication = require('./authentication').createAuthentication;

// lists the types of changes you can get notifications for
// with descriptions and examples of the types
function listChangeTypes(authInfo) {
    return {
        Pull_ListLiveNotificationMechanismChangeTypes_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// Allow you to subscribe to notifications types and by owners to a url
// changeTypes should be an array of the types from listChangeTypes
// owners should be owner IDs
// urlBase is where you want the notifications to go
function subscribeForNotificationsRequest(changeTypes, observedOwners, urlBase, authInfo) {
    return {
        Push_PutLiveNotificationMechanismSubscriptions_RQ: {
            ...createAuthentication(authInfo),
            ChangeTypes: {
                Type: changeTypes.map(x => {
                    return {
                        _text: x
                    }
                })
            },
            ObservedOwners: {
                Owner: observedOwners.map(x => {
                    return {
                        _text: x
                    }
                })
            },
            UrlBase: urlBase
        }
    }
}

// lists the subscriptions you are subscribed to
function listSubscriptions(authInfo) {
    return {
        Pull_ListLiveNotificationMechanismSubscriptions_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}


module.exports = {
    listChangeTypes,
    subscribeForNotificationsRequest,
    listSubscriptions,
}

const createAuthentication = require('./authentication').createAuthentication;

// Lists the property change log for pricing, availability, images and description
// get property ID from listProperties(needs location ID) pull-property-data
function listPropertyChangeLog(propertyID, authInfo) {
    return {
        Pull_ListPropertyChangeLog_RQ: {
            ...createAuthentication(authInfo),
            PropertyID: propertyID
        }
    }
}

// Lists multiple property change logs for pricing, availability, images and description
// get property IDs from listProperties(needs location ID) pull-property-data - pass in array
function listPropertiesChangeLog(propertyIds, authInfo) {
    return {
        Pull_ListPropertiesChangeLog_RQ: {
            ...createAuthentication(authInfo),
            PropertyIDs: {
                PropertyID: propertyIds.map(x => {
                    return {
                        _text: x
                    }
                })
            }
        }
    }
}

// Lists the property price changes from a given timestamp YYYY-MM-DD HH:MM:SS
// get property ID from listProperties(needs location ID) pull-property-data
function listPropertyPriceChanges(propertyID, since, authInfo) {
    return {
        Pull_ListPropertyPriceChanges_RQ: {
            ...createAuthentication(authInfo),
            PropertyID: propertyID,
            Since: since
        }
    }
}

// Lists the property availability changes from a given timestamp YYYY-MM-DD HH:MM:SS
// get property ID from listProperties(needs location ID) pull-property-data
function listPropertyAvailabilityChanges(propertyID, since, authInfo) {
    return {
        Pull_ListPropertyAvbChanges_RQ: {
            ...createAuthentication(authInfo),
            PropertyID: propertyID,
            Since: since
        }
    }
}


module.exports = {
    listPropertyChangeLog,
    listPropertiesChangeLog,
    listPropertyPriceChanges,
    listPropertyAvailabilityChanges
}

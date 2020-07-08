const createAuthentication = require('./authentication').createAuthentication;

// Get Lists available properties by location id, pass in location id - reference dictionary listLocations for id list
// NLA will filter our not available properties - defaults to true
function listProperties(locationID, includesNLA, authInfo) {
    return {
        Pull_ListProp_RQ: {
            ...createAuthentication(authInfo),
            LocationID: locationID,
            IncludeNLA: includesNLA
        }
    }
}

// Get Lists available properties by owner pass in owner id - reference listAllOwners in this file for id list
// NLA will filter our not available properties - defaults to true
function listOwnersProperties(ownerID, includesNLA, authInfo) {
    return {
        Pull_ListOwnerProp_RQ: {
            ...createAuthentication(authInfo),
            OwnerID: ownerID,
            IncludeNLA: includesNLA
        }
    }
}

// Get Lists available properties by creationDate from and to YYYY-MM-DD format
// NLA will filter our not available properties - defaults to true
function listPropertiesByCreationDate(from, to, includesNLA, authInfo) {
    return {
        Pull_ListPropByCreationDate_RQ: {
            ...createAuthentication(authInfo),
            CreationFrom: from,
            CreationTo: to,
            IncludeNLA: includesNLA
        }
    }
}

// Get information about a specific property, pass in a propertyID
function listSpecificProperty(propertyID, authInfo) {
    return {
        Pull_ListSpecProp_RQ: {
            ...createAuthentication(authInfo),
            PropertyID: propertyID
        }
    }
}

// Lists buildings
function listBuildings(authInfo) {
    return {
        Pull_ListBuildings_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// Lists all the owners
function listAllOwners(authInfo) {
    return {
        Pull_ListAllOwners_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// Gets details of owner by ID
function getOwnerDetails(ownerID, authInfo) {
    return {
        Pull_GetOwnerDetails_RQ: {
            ...createAuthentication(authInfo),
            OwnerID: ownerID
        }
    }
}

// Lists owner agents
function listOwnerAgents(authInfo) {
    return {
        Pull_GetAgents_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// Lists property external listings
function listPropertyExternalListing(propertyIds, authInfo) {
    return {
        Pull_GetPropertyExternalListing_RQ: {
            ...createAuthentication(authInfo),
            Properties: {
                PropertyID: propertyIds.map(x => {
                    return {
                        _text: x
                    }
                })
            }
        }
    }
}



module.exports = {
    listProperties,
    listOwnersProperties,
    listPropertiesByCreationDate,
    listSpecificProperty,
    listBuildings,
    listAllOwners,
    getOwnerDetails,
    listOwnerAgents,
    listPropertyExternalListing
}

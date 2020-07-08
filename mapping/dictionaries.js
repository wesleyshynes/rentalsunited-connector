const createAuthentication = require('./authentication').createAuthentication;

// List Statuses
function listStatuses(authInfo) {
    return {
        Pull_ListStatuses_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Property Types
function listPropertyTypes(authInfo) {
    return {
        Pull_ListPropTypes_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}


// List OTA Property Types
function listOTAPropertyTypes(authInfo) {
    return {
        Pull_ListOTAPropTypes_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Location Types
function listLocationTypes(authInfo) {
    return {
        Pull_ListLocationTypes_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Locations
function listLocations(authInfo) {
    return {
        Pull_ListLocations_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// Get Location Details
// pass in a location ID and get details
function getLocationDetails(locationID, authInfo) {
    return {
        Pull_GetLocationDetails_RQ: {
            ...createAuthentication(authInfo),
            LocationID: locationID
        }
    }
}

// Get Location by Name
function getLocationByName(locationName, authInfo) {
    return {
        Pull_GetLocationByName_RQ: {
            ...createAuthentication(authInfo),
            LocationName: locationName
        }
    }
}

// Get Location by Coordinates
function getLocationByCoordinates(latitude, longitude, authInfo) {
    return {
        Pull_GetLocationByCoordinates_RQ: {
            ...createAuthentication(authInfo),
            Latitude: latitude,
            Longitude: longitude
        }
    }
}

// Get Cities and number of properties
function getCitiesAndNumberOfProperties(authInfo) {
    return {
        Pull_ListCitiesProps_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Cities and Currencies
function listCitiesAndCurrencies(authInfo) {
    return {
        Pull_ListCurrenciesWithCities_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Destinations
function listDestinations(authInfo) {
    return {
        Pull_ListDestinations_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Distance Units
function listDistanceUnits(authInfo) {
    return {
        Pull_ListDistanceUnits_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Room Types
function listCompositionRooms(authInfo){
    return {
        Pull_ListCompositionRooms_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Amenities
function listAmenities(authInfo) {
    return {
        Pull_ListAmenities_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Amenities available for rooms
function listAmenitiesAvailableForRooms(authInfo) {
    return {
        Pull_ListAmenitiesAvailableForRooms_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Image types
function listImageTypes(authInfo) {
    return {
        Pull_ListImageTypes_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Payment Methods
function listPaymentMethods(authInfo) {
    return {
        Pull_ListPaymentMethods_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Reservation Statuses
function listReservationStatuses(authInfo) {
    return {
        Pull_ListReservationStatuses_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Deposit Types
function listDepositTypes(authInfo) {
    return {
        Pull_ListDepositTypes_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}


// List Languages
function listLanguages(authInfo) {
    return {
        Pull_ListLanguages_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Property External Statuses
function listPropertyExternalStatuses(authInfo) {
    return {
        Pull_ListPropExtStatuses_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Changeover Types
function listChangeoverTypes(authInfo) {
    return {
        Pull_ListChangeoverTypes_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Additional Fee Kinds
function listAdditionalFeeKinds(authInfo) {
    return {
        Pull_ListAdditionalFeeKinds_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Additional Fee Discriminators
function listAdditionalFeeDiscriminators(authInfo) {
    return {
        Pull_ListAdditionalFeeDiscriminators_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Additional Fee Types
function listAdditionalFeeTypes(authInfo) {
    return {
        Pull_ListAdditionalFeeTypes_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Cancellation Types
function listCancellationTypes(authInfo) {
    return {
        Pull_CancellationTypes_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// List Quote Modes
function listQuoteModes(authInfo) {
    return {
        Pull_QuoteModes_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}



module.exports = {
    listStatuses,
    listPropertyTypes,
    listOTAPropertyTypes,
    listLocationTypes,
    listLocations,
    getLocationDetails,
    getLocationByName,
    getLocationByCoordinates,
    getCitiesAndNumberOfProperties,
    listCitiesAndCurrencies,
    listDestinations,
    listDistanceUnits,
    listCompositionRooms,
    listAmenities,
    listAmenitiesAvailableForRooms,
    listImageTypes,
    listPaymentMethods,
    listReservationStatuses,
    listDepositTypes,
    listLanguages,
    listPropertyExternalStatuses,
    listChangeoverTypes,
    listAdditionalFeeKinds,
    listAdditionalFeeDiscriminators,
    listAdditionalFeeTypes,
    listCancellationTypes,
    listQuoteModes
}

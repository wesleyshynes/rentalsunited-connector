const createAuthentication = require('./authentication').createAuthentication;

// Lists properties unavailable blocks - use listLocations from dictionary
// NLA will filter our not available properties - defaults to true
function listPropertiesBlocks(locationID, from, to, includesNLA, authInfo) {
    return {
        Pull_ListPropertiesBlocks_RQ: {
            ...createAuthentication(authInfo),
            LocationID: locationID,
            DateFrom: from,
            DateTo: to,
            IncludeNLA: includesNLA
        }
    }
}

// Lists property availability on a day by day list
// get property ID from listProperties(needs location ID) pull-property-data
function listPropertyAvailabilityCalendar(propertyID, from, to, authInfo) {
    return {
        Pull_ListPropertyAvailabilityCalendar_RQ: {
            ...createAuthentication(authInfo),
            PropertyID: propertyID,
            DateFrom: from,
            DateTo: to,
        }
    }
}

// Lists property minimum stay by date ranges
// get property ID from listProperties(needs location ID) pull-property-data
function listPropertyMinStay(propertyID, from, to, authInfo) {
    return {
        Pull_ListPropertyMinStay_RQ: {
            ...createAuthentication(authInfo),
            PropertyID: propertyID,
            DateFrom: from,
            DateTo: to,
        }
    }
}

// Lists property prices based on the seasons setup
// get property ID from listProperties(needs location ID) pull-property-data
function listPropertyPrices(propertyID, from, to, pricingModelMode, authInfo) {
    return {
        Pull_ListPropertyPrices_RQ: {
            ...createAuthentication(authInfo),
            PropertyID: propertyID,
            DateFrom: from,
            DateTo: to,
            PricingModelMode: pricingModelMode
        }
    }
}

// Gets a price calculation for a property from a given time period. Nothing is returned if unavailable
// get property ID from listProperties(needs location ID) pull-property-data
function getPropertyAVBPrice(propertyID, from, to, authInfo) {
    return {
        Pull_GetPropertyAvbPrice_RQ: {
            ...createAuthentication(authInfo),
            PropertyID: propertyID,
            DateFrom: from,
            DateTo: to,
        }
    }
}

// Gets a price calculation for a property from a given time period. Nothing is returned if unavailable
// get property ID from listProperties(needs location ID) pull-property-data
function listPropertyDiscounts(propertyID, authInfo) {
    return {
        Pull_ListPropertyDiscounts_RQ: {
            ...createAuthentication(authInfo),
            PropertyID: propertyID
        }
    }
}

// Returns a sequence of strings representing the changeover policy for a given period
// get property ID from listProperties(needs location ID) pull-property-data
function getChangeoverDays(propertyID, startDate, endDate, authInfo) {
    return {
        Pull_GetChangeoverDays_RQ: {
            ...createAuthentication(authInfo),
            PropertyID: propertyID,
            StartDate: startDate,
            EndDate: endDate
        }
    }
}

module.exports = {
    listPropertiesBlocks,
    listPropertyAvailabilityCalendar,
    listPropertyMinStay,
    listPropertyPrices,
    getPropertyAVBPrice,
    listPropertyDiscounts,
    getChangeoverDays
}

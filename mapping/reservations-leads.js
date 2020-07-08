const createAuthentication = require('./authentication').createAuthentication;

function putConfirmedReservations(reservationInfo, authInfo) {
    let reservation = {
        Push_PutConfirmedReservationMulti_RQ: {
            ...createAuthentication(authInfo),
            Reservation: {
                ...createReservation(reservationInfo)
            }
        }
    }

    if(reservationInfo.quoteModeId) {
        reservation.Push_PutConfirmedReservationMulti_RQ.QuoteModeId = reservationInfo.quoteModeId
    }

    return reservation
}

function createReservation(r) {
    let reservation = {
        StayInfos: {
            StayInfo: r.stayInfo.map(x => {
                return {
                    PropertyID: x.propertyID,
                    DateFrom: x.from,
                    DateTo: x.to,
                    NumberOfGuests: x.numberOfGuests,
                    Costs: {
                        RUPrice: x.costs.ruPrice,
                        ClientPrice: x.costs.clientPrice,
                        AlreadyPaid: x.costs.alreadyPaid
                    }
                }
            })
        },
        CustomerInfo: {
            ...createCustomerInfo(r.customerInfo)
        },
        Comments: r.comments
    }

    if(r.creditCard) {
        reservation.CreditCard = {
            CCNumber: r.creditCard.ccNumber,
            CVC: r.creditCard.cvc,
            NameOnCard: r.creditCard.nameOnCard,
            Expiration: r.creditCard.expiration,
            BillingAddress: r.creditCard.billingAddress,
            CardType: r.creditCard.cardType,
            Comments: r.creditCard.comments
        }
    }

    return reservation
}

function createCustomerInfo(customerInfo){
    return {
        Name: customerInfo.name,
        SurName: customerInfo.surName,
        Email: customerInfo.email,
        Phone: customerInfo.phone,
        SkypeID: customerInfo.skypeID,
        Address: customerInfo.address,
        ZipCode: customerInfo.zipCode,
        LanguageID: customerInfo.languageID,
        CountryID: customerInfo.countryID
    }
}

// Cancels Reservation based on the reservation id
// cancel type id is 1 for property provider, 2 if guests cancels
function cancelReservation(reservationID, cancelTypeID, authInfo) {
    return {
        Push_CancelReservation_RQ: {
            ...createAuthentication(authInfo),
            ReservationID: reservationID,
            CancelTypeID: cancelTypeID
        }
    }
}

// Archives Reservation based on the reservation id
// set archive value to true or false
function archiveReservation(reservationID, archive, authInfo) {
    return {
        Push_ArchiveReservation_RQ: {
            ...createAuthentication(authInfo),
            ReservationID: reservationID,
            Archive: archive
        }
    }
}

// Adds a lead to the system
function putLead(leadInfo, authInfo) {
    return {
        Push_PutLead_RQ: {
            ...createAuthentication(authInfo),
            Lead: {
                ExternalLeadID: leadInfo.externalLeadID,
                PropertyID: leadInfo.propertyID,
                DateFrom: leadInfo.from,
                DateTo: leadInfo.to,
                NumberOfGuests: leadInfo.numberOfGuests,
                CustomerInfo: {
                    ...createCustomerInfo(leadInfo.customerInfo)
                },
                Comments: leadInfo.comments
            }
        }
    }
}

// AModifies an existing booking
/*
reservationID reservation id being modified
current
    {
        propertyID: propety id of current stay,
        from: YYYY-MM-DD,
        to: YYYY-MM-DD
    }
updated
    {
        propertyID property id of updated stay,
        from: YYYY-MM-DD,
        to: YYYY-MM-DD,
        numberOfGuests: number of guests,
        clientPrice: client price,
        alreadyPaid: amount already paid,
        pmsReservationId: reservation id in the PMS
    }
allowOverbooking true or false
*/
function pushModifyStay(reservationID, current, updated, allowOverbooking, authInfo) {
    return {
        Push_ModifyStay_RQ: {
            ...createAuthentication(authInfo),
            ReservationID: reservationID,
            Current: {
                PropertyID: current.propertyID,
                DateFrom: current.from,
                DateTo: current.to
            },
            Modify: {
                PropertyID: updated.propertyID,
                DateFrom: updated.from,
                DateTo: updated.to,
                NumberOfGuests: updated.numberOfGuests,
                AlreadyPaid: updated.alreadyPaid,
                PMSReservationId: updated.pmsReservationId
            },
            AllowOverbooking: allowOverbooking
        }
    }
}

// Lists reservations from specific date range in a location id
function listReservations(from, to, locationID, authInfo) {
    return {
        Pull_ListReservations_RQ: {
            ...createAuthentication(authInfo),
            DateFrom: from,
            DateTo: to,
            LocationID: locationID
        }
    }
}

// Lists reservations created in rentals unitd from specific date range in a location id
function listOwnReservations(from, to, locationID, authInfo) {
    return {
        Pull_GetOwnReservations_RQ: {
            ...createAuthentication(authInfo),
            DateFrom: from,
            DateTo: to,
            LocationID: locationID
        }
    }
}

// Gets reservation info based on the id
function getReservationByID(reservationID, authInfo) {
    return {
        Pull_GetReservationByID_RQ: {
            ...createAuthentication(authInfo),
            ReservationID: reservationID
        }
    }
}

// Lists leads based on the location id
function getLeads(from, to, locationID, authInfo) {
    return {
        Pull_GetLeads_RQ: {
            ...createAuthentication(authInfo),
            DateFrom: from,
            DateTo: to,
            LocationID: locationID
        }
    }
}

// Lists reservations missing pms mapping, to help reconcile info
function listReservationsMissingPMSMapping(from, authInfo) {
    return {
        Pull_ListReservationsMissingPMSMapping_RQ: {
            ...createAuthentication(authInfo),
            DateFrom: from
        }
    }
}

// Lists reservations for owner based on date range, location and email/username
function listReservationsForOwner(from, to, locationID, username, authInfo) {
    return {
        Pull_ListReservationsOwnerUser_RQ: {
            ...createAuthentication(authInfo),
            DateFrom: from,
            DateTo: to,
            LocationID: locationID,
            Username: username
        }
    }
}



module.exports = {
    putConfirmedReservations,
    cancelReservation,
    archiveReservation,
    putLead,
    pushModifyStay,
    listReservations,
    listOwnReservations,
    getReservationByID,
    getLeads,
    listReservationsMissingPMSMapping,
    listReservationsForOwner
}

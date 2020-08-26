const createAuthentication = require('./authentication').createAuthentication;

// Owner Functions
// pass in owner info:
/*
{
    firstName: first name,
    lastName: last name,
    email: email address,
    phone: phone number
}
*/
function putOwner(ownerInfo, authInfo) {
    return {
        Push_PutOwner_RQ: {
            ...createAuthentication(authInfo),
            ...createOwner(ownerInfo)
        }
    }
}

function createOwner(ownerInfo) {
    return {
        Owner: {
            FirstName: ownerInfo.firstName,
            SurName: ownerInfo.lastName,
            Email: ownerInfo.email,
            Phone: ownerInfo.phone
        }
    }
}

// Building Functions
// pass in building Info
/*
    {
        buildingName: the building name
    }
*/
function putBuilding(buildingInfo, authInfo) {
    return {
        Push_PutBuilding_RQ: {
            ...createAuthentication(authInfo),
            ...createBuilding(buildingInfo)
        }
    }
}

function createBuilding(buildingInfo) {
    return {
        BuildingName: buildingInfo.buildingName
    }
}

// Property Functions
function putProperty(propertyData, authInfo) {
    return {
        Push_PutProperty_RQ: {
            ...createAuthentication(authInfo),
            ...createProperty(propertyData)
        }
    }
}

function createProperty(p) {
    const propertyData = {
        Property: {
            PUID: {
                _attributes: {
                    BuildingID: p.puid.buildingID
                },
                _text: p.puid.text
            },
            Name: p.name,
            OwnerID: p.ownerID,
            DetailedLocationID: {
                _attributes: {
                    TypeID: p.detailedLocationID.typeID
                },
                _text: p.detailedLocationID.text
            },
            IsActive: p.isActive,
            IsArchived:  p.isArchived,
            CleaningPrice: p.cleaningPrice,
            Space: p.space,
            StandardGuests: p.standardGuests,
            CanSleepMax: p.canSleepMax,
            PropertyTypeID: p.propertyTypeID,
            Floor: p.floor,
            Street: p.street,
            ZipCode: p.zipCode,
            Coordinates: {
                Longitude: p.coordinates.longitude,
                Latitude: p.coordinates.lattitude
            },
            Distances: {
                Distance: p.distances.map(x => {
                    return {
                        DestinationID: x.distanceUnitID,
                        DistanceUnitID: x.distanceUnitID,
                        DistanceValue: x.distanceValue
                    }
                })
            },
            CompositionRooms: {
                CompositionRoomID: p.compositionRooms.map(x => {
                    return {
                        _attributes: {
                            Count: x.count
                        },
                        _text: x.compositionRoomID
                    }
                })
            },
            Amenities: {
                Amenity: p.amenities.map(x => {
                    let amenityValue = {
                        _text: x.amenity
                    }
                    if(x.count){
                        amenityValue._attributes = {
                            Count: x.count
                        }
                    }
                    return amenityValue
                })
            },
            Images: {
                Image: p.images.map(x => {
                    return {
                        _attributes: {
                            ImageTypeID: x.imageTypeID
                        },
                        _text: x.image
                    }
                })
            },
            ArrivalInstructions: {
                Landlord: p.arrivalInstructions.landord,
                Email: p.arrivalInstructions.email,
                Phone: p.arrivalInstructions.phone,
                DaysBeforeArrival: p.arrivalInstructions.daysBeforeArrival,
                HowToArrive: {
                    Text: p.arrivalInstructions.howToArrive.map(x => {
                        return {
                            _attributes: {
                                LanguageID: x.languageID
                            },
                            _text: x.text
                        }
                    })
                },
                PickupService: {
                    Text: p.arrivalInstructions.pickupService.map(x => {
                        return {
                            _attributes: {
                                LanguageID: x.languageID
                            },
                            _text: x.text
                        }
                    })
                }
            },
            CheckInOut: {
                CheckInFrom: p.checkInOut.checkInFrom,
                CheckInTo: p.checkInOut.checkInTo,
                CheckOutUntil: p.checkInOut.checkOutUntil,
                Place: p.checkInOut.place,
                LateArrivalFees: {
                    LateArrivalFee: p.checkInOut.lateArrivalFees.map(x => {
                        return {
                            _attributes: {
                                From: x.from,
                                To: x.to
                            },
                            _text: x.lateArrivalFee
                        }
                    })
                },
                EarlyDepartureFees: {
                    EarlyDepartureFee: p.checkInOut.earlyDepartureFees.map(x => {
                        return {
                            _attributes: {
                                From: x.from,
                                To: x.to
                            },
                            _text: x.earlyDepartureFee
                        }
                    })
                }
            },
            PaymentMethods: {
                PaymentMethod: p.paymentMethods.map(x => {
                    return {
                        _attributes: {
                            PaymentMethodID: x.paymentMethodID
                        },
                        _text: x.paymentMethod
                    }
                })
            },
            Deposit: {
                _attributes: {
                    DepositTypeID: p.deposit.depositTypeID
                },
                _text: p.deposit.text
            },
            CancellationPolicies: {
                CancellationPolicy: p.cancellationPolicies.map(x => {
                    return {
                        _attributes: {
                            ValidFrom: x.validFrom,
                            ValidTo: x.validTo
                        },
                        _text: x.cancellationPolicy
                    }
                })
            },
            Descriptions: {
                Description: p.descriptions.map(x => {
                    let description = {
                        _attributes: {
                            LanguageID: x.languageID
                        }
                    }
                    if(x.text) {
                        description.Text = x.text
                    }
                    if(x.image) {
                        description.Image = x.image
                    }

                    return description
                })
            },
            SecurityDeposit: {
                _attributes: {
                    DepositTypeID: p.securityDeposit.deposityTypeID
                },
                _text: p.securityDeposit.text
            },
            AdditionalFees: {
                AdditionalFee: p.additionalFees.map(x => {
                    return {
                        _attributes: {
                            FeeTaxType: x.feeTaxType,
                            DiscriminatorID: x.discriminatorID,
                            Order: x.order
                        },
                        Value: x.value
                    }
                })
            },
            LicenceInfo: {
                LicenceNumber: p.licenseInfo.licenseNumber
            },
            PreparationTimeBeforeArrivalInHours: p.preparationTimeBeforeArrivalInHours
        }
    }

    if(p.id) {
        propertyData.Property.ID = {
            _attributes: {
                BuildingID: p.id.buildingID,
                BuildingName: p.id.buildingName
            },
            _text: p.id.text
        }
    }

    return propertyData
}


// Sets property statuses
// pass in list of property Ids
function setPropertiesStatus(isActive, isArchived, propertyIds, authInfo) {
    return {
        Push_SetPropertiesStatus_RQ: {
            ...createAuthentication(authInfo),
            IsActive: isActive,
            IsArchived: isArchived,
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

// Sets property external listings
/*
**    {
**        id: propertyID,
**         url: url of external listing ,
**         status: status of listing - see listPropertyExternalStatuses,
**         description: description of external listing
**    }
*/
// pass in list of property Ids
function putPropertyExternalListing(propertyListingData, authInfo) {
    return {
        Push_PutPropertyExternalListing_RQ: {
            ...createAuthentication(authInfo),
            Properties: {
                Property: propertyListingData.map(x => {
                    return {
                        _attributes: {
                            ID: x.id
                        },
                        Url: {
                            _text: x.url
                        },
                        Status: {
                            _text: x.status
                        },
                        Description: {
                            _text: x.description
                        }
                    }
                })
            }
        }
    }
}

// Sets standard number of guests for a property
// pass in list of property Ids
function pushStandardNumberOfGuests(propertyID, guests, authInfo) {
    return {
        Push_StandardNumberOfGuests_RQ: {
            ...createAuthentication(authInfo),
            Property: {
                ID: propertyID,
                StandardGuests: guests
            }
        }
    }
}


module.exports = {
    putOwner,
    putBuilding,
    putProperty,
    setPropertiesStatus,
    putPropertyExternalListing,
    pushStandardNumberOfGuests
}

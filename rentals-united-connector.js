const axios = require('axios');
const converter = require('xml-js');

const authentication = require('./mapping/authentication');
const deltaMethods = require('./mapping/delta-methods');
const dictionaries = require('./mapping/dictionaries');
const liveNotificationMechanism = require('./mapping/live-notification-mechanism');
const pullAvailabilityPricing = require('./mapping/pull-availability-pricing');
const pullPropertyData = require('./mapping/pull-property-data');
const pushAvailabilityPricing = require('./mapping/push-availability-pricing');
const pushStaticPropertyData = require('./mapping/push-static-property-data');
const reservationLiveNotificationMechanism = require('./mapping/reservation-live-notification-mechanism');
const reservationsLeads = require('./mapping/reservations-leads');
const userManagement = require('./mapping/user-management');

const config = {
    headers: {
        'Content-Type': 'text/xml'
    }
};

const converterOptions = {compact: true, ignoreComment: true, spaces: 4}

class RentalsUnitedConnector {
    constructor(ruConfig) {
        this.username = ruConfig.username
        this.password = ruConfig.password
        this.debugEnabled = ruConfig.debugEnabled

        this.definitions = {}

        // this.authentication = ruConfig;
        this.dictionaries = dictionaries;
        this.pullPropertyData = pullPropertyData;
        this.pullAvailabilityPricing = pullAvailabilityPricing;
        this.deltaMethods = deltaMethods;
        this.pushStaticPropertyData = pushStaticPropertyData;
        this.pushAvailabilityPricing = pushAvailabilityPricing;
        this.reservationsLeads = reservationsLeads;

        // there are no native methods for this
        this.authentication = authentication;
        this.userManagement = userManagement;
        this.liveNotificationMechanism = liveNotificationMechanism;
        this.reservationLiveNotificationMechanism = reservationLiveNotificationMechanism;
    }

    showCredentials(){
        this.logMessage(this.username);
        this.logMessage(this.password);
    }

    async makeCall(endpoint, values = []) {
        try {
            const response = await this[endpoint](...values)
            return response
        } catch (err) {
            return err
        }
    }

    logMessage(message) {
        if(this.debugEnabled) {
            console.log(message)
        }
    }

    // BEGIN DEFINITION FUNCTIONS //////////////////////////////////////////////
    async checkStatus(statusCode){
        this.logMessage('calling check Status')
        await this.saveDefinitions(
            'statusCodes',
            'listStatuses',
            ['Pull_ListStatuses_RS','Statuses','StatusInfo'],
            (entry) => entry._attributes.ID,
            (entry) => {
                return {
                    id: entry._attributes.ID,
                    value: entry._text
                }
            }
        )
        return this.definitions.statusCodes.values[statusCode]
    }

    async listPropertyTypes() {
        this.logMessage('calling list property types')
        await this.saveDefinitions(
            'propertyTypes',
            'listPropertyTypes',
            ['Pull_ListPropTypes_RS','PropertyTypes','PropertyType'],
            (entry) => entry._attributes.PropertyTypeID,
            (entry) => {
                return {
                    propertyTypeId: entry._attributes.PropertyTypeID,
                    value: entry._text
                }
            }
        )
        return this.definitions.propertyTypes.values
    }

    async listOTAPropertyTypes() {
        this.logMessage('calling list OTA property types')
        await this.saveDefinitions(
            'otaPropertyTypes',
            'listOTAPropertyTypes',
            ['Pull_ListOTAPropTypes_RS','PropertyTypes','PropertyType'],
            (entry) => entry._attributes.OTACode,
            (entry) => {
                return {
                    propertyTypeId: entry._attributes.PropertyTypeID,
                    otaCode: entry._attributes.OTACode,
                    value: entry._text
                }
            }
        )
        return this.definitions.otaPropertyTypes.values
    }

    async listLocationTypes() {
        this.logMessage('calling list location types')
        await this.saveDefinitions(
            'locationTypes',
            'listLocationTypes',
            ['Pull_ListLocationTypes_RS','LocationTypes','LocationType'],
            (entry) => entry._attributes.LocationTypeID,
            (entry) => {
                return {
                    locationTypeId: entry._attributes.LocationTypeID,
                    value: entry._text
                }
            }
        )
        return this.definitions.locationTypes.values
    }

    async listLocations() {
        this.logMessage('calling list locations')
        await this.saveDefinitions(
            'locations',
            'listLocations',
            ['Pull_ListLocations_RS','Locations','Location'],
            (entry) => entry._attributes.LocationID,
            (entry) => {
                return {
                    locationTypeId: entry._attributes.LocationTypeID,
                    locationId: entry._attributes.LocationID,
                    parentLocationId: entry._attributes.ParentLocationID,
                    value: entry._text
                }
            }
        )
        return this.definitions.locations.values
    }

    async listCitiesAndCurrencies() {
        this.logMessage('calling list cities and currencies')
        await this.saveDefinitionsCustom(
            'citiesAndCurrencies',
            'listCitiesAndCurrencies',
            ['Pull_ListCurrenciesWithCities_RS','Currencies','Currency'],
            (data) => {
                let values = {}
                data.map((entry) => {
                    // this.logMessage(entry)
                    let currency = entry._attributes.CurrencyCode;
                    this.logMessage('mapping currency', currency)
                    this.arrayify(entry.Locations.LocationID).map((location) => {
                        values[location._text] = currency
                    })
                })
                return values;
            }
        )
        return this.definitions.citiesAndCurrencies.values
    }

    async listDestinations() {
        this.logMessage('calling list destinations')
        await this.saveDefinitions(
            'destinations',
            'listDestinations',
            ['Pull_ListDestinations_RS','Destinations','Destination'],
            (entry) => entry._attributes.DestinationID,
            (entry) => {
                return {
                    destinationId: entry._attributes.DestinationID,
                    value: entry._text
                }
            }
        )
        return this.definitions.destinations.values
    }

    async listDistanceUnits() {
        this.logMessage('calling list distance units')
        await this.saveDefinitions(
            'distanceUnits',
            'listDistanceUnits',
            ['Pull_ListDistanceUnits_RS','DistanceUnits','DistanceUnit'],
            (entry) => entry._attributes.DistanceUnitID,
            (entry) => {
                return {
                    distanceUnitId: entry._attributes.DistanceUnitID,
                    value: entry._text
                }
            }
        )
        return this.definitions.distanceUnits.values
    }

    async listCompositionRooms() {
        this.logMessage('calling list composition rooms')
        await this.saveDefinitions(
            'compositionRooms',
            'listCompositionRooms',
            ['Pull_ListCompositionRooms_RS','CompositionRooms','CompositionRoom'],
            (entry) => entry._attributes.CompositionRoomID,
            (entry) => {
                return {
                    compositionRoomId: entry._attributes.CompositionRoomID,
                    value: entry._text
                }
            }
        )
        return this.definitions.compositionRooms.values
    }

    async listAmenities() {
        this.logMessage('calling list amenities')
        await this.saveDefinitions(
            'amenities',
            'listAmenities',
            ['Pull_ListAmenities_RS','Amenities','Amenity'],
            (entry) => entry._attributes.AmenityID,
            (entry) => {
                return {
                    amenityId: entry._attributes.AmenityID,
                    value: entry._text
                }
            }
        )
        return this.definitions.amenities.values
    }

    async listAmenitiesAvailableForRooms() {
        this.logMessage('calling list amenities available for rooms')
        await this.saveDefinitionsCustom(
            'amenitiesAvailableForRooms',
            'listAmenitiesAvailableForRooms',
            ['Pull_ListAmenitiesAvailableForRooms_RS','AmenitiesAvailableForRooms','AmenitiesAvailableForRoom'],
            (data) => {
                let values = {}
                data.map((entry) => {
                    // this.logMessage(entry)
                    let compositionRoom = entry._attributes.CompositionRoom;
                    let compositionRoomId = entry._attributes.CompositionRoomID;
                    this.logMessage('mapping composition room', compositionRoom, compositionRoomId)
                    values[compositionRoomId] = {
                        compositionRoom: compositionRoom,
                        compositionRoomId: compositionRoomId,
                        amenities: this.arrayify(entry.Amenity).map((amenity) => {
                            return {
                                amenityId: amenity._attributes.AmenityID,
                                value: amenity._text
                            }
                        })
                    }
                })
                return values;
            }
        )
        return this.definitions.amenitiesAvailableForRooms.values
    }

    async listImageTypes() {
        this.logMessage('calling list image types')
        await this.saveDefinitions(
            'imageTypes',
            'listImageTypes',
            ['Pull_ListImageTypes_RS','ImageTypes','ImageType'],
            (entry) => entry._attributes.ImageTypeID,
            (entry) => {
                return {
                    imageTypeId: entry._attributes.ImageTypeID,
                    value: entry._text
                }
            }
        )
        return this.definitions.imageTypes.values
    }

    async listPaymentMethods() {
        this.logMessage('calling list payment methods')
        await this.saveDefinitions(
            'paymentMethods',
            'listPaymentMethods',
            ['Pull_ListPaymentMethods_RS','PaymentMethods','PaymentMethod'],
            (entry) => entry._attributes.PaymentMethodID,
            (entry) => {
                return {
                    paymentMethodId: entry._attributes.PaymentMethodID,
                    value: entry._text
                }
            }
        )
        return this.definitions.paymentMethods.values
    }

    async listReservationStatuses() {
        this.logMessage('calling list reservation statuses')
        await this.saveDefinitions(
            'reservationStatuses',
            'listReservationStatuses',
            ['Pull_ListReservationStatuses_RS','ReservationStatuses','ReservationStatus'],
            (entry) => entry._attributes.ReservationStatusID,
            (entry) => {
                return {
                    reservationStatusId: entry._attributes.ReservationStatusID,
                    value: entry._text
                }
            }
        )
        return this.definitions.reservationStatuses.values
    }

    async listDepositTypes() {
        this.logMessage('calling list deposit types')
        await this.saveDefinitions(
            'depositTypes',
            'listDepositTypes',
            ['Pull_ListDepositTypes_RS','DepositTypes','DepositType'],
            (entry) => entry._attributes.DepositTypeID,
            (entry) => {
                return {
                    depositTypeId: entry._attributes.DepositTypeID,
                    value: entry._text
                }
            }
        )
        return this.definitions.depositTypes.values
    }

    async listLanguages() {
        this.logMessage('calling list languages')
        await this.saveDefinitions(
            'languages',
            'listLanguages',
            ['Pull_ListLanguages_RS','Languages','Language'],
            (entry) => entry._attributes.LanguageID,
            (entry) => {
                return {
                    languageId: entry._attributes.LanguageID,
                    languageCode: entry._attributes.LanguageCode,
                    value: entry._text
                }
            }
        )
        return this.definitions.languages.values
    }

    async listPropertyExternalStatuses() {
        this.logMessage('calling list property external statuses')
        await this.saveDefinitions(
            'propertyExternalStatuses',
            'listPropertyExternalStatuses',
            ['Pull_ListPropExtStatuses_RS','PropertyExternalStatuses','Status'],
            (entry) => entry._attributes.ID,
            (entry) => {
                return {
                    id: entry._attributes.ID,
                    value: entry._text
                }
            }
        )
        return this.definitions.propertyExternalStatuses.values
    }

    async listChangeoverTypes() {
        this.logMessage('calling list changeover types')
        await this.saveDefinitions(
            'changeoverTypes',
            'listChangeoverTypes',
            ['Pull_ListChangeoverTypes_RS','ChangeoverTypes','ChangeoverType'],
            (entry) => entry._attributes.ID,
            (entry) => {
                return {
                    id: entry._attributes.ID,
                    value: entry._text
                }
            }
        )
        return this.definitions.changeoverTypes.values
    }

    async listAdditionalFeeKinds() {
        this.logMessage('calling list additional fee kinds')
        await this.saveDefinitions(
            'additionalFeeKinds',
            'listAdditionalFeeKinds',
            ['Pull_ListAdditionalFeeKinds_RS','AdditionalFeeKinds','AdditionalFeeKindInfo'],
            (entry) => entry._attributes.ID,
            (entry) => {
                return {
                    id: entry._attributes.ID,
                    value: entry._text
                }
            }
        )
        return this.definitions.additionalFeeKinds.values
    }

    async listAdditionalFeeDiscriminators() {
        this.logMessage('calling list additional fee discriminators')
        await this.saveDefinitions(
            'additionalFeeDiscriminators',
            'listAdditionalFeeDiscriminators',
            ['Pull_ListAdditionalFeeDiscriminators_RS','AdditionalFeeDiscriminators','AdditionalFeeDiscriminatorInfo'],
            (entry) => entry._attributes.ID,
            (entry) => {
                return {
                    id: entry._attributes.ID,
                    value: entry._text
                }
            }
        )
        return this.definitions.additionalFeeDiscriminators.values
    }

    async listAdditionalFeeTypes() {
        this.logMessage('calling list additional fee types')
        await this.saveDefinitions(
            'additionalFeeTypes',
            'listAdditionalFeeTypes',
            ['Pull_ListAdditionalFeeTypes_RS','AdditionalFeeTypes','AdditionalFeeTypeInfo'],
            (entry) => entry._attributes.ID,
            (entry) => {
                return {
                    id: entry._attributes.ID,
                    value: entry._text
                }
            }
        )
        return this.definitions.additionalFeeTypes.values
    }

    async listCancellationTypes() {
        this.logMessage('calling list cancellation types')
        await this.saveDefinitions(
            'cancellationTypes',
            'listCancellationTypes',
            ['Pull_CancellationTypes_RS','CancellationTypes','CancellationType'],
            (entry) => entry._attributes.Id,
            (entry) => {
                return {
                    id: entry._attributes.Id,
                    value: entry._text
                }
            }
        )
        return this.definitions.cancellationTypes.values
    }

    async listQuoteModes() {
        this.logMessage('calling list quote modes')
        await this.saveDefinitions(
            'quoteModes',
            'listQuoteModes',
            ['Pull_QuoteModes_RS','QuoteModes','QuoteMode'],
            (entry) => entry._attributes.Id,
            (entry) => {
                return {
                    id: entry._attributes.Id,
                    value: entry._text
                }
            }
        )
        return this.definitions.quoteModes.values
    }
    // END DEFINITION FUNCTIONS ////////////////////////////////////////////////

    // GETTER FUNCTIONS ////////////////////////////////////////////////////////
    async getLocationDetails(locationId) {
        this.logMessage('getting location details for location id', locationId)
        const requestObject = this.dictionaries.getLocationDetails(locationId, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_GetLocationDetails_RS', 'Locations', 'Location'],
            (data) => {
                return this.arrayify(data).map( entry => {
                    return {
                        locationTypeId: entry._attributes.LocationTypeID,
                        locationId: entry._attributes.LocationID,
                        parentLocationId: entry._attributes.ParentLocationID,
                        value: entry._text
                    }
                })
            }
        )
        return requestResponse
    }

    async getLocationByName(locationName) {
        this.logMessage('getting location id for', locationName)
        const requestObject = this.dictionaries.getLocationByName(locationName, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_GetLocatinByName_RS', 'LocationID'],
            (data) => {
                return data
            }
        )
        return requestResponse
    }

    async getLocationByCoordinates(latitude, longitude) {
        this.logMessage('getting location id for(lat, long)', latitude, longitude)
        const requestObject = this.dictionaries.getLocationByCoordinates(latitude, longitude, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_GetLocationByCoordinates_RS', 'Location'],
            (data) => {
                return {
                    locationId: data._attributes.LocationID,
                    distance: data._attributes.Distance,
                    value: data._text
                }
            }
        )
        return requestResponse
    }

    async getCitiesAndNumberOfProperties() {
        this.logMessage('getting cities and number of properties')
        const requestObject = this.dictionaries.getCitiesAndNumberOfProperties(this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListCitiesProps_RS', 'CitiesProps', 'CityProps'],
            (data) => {
                return this.arrayify(data).map( entry => {
                    return {
                        locationId: entry._attributes.LocationID,
                        value: entry._text
                    }
                })
            }
        )
        return requestResponse
    }
    // END GETTER FUNCTIONS ////////////////////////////////////////////////////

    // BEGIN LIST FUNCTION /////////////////////////////////////////////////////

    async listProperties(locationId, includesNLA = true) {
        this.logMessage(`getting properties list for location ${locationId}`)
        const requestObject = this.pullPropertyData.listProperties(locationId, includesNLA, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListProp_RS', 'Properties', 'Property'],
            (data) => {
                return this.arrayify(data).map((entry) => {
                    return this.mapPropertyListEntry(entry)
                })
            }
        )
        return requestResponse
    }

    async listOwnersProperties(ownerId, includesNLA = true) {
        this.logMessage(`getting properties list for owner id ${ownerId}`)
        const requestObject = this.pullPropertyData.listOwnersProperties(ownerId, includesNLA, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListOwnerProp_RS', 'Properties', 'Property'],
            (data) => {
                // return data
                return this.arrayify(data).map((entry) => {
                    return this.mapPropertyListEntry(entry)
                })
            }
        )
        return requestResponse
    }

    async listPropertiesByCreationDate(from, to, includesNLA = true) {
        this.logMessage(`getting properties list created from ${from} thru ${to}`)
        const requestObject = this.pullPropertyData.listPropertiesByCreationDate(from, to, includesNLA, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListPropByCreationDate_RS', 'Properties', 'Property'],
            (data) => {
                return this.arrayify(data).map((entry) => {
                    return this.mapPropertyListEntry(entry)
                })
            }
        )
        return requestResponse
    }

    async listSpecificProperty(propertyId) {
        this.logMessage(`getting properties id ${propertyId}`)
        const requestObject = this.pullPropertyData.listSpecificProperty(propertyId, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListSpecProp_RS', 'Property'],
            (data) => {
                // return data
                return this.mapPropertyListEntry(data, true)
            }
        )
        return requestResponse
    }

    async listBuildings() {
        this.logMessage(`getting buildings`)
        const requestObject = this.pullPropertyData.listBuildings(this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListBuildings_RS', 'Buildings', 'Building'],
            (data) => {
                // return data
                return this.arrayify(data).map((entry) => {
                    return {
                        buildingID: entry._attributes.BuildingID,
                        buildingName: entry._attributes.BuildingName,
                        properties: this.arrayify(entry.PropertyID).map(propertyID => propertyID._text) ,
                    }
                })

            }
        )
        return requestResponse
    }

    async listAllOwners() {
        this.logMessage(`getting owners`)
        const requestObject = this.pullPropertyData.listAllOwners(this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListAllOwners_RS', 'Owners', 'Owner'],
            (data) => {
                // return data
                return this.arrayify(data).map((entry) => {
                    return this.mapOwnerListEntry(entry)
                })

            }
        )
        return requestResponse
    }

    async getOwnerDetails(ownerID) {
        this.logMessage(`getting info for owner id ${ownerID}`)
        const requestObject = this.pullPropertyData.getOwnerDetails(ownerID, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_GetOwnerDetails_RS', 'Owner'],
            (data) => {
                // return data
                return this.mapOwnerListEntry(data)
            }
        )
        return requestResponse
    }

    async listOwnerAgents() {
        this.logMessage(`getting pwner agents`)
        const requestObject = this.pullPropertyData.listOwnerAgents(this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_GetAgents_RS'],
            (data) => {
                // return data
                return {
                    owner: {
                        ...this.mapOwnerListEntry(data.Owner)
                    },
                    agents: this.arrayify(data.Agents.Agent).map((entry) => {
                        return this.mapAgentListEntry(entry)
                    })
                }
            }
        )
        return requestResponse
    }

    async listPropertyExternalListing(propertyIdList) {
        this.logMessage(`getting property external listing for ${propertyIdList}`)
        const requestObject = this.pullPropertyData.listPropertyExternalListing(propertyIdList, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_GetPropertyExternalListing_RS', 'Properties', 'Property'],
            (data) => {
                // return data
                return this.arrayify(data).map((entry) => {
                    return {
                        id: entry._attributes.ID,
                        externalListings: entry.ExternalListing ?
                        this.arrayify(entry.ExternalListing).map((externalListing) => {
                            const externalListingFields = [
                                ['Url', 'url'],
                                ['Status', 'status'],
                                ['Description', 'description']
                            ]
                            return {
                                ...this.mapCustomObjects(externalListingFields, externalListing)
                            }
                        })
                         : []
                    }
                })
            }
        )
        return requestResponse
    }

    async listPropertiesBlocks(locationID, from, to, includesNLA = false) {
        this.logMessage(`getting properties block ${from} thru ${to} for location ${locationID}`)
        const requestObject = this.pullAvailabilityPricing.listPropertiesBlocks(locationID, from, to, includesNLA, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListPropertiesBlocks_RS', 'Properties', 'PropertyBlock'],
            (data) => {
                // return data
                return this.arrayify(data).map((entry) => {
                    const blockFields = [
                        ['DateFrom', 'from'],
                        ['DateTo', 'to']
                    ]
                    return {
                        propertyID: entry._attributes.PropertyID,
                        blocks: this.arrayify(entry.Block).map((block) => {
                            return {
                                ...this.mapCustomObjects(blockFields, block)
                            }
                        })
                    }
                })
            }
        )
        return requestResponse
    }

    async listPropertyAvailabilityCalendar(propertyID, from, to) {
        this.logMessage(`getting properties block ${from} thru ${to} for property ${propertyID}`)
        const requestObject = this.pullAvailabilityPricing.listPropertyAvailabilityCalendar(propertyID, from, to, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListPropertyAvailabilityCalendar_RS', 'PropertyCalendar'],
            (data) => {
                // return data
                return {
                    propertyID: data._attributes.PropertyID,
                    calDay: this.arrayify(data.CalDay).map(day => {
                        const calDayFields = [
                            ['IsBlocked', 'isBlocked'],
                            ['MinStay', 'minStay'],
                            ['Changeover', 'changeover']
                        ]
                        return {
                            date: day._attributes.Date,
                            units: day._attributes.Units,
                            reservations: day._attributes.Reservations,
                            ...this.mapCustomObjects(calDayFields, day)
                        }
                    })
                }
            }
        )
        return requestResponse
    }

    async listPropertyMinStay(propertyID, from, to) {
        this.logMessage(`getting property min stay ${from} thru ${to} for property ${propertyID}`)
        const requestObject = this.pullAvailabilityPricing.listPropertyMinStay(propertyID, from, to, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListPropertyMinStay_RS', 'PropertyMinStay'],
            (data) => {
                // return data
                return {
                    propertyID: data._attributes.PropertyID,
                    minStay: data.MinStay ? this.arrayify(data.MinStay).map(stay => {
                        return {
                            stayLength: stay._text,
                            from: stay._attributes.DateFrom,
                            to: stay._attributes.DateTo
                        }
                    }) : []
                }
            }
        )
        return requestResponse
    }

    async listPropertyPrices(propertyID, from, to, pricingModelMode = 1) {
        this.logMessage(`getting property pricing ${from} thru ${to} for property ${propertyID} using pricing ${pricingModelMode}`)
        const requestObject = this.pullAvailabilityPricing.listPropertyPrices(propertyID, from, to, pricingModelMode, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListPropertyPrices_RS', 'Prices'],
            (data) => {
                // return data
                return {
                    propertyID: data._attributes.PropertyID,
                    seasons: data.Season ? this.arrayify(data.Season).map(season => {
                        const seasonFields = [
                            ['Price', 'price'],
                            ['Extra', 'extra'],
                            ['LOSS', 'loss', (entry) => {
                                return this.arrayify(entry.LOS).map(los => {
                                    const losFields = [
                                        ['Price', 'price'],
                                        ['LOSPS', 'losps', (losps) => {
                                            return this.arrayify(losps.LOSP).map(losp => {
                                                return {
                                                    nrOfGuests: losp._attributes.NrOfGuests,
                                                    price: losp.Price._text
                                                }
                                            })
                                        }],
                                        ['EGPS', 'egps', (egps) => {
                                            return this.arrayify(egps.EGP).map(egp => {
                                                return {
                                                    extraGuests: egp._attributes.ExtraGuests,
                                                    price: egp._text
                                                }
                                            })
                                        }]
                                    ]
                                    return {
                                        nights: los._attributes.Nights,
                                        price: los.Price._text,
                                        ...this.mapCustomObjects(losFields, los)
                                    }
                                })
                            }]
                        ]
                        return {
                            from: season._attributes.DateFrom,
                            to: season._attributes.DateTo,
                            ...this.mapCustomObjects(seasonFields, season)
                        }
                    }) : [],
                    fspSeasons: data.FSPSeasons && data.FSPSeasons.FSPSeason ? this.arrayify(data.FSPSeasons.FSPSeason).map(fspSeason => {
                        const fspSeasonFields = [
                            ['FSPRows', 'fspRows', (fspRows) => {
                                return this.arrayify(fspRows.FSPRow).map(fspRow => {
                                    return {
                                        nrOfGuests: fspRow._attributes.NrOfGuests,
                                        prices: fspRow.Prices && fspRow.Prices.Price ? this.arrayify(fspRow.Prices.Price).map(price => {
                                            return {
                                                nrOfNights: price._attributes.NrOfNights,
                                                price: price._text
                                            }
                                        }) : []
                                    }
                                })
                            }]
                        ]
                        return {
                            date: fspSeason._attributes.Date,
                            defaultPrice: fspSeason._attributes.DefaultPrice,
                            ...this.mapCustomObjects(fspSeasonFields, fspSeason)
                        }
                    }) : []
                }
            }
        )
        return requestResponse
    }

    async getPropertyAVBPrice(propertyID, from, to,) {
        this.logMessage(`getting property AVB price from ${from} thru ${to} for property ${propertyID}`)
        const requestObject = this.pullAvailabilityPricing.getPropertyAVBPrice(propertyID, from, to, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_GetPropertyAvbPrice_RS', 'PropertyPrices'],
            (data) => {
                // return data
                return {
                    propertyID: data._attributes.propertyID,
                    units: data._attributes.Units,
                    propertyPrices: data.PropertyPrice ? this.arrayify(data.PropertyPrice).map(propertyPrice => {
                        return {
                            price: propertyPrice._text,
                            nop: propertyPrice._attributes.NOP,
                            cleaning: propertyPrice._attributes.Cleaning,
                            extraPersonPrice: propertyPrice._attributes.extraPersonPrice,
                            deposit: propertyPrice._attributes.Deposit,
                            securityDeposit: propertyPrice._attributes.SecurityDeposit,
                        }
                    }) : []
                }
            }
        )
        return requestResponse
    }

    async listPropertyDiscounts(propertyID) {
        this.logMessage(`getting property discounts for property ${propertyID}`)
        const requestObject = this.pullAvailabilityPricing.listPropertyDiscounts(propertyID, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListPropertyDiscounts_RS', 'Discounts'],
            (data) => {
                // return data
                const listPropertyDiscountFields = [
                    ['LongStays', 'longStays', (longStays) => {
                        return longStays.LongStay ? this.arrayify(longStays.LongStay).map(longStay => {
                            return {
                                from: longStay._attributes.DateFrom,
                                to: longStay._attributes.DateTo,
                                bigger: longStay._attributes.Bigger,
                                smaller: longStay._attributes.Smaller,
                                percentage: longStay._text
                            }
                        }) : []
                    }],
                    ['LastMinutes', 'lastMinutes', (lastMinutes) => {
                        return lastMinutes.LastMinute ? this.arrayify(lastMinutes.LastMinute).map(lastMinute => {
                            return {
                                from: lastMinute._attributes.DateFrom,
                                to: lastMinute._attributes.DateTo,
                                daysToArrivalFrom: lastMinute._attributes.DaysToArrivalFrom,
                                daysToArrivalTo: lastMinute._attributes.DaysToArrivalTo,
                                percentage: lastMinute._text
                            }
                        }) : []
                    }],
                ]
                return {
                    propertyID: data._attributes.PropertyID,
                    ...this.mapCustomObjects(listPropertyDiscountFields, data)
                }
            }
        )
        return requestResponse
    }

    async getChangeoverDays(propertyID, from, to) {
        this.logMessage(`getting changeover days from ${from} thru ${to} for property ${propertyID}`)
        const requestObject = this.pullAvailabilityPricing.getChangeoverDays(propertyID, from, to, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_GetChangeoverDays_RS', 'Changeover'],
            (data) => {
                // return data
                return data._text
            }
        )
        return requestResponse
    }

    async listPropertyChangeLog(propertyID) {
        this.logMessage(`getting changelog for property ${propertyID}`)
        const requestObject = this.deltaMethods.listPropertyChangeLog(propertyID, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListPropertyChangeLog_RS', 'ChangeLog'],
            (data) => {
                // return data
                return this.mapChangeLogEntry(data)
            }
        )
        return requestResponse
    }

    async listPropertyPriceChanges(propertyID, since) {
        this.logMessage(`getting price changes since ${since} for property ${propertyID}`)
        const requestObject = this.deltaMethods.listPropertyPriceChanges(propertyID, since, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListPropertyPriceChanges_RS', 'PriceChanges'],
            (data) => {
                // return data
                return data.Day ? this.arrayify(data.Day).map(day => {
                    return {
                        day: day._text
                    }
                }) : []
            }
        )
        return requestResponse
    }

    async listPropertyAvailabilityChanges(propertyID, since) {
        this.logMessage(`getting availability changes since ${since} for property ${propertyID}`)
        const requestObject = this.deltaMethods.listPropertyAvailabilityChanges(propertyID, since, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListPropertyAvbChanges_RS', 'AvbChanges'],
            (data) => {
                // return data
                return data.Day ? this.arrayify(data.Day).map(day => {
                    return {
                        day: day._text
                    }
                }) : []
            }
        )
        return requestResponse
    }

    // END LIST FUNCTIONS //////////////////////////////////////////////////////

    // BEGIN PUSH FUNCTIONS ////////////////////////////////////////////////////
    async putBuilding(buildingInfo) {
        this.logMessage(`Pushing building ${buildingInfo.buildingName}`)
        const requestObject = this.pushStaticPropertyData.putBuilding(buildingInfo, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_PutBuilding_RS', 'BuildingID'],
            (data) => {
                // return data
                return {
                    buildingID: data._text
                }
            }
        )
        return requestResponse
    }

    async putOwner(ownerInfo) {
        this.logMessage(`Pushing owner ${ownerInfo.firstName} ${ownerInfo.lastName}`)
        const requestObject = this.pushStaticPropertyData.putOwner(ownerInfo, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_PutOwner_RS', 'OwnerID'],
            (data) => {
                // return data
                return {
                    ownerID: data._text
                }
            }
        )
        return requestResponse
    }

    async putProperty(propertyInfo) {
        this.logMessage(`Pushing property ${propertyInfo.name}`)
        const requestObject = this.pushStaticPropertyData.putProperty(propertyInfo, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_PutProperty_RS'],
            (data) => {
                // return data
                return {
                    status: data.Status ? data.Status._text : 'no status',
                    propertyID: data.ID ? data.ID._text : 'failure'
                }
            }
        )
        return requestResponse
    }

    async setPropertiesStatus(isActive, isArchived, propertyIds) {
        this.logMessage(`Setting property status to Active: ${isActive} Archived: ${isArchived} for ${propertyIds}`)
        const requestObject = this.pushStaticPropertyData.setPropertiesStatus(isActive, isArchived, propertyIds, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_SetPropertiesStatus_RS'],
            (data) => {
                // return data
                return {
                    status: data.Status ? data.Status._text : 'no status'
                }
            }
        )
        return requestResponse
    }

    async putPropertyExternalListing(propertyListingData) {
        this.logMessage(`Setting property external listings for ${propertyListingData}`)
        const requestObject = this.pushStaticPropertyData.putPropertyExternalListing(propertyListingData, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_PutPropertyExternalListing_RS'],
            (data) => {
                // return data
                return {
                    status: data.Status ? data.Status._text : 'no status'
                }
            }
        )
        return requestResponse
    }

    async pushStandardNumberOfGuests(propertyID, guests) {
        this.logMessage(`Pushing standard number of guests to ${guests} for ${propertyID}`)
        const requestObject = this.pushStaticPropertyData.pushStandardNumberOfGuests(propertyID, guests, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_StandardNumberOfGuests_RS'],
            (data) => {
                // return data
                return {
                    status: data.Status ? data.Status._text : 'no status'
                }
            }
        )
        return requestResponse
    }

    async uploadAvailableUnits(propertyID, dates) {
        this.logMessage(`Uploading available units for property ${propertyID} during ${dates}`)
        const requestObject = this.pushAvailabilityPricing.uploadAvailableUnits(propertyID, dates, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_PutAvbUnits_RS'],
            (data) => {
                // return data
                return {
                    status: data.Status ? data.Status._text : 'no status'
                }
            }
        )
        return requestResponse
    }

    async putPrices(propertyID, seasons) {
        this.logMessage(`Uploading pricing for property ${propertyID} during ${seasons}`)
        const requestObject = this.pushAvailabilityPricing.putPrices(propertyID, seasons, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_PutPrices_RS'],
            (data) => {
                // return data
                return this.mapNotifsResponse(data)
            }
        )
        return requestResponse
    }

    async putLongStayDiscounts(propertyID, longStays) {
        this.logMessage(`Uploading long stay discounts for property ${propertyID} for ${longStays}`)
        const requestObject = this.pushAvailabilityPricing.putLongStayDiscounts(propertyID, longStays, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_PutLongStayDiscounts_RS'],
            (data) => {
                // return data
                return this.mapNotifsResponse(data)
            }
        )
        return requestResponse
    }

    async putLastMinuteDiscounts(propertyID, lastMinute) {
        this.logMessage(`Uploading last minute discounts for property ${propertyID} for ${lastMinute}`)
        const requestObject = this.pushAvailabilityPricing.putLastMinuteDiscounts(propertyID, lastMinute, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_PutLastMinuteDiscounts_RS'],
            (data) => {
                // return data
                return this.mapNotifsResponse(data)
            }
        )
        return requestResponse
    }

    async putConfirmedReservations(reservationInfo) {
        this.logMessage(`Creating reservation ${reservationInfo}`)
        const requestObject = this.reservationsLeads.putConfirmedReservations(reservationInfo, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_PutConfirmedReservationMulti_RS'],
            (data) => {
                // return data
                return {
                    status: data.Status ? data.Status._text : 'no status',
                    reservationID: data.ReservationID ? data.ReservationID._text : ''
                }
            }
        )
        return requestResponse
    }

    async cancelReservation(reservationID, reason) {
        this.logMessage(`Cancelling reservation ${reservationID}`)
        const requestObject = this.reservationsLeads.cancelReservation(reservationID, reason, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_CancelReservation_RS'],
            (data) => {
                // return data
                return {
                    status: data.Status ? data.Status._text : 'no status',
                }
            }
        )
        return requestResponse
    }

    async archiveReservation(reservationID, isArchived) {
        this.logMessage(`Archiving reservation ${reservationID} ${isArchived}`)
        const requestObject = this.reservationsLeads.archiveReservation(reservationID, isArchived, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_ArchiveReservation_RS'],
            (data) => {
                // return data
                return {
                    status: data.Status ? data.Status._text : 'no status',
                }
            }
        )
        return requestResponse
    }

    async putLead(leadInfo) {
        this.logMessage(`Adding Lead ${leadInfo}`)
        const requestObject = this.reservationsLeads.putLead(leadInfo, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_PutLead_RS'],
            (data) => {
                // return data
                return {
                    status: data.Status ? data.Status._text : 'no status',
                    reservationID: data.ReservationID ? data.ReservationID._text : ''
                }
            }
        )
        return requestResponse
    }

    async pushModifyStay(reservationID, current, updated, allowOverbooking) {
        this.logMessage(`Updating reservation ${reservationID}`)
        const requestObject = this.reservationsLeads.pushModifyStay(reservationID, current, updated, allowOverbooking, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Push_ModifyStay_RS'],
            (data) => {
                // return data
                return {
                    status: data.Status ? data.Status._text : 'no status'
                }
            }
        )
        return requestResponse
    }

    async listReservations(from, to, locationID) {
        this.logMessage(`listing reservations ${from} thru ${to} for location ${locationID}`)
        const requestObject = this.reservationsLeads.listReservations(from, to, locationID, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListReservations_RS', 'Reservations'],
            (data) => {
                // return data
                return data.Reservation ? this.arrayify(data.Reservation).map(reservationEntry => {
                    return this.mapReservationEntry(reservationEntry)
                }) : []
            }
        )
        return requestResponse
    }

    async listOwnReservations(from, to, locationID) {
        this.logMessage(`listing own reservations ${from} thru ${to} for location ${locationID}`)
        const requestObject = this.reservationsLeads.listOwnReservations(from, to, locationID, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_GetOwnReservations_RS', 'Reservations'],
            (data) => {
                // return data
                return data.Reservation ? this.arrayify(data.Reservation).map(reservationEntry => {
                    return this.mapReservationEntry(reservationEntry)
                }) : []
            }
        )
        return requestResponse
    }

    async getReservationByID(reservationID) {
        this.logMessage(`getting reservation ${reservationID}`)
        const requestObject = this.reservationsLeads.getReservationByID(reservationID, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_GetReservationByID_RS', 'Reservation'],
            (data) => {
                // return data
                return this.mapReservationEntry(data)
            }
        )
        return requestResponse
    }

    async getLeads(from, to, locationID) {
        this.logMessage(`getting leads from ${from} thru ${to} for location ${locationID}`)
        const requestObject = this.reservationsLeads.getLeads(from, to, locationID, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_GetLeads_RS', 'Leads'],
            (data) => {
                // return data
                return data.Lead ? this.arrayify(data.Lead).map(leadEntry => {
                    return this.mapLeadEntry(leadEntry)
                }) : []
            }
        )
        return requestResponse
    }

    async listReservationsMissingPMSMapping(from) {
        this.logMessage(`getting reservations missing pms mapping from ${from}`)
        const requestObject = this.reservationsLeads.listReservationsMissingPMSMapping(from, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListReservationsMissingPMSMapping_RS', 'Reservations'],
            (data) => {
                // return data
                return data.ReservationMissingPMSMapping ? this.arrayify(data.ReservationMissingPMSMapping).map(reservation => {
                    const missingPMSMapping = [
                        ['RUReservationId', 'ruReservationId'],
                        ['ExternalReservationId', 'externalReservationId'],
                        ['RUPropertyId', 'ruPropertyId'],
                        ['PMSPropertyId', 'pmsPropertyId'],
                        ['DateFrom', 'from'],
                        ['DateTo', 'to']
                    ]
                    return this.mapCustomObjects(missingPMSMapping, reservation)
                }) : []
            }
        )
        return requestResponse
    }

    async listReservationsForOwner(from, to, locationID, username) {
        this.logMessage(`listing reservations for owner ${username} from ${from} thru ${to} for location ${locationID}`)
        const requestObject = this.reservationsLeads.listReservationsForOwner(from, to, locationID, username, this.authInfo())
        const requestResponse = await this.makeRequestAndMap(
            requestObject,
            ['Pull_ListReservationsOwnerUser_RS', 'Reservations'],
            (data) => {
                // return data
                return data.Reservation ? this.arrayify(data.Reservation).map(reservationEntry => {
                    return this.mapReservationEntry(reservationEntry)
                }) : []
            }
        )
        return requestResponse
    }


    // END PUSH FUNCTIONS //////////////////////////////////////////////////////

    // core functions of the API
    authInfo() {
        return {
            username: this.username,
            password: this.password
        }
    }

    async makeRequestAndMap(requestJSON, responseChain, mappingFunction) {
        const originalResponse = await this.rentalsUnitedPromise(requestJSON)
        let codeData = {...originalResponse}
        try {
            responseChain.forEach( x => {
                codeData = codeData[x]
            })
            return mappingFunction(codeData)
        } catch(error) {
            throw ({response: originalResponse, error: error.toString()})
        }
    }

    arrayify(dataObject) {
        if(Array.isArray(dataObject)) {
            return dataObject
        } else {
            return dataObject ? [dataObject] : []
        }
    }

    async saveDefinitions(definitionValue, dictionaryCall, responseChain, valueKey, mappingFunction) {
        if(!this.definitions[definitionValue]){
            this.logMessage(`initiating ${definitionValue} code definitions object`)
            this.definitions[definitionValue] = {
                lastCheck: null,
                values: {}
            }
        }
        if(
            this.definitions[definitionValue].lastCheck === null ||
            this.definitions[definitionValue].lastCheck < Date.now() - 7200000
        ) {
            this.logMessage('getting data codes')
            const requestJSON = this.dictionaries[dictionaryCall](this.authInfo())
            const originalResponse = await this.rentalsUnitedPromise(requestJSON)
            let codeData = originalResponse
            try {
                responseChain.forEach( x => {
                    codeData = codeData[x]
                })
                this.logMessage('mapping status codes')
                codeData.forEach(x => {
                    const keyValue = valueKey(x)
                    this.definitions[definitionValue].values[keyValue] = {
                        ...mappingFunction(x)
                    }
                })
                this.definitions[definitionValue].lastCheck = Date.now()
            } catch(error) {
                throw ({response: originalResponse, error: error.toString()})
            }
        }

        return true
    }

    async saveDefinitionsCustom(definitionValue, dictionaryCall, responseChain, mappingFunction) {
        if(!this.definitions[definitionValue]){
            this.logMessage(`initiating ${definitionValue} code definitions object`)
            this.definitions[definitionValue] = {
                lastCheck: null,
                values: {}
            }
        }
        if(
            this.definitions[definitionValue].lastCheck === null ||
            this.definitions[definitionValue].lastCheck < Date.now() - 7200000
        ) {
            this.logMessage('getting data codes')
            const requestJSON = this.dictionaries[dictionaryCall](this.authInfo())
            const originalResponse = await this.rentalsUnitedPromise(requestJSON)
            let codeData = originalResponse
            try {
                responseChain.forEach( x => {
                    codeData = codeData[x]
                })
                this.logMessage('mapping status codes')
                this.definitions[definitionValue].values = {
                    ...mappingFunction(codeData)
                }
                this.definitions[definitionValue].lastCheck = Date.now()
            } catch(error) {
                throw ({response: originalResponse, error: error.toString()})
            }
        }

        return true
    }

    rentalsUnitedPromise(json) {
        this.logMessage('making promise')
        return new Promise((resolve, reject) => {
            axios.post(
                'https://rm.rentalsunited.com/api/Handler.ashx',
                converter.json2xml(json, converterOptions),
                config).then(response => {
                this.logMessage('got response')
                resolve(converter.xml2js(response.data, converterOptions))
            }).catch(err => {
                this.logMessage('there was an error')
                this.logMessage(err)
                reject(err)
            })
        })
    }

    callRentalsUnited(json, callback, fail) {
        axios.post(
            'https://rm.rentalsunited.com/api/Handler.ashx',
            converter.json2xml(json, converterOptions),
            config).then(response => {
            callback(converter.xml2js(response.data, converterOptions))
        }).catch(err => {
            this.logMessage('there was an error')
            this.logMessage(err)
            fail(err)
        })
    }

    // BEGIN COMMON MAPPING FUNCTIONS //////////////////////////////////////////
    mapCustomObjects(mapReference, data) {
        let returnObject = {}
        mapReference.map((entry) => {
            const [value, map, customMap] = entry
            if(data[value]) {
                returnObject[map] = customMap ? customMap(data[value]) : data[value]._text
            }
        })
        return returnObject
    }

    mapLeadEntry(data) {
        const leadEntryMapping = [
            ['ReservationID', 'reservationID'],
            ['ExternalReservationID', 'externalReservationID'],
            ['PropertyID', 'propertyID'],
            ['XmlApartmentID', 'xmlApartmentID'],
            ['DateFrom', 'from'],
            ['DateTo', 'to'],
            ['NumberOfGuests', 'numberOfGuests'],
            ['CustomerInfo', 'customerInfo', (customerInfo) => this.mapCustomer(customerInfo)],
            ['Comments', 'comments'],
            ['Creator', 'creator'],
            ['DateEntered', 'dateEntered'],
            ['Units', 'units'],
            ['IsArchived', 'isArchived'],
            ['ResApaID', 'resApaID']
        ]

        return this.mapCustomObjects(leadEntryMapping, data)
    }

    mapReservationEntry(data) {
        const reservationMapping = [
            ['ReservationID', 'reservationID'],
            ['StatusID', 'statusID'],
            ['LastMod', 'lastMod'],
            ['StayInfos', 'stayInfo', (stayInfo) => {
                const stayInfoMapping = [
                    ['PropertyID', 'propertyID'],
                    ['XMLApartmentID', 'xmlApartmentID'],
                    ['DateFrom', 'from'],
                    ['DateTo', 'to'],
                    ['NumberOfGuests', 'numberOfGuests'],
                    ['Costs', 'costs', (costs) => {
                        const costMapping = [
                            ['RUPrice', 'ruPrice'],
                            ['ClientPrice', 'clientPrice'],
                            ['AlreadyPaid', 'alreadyPaid']
                        ]
                        return this.mapCustomObjects(costMapping, costs)
                    }],
                    ['Comments', 'comments'],
                    ['ResapaID', 'resapaID'],
                    ['Units', 'units'],
                    ['Mapping', 'mapping', (mappingEntry) => {
                        const mappingEntryMapping = [
                            ['ReservationID', 'reservationID'],
                            ['StayID', 'stayID'],
                            ['HotelID', 'hotelID'],
                            ['RoomID', 'roomID'],
                            ['RateID', 'rateID']
                        ]
                        return this.mapCustomObjects(mappingEntryMapping, mappingEntry)
                    }]
                ]
                return stayInfo.StayInfo ? this.arrayify(stayInfo.StayInfo).map(stayEntry => {
                    return this.mapCustomObjects(stayInfoMapping, stayEntry)
                }) : []
            }],
            ['CustomerInfo', 'customerInfo', (customerData) => {
                return this.mapCustomer(customerData)
            }],
            ['Creator', 'creator'],
            ['Comments', 'comments'],
            ['PMSReservationId', 'pmsReservationId'],
            ['CancelTypeID', 'cancelTypeID'],
            ['IsArchived', 'isArchived']
        ]
        return this.mapCustomObjects(reservationMapping, data)
    }

    mapCustomer(data) {
        const customerMapping = [
            ['Name', 'name'],
            ['SurName', 'surName'],
            ['Email', 'email'],
            ['Phone', 'phone'],
            ['MobilePhone', 'mobilePhone'],
            ['SkypeID', 'skypeID'],
            ['Address', 'address'],
            ['ZipCode', 'zipCode'],
            ['CountryID', 'countryID'],
            ['Passport', 'passport', (passport => {
                return passport
            })],
            ['MessagingContactId', 'messaginContactId'],
        ]
        return this.mapCustomObjects(customerMapping, data)
    }

    mapNotifsResponse(data){
        return {
            status: data.Status ? data.Status._text : 'no status',
            notifs: data.Notifs && data.Notifs.Notif ? this.arrayify(data.Notifs.Notif).map(notif => {
                return {
                    from: notif._attributes.DateFrom,
                    to: notif._attributes.DateTo,
                    statusID: notif._attributes.StatusID,
                    notif: notif._text
                }
            }) : []
        }
    }

    mapChangeLogEntry(data) {
        const changeLogFields = [
            ['StaticData', 'staticData'],
            ['Pricing', 'pricing'],
            ['Availability', 'availability'],
            ['Image', 'image'],
            ['Description', 'description']
        ]
        return {
            propertyID: data._attributes.PropertyID,
            nla: data._attributes.NLA,
            isActive: data._attributes.IsActive,
            ...this.mapCustomObjects(changeLogFields, data)
        }
    }

    mapOwnerListEntry(data) {
        const ownerFields = [
            ['_attributes', 'ownerID', (entry) => entry.OwnerID],
            ['FirstName', 'firstName'],
            ['SurName', 'lastName'],
            ['Email', 'email'],
            ['Phone', 'phone'],
            ['ScreenName', 'screenName'],
            ['User', 'userName', (entry) => entry.UserName._text],
            ['UserAccountId', 'userAccountId']
        ]
        return {
            ...this.mapCustomObjects(ownerFields, data)
        }
    }

    mapAgentListEntry(data) {
        const agentFields = [
            ['AgentID', 'agentID'],
            ['UserName', 'userName'],
            ['CompanyName', 'companyName'],
            ['FirstName', 'firstName'],
            ['SurName', 'lastName'],
            ['Emial', 'emial'],
            ['Email', 'email'],
            ['Telephone', 'telephone']
        ]
        return {
            ...this.mapCustomObjects(agentFields, data)
        }
    }

    mapPropertyListEntry(data, fullMap = false) {

        const shortPropertyStuff = [
            ['PUID', 'puid', (entry) => {
                return {
                    buildingID: entry._attributes.BuildingID,
                    text: entry._text
                }
            }],
            ['ID', 'id', (entry) => {
                return {
                    buildingId: entry._attributes.BuildingID,
                    buildingName: entry._attributes.BuildingName,
                    text: entry._text
                }
            }],
            ['Name', 'name'],
            ['OwnerID', 'ownerID'],
            ['DetailedLocationID', 'detailedLocationID', (entry) => {
                return {
                    typeID: entry._attributes.TypeID,
                    text: entry._text
                }
            }],
            ['LastMod', 'lastMod', (entry) => {
                return {
                    nla: entry._attributes.NLA,
                    text: entry._text
                }
            }],
            ['DateCreated', 'dateCreated'],
            ['UserID', 'userId']
        ]

        // begin full property list stuff
        const fullPropertyStuff = [
            ['CleaningPrice', 'cleaningPrice'],
            ['Space', 'space'],
            ['StandardGuests', 'standardGuests'],
            ['CanSleepMax', 'canSleepMax'],
            ['PropertyTypeID', 'propertyTypeID'],
            ['ObjectTypeID', 'objectTypeID'],
            ['NoOfUnits', 'noOfUnits'],
            ['Floor', 'floor'],
            ['Street', 'street'],
            ['ZipCode', 'zipCode'],
            ['LicenseNumber', 'licenseNumber'],
            ['LicenseInfo', 'licenseInfo', (entry) => {
                return {
                    licenceNumber: entry.LicenseNumber._text
                }
            }],
            ['Coordinates', 'coordinates', (entry) => {
                return {
                    latitude: entry.Latitude._text,
                    longitude: entry.Longitude._text,
                }
            }],
            ['ImageCaptions', 'imageCaptions', (entry) => {
                if(entry.ImageCaption) {
                    return this.arrayify(entry.ImageCaption).map((imageCaption) => {
                        return {
                            languageID: imageCaption._attributes.LanguageID,
                            imageReferenceID: imageCaption._attributes.ImageReferenceID,
                            text: imageCaption._text
                        }
                    })
                }
            }],
            ['ArrivalInstructions', 'arrivalInstructions', (entry) => {
                const arrivalInstructionsMap = [
                    ['Landlord', 'landlord'],
                    ['Email', 'email'],
                    ['Phone', 'phone'],
                    ['DaysBeforeArrival', 'daysBeforeArrival'],
                    ['PickupService', 'pickupService', (pickupText) => {
                        if(pickupText.Text) {
                            return this.arrayify(pickupText.Text).map((pickupEntry) => {
                                return {
                                    languageID: pickupEntry._attributes.LanguageID,
                                    text: pickupEntry._cdata
                                }
                            })
                        } else {
                            return []
                        }

                    }],
                    ['HowToArrive', 'howToArrive', (arriveText) => {
                        if(arriveText.Text) {
                            return this.arrayify(arriveText.Text).map((arriveEntry) => {
                                return {
                                    languageID: arriveEntry._attributes.LanguageID,
                                    text: arriveEntry._cdata
                                }
                            })
                        } else {
                            return []
                        }
                    }],
                ]
                return {
                    ...this.mapCustomObjects(arrivalInstructionsMap, entry)
                }
            }],
            ['CheckInOut', 'checkInOut', (entry) => {
                const checkInOutMap = [
                    ['CheckInFrom','checkInFrom'],
                    ['CheckInTo','checkInTo'],
                    ['Place','place'],
                    ['LateArrivalFees','lateArrivalFees', (lateFee) => {
                        if(lateFee.LateArrivalFee) {
                            return this.arrayify(lateFee.LateArrivalFee).map((lateFeeEntry) => {
                                return {
                                    id: lateFeeEntry._attributes.ID,
                                    from: lateFeeEntry._attributes.From,
                                    to: lateFeeEntry._attributes.To,
                                    lateArrivalFee: lateFeeEntry._text
                                }
                            })
                        } else {
                            return []
                        }
                    }],
                    ['EarlyDepartureFees', 'earlyDepartureFees', (entry) => {
                        if(entry.EarlyDepartureFee) {
                            return this.arrayify(entry.EarlyDepartureFee).map((earlyDepartureFeeEntry) => {
                                return {
                                    from: earlyDepartureFeeEntry._attributes.From,
                                    to: earlyDepartureFeeEntry._attributes.To,
                                    earlyDepartureFee: earlyDepartureFeeEntry._text
                                }
                            })
                        } else {
                            return []
                        }
                    }]
                ]
                return {
                    ...this.mapCustomObjects(checkInOutMap, entry)
                }
            }],
            ['Deposit', 'deposit', (entry) => {
                return {
                    depositTypeID: entry._attributes.DepositTypeID,
                    text: entry._text
                }
            }],
            ['SecurityDeposit', 'securityDeposit', (entry) => {
                return {
                    depositTypeID: entry._attributes.DepositTypeID,
                    text: entry._text
                }
            }],
            ['IsActive', 'isActive'],
            ['IsArchived', 'isArchived'],
            ['Distances', 'distances', (entry) => {
                if (entry.Distance) {
                    return this.arrayify(entry.Distance).map((distanceEntry) => {
                        return {
                            destinationID: distanceEntry.DestinationID._text,
                            distanceUnitID: distanceEntry.DistanceUnitID._text,
                            distanceValue: distanceEntry.DistanceValue._text
                        }
                    })
                } else {
                    return []
                }
            }],
            ['CompositionRoomsAmenities', 'compositionRoomsAmenities', (entry) => {
                return this.arrayify(entry.CompositionRoomAmenities).map((compositionRoomEntry) => {
                    return {
                        compositionRoomID: compositionRoomEntry._attributes.CompositionRoomID,
                        amenities: compositionRoomEntry.amenities
                    }
                })
            }],
            ['CompositionRooms', 'compositionRooms', (entry) => {
                return this.arrayify(entry.CompositionRoom).map((compositionRoomEntry) => {
                    return {
                        compositionRoomID: compositionRoomEntry._text,
                        count: compositionRoomEntry._attributes.Count
                    }
                })
            }],
            ['Amenities', 'amenities', (entry) => {
                return this.arrayify(entry.Amenity).map(amenity => {
                    return {
                        amenity: amenity._text,
                        count: amenity._attributes.Count ? amenity._attributes.Count : 1
                    }
                })
            }],
            ['Images', 'images', (entry) => {
                return this.arrayify(entry.Image).map(image => {
                    return {
                        image: image._text,
                        imageTypeID: image._attributes.ImageTypeID,
                        imageReferenceID: image._attributes.ImageReferenceID
                    }
                })
            }],
            ['PaymentMethods', 'paymentMethods', (entry) => {
                return this.arrayify(entry.PaymentMethod).map((paymentMethod) => {
                    return {
                        paymentMethodID: paymentMethod._attributes.PaymentMethodID,
                        paymentMethod: paymentMethod._cdata
                    }
                })
            }],
            ['CancellationPolicies', 'cancellationPolicies', (entry) => {
                return this.arrayify(entry.CancellationPolicy).map((cancellationPolicy) => {
                    return {
                        id: cancellationPolicy._attributes.ID,
                        validFrom: cancellationPolicy._attributes.ValidFrom,
                        validTo: cancellationPolicy._attributes.ValidTo,
                        cancellationPolicy: cancellationPolicy._text
                    }
                })
            }],
            ['Descriptions', 'description', (entry) => {
                return this.arrayify(entry.Description).map((description) => {
                    return {
                        languageID: description._attributes.LanguageID,
                        text: description.Text ? description.Text._cdata : '',
                        image: description.Image ? description.Image._text : ''
                    }
                })
            }],
            ['AdditionalFees', 'additionalFees', (entry) => {
                return this.arrayify(entry.AdditionalFee).map((additionalFee) => {
                    return {
                        order: additionalFee._attributes.Order,
                        discriminatorID: additionalFee._attributes.DiscriminatorID,
                        kindID: additionalFee._attributes.KindID,
                        name: additionalFee._attributes.Name,
                        optional: additionalFee._attributes.Optional,
                        refundable: additionalFee._attributes.Refundable,
                        feeTaxType: additionalFee._attributes.FeeTaxType,
                        collectTime: additionalFee._attributes.CollectTime,
                        value: additionalFee.Value._text
                    }
                })
            }]
        ]

        const propertyListEntry = {
            ...this.mapCustomObjects(shortPropertyStuff,data),
            ...(fullMap ? this.mapCustomObjects(fullPropertyStuff,data) : {})
        }
        // end full property list stuff
        return propertyListEntry
    }
    // END COMMON MAPPING FUNCTIONS ////////////////////////////////////////////
}

module.exports = RentalsUnitedConnector

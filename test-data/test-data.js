const sampleSeasons = [
    {
        from: '2020-01-03',
        to: '2020-01-05',
        price: 100,
        extra: 50
    },
    {
        from: '2020-01-06',
        to: '2020-01-09',
        price: 100,
        extra: 50,
        egps: [
            {
                extraGuests: 1,
                price: 10
            },
            {
                extraGuests: 2,
                price: 20
            },
        ]
    },
    {
        from: '2020-01-10',
        to: '2020-01-14',
        price: 300,
        extra: 20,
        loss: [
            {
                nights: 1,
                price: 10
            },
            {
                nights: 2,
                price: 20,
                losps: [
                    {
                        nrOfGuests: 10,
                        price: 90
                    }
                ]
            },
        ]
    },
    {
        from: '2020-01-10',
        to: '2020-01-14',
        price: 300,
        extra: 20,
        loss: [
            {
                nights: 1,
                price: 10
            },
            {
                nights: 2,
                price: 20,
                losps: [
                    {
                        nrOfGuests: 10,
                        price: 90
                    }
                ]
            },
        ],
        egps: [
            {
                extraGuests: 1,
                price: 10
            },
            {
                extraGuests: 2,
                price: 20
            },
        ]
    },
]

const sampleProperty = {
	puid: {
		buildingID: 12345,
		text: 'Kendall wood Villas building b'
	},
	name: 'Chews House',
	ownerID: '565784',
	detailedLocationID: {
		typeID: 1,
		text: '5376'
	},
	isActive: true,
	isArchived: false,
	cleaningPrice: 10,
	space: 45,
	standardGuests: 3,
	canSleepMax: 5,
	propertyTypeID: 1,
	floor: 2,
    street: '10477 sw 108 ave',
    zipCode: '33176',
    coordinates: {
        longitude: -80.3715255,
        lattitude: 25.6713131
    },
    distances: [
        {
            destinationID: 5376,
            distanceUnitID: 1,
            distanceValue: 10
        }
    ],
    compositionRooms: [
        {
            count: 1,
            compositionRoomID: 81
        },
        {
            count: 1,
            compositionRoomID: 257
        }
    ],
    amenities: [
        {
            count: 2,
            amenity: 8
        },
        {
            amenity: 2
        }
    ],
    images: [
        {
            imageTypeID: 1,
            image: 'http://www.domain.com/1.jpg'
        }
    ],
    arrivalInstructions: {
        landord: 'John Smith',
        email: 'john.smith@domain.com',
        phone: '+1 305 661 5526',
        daysBeforeArrival: 2,
        howToArrive: [
            {
                languageID: 1,
                text: 'Information on arriving in english'
            },
            {
                languageID: 2,
                text: 'Information on arriving in German'
            }
        ],
        pickupService: [
            {
                languageID: 1,
                text: 'Information about pickup service in english'
            }
        ]
    },
    checkInOut: {
        checkInFrom: '10:00',
        checkInTo: '13:00',
        checkOutUntil: '09:00',
        place: 'apartment',
        lateArrivalFees: [
            {
                from: '13:00',
                to: '20:00',
                lateArrivalFee: 10.00,
            },
            {
                from: '20:00',
                to: '01:00',
                lateArrivalFee: 30.00,
            }
        ],
        earlyDepartureFees: [
            {
                from: '03:00',
                to: '05:00',
                earlyDepartureFee: 30
            },
            {
                from: '05:00',
                to: '13:00',
                earlyDepartureFee: 25
            }
        ]
    },
    paymentMethods: [
        {
            paymentMethodID: 1,
            paymentMethod: 'Account number: 000000000000000'
        },
        {
            paymentMethodID: 2,
            paymentMethod: 'Visa/MasterCard'
        }
    ],
    deposit: {
        depositTypeID: 3,
        text: 15.00
    },
    cancellationPolicies: [
        {
            validFrom: 0,
            validTo: 3,
            cancellationPolicy: 100
        },
        {
            validFrom: 4,
            validTo: 10,
            cancellationPolicy: 50
        }
    ],
    descriptions: [
        {
            languageID: 1,
            text: 'description in english'
        },
        {
            languageID: 2,
            image: 'http://YourServer/GermanDescription.jpg'
        },
        {
            languageID: 3,
            text: 'description in polish',
            image: 'http://YourServer/PolishDescription.jpg'
        }
    ],
    securityDeposit: {
        deposityTypeID: 5,
        text: 85
    },
    additionalFees: [
        {
            feeTaxType: 1,
            discriminatorID: 1,
            order: 0,
            value: 50.05
        },
        {
            feeTaxType: 1,
            discriminatorID: 4,
            order: 1,
            value: 0.1244
        }
    ],
    licenseInfo: {
        licenseNumber: 'License_Number'
    }

}

const sampleReservation = {
    stayInfo: [
        {
            propertyID: '1',
            from: '2012-03-02',
            to: '2012-03-14',
            numberOfGuests: 3,
            costs: {
                ruPrice: 120,
                clientPrice: 140,
                alreadyPaid: 0
            }
        },
        {
            propertyID: '4',
            from: '2012-03-02',
            to: '2012-03-14',
            numberOfGuests: 3,
            costs: {
                ruPrice: 120,
                clientPrice: 140,
                alreadyPaid: 0
            }
        }
    ],
    customerInfo: {
        name: 'Joe',
        surName: 'Smith',
        email: 'joe.smith@farts.com',
        phone: '555-555-5555',
        skypeID: 'joeblows',
        address: '12345 fake st',
        zipCode: 33333,
        languageID: 1,
        countryID: 42
    },
    creditCard: {
        ccNumber: 000000000000000,
        cvc: 123,
        nameOnCard: 'Joe Smith',
        expiration: '12/2020',
        billingAddress: '12345 bull street',
        cardType: 'VISA',
        comments: 'comments about credit card info'
    },
    comments: 'this is a comment',
    quoteModeId: 2
}

const sampleLead = {
    externalLeadID: '123_asd_123',
    propertyID: '12345',
    from: '2020-06-10',
    to: '2020-06-15',
    numberOfGuests: 2,
    customerInfo: {
        name: 'Joe',
        surName: 'Smith',
        email: 'joe.smith@farts.com',
        phone: '555-555-5555',
        skypeID: 'joeblows',
        address: '12345 fake st',
        zipCode: 33333,
        languageID: 1,
        countryID: 42
    },
    comments: 'comment section here.'
}


module.exports = {
    sampleSeasons,
    sampleProperty,
    sampleReservation
}

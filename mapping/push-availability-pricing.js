const createAuthentication = require('./authentication').createAuthentication;

// Use this method to upload availability, minimum stay and changeover for a property and specified date ranges
// if property is multiunit, you can set the number of available units
/*
**    {
**         from: YYYY-MM-DD,
**         to: YYYY-MM-DD ,
**         u: number of available units,
**         ms: minimum length of stay
**         c: changeover type id
**    }
*/
// pass in property Id
function uploadAvailableUnits(propertyID, dates, authInfo) {
    return {
        Push_PutAvbUnits_RQ: {
            ...createAuthentication(authInfo),
            MuCalendar: {
                _attributes: {
                    PropertyID: propertyID
                },
                Date: dates.map(x => {
                    return {
                        _attributes: {
                            From: x.from,
                            To: x.to
                        },
                        U: {
                            _text: x.u
                        },
                        MS: {
                            _text: x.ms
                        },
                        C: {
                            _text: x.c
                        }
                    }
                })
            }
        }
    }
}

// Use this method to upload rates for specified date ranges.
// only send dates that you wish to overwrite
/*
**    seasons: {
**         from: YYYY-MM-DD,
**         to: YYYY-MM-DD ,
**         price: price per night,
**         extra: extra fee for each guest above the standard number of guests,
**         egps: OPTIONAL array of prices based on extra guests -
                [
                    {
                        extraGuests: number of extra guests,
                        price: price for extra guests
                    }
                ],
            loss: OPTIONAL length of stay based pricing -
                [
                    {
                        nights: number of nights,
                        price: price,
                        losps: OPTIONAL pricing based on the number of guests -
                            [
                                {
                                    nrOfGuests: number of guests,
                                    price: price
                                }
                            ]
                    }
                ]
**
  }

    fspSeasons: {
        date: YYYY-MM-DD,
            defaultPrice: default price for day,
            fspRows: [
                {
                    nrOfGuests: number of guests,
                    prices: [
                        {
                            nrOfNights: number of nights,
                            price: the price for the full stay during those nights
                        }
                    ]
                }
            ]
    }
*/
// pass in property Id
// pricing is an object with either seasons array or fspSeasons
/*
{
    seasons: [see reference above to entry example],
    fspSeasons: [see reference above for entry example]
}
*/
function putPrices(propertyID, pricing, authInfo) {
    const pricesEntry = {
        _attributes: {
            PropertyID: propertyID
        }
    }
    if(pricing.seasons) {
        pricesEntry.Season = pricing.seasons.map(x => {
            const prices = {
                _attributes: {
                    DateFrom: x.from,
                    DateTo: x.to
                },
                Price: {
                    _text: x.price
                },
                Extra: {
                    _text: x.extra
                }
            }

            if (x.egps && x.egps.length > 0) {
                prices.EGPS = {
                    EGP: x.egps.map(y => {
                        return {
                            _attributes: {
                                ExtraGuests: y.extraGuests
                            },
                            Price: {
                                _text: y.price
                            }
                        }
                    })
                }
            }

            if (x.loss && x.loss.length > 0) {
                prices.LOSS = {
                    LOS: x.loss.map(y => {
                        const los = {
                            _attributes: {
                                Nights: y.nights
                            },
                            Price: {
                                _text: y.price
                            },
                        }

                        if (y.losps && y.losps.length > 0) {
                            los.LOSPS = {
                                LOSP: y.losps.map(z => {
                                    return {
                                        _attributes: {
                                            NrOfGuests: z.nrOfGuests
                                        },
                                        Price: {
                                            _text: z.price
                                        }
                                    }
                                })
                            }
                        }
                        return los
                    })
                }
            }

            return prices
        })
    }

    if(pricing.fspSeasons) {
        pricingEntry.FSPSeasons = {
            FSPSeason: pricing.fspSeasons.map(f => {
                return {
                    _attributes: {
                        Date: f.date,
                        DefaultPrice: f.defaultPrice
                    },
                    FSPRows: {
                        FSPRow: f.fspRows.map(r => {
                            return {
                                _attributes: {
                                    NrOfGuests: r.nrOfGuests
                                },
                                Prices: {
                                    Price: r.prices.map(p => {
                                        return {
                                            _attributes: {
                                                NrOfNights: p.nrOfNights
                                            },
                                            _text: p.price
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }
    }

    console.log(pricesEntry)

    return {
        Push_PutPrices_RQ: {
            ...createAuthentication(authInfo),
            Prices: pricesEntry
        }
    }
}

// Use this method to put long stay discounts on a property
// pass in an array of long stay items
/*
    {
        from: YYYY-MM-DD,
        to: YYYY-MM-DD,
        bigger: maximum length of stay up to 180,
        smaller: minimum length of stay,
        percentage: percentage
    }
*/
function putLongStayDiscounts(propertyID, longStayDiscounts, authInfo) {
    return {
        Push_PutLongStayDiscounts_RQ: {
            ...createAuthentication(authInfo),
            LongStays: {
                _attributes: {
                    PropertyID: propertyID
                },
                LongStay: longStayDiscounts.map(x => {
                    return {
                        _attributes: {
                            DateFrom: x.from,
                            DateTo: x.to,
                            Bigger: x.bigger,
                            Smaller: x.smaller,
                        },
                        _text: x.percentage
                    }
                })
            }
        }
    }
}

// Use this method to put last minute discounts
// pass in an array discounts
/*
    {
        from: YYYY-MM-DD,
        to: YYYY-MM-DD,
        daysToArrivalFrom: minimum number of days from arrival,
        daysToArrivalTo: maximum number of days from arrival,
        percentage: percentage discount
    }
*/
function putLastMinuteDiscounts(propertyID, lastMinuteDiscounts, authInfo) {
    return {
        Push_PutLastMinuteDiscounts_RQ: {
            ...createAuthentication(authInfo),
            LastMinutes: {
                _attributes: {
                    PropertyID: propertyID
                },
                LastMinute: lastMinuteDiscounts.map(x => {
                    return {
                        _attributes: {
                            DateFrom: x.from,
                            DateTo: x.to,
                            DaysToArrivalFrom: x.daysToArrivalFrom,
                            DaysToArrivalTo: x.daysToArrivalTo,
                        },
                        _text: x.percentage
                    }
                })
            }
        }
    }
}

module.exports = {
    uploadAvailableUnits,
    putPrices,
    putLongStayDiscounts,
    putLastMinuteDiscounts
}

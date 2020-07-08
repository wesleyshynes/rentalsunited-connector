# Rentals United connector

This project was made to make connecting your node js project to the rentals united api easier.

to initiate

```
const RentalsUnitedConnector = require('../mapping/rentals-united-connector');
const ru = new RentalsUnitedConnector({
    username: username@somewhere.com,
    password: something123,
    debug: true // optional
})

async function sampleCall () {
    // pass in arguments if necessary
    const sampleResponse = await ru.checkStatus(0)

    return sampleResponse
}

// this wraps the call in a try catch block and provides information if an error occurred
async function safeSampleCall () {
    // first argument is the function you want to use, second argument is an optional array of values
    const sampleResponse = await ru.makeCall('checkStatus', [0])

    return sampleResponse
}

```

const createAuthentication = require('./authentication').createAuthentication;

// lists the users created
function listCreatedUsers(authInfo) {
    return {
        Pull_ListMyUsers_RQ: {
            ...createAuthentication(authInfo)
        }
    }
}

// lists the users created
/*
    {
        firstName: user first name,
        lastName: user last name,
        email: user email,
        password: user password,
        locationID: location id of the user
    }
*/
function createUser(userInfo, authInfo) {
    return {
        Push_CreateUser_RQ: {
            ...createAuthentication(authInfo),
            FirstName: userInfo.firstName,
            LastName: userInfo.lastName,
            Email: userInfo.email,
            Password: userInfo.password,
            Location: {
                LocationID: userInfo.locationID
            }
        }
    }
}


module.exports = {
    listCreatedUsers,
    createUser
}

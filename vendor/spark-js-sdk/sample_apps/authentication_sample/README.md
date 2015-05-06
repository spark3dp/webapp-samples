## Authentication Example

This example has two components: the authentication server, and the frontend server.

You must have both servers running for the example to work.

Once both servers are running, you should be able to see the sample at `http://localhost:8000`. This sample simply
displays the tokens that the SDK knows about and allows you to login, logout, and get a guest token.

### Setup
For this sample, you'll need to have an app registered on the spark developer portal. This can be done
[here](https://spark.autodesk.com/developers/myApps). Once you have your app setup, set the callback URl to
`http://localhost:8000/index.html`. Make sure you have [node.js](http://nodejs.org) and npm installed.

## Authentication Server
The authentication server stores your app secret and handles the exchange of the secret for various tokens from the
API server.

#### Setup
Modify `authenticationServer/config.js` to include you app's key and secret as instructed in the comments.

Run `npm install` from within the `authenticationServer` directory. This will install the required node modules for this
server.

#### How to Run
Run `node server.js` to start the server on port 3000.

## Frontend Server
The frontend server is what serves your app. It communicates with your authentication server to get access tokens but for
other API calls, it communicates with the spark platform directly.

#### Setup
Modify `frontendServer/public/index.html` as instructed in the comments.

Run `npm install` from within the `frontendServer` directory. This will install the required node modules for this
server.

#### How to Run
Run `node server.js` from within the `frontendServer` directory to start the server on port 8000.

In your browser, navigate to `localhost.autodesk.com:8000`.

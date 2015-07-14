Web App Samples
========================
### Introduction
These applications demonstrate Spark's cloud based 3D model storage, mesh preparation and 3D printing and can also provide an example of the Spark OAuth 2.0 procedure.

### Required setup before running the sample code
1. Clone the software repository (copy its files) to a folder on your web server. 
2. If you have not already done so, define an app on the Spark Developers portal at https://spark.autodesk.com/developers/myApps.
3. In the API Keys tab of the app registration, enter the fully qualified URL of the sample's plugins/login/login-callback.html file (do not use a relative path).
4. Copy the app key for later use.
5. If you are not using the advanced 3-legged auth flow, skip to step 8.
6. Copy the app secret for later use.
7. For the 3-legged authentication flow, you need to run a server. This repo is provided with a nodejs server. To run it you should:
  * Copy server/nodejs/config.example.js to server/nodejs/config.js and enter your app key and secret.
  * Install nodejs and then:
  ```sh
  $ sudo npm -g install grunt-cli
  $ cd server/nodejs
  $ npm install
  $ node server.js
  ```
  * Now you have a server running on port 3000. You can check it by going to http://your-server.com:3000.
8. Initialize your app - see info in the "Quick Start" section.


### Quick Start
* <b>Include the SDK library in your HTML page</b> just before closing the body section (`</body>`).

```HTML
<script type="text/javascript" src="//code.spark.autodesk.com/autodesk-spark-sdk-0.1.0.min.js"></script>
```

* After including the SDK library, the method ADSKSpark.Client.initialize() must be used to initialize and setup the SDK:<br>
For the 3-legged authentication flow, the SDK requires that authentication API requests are called from a server. For example the guest token URL could be <i>http://example.com/guest_token</i>.

```JavaScript
ADSKSpark.Client.initialize(
  '<app key>', //A string containing your Spark app key, provided during registration.
  '<is production>', //(Optional - true/false) Whether we work in production or sandbox environment - default is sandbox
  '<redirect uri>', // (Optional) The redirect URI for the auth service (i.e. http://example.com/callback), in cases where it is different than the one that was set for your app's Callback URL
  '<guest token URL>', //(Optional) The server URL to which guest token requests will be directed, for example http://example.com/guest_token. The SDK requires that authentication APIs are called from a server.
  '<access token URL>', //(Optional) The server URL to which access token requests will be directed, for example http://example.com/access_token.
  '<refresh access token URL>' //(Optional) The server URL to which refresh access token requests will be directed.
);
```

#### Sample code

```HTML
<!DOCTYPE html>
<html>
  <head>
	<title>Sample Code</title>
	<meta charset="utf-8">
  </head>
  <body>
    <div class="content">
        <a onclick="login()">Login</a>
        <br/>
        <a onclick="getGuestToken()">Get a guest token</a>
    </div>

    <script type="text/javascript" src="//code.spark.autodesk.com/autodesk-spark-sdk-0.1.0.min.js"></script>
    <script>
      ADSKSpark.Client.initialize(
              '',// Your app key
              false,
              'http://localhost/webapp-samples/plugins/login/login-callback.html', // (Optional) The redirect URI for the auth service (i.e. http://example.com/callback), if it is different to the one that was set for your app's Callback URL
              'http://localhost:3000/guest_token',// The guest token endpoint implemented by your server (i.e. http://example.com/guest_token)
              'http://localhost:3000/access_token',// The access token endpoint implemented by your server (i.e. http://example.com/access_token)
              'http://localhost:3000/refresh_token'// The refresh access token endpoint implemented by your server (i.e. http://example.com/refresh_token)
      );

      	/**
      	 * Open login window
      	 */
      	function login() {
      		ADSKSpark.Client.openLoginWindow();
      	}

      	function logout(){
      		ADSKSpark.Client.logout();
      		location.reload();
      	}

      	function getGuestToken(){
      		ADSKSpark.Client.getGuestToken().then(function(guestToken) {
      			console.log('guest token: ',guestToken);
      		});
      	}


      	if (ADSKSpark.Client.isAccessTokenValid()) {
      		console.log('access token: ',ADSKSpark.Client.getAccessToken());
            ADSKSpark.Members.getMyProfile().then(function(response){
              console.log('Current logged in member is: ', response.member);
            });
      	}

    </script>
  </body>
</html>
```

A sever side authentication process, fetching an access_token and guest_token, is required
for your application to work. You can utilize one of the server implementations that are supplied in this repository.

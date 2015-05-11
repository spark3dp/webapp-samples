Sample-App-Auth-Drive-JS
========================
### Introduction
This sample application provides an introduction to working with the Spark OAuth 2.0 process and examples of Spark APIs functionalities.

### Required setup before running the sample code
1. Clone the software repository (copy its files) to a folder on your web server. 
2. If you have not already done so, define an app on the Spark Developers portal at https://spark.autodesk.com/developers.
3. In the API Keys tab of the app registration, enter the fully qualified URL of the sample's plugins/login/login-callback.html file (do not use a relative path).
4. Copy the app key and app secret for later use.
5. You need to run a server. This repo is provided with a nodejs server. To run it you should:
  * Copy server/nodejs/config.example.js to server/nodejs/config.js and set your app's key and secret there.
  * Install nodejs and then:
  ```sh
  $ sudo npm -g install grunt-cli
  $ cd server/nodejs
  $ npm install
  $ node server.js
  ```
  * Now you have a server running on port 3000. You can check it by going to <your-server.com>:3000
6. Initialize your app - see info in the "Quick Start" section


### Quick Start
You can use the lastest published version of the SDK [here](http://spark-sdks.s3.amazonaws.com/autodesk-spark-sdk-latest.min.js)

To use the SDK you should include the SDK library in your HTML page right befory the closing </body>.

```HTML
<script type="text/javascript" src="//spark-sdks.s3.amazonaws.com/autodesk-spark-sdk-latest.min.js"></script>
```

Then you would have to initialize the SDK client with your credentials and choose the environment between sandbox and production:

```JavaScript
	ADSKSpark.Client.initialize('',// Your app key
			'',// The guest token endpoint that is implemented by your server (i.e. http://example.com/guest_token)
			'',// The access token endpoint that is implemented by your server (i.e. http://example.com/access_token)
			ADSKSpark.Constants.API_HOST_SANDBOX // api host - API_HOST_PRODUCTION or API_HOST_SANDBOX
	);
```

The current authentication process is using a server side that handles the fetching of access_token and guest_token. These are required
so that your application will work. You can utilize one of the server implementations that are supplied in this repository.

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

    </div>

    <script type="text/javascript" src="//spark-sdks.s3.amazonaws.com/autodesk-spark-sdk-latest.min.js"></script>
    <script>
      ADSKSpark.Client.initialize('',// Your app key
              '',// The guest token endpoint that is implemented by your server (i.e. http://example.com/guest_token)
              '',// The access token endpoint that is implemented by your server (i.e. http://example.com/access_token)
              ADSKSpark.Constants.API_HOST_SANDBOX // api host - API_HOST_PRODUCTION or API_HOST_SANDBOX
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

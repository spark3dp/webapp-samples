 Implicit Login flow
========================
### Introduction
These sample code demonstrate Spark's Implicit login authentication based on OAuth2 protocol.

### Prerequisites
* A registered application on <a href="https://spark.autodesk.com/developers/" target="_blank">Spark Developer Portal</a>. For more information see the <a href="https://spark.autodesk.com/developers/reference/introduction/tutorials/register-an-app" target="_blank">tutorial</a>.


### Installation
* Include the SDK library in your HTML page just before closing the body section (`</body>`).

```HTML
<script type="text/javascript" src="//code.spark.autodesk.com/autodesk-spark-sdk-0.1.0.min.js"></script>
```


### Quick Start
##### Step 1 - Initialize Client
We need to initialize the SDK JS Client with the APP_KEY that was provided during registration.

```JavaScript

ADSKSpark.Client.initialize('<your-app-key>'));
```

##### Step 2 - Login dialog
We need to call the login dialog window to allow user to enter his credentials.

```JavaScript


	/**
	 * Open login window
	 */
	function login() {
		ADSKSpark.Client.openLoginWindow();
	}
```

##### Step 3 - Handle Login access token callback
The access token will be returned to:
1. The page you are calling the login window from (<b>this is the way the sample code uses by default</b>).<br>
2. The redirect URL you supplied when initialize (see Additional Configuration section).<br>
3. The  callback URL you defined when registered your app.<br>

```JavaScript

ADSKSpark.Client.completeLogin(false).then(function (token) {
		if (token) {
			if (window.opener) {

				window.opener.location.reload(true);
				//close the login window
				window.close();
			} else {
				window.parent.location.reload();
			}
		} else {
			console.error('Problem with fetching token');
		}

	});
```

### Additional Configuration
##### Adding an Options configuration
We can add additional optional parameters to our initialization method

```JavaScript
 var options = {
isProduction:false, //(Optional - true/false) Whether we work in production or sandbox environment default to sandbox
redirectUri: '',// (Optional) The redirect URI for the auth service (i.e. http://example.com/callback), in cases where it is different than the one that was set for your app's Callback URL
guestTokenUrl: '',//(Optional) The server URL to which guest token requests will be directed, for example http://example.com/guest_token.
accessTokenUrl: '',//(Optional) The server URL to which access token requests will be directed, for example http://example.com/access_token.
refreshTokenUrl: ''//(Optional) The server URL to which refresh access token requests will be directed.
    };

ADSKSpark.Client.initialize('<your-app-key>',options);
```
<b>isProduction</b> - We can have an Application on Sandbox environment or on Production environment, this parameter sets the init of the Client to the desired environment.<br>
<i>Note!</i>  each environment needs different APP_KEY.

<b>redirectUri</b> - This is the redirect uri we set for the authentication access_token to return to.
it should match the registered URL we set for the Application.
If no redirectUri supplied we calculate by default the URL of the page we got from to the login dialog.

### Complete Sample Code
```HTML

 <!DOCTYPE html>
<html lang="en">
<head>
	<title>Spark Sample Application - Implicit login</title>
	<meta charset="utf-8">
	<!-- Bootstrap core CSS -->
	<link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">
</head>

<body>

<div class="container">
	<div class="col-md-12">
		<p class="token-wrapper" id="access-token">Access Token: <b id="access-token-span">none</b></p>
		<a onclick="login()" id="login" class="btn btn-primary">Login to Get an Access Token (Implicit)</a>
		<a onclick="logout()" id="logout" class="btn btn-primary">Logout</a>
	</div>
</div>

<script type="text/javascript" charset="utf-8" src="//code.jquery.com/jquery-2.1.3.min.js"></script>
<!-- include the SPARK JS SDK -->
<script type="text/javascript" src="//code.spark.autodesk.com/autodesk-spark-sdk-0.1.0.min.js"></script>
<script>

	// Initialize Spark client
	ADSKSpark.Client.initialize('<your-app-key>');

	/**
	 * Open login window
	 */
	function login() {
		ADSKSpark.Client.openLoginWindow();
	}

	/**
	 * Logout button function
	 */
	function logout() {
		ADSKSpark.Client.logout();
		location.reload();
	}

	/**
	 * Complete the login flow after the redirect from Authentication.
 	 */
	ADSKSpark.Client.completeLogin(false).then(function (token) {
		// Get the access_token
		if (token) {
			if (window.opener) {

				window.opener.location.reload(true);
				//close the login window
				window.close();
			} else {
				window.parent.location.reload();
			}
		} else {
			console.error('Problem with fetching token');
		}

	}, function (error) {
		console.error(error);
	});

	// Checks on load/reload if the Access_token exist at the local storage.
	if (ADSKSpark.Client.isAccessTokenValid()) {
		$('#access-token-span').text(ADSKSpark.Client.getAccessToken());
		$('#login').hide();
		$('#logout').css('display', 'inline-block');
	}
</script>
</body>
</html>

```





 Implicit Login flow
========================
### Introduction
These sample code demonstrate Spark's Implicit login authentication based on OAuth2 protocol.

### Prerequisites
* A registered application on <a href="https://spark.autodesk.com/developers/" target="_blank">Spark Developer Portal</a>. For more information see the <a href="https://spark.autodesk.com/developers/reference/introduction/tutorials/register-an-app" target="_blank">tutorial</a>.


### Installation
* <b>Include the SDK library in your HTML page</b> just before closing the body section (`</body>`).

```HTML
<script type="text/javascript" src="//code.spark.autodesk.com/autodesk-spark-sdk-0.1.0.min.js"></script>
```


### Quick Start
<b>Step 1 - Initialize Client</b>
We need to initialize the SDK JS Client with the APP_KEY that was provided during registration.

```JavaScript

ADSKSpark.Client.initialize(APP_KEY);
```

<b>Step 2 - Login dialog</b>
We need to call the login dialog window to allow user to enter his credentials.

```JavaScript

ADSKSpark.Client.openLoginWindow();
```

<b>Step 3 - Handle Login access token callback</b>
The access token will be returned to:
1. The registered callback you defined when registered your app.
2. The redirect uri you supplied when initialize (see Advanced Features).
3. The page you are calling the login window from (<b>this is the way the sample code uses by default</b>).


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

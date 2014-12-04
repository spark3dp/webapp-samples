Sample-App-Auth-Drive-JS
========================
This sample application provides an introduction to working with the Spark OAuth 2.0 process and examples of basic Spark Drive functionalities.

Required setup before running the sample code 
=============================================
1. Clone the software repository (copy its files) to a folder on your web server. 
2. If you have not already done so, define an app on the Spark Developers portal at https://spark.autodesk.com/developer.
3. In the Sandbox tab of the app definitions, enter your app's Redirect URL, which is the path to the sample's auth.html file (for example http://localhost/drivestar-folder/auth.html) and copy the app key and app secret for later use.
4. In the auth.html file: Copy your app key to the value of the variable CLIENT_ID (line 18). 
5. In the auth.html file: Enter the Base64 value of (app key + ":" + app secret) as the value of the variable AUTH_HASH (line 19). Base64 encoding can be performed at https://www.base64encode.org/.
6. In the auth.html file: Enter the path to the sample's auth.html file in the REDIRECT_URL variable (line 21). This must be the same as the redirect URL entered in the app definitions, without the "http://hostname" part of the URL which the variable automatically generates.
7. In the login.js file (located in the Scripts folder): Replace the path of your sample code's folder in line 16.
8. Save your changes and run the sample.

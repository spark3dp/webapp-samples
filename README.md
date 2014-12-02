Sample-App-Auth-Drive-JS
========================
This sample application provides an introduction to working with the Spark OAuth 2.0 process and examples of basic Spark Drive functionalities.

Required setup before running the sample code 
=============================================
1. Clone the software repository (copy its files) to a folder on your web server. 
2. If you have not already done so, define an app on the Spark Developers portal at https://spark.autodesk.com/developer.
3. In the Sandbox tab of the app definitions, enter your app's Redirect URL, which is the path to the sample's auth.html file (for example http://localhost/drivestar-folder/auth.html) and copy the app key and app secret for later use.
4.Copy your app key to the auth.html file, as the value of the variable CLIENT_ID. 
5. Enter the Base64 value of (app key + ":" + app secret) as the value of the variable AUTH_HASH. Base64 encoding can be performed at https://www.base64encode.org/.
6. Enter the path to the sample's auth.html file in the REDIRECT_URL variable, this must be the same as the URL entered in the app's redirect URL without the "http://hostname" part of the URL which the variable automatically generates. 
7. Run the program.

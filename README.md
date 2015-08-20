Web App Samples
========================
### Introduction
These applications demonstrate Spark's cloud based 3D model storage, mesh preparation and 3D printing and can also provide an example of the Spark OAuth 2.0 implicit login procedure.

### Required setup before running the sample code
1. Clone the software repository (copy its files) to a folder on your web server. 
2. If you have not already done so, define an app on the Spark Developers portal at https://spark.autodesk.com/developers/myApps.
3. In the API Keys tab of the app registration, enter the fully qualified URL of the sample's home page (do not use a relative path).
4. Copy the app key for later use.
5. Setup your app with your app key - see info in the "Quick Start" section.

### Quick Start
Copy the file "assets/scripts/config.example.js" to "assets/scripts/config.js" and supply these details:

* **APP_KEY** - paste the app key from step 4 in the previous section
* **REDIRECT_URI** - The redirect uri the Spark Auth flow will redirect your users after they will complete the login process. This repository is provided with a login callback html file that makes this task easy. The file is located in "plugins/login/login-callback.html" and you should set your REDIRECT_URI to http://example.com/your-app/plugins/login/login-callback.html (assumed the home page of your app is http://example.com/your-app)

### The contents of this repository
This repository demonstrates use of Spark APIs in these samples:

1. 3D Model Healing Utility For Printing (healing-utility.html) - Improve 3D printing success rates and minimize printing time with our extensive range of API print-preparation tools. Heal, fix and optimize your model for different materials, textures and file output types.
2. 3D Model Printing Sample Application (sample-app-print.html) - Integrate an app with local and network 3D printers, desktop FDM printers and professional grade additive manufacturing systems.
3. 3D Model Cloud Storage Application (sample-app-storage.html) - Use Spark's cloud services to easily store 3D models and to create collaborative shared 3D creations.
4. 3D Model Social Application (sample-app-gallery.html) - Create an online gallery, exhibit app-users' 3D images and digital creations and add social network functions, such as comments and likes.

### Using the SDK
The samples provided in this repository utilize Spark's JavaScript SDK that is provided through [this link](https://code.spark.autodesk.com/autodesk-spark-sdk.min.js).

To run your own code with the SDK, reference the [JS SDK repository](https://github.com/spark3dp/spark-js-SDK).

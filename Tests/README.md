# Tests
The tests are run on the API routes to ensure that they return information about the inventory. 

## Requirements
Postman is required to run the tests. 

## Instructions
1. Import the Collection and Environment file into Postman. The collection will be called THINGS-API contains the routes that will be tested whereas the environment (called THINGS) will contain variables that routes can use when making requests such as authentication tokens. 
2. Before you can run the tests, you will need to configure the credentials in the login routes. The admin and user login routes (correct credentials, bad username, and bad password)will need to have your login credentials. Open each of these routes and in the Body tab, enter the appropriate credential. If you see YOUR_USERNAME, enter the username and where you see YOUR_PASSWORD, enter your password. 
3. Once the credentials have been entered on the 6 routes, go to Runner, select the THINGS-API collection and the THINGS environment and click on Run at the bottom. This will run all tests in the collection and will indicate whether that test passed or failed. 

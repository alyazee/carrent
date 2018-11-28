const express = require('express');
const cors = require('cors');
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser'); //read form data and form fields
const methodOverride = require('method-override'); //to support PUT and DELETE FROM browssers

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride('_method'));

//const mongoServerURL = "mongodb://localhost:27017";
//const mongoServerURL = "mongodb://yaze:A0509330995@ds013405.mlab.com:13405/itemdb";


//----------------------------------------------


//default route / - display all items
app.get('/', (request, response, next) => {
	mongoClient.connect(mongoServerURL, (err, db) => {
		if (err)
			console.log("Cannot connect to Mongo:"+err.message);

		//connect to carrent database
		const carrentdb = db.db("carrentdb");

		//read from carrent vehicles collection
		carrentdb.collection("vehicles").find({}).toArray((err, itemsArray) => {
			if (err)
				console.log(err.message);

			response.send(JSON.stringify(itemsArray));
		});

		//close the connection to the db
		db.close();
	});

});


//-----------------------------------------------


app.get('/', (request, response, next) => {
	mongoClient.connect(mongoServerURL, (err, db) => {
		if (err)
			console.log("Cannot connect to Mongo:"+err.message);

		//connect to carrent database
		const carrentdb = db.db("carrentdb");

		//read from carrent users collection
		carrentdb.collection("users").find({}).toArray((err, itemsArray) => {
			if (err)
				console.log(err.message);

			response.send(JSON.stringify(itemsArray));
		});

		//close the connection to the db
		db.close();
	});

});

//----------------------------------------------------------

//get one vehicle by name - used in update and delete web pages
app.get('/vehicles/:vName', (request, response, next) => {

	const vName = request.params.vName;

	mongoClient.connect(mongoServerURL, (err, db) => {
		if (err)
			console.log("Cannot connect to Mongo:"+err.message);

		//connect to vehicledb
		const carrentdb = db.db("carrentdb");

		console.log(vName);
		//build the query filter
		let query = {v_name:vName};

		//read from carrentdb vehicles collection
		carrentdb.collection("vehicles").find(query).toArray((err, itemsArray) => {
			if (err)
				console.log(err.message);

			response.send(JSON.stringify(itemsArray));
		});

		//close the connection to the db
		db.close();
	});

});

//----------------------------------------------------
//get one vehicle by name - used in update and delete web pages
app.get('/users/:username', (request, response, next) => {

	const username = request.params.username;

	mongoClient.connect(mongoServerURL, (err, db) => {
		if (err)
			console.log("Cannot connect to Mongo:"+err.message);

		//connect to vehicledb
		const carrentdb = db.db("carrentdb");

		console.log(username);
		//build the query filter
		let query = {usrname:username};

		//read from carrentdb vehicles collection
		carrentdb.collection("users").find(query).toArray((err, itemsArray) => {
			if (err)
				console.log(err.message);

			response.send(JSON.stringify(itemsArray));
		});

		//close the connection to the db
		db.close();
	});

});



//-------------------------------------------

//example of hardcoded route
app.get('/car', (request, response, next) => {
	mongoClient.connect(mongoServerURL, (err, db) => {
		if (err)
			console.log("Cannot connect to Mongo:"+err.message);

		//connect to item
		const carrentdb = db.db("carrentdb");

		//read from itemdb items collection
		carrentdb.collection("vehicles").find({category:"car"}).toArray((err, itemsArray) => {
			if (err)
				console.log(err.message);

			response.send(JSON.stringify(itemsArray));
		});

		//close the connection to the db
		db.close();
	});
});



//----------------------------------------------------------

//example to used to handle many routes using request parameter
//here the request parameter is :category
app.get('/:category', (request, response, next) => {
	mongoClient.connect(mongoServerURL, (err, db) => {
		if (err)
			console.log("Cannot connect to Mongo:"+err.message);

		//connect to item
		const carrentdb = db.db("carrentdb");
		let categoryValue = request.params.category;
		if (categoryValue == "cars")
			categoryValue = "car";
		else if (categoryValue == "heavy")
			categoryValue = "heavy";
		console.log(categoryValue);
		//build the query filter
		let query = {category:categoryValue};

		//read from carrentdb items collection
		carrentdb.collection("vehicles").find(query).toArray((err, itemsArray) => {
			if (err)
				console.log(err.message);

			response.send(JSON.stringify(itemsArray));
		});

		//close the connection to the db
		db.close();
	});
});
//----------------------------------------------------------------
app.get('/:category', (request, response, next) => {
	mongoClient.connect(mongoServerURL, (err, db) => {
		if (err)
			console.log("Cannot connect to Mongo:"+err.message);

		//connect to item
		const carrentdb = db.db("carrentdb");
		let categoryValue = request.params.category;
		if (categoryValue == "usrname")
			categoryValue = "username";
		
		console.log(categoryValue);
		//build the query filter
		let query = {category:categoryValue};

		//read from carrentdb items collection
		carrentdb.collection("users").find(query).toArray((err, itemsArray) => {
			if (err)
				console.log(err.message);

			response.send(JSON.stringify(itemsArray));
		});

		//close the connection to the db
		db.close();
	});
});

//-----------------------------------------------------------------
//add a new vehicle - using HTTP POST method
app.post('/vehicles', (request, response, next) => {
	//access the form fields by the same names as in the HTML form
	const v_id = request.body.v_id;
	console.log(v_id);
	const vname = request.body.vname;
	const vCategory = request.body.vCategory;
	const vDescription = request.body.vDescription;
	const vStatus = request.body.vStatus;
	const vCity = request.body.vCity;
	const vdate  = request.body.vdate;
	let vprice = request.body.vprice;
	//convert price to number
	vprice = parseFloat(vprice);

	mongoClient.connect(mongoServerURL, (err, db) => {
		if (err)
			console.log("Cannot connect to Mongo:"+err.message);

		//connect to carrentdb
		const carrentdb = db.db("carrentdb");
		
		const newVehicle = {v_id:vId, v_name:vname, v_category:vCategory, v_description:vDescription,
						v_Status:vStatus, v_City:vCity, v_date:vdate };
		//insert to carrentdb vehicles collection
		carrentdb.collection("vehicles").insertOne(newVehicle, (err, result) => {
			if (err) {
				console.log(err.message);
			}

			if (result.insertedCount == 1) {
				//one way - return response - let client handle it
				//response.end("vehicle " + vname + " added successfully!");
				
				//another way - redirect to the all items page - showing item added
				response.redirect("/static/index.html");
			}
			else
				response.end("vehicle " + vname + " could not be added!!");

			//response.send(JSON.stringify(newItem));
		});

		//close the connection to the db
		db.close();
	});	
});



//-------------------------------------------------------------------------
//add a new user - using HTTP POST method
app.post('/users', (request, response, next) => {
	//access the form fields by the same names as in the HTML form
	const username = request.body.username;
	console.log(username);
	const password = request.body.password;
	const email = request.body.email;
	
	mongoClient.connect(mongoServerURL, (err, db) => {
		if (err)
			console.log("Cannot connect to Mongo:"+err.message);

		//connect to carrentdb
		const carrentdb = db.db("carrentdb");
		//here bitch
		const newUsers = {username:usrname, password:pword, email:uEmail};
		//insert to carrentdb users collection
		carrentdb.collection("users").insertOne(newUsers, (err, result) => {
			if (err) {
				console.log(err.message);
			}

			if (result.insertedCount == 1) {
				//one way - return response - let client handle it
				//response.end("user " + username + " added successfully!");
				
				//another way - redirect to the all items page - showing item added
				response.redirect("/static/index.html");
			}
			else
				response.end("user " + username + " could not be added!!");

			//response.send(JSON.stringify(newItem));
		});

		//close the connection to the db
		db.close();
	});	
});




//-------------------------------------------------------------------------
//update vehicle - uisng HTTP PUT method
app.put('/vehicles', (request, response, next) => {
	console.log("in PUT");
	const vname = request.param('vname');
	const vCategory = request.param('vCategory');
	const vDescription = request.param('vDescription');
	const vStatus = request.param('vStatus');
	const vCity = request.param('vCity')
	let vdate = request.param('vdate');
	let vprice=request.param('vprice')
	//convert price to number
	vprice = parseFloat(vprice);
	mongoClient.connect(mongoServerURL, (err, db) => {
		if (err)
			console.log("Cannot connect to Mongo:"+err.message);

		//connect to carrentdb
		const carrentdb = db.db("carrentdb");
		
		//we are updating by the vehicle name
		const updateFilter = {v_name:vname};
		const updateValues = {$set:{vCategory:vCategory, vdescription:vDescription,
						v_Status:vStatus, vCity:vCity ,v_date:vdate}};
		//insert from carrentdb vehicles collection
		carrentdb.collection("vehicles").updateOne(updateFilter, updateValues, (err, res) => {
			if (err) {
				console.log(err.message);
			}

			//console.log("matchcount " + res.matchedCount);
			//console.log("updatecount:" + res.modifiedCount);

			//one way 
			//const responseJSON = {updateCount:res.result.nModified};
			//response.send(JSON.stringify(responseJSON));

			//another way - redirect to all items page
			response.redirect("/static/index.html");
		});

		//close the connection to the db
		db.close();
	});	
});


//------------------------------------------------------------------------
//update users - uisng HTTP PUT method
app.put('/users', (request, response, next) => {
	console.log("in PUT");
	const username = request.param('username');
	const password = request.param('password');
	const email = request.param('email');


	mongoClient.connect(mongoServerURL, (err, db) => {
		if (err)
			console.log("Cannot connect to Mongo:"+err.message);

		//connect to carrentdb
		const carrentdb = db.db("carrentdb");
		
		//we are updating by the vehicle name
		const updateFilter = {username:usrname};
		const updateValues = {$set:{email:email, password:password}};
		//insert from carrentdb users collection
		carrentdb.collection("users").updateOne(updateFilter, updateValues, (err, res) => {
			if (err) {
				console.log(err.message);
			}

			//console.log("matchcount " + res.matchedCount);
			//console.log("updatecount:" + res.modifiedCount);

			//one way 
			//const responseJSON = {updateCount:res.result.nModified};
			//response.send(JSON.stringify(responseJSON));

			//another way - redirect to all items page
			response.redirect("/static/index.html");
		});

		//close the connection to the db
		db.close();
	});	
});




//-------------------------------------------------------------

//delete vehicle by vehicle name
app.delete('/vehicles', (request, response, next) => {
	const vname = request.param('vName');

	mongoClient.connect(mongoServerURL, (err, db) => {
		if (err)
			console.log("Cannot connect to Mongo:"+err.message);

		//connect to vehicle
		const carrentdb = db.db("carrentdb");
		
		//we are deleting by the v_name
		const deleteFilter = {v_name:vname};

		//insert from carrent vehicles collection
		carrentdb.collection("vehicles").deleteOne(deleteFilter, (err, res) => {
			if (err) {
				console.log(err.message);
			}

			//const responseJSON = {deleteCount:res.result.n}; //n - how many docs deleted
			//response.send(JSON.stringify(responseJSON));

			if (res.deletedCount > 0) {
				response.redirect("/static/index.html");
			}
			else {
				response.send("<script>alert(\"deleted \" +vname);</script>");
			}
		});

		//close the connection to the db
		db.close();
	});	
});

//-------------------------------------------------------------------------
//delete user by username
app.delete('/users', (request, response, next) => {
	const username = request.param('usrName');

	mongoClient.connect(mongoServerURL, (err, db) => {
		if (err)
			console.log("Cannot connect to Mongo:"+err.message);

		//connect to carrent database
		const carrentdb = db.db("carrentdb");
		
		//we are deleting by the username
		const deleteFilter = {usrname:username};

		//insert from carrent users collection
		carrentdb.collection("users").deleteOne(deleteFilter, (err, res) => {
			if (err) {
				console.log(err.message);
			}

			//const responseJSON = {deleteCount:res.result.n}; //n - how many docs deleted
			//response.send(JSON.stringify(responseJSON));

			if (res.deletedCount > 0) {
				response.redirect("/static/index.html");
			}
			else {
				response.send("<script>alert(\"deleted \" +username);</script>");
			}
		});

		//close the connection to the db
		db.close();
	});	
});
//-------------------------------------------------------------------------


//set the route for static HTML files to /static
//actual folder containing HTML files will be public
app.use('/static', express.static('public'));

//start the web server
const port = 7979;
app.listen(port, ()=> {
	console.log("server listening on "+port);
});


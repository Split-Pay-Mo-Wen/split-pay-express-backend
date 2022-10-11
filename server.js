const express = require('express');
const app = express();
const PORT = 3000; 



const cors = require('cors');
// Use this CORS package as part of the Express
// set the CORS allow header for us on every request, for AJAX requests
app.use( cors() ); 

// To get access to POSTed 'formdata' body content

app.use( express.json());
app.use(express.urlencoded( {extended: true }))


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT} ...`);
});

// Mongoose DB initialisation
const mongoose = require('mongoose');
const User = require('./models/User');
const Category = require('./models/Category');
const Payment = require('./models/Payment');
const UserDebt= require('./models/UserDebt');
// const GroupDebt = require('./models/GroupDebt');
const Group = require('./models/Group');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_CLOUD_URL);
const db = mongoose.connection;

db.on('error', err => {
  console.log('Error connecting to DB server', err);
  process.exit( 1 );

});

// Authentication
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const jwtAuthenticate = require('express-jwt');



const checkAuth = () => {
  return jwtAuthenticate.expressjwt({ 
      secret: process.env.SERVER_SECRET_KEY, // check token hasn't been tampered with
      algorithms: ['HS256'],
      requestProperty: 'auth' // gives us 'req.auth'
  });
}; // checkAuth

const SERVER_SECRET_KEY = process.env.SERVER_SECRET_KEY;

// Split Pay Routes
app.get('/', (req, res) => {
    console.log('Root route was requested.');
    res.json( { hello: 'TEST to see if connected' } );
  });


// Index Users 
  app.get('/users', async (req, res) => {
    try{
        const filter = {}
        const users = await User.find();
        res.json(users)

    } catch( err ){
        console.error('Error loading all Users:', err);

        // res.sendStatus(422);
        res.status(422).json({error: 'Db connection error'})
    }
  }); // Get/Users

  // Show Page Users

  app.get('/users/:id', async(req, res) => {

    try{
        const user = await User.findOne({
            _id: req.params.id
        });

        // user.
        console.log('user', user);
        res.send({ user})

    } catch(err){
        console.log('Error finding User by ID:', req.params, err);
        res.sendStatus( 422 );
    }

  });


//   Index Categories
  app.get('/categories', async(req, res) => {
    try{
        const categories = await Category.find();
        res.json(categories)

    } catch( err ){
        console.error('Error loading all Categories:', err);

        // res.sendStatus(422);
        res.status(422).json({error: 'Db connection error'})
    }
  }); // Get/Categoeris


// Index Groups page
  app.get('/groups', async(req, res) => {
    try{
        const groups = await Group.find();
        res.json(groups)

    } catch( err ){
        console.error('Error loading all Groups:', err);

        // res.sendStatus(422);
        res.status(422).json({error: 'Db connection error'})
    }
  }); // Get/groups

//   TODO: Group specific show page add req.params



// Index groupDebts
// TODO: Show page for User Debts


// TODO: EDIT page
// TODO: Delete page - once posted/ complete



//   Index UserDebts page
// TODO: Show page for User Debts
// TODO: EDIT page
// TODO: Delete page - once posted/ complete

  app.get('/userDebts', async(req, res) => {
    try{
        const userDebts = await UserDebt.find();
        res.json(userDebts)

    } catch( err ){
        console.error('Error loading all UserDebt:', err);

        // res.sendStatus(422);
        res.status(422).json({error: 'Db connection error'})
    }
  }); // Get/userDebts

//   Index Payments page

  app.get('/payment', async(req, res) => {
    try{
        const payment = await Payment.find();
        res.json(payment)

    } catch( err ){
        console.error('Error loading all payment:', err);

        // res.sendStatus(422);
        res.status(422).json({error: 'Db connection error'})
    }
  }); // Get/payment

  app.post('/signup', async (req, res) => {
    console.log('signup: ', req.body);
    res.json(req.body);

    const newUser = { 
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };

    try{
        const user = await User.create({newUser});
        console.log('new User created', user)
      //   if ( user && bcrypt.compareSync(password, user.passwordDigest) ) {

      //     // res.json({ success: true })
      //     const token = jwt.sign(
      //         { _id: user._id },
      //         SERVER_SECRET_KEY,
      //         // expiry date/other config:
      //         { expiresIn: '72h' } // 3 days

      //     );

      //         res.json( { token }); 
             
      // } else {
      //     // incorrect credentials: user not found ( by email ) or passwords don't 
      //     // match
      //     res.status( 401 ).json({ success: false }); // Unauthorised code
      // }
    } // try 
    catch (err) {

        console.log('Error verifying login credentials:', err);
        res.sendStatus(500); // Low-level error
    
    } // catch


    
  })   // create new user

//   TODO: Payment show page

// TODO: Payment Post page



// /////////////// Deleted GROUP DEBT MODEL
  // app.get('/groupDebts', async(req, res) => {
  //   try{
  //       const groupDebts = await GroupDebt.find();
  //       res.json(groupDebts)

  //   } catch( err ){
  //       console.error('Error loading all GroupDebt', err);

  //       // res.sendStatus(422);
  //       res.status(422).json({error: 'Db connection error'})
  //   }
  // }); // Get/groupDebts

  // At the end of the file, we add a new route for Login
// app.post('/login', (req, res) => {
//   // console.log('login:', req.body);
//   // res.json( req.body ); // just for debugging

// });


// SIGNUP

router.post("/signup", async (req, res)=>{
  const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password.toString(),
  });

  try{
      const savedUser = await newUser.save();
      res.json(savedUser);
  }catch(err){
      // console.log(err);
      res.status(500).json(err);
  }

});
// LOGIN

// adding jwt to the route:
app.post('/login', async (req, res) => {
    console.log('login:', req.body);
    
    const { email, password } = req.body 

    try {

        const user = await User.findOne({ email }) // short for { email: email }

        if ( user && bcrypt.compareSync(password, user.passwordDigest) ) {

            // res.json({ success: true })
            const token = jwt.sign(
                { _id: user._id },
                SERVER_SECRET_KEY,
                // expiry date/other config:
                { expiresIn: '72h' } // 3 days

            );

                res.json( { token }); 
               
        } else {
            // incorrect credentials: user not found ( by email ) or passwords don't 
            // match
            res.status( 401 ).json({ success: false }); // Unauthorised code
        }

    } catch (err) {

        console.log('Error verifying login credentials:', err);
        res.sendStatus(500); // Low-level error
        
    }
}) //login



// ** Routes below this line only work for authenticated users - move the required ones under here.
app.use( checkAuth() ); // provide req.auth (the User ID from token) to all following routes
// Custom middleware, defined inline:
// Use the req.auth ID from the middleware above and try to look up a user with it - 
// if found, attach to req.current_user for all the requests that follow this;
// if not found, return an error code
app.use( async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.auth._id })
        if( user === null ){
            res.sendStatus( 401 ); // invalid/stale token
            // by running a res method here, this middleware will not
            // allow any further routes to be handled below it
        } else {
            req.current_user = user; // add 'current_user' for the next route to access
            next(); // move on to the next route handler in this server
        }
    } catch( err ){
        console.log('Error querying User in auth', err);
        res.sendStatus( 500 );
    } 
});
// All routes below now have a 'req.current_user defined
// TODO: dont send everything keep it limited
// 
app.get('/current_user', (req, res) => {
    res.json( req.current_user );
});

const express = require('express');
const router = express.Router();
const momentTimezone = require('moment-timezone');
const User = require('../models/User');
const Restaurant = require('../models/Restaurent')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwrsecret = "MYNameisJashandeepSInghjoharmukts"
const bcrypt = require("bcryptjs");
const Category = require('../models/Category')
const Subcategory = require('../models/Subcategory')
const Itemlist = require('../models/Itemlist')
const Menu = require('../models/Menu')
const WeeklyOffers= require('../models/WeeklyOffers')
const Offers= require('../models/Offers');
const UserPreference = require('../models/UserPreference');
const Timeschema = require('../models/Timeschema');
const Team = require('../models/Team');
const Customerlist = require('../models/Customerlist');

router.get('/dashboard/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        const restaurantCount = await Restaurant.countDocuments({userid:userid});
        const categoryCount = await Category.countDocuments({userid:userid});
        const itemCount = await Items.countDocuments({userid:userid});

        res.json({ restaurantCount, categoryCount, itemCount });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ message: 'Error fetching dashboard data' });
    }
});

router.post("/createuser", [
    body('email').isEmail(),
    body('companyname').isLength(),
    body('Businesstype').isLength(),
    body('CurrencyType').isLength(),
    body('FirstName').isLength({ min: 3 }),
    body('LastName').isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const email = req.body.email;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log('Email already registered:', email);
            return res.status(400).json({
                success: false,
                message: "This Email ID is already registered!"
            });
        } else {
            const salt = await bcrypt.genSalt(10);
            const secPassword = await bcrypt.hash(req.body.password, salt);

            await User.create({
                companyname: req.body.companyname,
                Businesstype: req.body.Businesstype,
                CurrencyType: req.body.CurrencyType,
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                password: secPassword,
                email: req.body.email,
            });

            return res.json({
                success: true,
                message: "Congratulations! Your account successfully created!"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


    // router.post("/createuser",
    // [
    //     body('email').isEmail(),
    //     body('companyname').isLength(),
    //     body('Businesstype').isLength(),
    //     body('CurrencyType').isLength(),
    //     body('FirstName').isLength({min:3}),
    //     body('LastName').isLength({min:3}),
    //     body('password').isLength({ min: 5 }),
    // ]
    // , async (req, res) => {
    //     const errors = validationResult(req);
    //     if (!errors.isEmpty()) {
    //         return res.status(400).json({ errors: errors.array() });
    //     }
    //     const salt = await bcrypt.genSalt(10);
    //     let secPassword= await bcrypt.hash(req.body.password, salt)

    //     try {
    //         let emaild = req.body.email;
    //             let userdata = await User.findOne({ emaild });
    //     if (!userdata) {
    //         User.create({
    //             companyname: req.body.companyname,
    //             Businesstype: req.body.Businesstype,
    //             CurrencyType: req.body.CurrencyType,
    //             FirstName: req.body.FirstName,
    //             LastName: req.body.LastName,
    //             password: secPassword,
    //             email: req.body.email,
    //         })
    //         res.json({ 
    //             Success: true,
    //             message: "Congratulations! Your account Succefully created! "
    //         })
    //     }else{
            
    //         res.json({ 
    //             Success: false,
    //             message: "This Email id already Registered! "
    //         })
    //     }
    //     }
    //     catch (error) {
    //         console.log(error);
    //         res.json({ Success: false })
    //     }
    // });



// Create a new user document
// const newUser = new User({
//     name: 'John Doe',
//     location: 'New York',
//     email: 'abc@gmail.com',
//     password: '123456',
// });

// // Save the user document to the database
// newUser.save()
//     .then((user) => {
//         console.log('User saved to the database:', user);
//     })
//     .catch((error) => {
//         console.error('Error saving user:', error);
//     });

// router.post("/createuser", async (req, res) => {
//     const { name, email, password, location, signupMethod } = req.body;

//     // Validate input based on the signup method (e.g., for email signup)
//     if (signupMethod === "email") {
//         // Perform email signup validation here
//         // Example: Check if email is valid and password meets the criteria
//         if (!isValidEmail(email) || !isValidPassword(password)) {
//             return res.status(400).json({ message: "Invalid email or password." });
//         }
//     } 
//         else if (signupMethod === "google") {
//         // Handle Google signup
//         // You can add custom validation for Google signup here
//         let userdata = await User.findOne({ email });
//         if (!userdata) {
//             try {
//                 User.create({
//                     name,
//                     password: secPassword,
//                     email,
//                     location,
//                     signupMethod,
//                 });
//                 let userdata = await User.findOne({ email });
//                 const data = {
//                     user:{
//                         id:userdata.id
//                     }
//                 }
//                 const authToken = jwt.sign(data, jwrsecret)
//                 return res.json({ Success: true,authToken:authToken,userid: userdata.id})
        
//             } catch (error) {
//                 console.log(error);
//                 res.json({ Success: false });
//             }
//         }else{
//         if (userdata.signupMethod == signupMethod) {


//         const data = {
//             user:{
//                 id:userdata.id
//             }
//         }

//         const authToken = jwt.sign(data, jwrsecret)
//         return res.json({ Success: true,authToken:authToken,userid: userdata.id})
//     }
//     }
//     } else if (signupMethod === "facebook") {
        
//         // Handle Google signup
//         // You can add custom validation for Google signup here
//         let userdata = await User.findOne({ email });
//         if (!userdata) {
//             try {
//                 User.create({
//                     name,
//                     password: secPassword,
//                     email,
//                     location,
//                     signupMethod,
//                 });
//                 let userdata = await User.findOne({ email });
//                 const data = {
//                     user:{
//                         id:userdata.id
//                     }
//                 }
//                 const authToken = jwt.sign(data, jwrsecret)
//                 return res.json({ Success: true,authToken:authToken,userid: userdata.id})
        
//             } catch (error) {
//                 console.log(error);
//                 res.json({ Success: false });
//             }
//         }else{
//         if (userdata.signupMethod == signupMethod) {


//         const data = {
//             user:{
//                 id:userdata.id
//             }
//         }

//         const authToken = jwt.sign(data, jwrsecret)
//         return res.json({ Success: true,authToken:authToken,userid: userdata.id})
//     }
//     }
// }

//     // Continue with user creation based on the signup method
//     const salt = await bcrypt.genSalt(10);
//     let secPassword = await bcrypt.hash(password, salt);

//     try {
//         User.create({
//             name,
//             password: secPassword,
//             email,
//             location,
//             signupMethod,
//         });

//         res.json({
//             Success: true,
//             message: "Congratulations! Your account successfully created!",
//         });
//     } catch (error) {
//         console.log(error);
//         res.json({ Success: false });
//     }
// });



// router.post("/login", [
//     body('email').isEmail(),
//     body('password').isLength({ min: 5 }),
// ], async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     let signupMethod = req.body.signupMethod;
//     let email = req.body.email;
//     try {
//         let userdata = await User.findOne({ email });
//         if (!userdata) {
//             return res.status(400).json({ errors: "Login with correct details " });
//         }

//         const pwdCompare = await bcrypt.compare(req.body.password, userdata.password)
//         if (!pwdCompare) {
//             return res.status(400).json({ errors: "Login with correct details" });
//         }

//         if (userdata.signupMethod != signupMethod) {
//             return res.status(400).json({ errors: "You can try with social login" });
//         }


//         const data = {
//             user:{
//                 id:userdata.id
//             }
//         }

//         const authToken = jwt.sign(data, jwrsecret)
//         res.json({ Success: true,authToken:authToken,userid: userdata.id})
//     }
//     catch (error) {
//         console.log(error);
//         res.json({ Success: false })
//     }
// });

// User and Team Member login route

router.post('/login', [
    body('email').isEmail(),
    body('password').isLength({ min: 4 }),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const email = req.body.email;
    const password = req.body.password;
  
    try {
      // Check if it's a user
      const user = await User.findOne({ email });
      
      if (user) {
        const pwdCompare = await bcrypt.compare(password, user.password);
        if (pwdCompare) {
          const data = {
            user: {
              id: user._id,
            },
          };
          const mostRecentClockEntry = await Timeschema.findOne({ endTime: null, userid:user._id }).sort({ startTime: -1 });
          const mostRecentClockEntrystartTime = mostRecentClockEntry != null ? mostRecentClockEntry.startTime : "";
          const authToken = jwt.sign(data, jwrsecret);
          return res.json({ Success: true, authToken, userid: user._id, username: user.FirstName, startTime:mostRecentClockEntrystartTime, isTeamMember: false, });
        }
      }
  
      // Check if it's a team member
      const teamMember = await Team.findOne({ email });
      
      if (teamMember) {
        const pwdCompare1 = await bcrypt.compare(password, teamMember.password);
        if (pwdCompare1) {
          const data1 = {
            users: {
              id: teamMember._id,
            },
          };
          const mostRecentClockEntry = await Timeschema.findOne({ endTime: null, userid:teamMember._id }).sort({ startTime: -1 });
          const mostRecentClockEntrystartTime = mostRecentClockEntry != null ? mostRecentClockEntry.startTime : "";
          const authToken = jwt.sign(data1, jwrsecret);
          return res.json({ Success: true, authToken, userid: teamMember._id, username: teamMember.name, startTime:mostRecentClockEntrystartTime, isTeamMember: true });
        }
      }
  
      console.log('Login failed for email:', email);
      return res.status(400).json({ errors: 'Login with correct details' });
    } catch (error) {
      console.log(error);
      res.json({ Success: false });
    }
  });


// router.post('/clockin', async (req, res) => {

//     let Data = new Date();
//     const options = { timeZone: 'Asia/Kolkata', timeZoneName: 'short' };
//     console.log(Data.toLocaleString('en-US', options), "Time Zone");
//     const formattedTime = Data.toLocaleString('en-US', options);
//     const newClock = new Timeschema({
//         startTime: formattedTime, 
//     });

//     await newClock.save();

//     res.json({ message: 'Clock-in successful', startTime: formattedTime });
// });

// router.post('/clockout', async (req, res) => {
//     let Data = new Date();
//     const options = { timeZone: 'Asia/Kolkata', timeZoneName: 'short' };
//     console.log(Data.toLocaleString('en-US', options), "Time Zone");
//     const formattedTime = Data.toLocaleString('en-US', options);

//     // Assuming you have a Mongoose model named 'Timeschema' for clock-out times
//     const newClock = new Timeschema({
//         endTime: formattedTime, 
//     });

//     await newClock.save();

//     res.json({ message: 'Clock-out successful', endTime: formattedTime });
// });

router.post('/clockin', async (req, res) => {
    const { userid,username,userEmail,isTeamMember } = req.body;

    const startTime = new Date();
    const options = { timeZone: 'Asia/Kolkata', timeZoneName: 'short' };
    const formattedStartTime = startTime.toLocaleString('en-US', options);

    const newClockEntry = new Timeschema({
        startTime: formattedStartTime,
        userid:userid,
        username:username,
        isteamMember:isTeamMember,
    });

    try {
        await newClockEntry.save();
        res.json({ message: 'Clock-in successful', startTime: formattedStartTime });
    } catch (error) {
        res.status(500).json({ message: 'Failed to store clock entry' });
    }
});


router.post('/clockout', async (req, res) => {
    const { userid,username,userEmail,isTeamMember } = req.body;
    const endTime = new Date();
    const options = { timeZone: 'Asia/Kolkata', timeZoneName: 'short' };
    const formattedEndTime = endTime.toLocaleString('en-US', options);

    // Find the most recent clock-in entry and update it with the end time
    const mostRecentClockEntry = await Timeschema.findOne({ endTime: null, userid:userid }).sort({ startTime: -1 });

    if (mostRecentClockEntry) {
        mostRecentClockEntry.endTime = formattedEndTime;
        const startTime = new Date(mostRecentClockEntry.startTime);
        const endTime = new Date(mostRecentClockEntry.endTime);
        const totalTimeWorked = (endTime - startTime)


        // Convert the time difference to hours, minutes, and seconds
    const hours = Math.floor(totalTimeWorked / 3600000); // 1 hour = 3600000 milliseconds
    const minutes = Math.floor((totalTimeWorked % 3600000) / 60000); // 1 minute = 60000 milliseconds
    const seconds = Math.floor((totalTimeWorked % 60000) / 1000); // 1 second = 1000 milliseconds

    mostRecentClockEntry.totalTime = `${hours} hours ${minutes} minutes ${seconds} seconds`;
        await mostRecentClockEntry.save();

        res.json({ message: 'Clock-out successful', endTime: formattedEndTime,totalTimeWorked: mostRecentClockEntry.totalTime });
    } else {
        res.json({ message: 'No matching clock-in entry found for clock-out' });
    }
});

router.get('/userEntries/:userid', async (req, res) => {
    try {
      const { userid } = req.params;
      const userEntries = await Timeschema.find({ userid }).sort({ startTime: 1 });
  
      if (userEntries) {
        res.json({ userEntries });
      } else {
        res.status(404).json({ message: 'No entries found for this user' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/allEntries', async (req, res) => {
  try {
    const allEntries = await Timeschema.find().sort({ startTime: 1 });

    if (allEntries && allEntries.length > 0) {
      res.json({ allEntries });
    } else {
      res.status(404).json({ message: 'No entries found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

//   router.get('/allEntriesuserwise/:userid', async (req, res) => {
//   try {
//     const { userid } = req.params;
//     const allEntries = await Timeschema.find({userid}).sort({ startTime: 1 });

//     if (allEntries && allEntries.length > 0) {
//       res.json({ allEntries });
//     } else {
//       res.status(404).json({ message: 'No entries found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

router.post("/addcustomer",
[
    body('email').isEmail(),
    body('name').isLength({min:3}),
    body('information').isLength(),
    body('number').isNumeric(),
    body('city').isLength(),
    body('state').isLength(),
    body('country').isLength(),
    body('post').isLength(),
    
    // body('address').isLength(),
]
, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const email = req.body.email;
        const existingcustomer = await Customerlist.findOne({ email });

        if (existingcustomer) {
            console.log('Email already registered:', email);
            return res.status(400).json({
                success: false,
                message: "This Customer Email already exist!"
            });
        } else {
        Customerlist.create({
            userid: req.body.userid,
            name: req.body.name,
            information: req.body.information,
            email: req.body.email,
            number: req.body.number,
            country: req.body.country,
            countryid: req.body.countryid,
            city: req.body.city,
            cityid: req.body.cityid,
            state: req.body.state,
            stateid: req.body.stateid,
            countrydata: req.body.countrydata,
            statedata: req.body.statedata,
            citydata: req.body.citydata,
            zip: req.body.zip,
            address1: req.body.address1,
            address2: req.body.address2,
            post: req.body.post,
        })
        res.json({ 
            Success: true,
            message: "Congratulations! Your Customer has been successfully added! "
        })
        }
    }
    catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    });

router.get('/customers/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        const customers = (await Customerlist.find({ userid: userid}));
        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

    router.get('/getcustomers/:customerId', async (req, res) => {
        try {
            const customerId = req.params.customerId;
            console.log(customerId);
    
            const result = await Customerlist.findById(customerId);
    
            if (result) {
                res.json({
                    Success: true,
                    message: "Customerdata retrieved successfully",
                    customer: result
                });
            } else {
                res.status(404).json({
                    Success: false,
                    message: "Customerdata not found"
                });
            }
        } catch (error) {
            console.error("Error retrieving Customerdata:", error);
            res.status(500).json({
                Success: false,
                message: "Failed to retrieve Customerdata"
            });
        }
    });


    // Update a restaurant using POST
    router.post('/updatecostomerdata/:customerId', async (req, res) => {
        try {
            const customerId = req.params.customerId; // Fix here
            const updatedcustomerdata = req.body;
        
            const result = await Customerlist.findByIdAndUpdate(customerId, updatedcustomerdata, { new: true });
        
            if (result) {
                res.json({
                    Success: true,
                    message: "Customerdata updated successfully",
                    customer: result
                });
            } else {
                res.status(404).json({
                    Success: false,
                    message: "Customerdata not found"
                });
            }
        } catch (error) {
            console.error("Error updating Customerdata:", error);
            res.status(500).json({
                Success: false,
                message: "Failed to update Customerdata"
            });
        }
    });

    router.get('/delcustomers/:customerId', async (req, res) => {
        try {
            const customerId = req.params.customerId;
    
            const result = await Customerlist.findByIdAndDelete(customerId);
    
            if (result) {
                res.json({
                    Success: true,
                    message: "Customer deleted successfully"
                });
            } else {
                res.status(404).json({
                    Success: false,
                    message: "Customer not found"
                });
            }
        } catch (error) {
            console.error("Error deleting Customer:", error);
            res.status(500).json({
                Success: false,
                message: "Failed to delete Customer"
            });
        }
    });

    router.post("/additem",
[
    body('itemname').isLength({min:3}),
    body('description').isLength(),
    body('price').isNumeric(),
    
    // body('address').isLength(),
]
, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        Itemlist.create({
            userid: req.body.userid,
            itemname: req.body.itemname,
            description: req.body.description,
            price: req.body.price,
        })
        res.json({ 
            Success: true,
            message: "Congratulations! Your Item has been successfully added! "
        })
    }
    catch (error) {
        console.log(error);
        res.json({ Success: false })
    }
});

router.get('/itemdata/:userid', async (req, res) => {
    try {
        let userid = req.params.userid;
        const itemdata = (await Itemlist.find({ userid: userid}));
        res.json(itemdata);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/delitem/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;

        const result = await Itemlist.findByIdAndDelete(itemId);

        if (result) {
            res.json({
                Success: true,
                message: "Item deleted successfully"
            });
        } else {
            res.status(404).json({
                Success: false,
                message: "Item not found"
            });
        }
    } catch (error) {
        console.error("Error deleting Item:", error);
        res.status(500).json({
            Success: false,
            message: "Failed to delete Item"
        });
    }
});

router.get('/getitems/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        console.log(itemId);

        const result = await Itemlist.findById(itemId);

        if (result) {
            res.json({
                Success: true,
                message: "Itemdata retrieved successfully",
                item: result
            });
        } else {
            res.status(404).json({
                Success: false,
                message: "Itemdata not found"
            });
        }
    } catch (error) {
        console.error("Error retrieving Itemdata:", error);
        res.status(500).json({
            Success: false,
            message: "Failed to retrieve Itemdata"
        });
    }
});


// Update a restaurant using POST
router.post('/updateitemdata/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId; // Fix here
        const updateditemdata = req.body;
    
        const result = await Itemlist.findByIdAndUpdate(itemId, updateditemdata, { new: true });
    
        if (result) {
            res.json({
                Success: true,
                message: "Itemdata updated successfully",
                item: result
            });
        } else {
            res.status(404).json({
                Success: false,
                message: "Itemdata not found"
            });
        }
    } catch (error) {
        console.error("Error updating Itemdata:", error);
        res.status(500).json({
            Success: false,
            message: "Failed to update Itemdata"
        });
    }
});
  
// router.post("/addteammember",
//     [
//         body('email').isEmail(),
//         body('name').isLength({ min: 3 }),
//         body('number').isNumeric(),
//         body('password').isLength({ min: 4 }),
        
//         // body('address').isLength(),
//     ]
//     , async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }
//         const salt = await bcrypt.genSalt(10);
//         let sectmemberPassword= await bcrypt.hash(req.body.password, salt)

//         try {
//             Team.create({
//                 userid: req.body.userid,
//                 name: req.body.name,
//                 password: sectmemberPassword,
//                 email: req.body.email,
//                 number: req.body.number,
//             })
//             res.json({ 
//                 Success: true,
//                 message: "Congratulations! Your Team member has been successfully added! "
//             })
//         }
//         catch (error) {
//             console.log(error);
//             res.json({ Success: false })
//         }
//     });

router.post("/addteammember", [
    body('email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('number').isNumeric(),
    body('password').isLength({ min: 4 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const email = req.body.email;
        const existingTeamMember = await Team.findOne({ email });

        if (existingTeamMember) {
            console.log('Email already registered:', email);
            return res.status(400).json({
                success: false,
                message: "This Email ID is already registered as a team member!"
            });
        } else {
            const salt = await bcrypt.genSalt(10);
            const sectmemberPassword = await bcrypt.hash(req.body.password, salt);

            await Team.create({
                userid: req.body.userid,
                name: req.body.name,
                password: sectmemberPassword,
                email: req.body.email,
                number: req.body.number,
            });

            return res.json({
                success: true,
                message: "Congratulations! Your Team member has been successfully added!"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

    router.get('/teammemberdata/:userid', async (req, res) => {
        try {
            let userid = req.params.userid;
            const teammemberdata = (await Team.find({ userid: userid}));
            res.json(teammemberdata);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.get('/getteamdata/:teamid', async (req, res) => {
        try {
            const teamid = req.params.teamid;
            console.log(teamid);
    
            const result = await Team.findById(teamid);
    
            if (result) {
                res.json({
                    Success: true,
                    message: "teamdata retrieved successfully",
                    team: result
                });
            } else {
                res.status(404).json({
                    Success: false,
                    message: "teamdata not found"
                });
            }
        } catch (error) {
            console.error("Error retrieving teamdata:", error);
            res.status(500).json({
                Success: false,
                message: "Failed to retrieve teamdata"
            });
        }
    });
    
    
    // Update a restaurant using POST
    router.post('/updateteamdata/:teamid', async (req, res) => {
        try {
            const teamid = req.params.teamid; // Fix here
            const updatedteamdata = req.body;
        
            const result = await Team.findByIdAndUpdate(teamid, updatedteamdata, { new: true });
        
            if (result) {
                res.json({
                    Success: true,
                    message: "teamdata updated successfully",
                    team: result
                });
            } else {
                res.status(404).json({
                    Success: false,
                    message: "teamdata not found"
                });
            }
        } catch (error) {
            console.error("Error updating teamdata:", error);
            res.status(500).json({
                Success: false,
                message: "Failed to update teamdata"
            });
        }
    });


    router.get('/delteammember/:teamid', async (req, res) => {
        try {
            const teamid = req.params.teamid;
    
            const result = await Team.findByIdAndDelete(teamid);
    
            if (result) {
                res.json({
                    Success: true,
                    message: "teammember deleted successfully"
                });
            } else {
                res.status(404).json({
                    Success: false,
                    message: "teammember not found"
                });
            }
        } catch (error) {
            console.error("Error deleting teammember:", error);
            res.status(500).json({
                Success: false,
                message: "Failed to delete teammember"
            });
        }
    });

    router.get('/timezones', (req, res) => {
        // Get a list of timezones using moment-timezone
        const timezones = momentTimezone.tz.names();
      
        // Send the list of timezones as a JSON response
        res.json(timezones);
      });

    

        // Fetch single category
router.get('/getcategories/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const categories = await Category.findById(categoryId);
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// Fetch categories for a restaurant
router.get('/getrestaurantcategories/:restaurantId', async (req, res) => {
try {
const restaurantId = req.params.restaurantId;
const categories = await Category.find({restaurantId: restaurantId});
res.json(categories);
} catch (error) {
console.error('Error fetching categories:', error);
res.status(500).json({ message: 'Internal server error' });
}
});

// Add a new category
router.post('/categories', async (req, res) => {
    try {
        const newCategory = req.body; // You should validate and sanitize this data
        const category = new Category(newCategory);
        await category.save();
        res.json({ success: true, message: 'Category added successfully' });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ success: false, message: 'Failed to add category' });
    }
});

// Edit a category
router.put('/categories/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const updatedCategory = req.body; // You should validate and sanitize this data
        const result = await Category.findByIdAndUpdate(categoryId, updatedCategory, { new: true });
        if (result) {
            res.json({ success: true, message: 'Category updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ success: false, message: 'Failed to update category' });
    }
});

// Delete a category
router.delete('/categories/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const result = await Category.findByIdAndDelete(categoryId);
        if (result) {
            res.json({ success: true, message: 'Category deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Category not found' });
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ success: false, message: 'Failed to delete category' });
    }
});

        // Fetch single subcategory
        router.get('/getsinglesubcategory/:subcategoryId', async (req, res) => {
            try {
                const subcategoryId = req.params.subcategoryId;
                const subcategories = await Subcategory.findById(subcategoryId);
                res.json(subcategories); 
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        // Fetch subcategories for a category
        router.get('/getsubcategories/:categoryId', async (req, res) => {
        try {
        const categoryId = req.params.categoryId;
        const subcategories = await Subcategory.find({category: categoryId});
        res.json(subcategories);
        } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ message: 'Internal server error' });
        }
        });
        // Fetch items for a subcategory
router.get('/getitems/:subcategoryId', async (req, res) => {
        try {
        const subcategoryId = req.params.subcategoryId;
        const items = await Items.find({subcategoryId: subcategoryId});
        res.json(items);
        } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Internal server error' });
        }
        });

        // Add a new subcategory
router.post('/subcategories', async (req, res) => {
    try {
        const newSubCategory = req.body; // You should validate and sanitize this data
        const Subcategoryd = new Subcategory(newSubCategory);
        await Subcategoryd.save();
        res.json({ success: true, message: 'Subcategory added successfully' });
    } catch (error) {
        console.error('Error adding Subcategory:', error);
        res.status(500).json({ success: false, message: 'Failed to add Subcategory' });
    }
});

// Delete a subcategory
router.delete('/subcategories/:subcategoryId', async (req, res) => {
    try {
        const subcategoryId = req.params.subcategoryId;
        const result = await Subcategory.findByIdAndDelete(subcategoryId);
        if (result) {
            res.json({ success: true, message: 'Subcategory deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Subcategory not found' });
        }
    } catch (error) {
        console.error('Error deleting Subcategory:', error);
        res.status(500).json({ success: false, message: 'Failed to delete Subcategory' });
    }
});

// Edit a subcategory
router.put('/subcategoriesupdate/:subcategoryId', async (req, res) => {
    try {
        const subcategoryId = req.params.subcategoryId;
        const updatedsubCategory = req.body; // You should validate and sanitize this data
        const result = await Subcategory.findByIdAndUpdate(subcategoryId, updatedsubCategory, { new: true });
        if (result) {
            res.json({ success: true, message: 'subCategory updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'subCategory not found' });
        }
    } catch (error) {
        console.error('Error updating subCategory:', error);
        res.status(500).json({ success: false, message: 'Failed to update subCategory' });
    }
});

        // get all item
        router.get('/itemsall', async (req, res) => {
            try {
                const result = await Items.find();
                if (result) {
                    res.json({ success: true, items: result, message: 'Items get successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'Items not found' });
                }
            } catch (error) {
                console.error('Error adding item:', error);
                res.status(500).json({ success: false, message: 'Failed to add item' });
            }
        });

        // add offers
        router.post('/offers', async (req, res) => {
            try {
                const formData = req.body;
                const newOffer = new Offers(formData);
                await newOffer.save();
                res.json({ success: true, message: 'Offer added successfully' });
            } catch (error) {
                console.error('Error adding offer:', error);
                res.status(500).json({ success: false, message: 'Failed to add offer' });
            }
        });

        router.post('/WeeklyOffers', async (req, res) => {
            try {
                // const { searchResults, startTime, endTime, selectedDays } = req.body;
        
                const newWeeklyOffer = new WeeklyOffers(req.body);
        
                await newWeeklyOffer.save();
                res.json({ success: true, message: 'WeeklyOffer added successfully' });
            } catch (error) {
                console.error('Error adding WeeklyOffer:', error);
                res.status(500).json({ success: false, message: 'Failed to add WeeklyOffer' });
            }
        });

        //  get all Offers Items
         router.get('/offeritemsall', async (req, res) => {
            try {
                const result = await Offers.find();
                if (result) {
                    res.json({ success: true, offers: result, message: 'Offers Items get successfully' });
                } else {
                    res.status(404).json({ success: false, message: 'Offers Items not found' });
                }
            } catch (error) {
                console.error('Error adding Offers Items:', error);
                res.status(500).json({ success: false, message: 'Failed to add Offers Items' });
            }
        });

        router.get('/weeklyofferitemsall', async (req, res) => {
            try {
              // Fetch all offers from the database
              const offers = await WeeklyOffers.find();
          
              // Send the offers as a JSON response to the frontend
              res.json({ success: true, offers });
            } catch (error) {
              console.error('Error fetching offers:', error);
              // Send an error response to the frontend
              res.status(500).json({ success: false, message: 'Failed to fetch offers' });
            }
          });

        // Add a new item
        router.post('/items', async (req, res) => {
            try {
                const newItem = req.body; // You should validate and sanitize this data
                const addedItem = new Items(newItem);
                await addedItem.save();
                res.json({ success: true, message: 'Item added successfully' });
            } catch (error) {
                console.error('Error adding item:', error);
                res.status(500).json({ success: false, message: 'Failed to add item' });
            }
        });

        // Fetch items for a restaurant
router.get('/getrestaurantitems/:restaurantId', async (req, res) => {
    try {
    const restaurantId = req.params.restaurantId;
    const items1 = await Items.find({restaurantId: restaurantId});
    res.json(items1);
    } catch (error) {
    console.error('Error fetching Items:', error);
    res.status(500).json({ message: 'Internal server error' });
    }
    });

    // Delete a item
router.delete('/delitems/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const results = await Items.findByIdAndDelete(itemId);
        if (results) {
            res.json({ success: true, message: 'Items deleted successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Items not found' });
        }
    } catch (error) {
        console.error('Error deleting Subcategory:', error);
        res.status(500).json({ success: false, message: 'Failed to delete Subcategory' });
    }
});


        // Fetch single subcategory
        router.get('/getsingleitem/:itemId', async (req, res) => {
            try {
                const itemId = req.params.itemId;
                const item = await Items.findById(itemId);
                res.json(item);
            } catch (error) {
                console.error('Error fetching single item:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });

        // Edit a Items
router.put('/itemsupdate/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const updateditem = req.body; // You should validate and sanitize this data
        const result1 = await Items.findByIdAndUpdate(itemId, updateditem, { new: true });
        if (result1) {
            res.json({ success: true, message: 'Items updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Items not found' });
        }
    } catch (error) {
        console.error('Error updating Items:', error);
        res.status(500).json({ success: false, message: 'Failed to update Items' });
    }
});

router.post('/menu', async (req, res) => {
    try {
        const { itemId, sectionName,restaurantId } = req.body;

        const newMenu = new Menu({
            items: itemId,
            name: sectionName,
            restaurantId: restaurantId
        });

        await newMenu.save();
        res.json({ Success: true, message: 'Menu created successfully' });
    } catch (error) {
        console.error("Error creating Menu:", error);
        res.status(500).json({ Success: false, message: 'Failed to create Menu', error: error.message });
    }
});



router.get('/menu/:restaurantId', async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const menuItems = await Menu.find({ restaurantId });
        res.json(menuItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/getmenu/:menuItemId', async (req, res) => {
    try {
        const menuItemId = req.params.menuItemId;
        const result = await Menu.findById(menuItemId);

        if (result) {
            res.json({
                Success: true,
                message: "Menu retrieved successfully",
                menu: result
            });
        } else {
            res.status(404).json({
                Success: false,
                message: "Menu not found"
            });
        }
    } catch (error) {
        console.error("Error fetching Menu:", error);
        res.status(500).json({
            Success: false,
            message: "Failed to fetch Menu"
        });
    }
});


router.post('/menu/:menuItemId', async (req, res) => {
    try {
      const menuItemId = req.params.menuItemId;
      const updatedmenu = req.body;
  
      const result = await Menu.findByIdAndUpdate(menuItemId, updatedmenu, { new: true });
  
      if (result) {
        res.json({
          Success: true,
          message: "Menu updated successfully",
          menu: result
        });
      } else {
        res.status(404).json({
          Success: false,
          message: "Menu not found"
        });
      }
    } catch (error) {
      console.error("Error updating Menu:", error);
      res.status(500).json({
        Success: false,
        message: "Failed to update Menu"
      });
    }
  });

router.delete('/menu/:id', async (req, res) => {
    try {
        const deletedMenu = await Menu.findByIdAndDelete(req.params.id);

        if (deletedMenu) {
            res.json({ Success: true, message: 'Menu deleted successfully' });
        } else {
            res.json({ Success: false, message: 'Menu not found' });
        }
    } catch (error) {
        res.json({ Success: false, message: 'Failed to delete Menu' });
    }
});

router.get('/menu/:restaurantId', async (req, res) => {
    try {
        const restaurantId = req.params.restaurantId;
        const menuItems = await Menu.find({ restaurantId: restaurantId });
        res.json(menuItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/foodData',(req,res)=>{
    try{
        res.send([global.food_items,global.foodCategory])
    }
    catch(error){
        console.error(error.message);
        res.send("Server Error")
    }
})


  // API endpoint to save user preferences
  router.post('/saveColorPreferences', async (req, res) => {
    try {
      const { userid,restaurantId, userPreference } = req.body;
  
      // Create a new user preference document
      const newPreference = new UserPreference({
        userId: userid,
        restaurantId: restaurantId,
        backgroundColor: userPreference.backgroundColor,
        textColor: userPreference.textColor,
        headingTextColor: userPreference.headingTextColor,
        categoryColor: userPreference.categoryColor,
        font: userPreference.font,
        fontlink: userPreference.fontlink,
        // Add other preferences here
      });
  
      // Save the user preference to the database
      const savedPreference = await newPreference.save();
  
      res.json(savedPreference);
    } catch (error) {
      console.error('Error saving user preferences:', error);
      res.status(500).json({ error: 'Failed to save user preferences' });
    }
  });


  // In your backend API (e.g., Express.js)
router.get('/getUserPreferences/:userid', async (req, res) => {
    try {
      const userid = req.params.userid;
      // Retrieve user preferences from the database based on the user ID
      const userPreferences = await UserPreference.find({ userId: userid });
      res.json(userPreferences);
    } catch (error) {
      console.error('Error retrieving user preferences:', error);
      res.status(500).json({ error: 'Failed to retrieve user preferences' });
    }
  });
  

module.exports = router;
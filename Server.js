const express=require('express');
require('dotenv').config();
const bodyParser=require('body-parser');
const cors=require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const your_secret_key=process.env.SECRET_KEY;
const app=express();

const port=process.env.PORT||5000;
app.use(cors());
app.use(bodyParser.json());

const username = encodeURIComponent(process.env.USER_NAME);
const password = encodeURIComponent(process.env.PASSWORD);
const schema = encodeURIComponent(process.env.SCHEMA);

const uri = `mongodb+srv://${username}:${password}@${schema}.unudtgt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

//database name
const database=client.db(process.env.DATABASE_NAME);

//user preferences collection
const userCollectionName=process.env.USER_COLLECTION;
const userCollection=database.collection(userCollectionName);

//Admin Login preferences collection
const AdminCollectionName=process.env.ADMIN_COLLECTION;
const adminCollection=database.collection(AdminCollectionName);

//Task details collection
const taskCollectionName=process.env.TASK_COLLECTION;
const taskCollection=database.collection(taskCollectionName);

// Middleware for verifying JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({message:'Unauthorized'});

  jwt.verify(token, your_secret_key, (err, user) => {
    if (err) return res.status(403).json({message:'Invalid token'});
    req.user = user;
    next();
  });
};


//User Signup
app.post('/api/usersignup', async (req, res) => {
    const { name, email, password } = req.body;
    const details=[
        {
            name:name,
            email:email,
            password:password,
            isAdmin:false,
        }
    ]
  
    try {
      // Check if the username is already taken
       const existingUser = await userCollection.findOne({email});

       if (existingUser) {
         return res.status(400).json({ error: 'User already Exists' });
       }
  
      // Create a new user
      const insert = await userCollection.insertMany(details);
      console.log(`${insert.insertedCount} documents successfully inserted.\n`);
      res.json({ message: 'Signup successful' });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

//User Login
app.post('/api/userlogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // authorizing user
     const user = await userCollection.findOne({email,password});

     if (user) {
      const token = jwt.sign({ username:user.email, isAdmin: user.isAdmin }, your_secret_key);
      return res.json({ success:'successfully logged in',details:user,token:token});
     }else{
      return res.status(400).json({error:'sorry no user found or invalid credentials'})
     }

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Admin login
app.post('/api/adminlogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // authorizing Admin
     const user = await adminCollection.findOne({email,password});

     if (user) {
      const token = jwt.sign({ username:user.email, isAdmin: user.isAdmin }, your_secret_key);
       return res.json({ success:'successfully logged in',details:user,token:token});
     }else{
      return res.status(400).json({error:'invalid credentials'})
     }

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//Add new Tasks
app.post('/api/tasks/:userId', verifyToken, async (req, res) => {
  const { title, description, dueDate, status } = req.body;
  const userId = req.params.userId;

  const taskDetails=[
    {
      title:title,
      description:description,
      duedate:dueDate,
      status:status,
      userId:userId
    }
  ]

  try {
    // Create a new task
    const insert = await taskCollection.insertMany(taskDetails);
    console.log(`${insert.insertedCount} documents successfully inserted.\n`);
    res.json({ message: 'new task successfully added' });
  } catch (error) {
    console.error('Error during adding new task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//fetch tasks from database
app.post('/api/taskdetails/:userId', verifyToken, async (req,res)=>{
  const user=req.params.userId;
  const { isAdmin } = req.body; 

  try {
    // get tasks
    if(isAdmin){
      const tasks = await taskCollection.find().toArray();
      res.json(tasks);
    }else if(!isAdmin) {
      const tasks = await taskCollection.findOne({"userId":user});
      if(tasks!=null){
        const userTask=await taskCollection.find({"userId":user}).toArray();
        res.json(userTask);
      }else{
        res.json([{message:'sorry no task found add tasks first'}])
      }
    }
  } catch (error) {
    console.error('Error during fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//updating existing tasks
app.post('/api/updatetasks/:userId', verifyToken, async (req, res) => {
  const { title, description, dueDate, status } = req.body;
  const userId=req.params.userId;
  const updateTask={
      $set:{
          title:title,
          description:description,
          duedate:dueDate,
          status:status
      }
    }

  try {
    // update task
    const update = await taskCollection.updateOne({userId},updateTask);
    console.log(`${update.matchedCount} documents successfully updated.\n`);
    res.json({ message: 'Task successfully updated' });
  } catch (error) {
    console.error('Error during updating task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//deleting existing tasks
app.post('/api/deletetasks', verifyToken, async (req, res) => {
  const { id } = req.body;

  try {
    // delete task
    const deletetask = await taskCollection.deleteOne({id});
    console.log(`${deletetask.deletedCount} documents successfully deleted.\n`);
    res.json({ message: 'Task successfully deleted' });
  } catch (error) {
    console.error('Error during deleting task:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port,()=>console.log(`Server Running on PORT ${port}`));
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const secret = process.env.DB_SECRET;

// middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());





const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.isawup7.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      //  await client.connect();
      // Send a ping to confirm a successful connection
      const Assignment = client.db("Assignment").collection('data')
      const AssignmentSubmistionUser = client.db("Assignment").collection('submitted')
      // const gateman = (req, res,next) => {

      //    const { token } = req.cookies;
      //    if(!token){
      //       return res.status(401).send({message:'Invalid'});
      //    }
      //    // console.log(token);
      //    jwt.verify(token, secret, function (err, decoded) {
      //       if(err){
      //          return res.status(401).send({message:'Invalid'});

      //       }
      //       console.log(decoded);
      //       next();
      //    });
      // }
      app.get('/data',   async (req, res) => {
         // data filltaring
         let queryObj = {};
         const level = req.query.level;

         if (level) {
            queryObj.level = level;
         }

         const cursor = Assignment.find(queryObj);
         const result = await cursor.toArray();
         res.send(result);
      })

      // app.post('/data', async (req, res) => {
      //    const newAssignment = req.body;
      //    console.log(newAssignment);
      //    const result = await Assignment.insertOne(newAssignment);
      //    //  console.log(result);
      //    res.send(result);
      // })
      app.get('/data/:id', async(req,res)=>{
         const id = req.params.id;
         const  query = { _id: new ObjectId(id)};

         const options ={
            projection : { title :1 , description:1,title:1,photo:1,date:1,pdf:1,level:1,marks:1,email:1}
         }

         const result = await Assignment.findOne(query,options);
         res.send(result);
      })

      app.post('/submitted',async(req,res )=>{
         const myData =  req.body ;
         console.log(myData);
         const result = await AssignmentSubmistionUser.insertOne(myData);
         res.send(result);
      })

      app.get('/submitted',async(req,res)=>{
         let queryObj = {};
         const level = req.query.level;

         if (level) {
            queryObj.level = level;
         }

         const cursor = AssignmentSubmistionUser.find(queryObj);
         const result = await cursor.toArray();
         
         res.send(result);
      });
      app.delete('/submitted/:id',async(req,res)=>{
         const id = req.params.id;
         
         const query = { _id: new ObjectId(id) };
         const result = await AssignmentSubmistionUser.deleteOne(query);
         console.log(result);
         res.send(result);
      })
      
      

      
      // app.delete('/submitted/:id', async (req, res) => {

      //    const id = req.params.submittedId;
      //    const query = { _id: new ObjectId(id) };
      //    const result = await AssignmentSubmistionUser.deleteOne(query)
      //    res.send(result);

      // })
      // app.post('api/v1/auth/access-token', (req, res) => {

      //    const user = req.body;

      //    const token = jwt.sign(user, secret, { expiresIn: 60 * 60 });

      //    req.cookies('token', token, {
      //       httpOnly: true,
      //       secure: false,
      //       sameSite: 'none'
      //    }).send({ success: true });

      // });
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      //  await client.close();
   }
}
run().catch(console.dir);


app.get('/', (req, res) => {

   res.send('Assignment running');
})

app.listen(port, () => {
   console.log(`Assignment server is running on  port ${port}`);
})
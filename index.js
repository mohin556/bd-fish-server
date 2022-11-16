const express = require('express')

const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
const app = express()
const port = process.env.PORT || 5000;
var cors = require('cors')
require('dotenv').config()





app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('BD FISH WORLD!')
  })

  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6esat.mongodb.net/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 async function run(){
   
    try{
      await client.connect();
     
      const database = client.db("fishCorner");
      const servicesCollection = database.collection("service");
      const oderCollection = database.collection("oderItem");
      const extraCollection = database.collection("advantage");
      const adminCollection = database.collection("admin");

    app.get('/lists', async(req,res) =>{
      const email = req.query.email;
       const query = {email: email };
       const cursor = oderCollection.find(query);
       const  item = await cursor.toArray()
       res.send(item)
    })

    // Set for Admin

    app.get('/list', async(req,res) =>{
       const query = {};
       const cursor = oderCollection.find(query);
       const  item = await cursor.toArray()
       res.send(item)
    })

    
   


    app.get('/advantage',async(req,res)=>{
         const query ={};
         const cursor = extraCollection.find(query);
         const detail = await cursor.toArray()
         res.send(detail)
    })
    app.get('/advantage/:id',async(req,res)=>{
     const id = req.params.id;
     const query ={_id: ObjectID(id)}
     const result = await extraCollection.findOne(query);
     res.send(result)

    })



    app.get('/lists/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectID(id)}
      const result = await oderCollection.findOne(query);
      res.send(result)
    })
     app.post('/admin',async(req,res)=>{
      const admin = req.body;
      const result = await adminCollection.insertOne(admin)
      console.log(result)
      res.send({result})
     })
     app.post ('/isAdmin',async(req,res)=>{
        const email = req.body.email;
        const admin = adminCollection.find({email: email })
        const mohin = await  admin.toArray()
        res.send(mohin.length > 0)


     })






     app.get('/admin',async(req,res)=>{
      const query = {}
      const cursor = adminCollection.find(query)
      const admins = await cursor.toArray()

      res.send(admins)
     })

     app.post('/senddata',async(req,res)=>{  
          const newData = req.body;
          
          const result = await oderCollection.insertOne(newData)
          res.send({result : 'success'})

         })
     app.get('/services', async(req,res)=>{ 
        const testing = servicesCollection.find({});
        const service = await testing.toArray()
        res.send(service)
     })
     app.put('/services/:id', async(req,res) =>{
          const id = req.params.id;
          const find = {_id: ObjectID(id)};
          const updated = req.body;
          const option = { upsert: true};
          const updateDoc = {
            $set: {
              Name :updated.Name,
              image: updated.image,
              price: updated.price,
              description: updated.description
            }
          }
          const result = await servicesCollection.updateOne(find,updateDoc,option);
          res.send(result);
     })
     app.get('/services/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectID(id)};
        const result = await servicesCollection.findOne(query);
        res.send(result)


     })

     app.delete('/items/:id', async(req,res)=>{
       
      const id = req.params.id;
      const query = {_id: ObjectID(id)}
      const result = await servicesCollection.deleteOne(query);
      res.send(result);


     })

     app.delete('/delete/:id', async(req,res)=>{
         const id = req.params.id;
         const query = {_id:ObjectID(id)}
         const result = await oderCollection.deleteOne(query);
         res.send(result)
     })

 
  



     

    
      app.post('/services', async(req,res)=>{
         const details = req.body;
      //  console.log("try to hitting", details)
       const result = await servicesCollection.insertOne(details);
     
       res.send(result)
      })


    }
  
   finally{
    // await client.close();
   }


 }
 run().catch(console.dir);







  app.listen(port, () => {
    console.log(`BD FISH CORNER listening on port ${port}`)
  })
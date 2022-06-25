const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();
const port=process.env.PORT||5000
const app=express()
app.use(express.json())
//
// const corsConfig = {
//     origin: '*',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
app.use(cors({origin:"https://final-hero-project.web.app"}))
// app.options("*", cors(corsConfig))
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*")
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization")
//     next()
// })



// 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uhtrr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run()
{
    try{
        await client.connect();
        const toolCollection=client.db('toolsList').collection('tools')
        const bookingCollection=client.db('toolsList').collection('bookings')
        const commentsCollection=client.db('toolsList').collection('comments')
        const userProfileList=client.db('toolsList').collection('profile')
        const userCollection=client.db('toolsList').collection('users')
        app.get('/tools',async(req,res)=>{
            const query={};
            const cursor=toolCollection.find(query)
            const tools=await cursor.toArray();
            res.send(tools);
        })  
        app.post('/tools',async(req,res)=>{
            const toolsPost=req.body;
            const resultItem=await toolCollection.insertOne(toolsPost);
            res.send(resultItem)
        })
        app.delete('/tools/:id',async(req,res)=>
        {
            const id=req.params.id;
            console.log(id)
            const query={_id:ObjectId(id)};
            const result=await toolCollection.deleteOne(query)
            res.send(result);
        })
        // app.put('/tools/:id',async(req,res)=>
        // {
        //   const id=req.params.id;
        //   const updateQuantity=req.body;
        //   const filter={_id:ObjectId(id)}
        //   const options={upsert:true}
        //   const updateDoc={
        //     $set:
        //     {
        //         minimum:updateQuantity.quantity,
        //     }
        //   };
        //   const resultQuantity =await toolCollection.updateOne(filter,updateDoc,options)
        //   res.send(resultQuantity)
        // })
        app.get('/user',async(req,res)=>{
            const users =await userCollection.find().toArray();
            res.send(users)
        })
        app.get('/admin/:email',async(req,res)=>{
            const email=req.params.email;
            const user=await userCollection.findOne({email:email})
            const isAdmin=user.role==='admin';
            res.send({admin:isAdmin})
        })
        app.put('/user/admin/:email',async(req,res)=>{
            const email=req.params.email;
            const filter={email:email};
            const updateDoc={
                $set:{role:'admin'},
              };
            const userResult=await userCollection.updateOne(filter,updateDoc);
            res.send(userResult)
        })
        app.put('/user/:email',async(req,res)=>{
            const email=req.params.email;
            const filter={email:email};
            const user=req.body;
            const options={upsert:true};
            const updateDoc={
                $set:user,
              };
              const userResult=await userCollection.updateOne(filter,updateDoc,options);
              res.send(userResult)
        })
        app.get('/purchase/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:ObjectId(id)}
            const purchase=await toolCollection.findOne(query)
            res.send(purchase)
        })
        app.post('/booking',async(req,res)=>{
            const newTool=req.body;
            const result=await bookingCollection.insertOne(newTool);
            res.send(result)
        })
        app.get('/booking',async(req,res)=>{
            const email=req.query.email;
            const query={email:email};
            const cursor=bookingCollection.find(query)
            const showBooking=await cursor.toArray();
            res.send(showBooking);
        })
        app.get('/collectorder',async(req,res)=>{
            const query={};
            const cursor=bookingCollection.find(query)
            const showBookingAll=await cursor.toArray();
            res.send(showBookingAll);
        })

        app.post('/comments',async(req,res)=>{
            const comments=req.body;
            const resultComments=await commentsCollection.insertOne(comments);
            res.send(resultComments)
        })
        app.get('/comments',async(req,res)=>{
            const query={};
            const cursor=commentsCollection.find(query)
            const comments=await cursor.toArray();
            res.send(comments);
        })
        app.post('/profile',async(req,res)=>{
            const profile=req.body;
            const resultProfile=await userProfileList.insertOne(profile);
            res.send(resultProfile)
        })

    }
    finally
    {

    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Running')
})
app.listen(port,()=>{
    console.log('Listening',port)
})
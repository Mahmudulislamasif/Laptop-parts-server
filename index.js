const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port=process.env.PORT||5000
const app=express()

//middleware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uhtrr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run()
{
    try{
        await client.connect();
        const toolCollection=client.db('toolsList').collection('tools')
        const bookingCollection=client.db('bookingList').collection('bookings')
        const commentsCollection=client.db('commentsList').collection('comments')
        app.get('/tools',async(req,res)=>{
            const query={};
            const cursor=toolCollection.find(query)
            const tools=await cursor.toArray();
            res.send(tools);
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
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
        app.get('/tools',async(req,res)=>{
            const query={};
            const cursor=toolCollection.find(query)
            const tools=await cursor.toArray();
            res.send(tools);
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
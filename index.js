const express = require('express')
require("dotenv").config();
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')



// middleware 
app.use(express.json());
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ono972m.mongodb.net/?retryWrites=true&w=majority`;

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

        const tasksCollection = client.db('seo-page-task').collection('allTasks')


        app.get("/v1/allTask", async (req, res) => {
            const cursor = tasksCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })


        app.put("/v1/addFileTasks", async (req, res) => {
            const id = req.query.id;
            const file = req.query.file;
            const fileCount = parseInt(file)
            console.log(fileCount);
            console.log(id);
            let query = {};
            let updatedItem = {};
            if (id) {
                query = { _id: new ObjectId(id) };
                updatedItem = { $inc: { file : fileCount } };
            }
        
            const result = await tasksCollection.findOneAndUpdate(query ,updatedItem)
            res.send(result)
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World! job owner Your well Come ')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
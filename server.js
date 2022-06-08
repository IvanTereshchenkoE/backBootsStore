const express = require('express')
const app = express()
const port = 4000
var cors = require('cors')

const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;

app.use(cors())
app.use(express.urlencoded({
  extended: true,
}))
app.use(express.json())


var url = 'mongodb://localhost:27017/Store'

MongoClient.connect(url, function (err, database) {
  if (err) return console.log(err);
  myDbCollection = database.db('Store')
  console.log("Connecter to server success!")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


app.get('/', (req, res) => {
  res.send("hello world")
})

app.get('/products', (req, res) => {
  myDbCollection
    .collection('bootColections')
    .find()
    .toArray()
    .then(results => {
      console.log(results)
      res.json(results)
    })

})

app.post('/products', (req, res) => {
  myDbCollection.collection('bootColections').insertOne(req.body, (err, result) => {
    if (!err) {
      res.json(result)
    }
    console.log(result.insertedId)
  })
})


app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  const details = { '_id': new ObjectId(id) };
  myDbCollection.collection('bootColections').findOne(details, (err, item) => {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.send(item);
    }
  });
})

app.delete('/products/:id', (req, res) => {
  const id = req.params.id;
  const details = { '_id': new ObjectId(id) };
  myDbCollection.collection('bootColections').remove(details, (err, item) => {
    if (err) {
      res.send({ 'error': 'An error has occurred' });
    } else {
      res.send("id " + id + " deleted");
    }
  });
})

app.put('/products/:id', (req, res) => {
  const id = req.params.id;
  const details = { '_id': new ObjectId(id) };
  const note = { name: req.body.name, price: req.body.price};
  myDbCollection.collection('bootColections').updateOne(details, {$set: note}, (err, result) => {
    if (err) {
      res.send({'error':'An error has occurred'});
  } else {
      res.send(note);
  } 
  });
});



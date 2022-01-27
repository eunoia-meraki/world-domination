const express = require('express');
const mongoose = require('mongoose');
const Something = require('./model/something')

const PORT = process.env.PORT || 8001;

const app = express();
app.use(express.urlencoded({extended: true}));

async function start() {
  try {
    await mongoose.connect(
      'mongodb+srv://gasame6865:dtNWMqfU@cluster0.0u67a.mongodb.net/supertest'
    )

    app.get('/', async (req, res) => {
      const collection = await Something.find({});

      let view = '<h1>It Works! It must update right now!</h1>'
      view += '<ul>'
      collection.forEach((i) => {
        view += `<li>${i.title}</li>`
      })
      view += '</ul>'

      view += 
`
<form action="/add" method="POST">
  <h2>Create something</h2>
  <input type="text" name="title">
  <button type="submit">Create</button>
</form>
`
      res.end(view);
    })

    app.post('/add', async (req, res) => {
      const somethigg = new Something({
        title: req.body.title
      })

      await somethigg.save()

      res.redirect('/');
    })

    app.listen(PORT, () => {
      console.log('Server has been started...')
    })
  } catch (e) {
    console.log(e)
  }
}

start()
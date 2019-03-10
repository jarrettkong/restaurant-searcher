const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const Zomato = require('zomato.js')
const zomato = new Zomato(process.env.ZOMATO_API_KEY)

const app = express()


app.use(express.static(path.join(__dirname, 'static')))
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/search', async (req, res) => {
  try {
    const q = req.body.q;
    const data = await zomato.search({ entity_id: 305, entity_type: 'city', q })

    const restaurants = data.restaurants.map(r => {
      return {
        name: r.name,
        url: r.url,
        location: r.location,
        price: r.price_range,
        thumbnail: r.thumb,
        rating: r.user_rating.aggregate_rating,
      }
    })
    res.json({ restaurants })
  } catch (err) {
    console.error(err)
    res.status(500).send('error, yo')
  }
})

app.listen(3000, () => console.log('server started'))

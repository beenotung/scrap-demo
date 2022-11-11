import { db } from './db'
import express from 'express'
import { print } from 'listening-on'
import { proxy } from './proxy'
import { filter } from 'better-sqlite3-proxy'

let app = express()

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/hotels', (req, res) => {
  let page = +req.query.page! || 1
  let count = +req.query.count! || 10

  let hotel_ids = db.queryColumn<number>(
    'hotel_id',
    /* sql */ `
select distinct hotel_id
from feature_group
limit :limit
offset :offset
`,
    {
      limit: count,
      offset: (page - 1) * count,
    },
  )

  let hotels = hotel_ids.map(hotel_id => {
    let hotel = proxy.hotel[hotel_id]
    return {
      id: hotel_id,
      name: hotel.name,
      address: hotel.address,
      desc: hotel.desc,
      city: hotel.city?.name,
      area: hotel.city?.area?.name,
      images: filter(proxy.hotel_image, { hotel_id }).map(image => image.url),
      feature_groups: filter(proxy.feature_group, { hotel_id }).map(group => ({
        id: group.id,
        name: group.name,
        features: filter(proxy.feature, {
          feature_group_id: group.id!,
        }).map(feature => ({
          name: feature.name,
          is_available: !!feature.is_available,
        })),
      })),
    }
  })

  res.json({ hotels })
})

let port = 8100
app.listen(port, () => {
  print(port)
})

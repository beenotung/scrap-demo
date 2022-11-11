import { filter } from 'better-sqlite3-proxy'
import { db } from './db'
import { proxy } from './proxy'

// https://better-sql.surge.sh/
let text = `
select feature [
  name as feature_name
  is_available
  feature_group {
    name as group_name
    hotel {
      name as hotel_name
    }
  }
]
`

let hotel_ids = db.queryColumn<number>(
  'hotel_id',
  /* sql */ `
select distinct hotel_id
from feature_group
limit 10
`,
)

for (let hotel_id of hotel_ids) {
  let hotel = proxy.hotel[hotel_id]
  console.dir(
    {
      id: hotel_id,
      name: hotel.name,
      address: hotel.address,
      desc: hotel.desc,
      city: hotel.city?.name,
      area: hotel.city?.area?.name,
      images: filter(proxy.hotel_image, { hotel_id }).map(image => image.url),
      feature_groups: filter(proxy.feature_group, { hotel_id }).map(group => ({
        name: group.name,
        features: filter(proxy.feature, { feature_group_id: group.id! }).map(
          feature => ({
            name: feature.name,
            is_available: feature.is_available,
          }),
        ),
      })),
    },
    { depth: 20 },
  )
}

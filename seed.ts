import { proxy } from './proxy'

function collect() {
  console.log(
    Array.from(
      document.querySelectorAll<HTMLLIElement>('li[data-element-object-id]'),
    ).map(li => ({ id: li.dataset.elementObjectId, text: li.dataset.text })),
  )
}

let cityList = [
  {
    id: '5085',
    text: 'Tokyo',
  },
  {
    id: '9590',
    text: 'Osaka',
  },
  {
    id: '1784',
    text: 'Kyoto',
  },
  {
    id: '717899',
    text: 'Okinawa Main island',
  },
  {
    id: '16527',
    text: 'Fukuoka',
  },
  {
    id: '3435',
    text: 'Sapporo',
  },
]

proxy.area[1] = {
  name: 'Japan',
}

for (let city of cityList) {
  proxy.city[+city.id] = {
    area_id: 1,
    name: city.text,
    code: null,
  }
}

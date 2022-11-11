import { find, unProxy } from 'better-sqlite3-proxy'
import { chromium } from 'playwright'
import { proxy } from './proxy'

let date = '2022-11-22'

function toListPageUrl(options: { city_id: number }) {
  return `https://www.agoda.com/search?checkin${date}=&los=8&city=${options.city_id}&adults=2&children=0&rooms=1`
}

function toDetailPageUrl(options: { city_code: string; hotel_code: string }) {
  return `https://www.agoda.com/${options.hotel_code}/hotel/${options.city_code}.html?finalPriceView=1&isShowMobileAppPrice=false&cid=-1&numberOfBedrooms=&familyMode=false&adults=2&children=0&rooms=1&maxRooms=0&checkIn=${date}&isCalendarCallout=false&childAges=&numberOfGuest=0&missingChildAges=false&travellerType=-1&showReviewSubmissionEntry=false&currencyCode=HKD&isFreeOccSearch=false&isCityHaveAsq=false&tspTypes=-1&los=8`
}

async function main() {
  let browser = await chromium.launch({ headless: false })
  let page = await browser.newPage()
  let cities = unProxy(proxy.city)
  for (let city of cities) {
    let url = toListPageUrl({ city_id: city.id! })
    console.log('city link:', url)
    await page.goto(url)
    let hotelLinks = await page.evaluate(() => {
      return new Promise<{ id: number; href: string }[]>((resolve, reject) => {
        function scrollToBottom() {
          let list = document.querySelectorAll('li[data-hotelid]')
          let oldCount = list.length
          let last = list[list.length - 1]
          last.scrollIntoView()
          setTimeout(() => {
            let list = document.querySelectorAll('li[data-hotelid]')
            let newCount = list.length
            if (newCount > oldCount) {
              scrollToBottom()
            } else {
              collect()
            }
          }, 3000)
        }
        setTimeout(scrollToBottom)
        function collect() {
          let hotels = Array.from(
            document.querySelectorAll<HTMLAnchorElement>('li[data-hotelid]'),
          ).map(li => ({
            id: +li.dataset.hotelid!,
            href: li.querySelector<HTMLAnchorElement>('a.PropertyCard__Link')
              ?.href!,
          }))
          resolve(hotels)
        }
      })
    })
    for (let hotelLink of hotelLinks) {
      let hotel_id = hotelLink.id
      let hotel_href = hotelLink.href
      console.log('hotel link:', hotel_href)
      let parts = new URL(hotel_href).pathname.split('/')
      let hotel_code = parts[1]
      let city_code = parts[3]
      if (hotel_id in proxy.hotel) {
        console.log('skip hotel')
        continue
      }
      console.log({ hotel_code, city_code })
      if (!city.code) {
        city.code = city_code
      }
      for (;;) {
        await page.goto(hotel_href)
        let hotel_name = await page.evaluate(() => {
          return document.querySelector('[data-selenium="hotel-header-name"]')
            ?.textContent
        })
        if (hotel_name) {
          break
        }
        await sleep(5000)
      }
      let data = await page.evaluate(() => {
        let hotel = {
          name: document.querySelector('[data-selenium="hotel-header-name"]')
            ?.textContent,
          address: document.querySelector('[data-selenium="hotel-address-map"]')
            ?.textContent,
          desc: document.querySelector(
            '[data-element-name="property-short-description"]',
          )?.textContent,
        }
        let images = Array.from(
          document.querySelectorAll<HTMLImageElement>(
            '[data-element-name="hotel-mosaic"] img',
          ),
        ).map(img => img.src)
        let features = Array.from(
          document.querySelectorAll(
            '[data-element-name="abouthotel-amenities-facilities"] .FeatureGroup p',
          ),
        ).map(p => {
          let group_title = p.textContent
          let features = Array.from(
            p.parentElement!.querySelectorAll<HTMLDivElement>(
              '[data-element-name="property-feature"]',
            ),
          ).map(feature => {
            let name = feature.textContent
            let value = feature.dataset.elementValue
            return {
              name,
              is_available: value != 'unavailable',
            }
          })

          return { group_title, features }
        })
        return { hotel, images, features }
      })
      proxy.hotel[hotel_id] = {
        city_id: city.id!,
        code: hotel_code,
        address: data.hotel.address!,
        name: data.hotel.name!,
        desc: data.hotel.desc || '',
      }
      for (let url of data.images) {
        proxy.hotel_image.push({
          hotel_id,
          url: url,
        })
      }
      for (let feature_group of data.features) {
        let feature_group_id = proxy.feature_group.push({
          hotel_id,
          name: feature_group.group_title!,
        })
        for (let feature of feature_group.features) {
          proxy.feature.push({
            feature_group_id,
            is_available: feature.is_available ? 1 : 0,
            name: feature.name!,
          })
        }
      }
    }
    return 'todo'
  }
  await page.close()
  await browser.close()
}
main().catch(e => console.error(e))

function sleep(ms: number) {
  return new Promise<void>((resolve, reject) => setTimeout(resolve, ms))
}

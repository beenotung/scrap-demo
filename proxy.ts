import { proxySchema } from 'better-sqlite3-proxy'
import { db } from './db'

export type Area = {
  id?: number | null
  name: string
}

export type City = {
  id?: number | null
  name: string
  code: string | null
  area_id: number
  area?: Area
}

export type Hotel = {
  id?: number | null
  city_id: number
  city?: City
  code: string
  name: string
  address: string
  desc: string
}

export type FeatureGroup = {
  id?: number | null
  name: string
  hotel_id: number
  hotel?: Hotel
}

export type Feature = {
  id?: number | null
  feature_group_id: number
  feature_group?: FeatureGroup
  name: string
  is_available: number
}

export type HotelImage = {
  id?: number | null
  hotel_id: number
  hotel?: Hotel
  url: string
}

export type Facility = {
  id?: number | null
  name: string
}

export type HotelFacility = {
  id?: number | null
  hotel_id: number
  hotel?: Hotel
  facility_id: number
  facility?: Facility
}

export type Room = {
  id?: number | null
  type: string
  hotel_id: number
  hotel?: Hotel
  original_price: number
  discount_price: number
}

export type RoomTag = {
  id?: number | null
  room_id: number
  room?: Room
}

export type RoomImage = {
  id?: number | null
  room_id: number
  room?: Room
  url: string
}

export type DBProxy = {
  area: Area[]
  city: City[]
  hotel: Hotel[]
  feature_group: FeatureGroup[]
  feature: Feature[]
  hotel_image: HotelImage[]
  facility: Facility[]
  hotel_facility: HotelFacility[]
  room: Room[]
  room_tag: RoomTag[]
  room_image: RoomImage[]
}

export let proxy = proxySchema<DBProxy>({
  db,
  tableFields: {
    area: [],
    city: [
      /* foreign references */
      ['area', { field: 'area_id', table: 'area' }],
    ],
    hotel: [
      /* foreign references */
      ['city', { field: 'city_id', table: 'city' }],
    ],
    feature_group: [
      /* foreign references */
      ['hotel', { field: 'hotel_id', table: 'hotel' }],
    ],
    feature: [
      /* foreign references */
      ['feature_group', { field: 'feature_group_id', table: 'feature_group' }],
    ],
    hotel_image: [
      /* foreign references */
      ['hotel', { field: 'hotel_id', table: 'hotel' }],
    ],
    facility: [],
    hotel_facility: [
      /* foreign references */
      ['hotel', { field: 'hotel_id', table: 'hotel' }],
      ['facility', { field: 'facility_id', table: 'facility' }],
    ],
    room: [
      /* foreign references */
      ['hotel', { field: 'hotel_id', table: 'hotel' }],
    ],
    room_tag: [
      /* foreign references */
      ['room', { field: 'room_id', table: 'room' }],
    ],
    room_image: [
      /* foreign references */
      ['room', { field: 'room_id', table: 'room' }],
    ],
  },
})

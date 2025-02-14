import type { ActionDefinition } from '@segment/actions-core'
import type { Settings } from '../generated-types'
import type { Payload } from './generated-types'
import {
  email_as_identifier,
  getEventParameteres,
  phone_number_as_identifier,
  segment_anonymous_id,
  timestamp,
  user_attributes,
  uuid,
  append_arrays
} from '../insider-properties'
import { API_BASE, sendBulkTrackEvents, sendTrackEvent, UPSERT_ENDPOINT } from '../insider-helpers'

const action: ActionDefinition<Settings, Payload> = {
  title: 'Product Removed Event',
  description: 'Record Product Removed Event to Insider',
  defaultSubscription: 'type = "track" and event = "Product Removed"',
  fields: {
    email_as_identifier: { ...email_as_identifier },
    phone_number_as_identifier: { ...phone_number_as_identifier },
    append_arrays: { ...append_arrays },
    uuid: { ...uuid },
    segment_anonymous_id: { ...segment_anonymous_id },
    timestamp: { ...timestamp },
    parameters: {
      ...getEventParameteres([
        'taxonomy',
        'url',
        'currency',
        'unit_price',
        'unit_sale_price',
        'referrer',
        'product_id',
        'name',
        'product_image_url',
        'quantity'
      ])
    },
    attributes: { ...user_attributes }
  },
  perform: (request, data) => {
    return request(`${API_BASE}${UPSERT_ENDPOINT}`, {
      method: 'post',
      json: sendTrackEvent(data.payload, 'item_removed_from_cart')
    })
  },
  performBatch: (request, data) => {
    return request(`${API_BASE}${UPSERT_ENDPOINT}`, {
      method: 'post',
      json: sendBulkTrackEvents(data.payload, 'item_removed_from_cart')
    })
  }
}

export default action

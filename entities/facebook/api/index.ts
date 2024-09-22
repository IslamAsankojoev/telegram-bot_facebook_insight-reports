import { api } from '../../../config'
import { TInsights } from '../model/index'

export const facebookApi = {
  endpoint: 'insights',
  async getInsights({
    since = '2024-08-20',
    until = '2024-09-18',
    breakdowns = '',
    id,
    access_token,
  }: {
    since?: string
    until?: string
    breakdowns?: 'age' | 'gender' | 'country' | 'region' | 'placement' | 'device_platform' | 'publisher_platform' | 'platform_position' | ''
    id: string
    access_token: string
  }): Promise<TInsights[]> {
    return api
      .get(`${id}/${this.endpoint}`, {
        params: {
          fields: 'impressions,actions,cost_per_action_type,spend',
          breakdowns,
          'time_range[since]': since,
          'time_range[until]': until,
          access_token,
        },
      })
      .then((res) => res.data.data).catch((err) => {
        console.log('api error', err)
      })
  },
  async getInsightsAdLevel({
    since = '2024-08-20',
    until = '2024-09-18',
    breakdowns = '',
    id,
    access_token,
  }: {
    since?: string
    until?: string
    breakdowns?: 'age' | 'gender' | 'country' | 'region' | 'placement' | 'device_platform' | 'publisher_platform' | 'platform_position' | ''
    id: string
    access_token: string
  }): Promise<TInsights[]> {
    return api
      .get(`${id}/${this.endpoint}`, {
        params: {
          fields: 'impressions,actions,cost_per_action_type,spend,ad_name',
          level: 'ad',
          breakdowns,
          'time_range[since]': since,
          'time_range[until]': until,
          access_token,
        },
      })
      .then((res) => res.data.data).catch((err) => {
        console.log('api error', err)
      })
  },
}

import { api } from '../../../config'

export const facebookApi = {
  endpoint: 'insights',
  async getInsights(): Promise<TInsights[]> {
    return api
      .get(this.endpoint, {
        params: {
          fields: 'impressions,actions,cost_per_action_type,spend',
          'time_range[since]': '2024-08-20',
          'time_range[until]': '2024-09-18',
        },
      })
      .then((res) => res.data.data)
  },
}

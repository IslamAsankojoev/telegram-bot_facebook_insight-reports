import { api } from '../../../config'

export const facebookApi = {
  endpoint: 'insights',
  async getInsights({
    since = '2024-08-20',
    until = '2024-09-18',
  }: {
    since?: string
    until?: string
  }): Promise<TInsights[]> {
    return api
      .get(this.endpoint, {
        params: {
          fields: 'impressions,actions,cost_per_action_type,spend',
          'time_range[since]': since,
          'time_range[until]': until,
        },
      })
      .then((res) => res.data.data)
  },
}

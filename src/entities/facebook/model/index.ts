export type TInsights = {
  impressions: number
  spend: number
  actions: {
    action_type: string
    value: number
  }[]
  cost_per_action_type: {
    action_type: string
    value: number
  }[]
  date_start: string
  date_stop: string
  ad_name: string
  ad_id: string
  gender: 'female' | 'male' | 'unknown'
  age: string
  country: string
  region: string
  publisher_platform: string
}
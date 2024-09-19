import { actions } from '../../../constants'
import { facebookApi } from '../api'

export const getDayReport = async (since: string, until: string) => {
  const insights = await facebookApi.getInsights({
    since,
    until,
  })
  const link_clicks = insights[0].actions.find(
    (action) => action.action_type === actions.LINK_CLICK,
  )?.value
  const cost_per_link_click = insights[0].cost_per_action_type.find(
    (action) => action.action_type === actions.LINK_CLICK,
  )?.value
  const messages = insights[0].actions.find(
    (action) => action.action_type === actions.ONSITE_CONVERSION_TOTAL_MESSAGING_CONNECTION,
  )?.value
  const cost_per_message = insights[0].cost_per_action_type.find(
    (action) => action.action_type === actions.ONSITE_CONVERSION_TOTAL_MESSAGING_CONNECTION,
  )?.value
  const spend = insights[0].spend
  return `
Статистика за ${since} - ${until}:
Клики по ссылке: ${link_clicks}
Стоимость клика по ссылке: ${cost_per_link_click}
Заявки: ${messages}
Стоимость сообщения: ${cost_per_message}
Расход: ${spend}
  `
}

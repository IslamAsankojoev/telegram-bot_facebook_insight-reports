import { actions } from "../../../constants"
import { TInsights } from "../model"

export const getMessagesCount = (insight: TInsights | undefined) => {
  return insight ? insight?.actions?.find((action) => action?.action_type === actions.ONSITE_CONVERSION_TOTAL_MESSAGING_CONNECTION)?.value || 0 : 0
}

export const getMessagesCost = (insight: TInsights | undefined) => {
  return insight ? insight?.cost_per_action_type?.find((action) => action?.action_type === actions.ONSITE_CONVERSION_TOTAL_MESSAGING_CONNECTION)?.value || 0 : 0
}

export const getMessages = (insight: TInsights | undefined) => {
  return {
    messages: getMessagesCount(insight),
    cost_per_message: getMessagesCost(insight)
  }
}
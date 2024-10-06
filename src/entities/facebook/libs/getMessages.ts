import { actions } from '../../../constants'
import { TInsights } from '../model'

export const getMessagesCount = (insight: TInsights | undefined) => {
  // const onsiteConversionTotalMessagingConnection = insight ? insight?.actions?.find((action) => action?.action_type === actions.ONSITE_CONVERSION_TOTAL_MESSAGING_CONNECTION)?.value || 0 : 0
  // const onsiteConversionMessagingFirstReply = insight ? insight?.actions?.find((action) => action?.action_type === actions.ONSITE_CONVERSION_MESSAGING_FIRST_REPLY)?.value || 0 : 0
  // const onsiteConversionMessagingUserDepth3MessageSend = insight ? insight?.actions?.find((action) => action?.action_type === actions.ONSITE_CONVERSION_MESSAGING_USER_DEPTH_3_MESSAGE_SEND)?.value || 0 : 0
  // const onsiteConversionMessagingUserDepth2MessageSend = insight ? insight?.actions?.find((action) => action?.action_type === actions.ONSITE_CONVERSION_MESSAGING_USER_DEPTH_2_MESSAGE_SEND)?.value || 0 : 0
  const onsiteConversionMessagingConversationStarted7D = insight
    ? insight?.actions?.find(
        (action) =>
          action?.action_type === actions.ONSITE_CONVERSION_MESSAGING_CONVERSATION_STARTED_7D,
      )?.value || 0
    : 0

  return Number(onsiteConversionMessagingConversationStarted7D)
}

export const getMessagesCost = (insight: TInsights | undefined) => {
  // const onsiteConversionTotalMessagingConnection = insight ? insight?.cost_per_action_type?.find((action) => action?.action_type === actions.ONSITE_CONVERSION_TOTAL_MESSAGING_CONNECTION)?.value || 0 : 0
  // const onsiteConversionMessagingFirstReply = insight ? insight?.cost_per_action_type?.find((action) => action?.action_type === actions.ONSITE_CONVERSION_MESSAGING_FIRST_REPLY)?.value || 0 : 0
  // const onsiteConversionMessagingUserDepth3MessageSend = insight ? insight?.cost_per_action_type?.find((action) => action?.action_type === actions.ONSITE_CONVERSION_MESSAGING_USER_DEPTH_3_MESSAGE_SEND)?.value || 0 : 0
  // const onsiteConversionMessagingUserDepth2MessageSend = insight ? insight?.cost_per_action_type?.find((action) => action?.action_type === actions.ONSITE_CONVERSION_MESSAGING_USER_DEPTH_2_MESSAGE_SEND)?.value || 0 : 0
  const onsiteConversionMessagingConversationStarted7D = insight
    ? insight?.cost_per_action_type?.find(
        (action) =>
          action?.action_type === actions.ONSITE_CONVERSION_MESSAGING_CONVERSATION_STARTED_7D,
      )?.value || 0
    : 0

  return Number(onsiteConversionMessagingConversationStarted7D)
}

export const getMessages = (insight: TInsights | undefined) => {
  return {
    messages: getMessagesCount(insight),
    cost_per_message: getMessagesCost(insight),
  }
}

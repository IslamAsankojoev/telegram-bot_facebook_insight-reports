import { actions } from "../../../constants"
import { TInsights } from "../model"

export const getLinkClicksCount = (insight: TInsights) => {
  return insight ? insight?.actions?.find((action) => action?.action_type === actions?.LINK_CLICK)?.value || 0 : 0
}

export const getLinkClicksCost = (insight: TInsights) => {
  return insight ? insight?.cost_per_action_type?.find((action) => action?.action_type === actions?.LINK_CLICK)?.value || 0 : 0
}

export const getLinkClicks = (insight: TInsights) => {
  return {
    link_clicks: getLinkClicksCount(insight),
    cost_per_link_click: getLinkClicksCost(insight)
  }
}
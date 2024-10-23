import { facebookApi } from '../api'
import dayjs from 'dayjs'
import { createPdf, roundToTwoDecimals } from '../../../libs'
import { getHTMLTemplate, getLinkClicks, getMessages } from '../libs'
import { BotContext } from '../../../bot'
import { InputFile } from 'grammy'
import { TAccount } from '@/entities/accounts/model'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bishkek")

export const yesterdayReportCommand = async (ctx: BotContext, account: TAccount) => {
  ctx.replyWithChatAction('typing')
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

  try {

  const insightsAll = await facebookApi.getInsights({
    since: yesterday,
    until: yesterday,
    id: account.ad_account_id,
    access_token: account.marker,
  })
  const insightsAllData = insightsAll.map((insight) => ({
    link_clicks: getLinkClicks(insight).link_clicks,
    cost_per_link_click: getLinkClicks(insight).cost_per_link_click,
    messages: getMessages(insight).messages,
    cost_per_message: getMessages(insight).cost_per_message,
    spend: insight.spend,
  }))

  if(!insightsAllData[0]) {
    return null
  }

  const insightsAdLevel = await facebookApi.getInsightsAdLevel({
    since: yesterday,
    until: yesterday,
    id: account.ad_account_id,
    access_token: account.marker,
  })

  const insightsAdLevelData = insightsAdLevel
    .map((insight) => ({
      messages: getMessages(insight).messages,
      cost_per_message: roundToTwoDecimals(getMessages(insight).cost_per_message),
      spend: insight.spend,
      ad_name: insight.ad_name,
    }))
    .sort((a, b) => b.messages - a.messages)

  const ageInsights = await facebookApi.getInsights({
    since: yesterday,
    until: yesterday,
    breakdowns: 'age',
    id: account.ad_account_id,
    access_token: account.marker,
  })
  const ageHashMap = new Map()
  ageInsights.forEach((insight) => {
    const age = insight.age
    const messages = getMessages(insight).messages
    if (ageHashMap.has(age)) {
      ageHashMap.set(age, ageHashMap.get(age) + messages)
    } else {
      ageHashMap.set(age, messages)
    }
  })

  const html = getHTMLTemplate({
    date: yesterday,
    link_clicks_all: insightsAllData[0]?.link_clicks,
    cost_per_link_click_all: roundToTwoDecimals(insightsAllData[0]?.cost_per_link_click),
    messages_all: insightsAllData[0]?.messages,
    cost_per_message_all: roundToTwoDecimals(insightsAllData[0]?.cost_per_message),
    spend_all: insightsAllData[0]?.spend,
    conversion: roundToTwoDecimals(
      (insightsAllData[0]?.messages / insightsAllData[0]?.link_clicks) * 100,
    ),
    creative_insights: insightsAdLevelData,
    account,
    split: false,
  })
  const pdf = await createPdf(html)
  const file = new InputFile(pdf, `Ежедневный отчет - (${yesterday}).pdf`)
  return file
  } catch (error) {
    console.error(error)
    await ctx.reply('Произошла ошибка. Попробуйте позже.')
  }
}

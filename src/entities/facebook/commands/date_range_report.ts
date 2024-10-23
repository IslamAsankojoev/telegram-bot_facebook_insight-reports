import { facebookApi } from '../api'
import { Context, InputFile } from 'grammy'
import { createPdf, roundToTwoDecimals } from '../../../libs'
import dayjs from 'dayjs'
import { getHTMLTemplate, getLinkClicks, getMessages } from '../libs'
import { TAccount } from '@/entities/accounts/model'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Bishkek")

export const dateRangeReportCommand = async (ctx: Context, account: TAccount) => {
  ctx.replyWithChatAction('typing')
  const userMessage = ctx?.message?.text?.split(' ') || []
  if (!userMessage || userMessage.length < 3) {
    return ctx.reply('Укажите даты начала и конца периода')
  }

  const [_, __, ___, firstDate, secondDate] = userMessage
  const startDate = dayjs(firstDate).isValid()
    ? dayjs(firstDate).format('YYYY-MM-DD')
    : dayjs().subtract(31, 'day').format('YYYY-MM-DD')
  const endDate = dayjs(secondDate).isValid()
    ? dayjs(secondDate).format('YYYY-MM-DD')
    : dayjs().format('YYYY-MM-DD')
  if (startDate > endDate) {
    return ctx.reply('Дата начала периода должна быть меньше даты окончания')
  }

  try {
    const insightsAll = await facebookApi.getInsights({
      since: startDate,
      until: endDate,
      id: account.ad_account_id,
      access_token: account.marker,
    })

    const insightsAllData = insightsAll?.map((insight) => ({
      link_clicks: getLinkClicks(insight).link_clicks,
      cost_per_link_click: getLinkClicks(insight).cost_per_link_click,
      messages: getMessages(insight).messages,
      cost_per_message: getMessages(insight).cost_per_message,
      spend: insight.spend,
      impressions: insight.impressions,
    }))

    if (!insightsAllData?.[0]) {
      return null
    }

    const insightsAdLevel = await facebookApi.getInsightsAdLevel({
      since: startDate,
      until: endDate,
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

    const genderInsights = await facebookApi.getInsights({
      since: startDate,
      until: endDate,
      breakdowns: 'gender',
      id: account.ad_account_id,
      access_token: account.marker,
    })
    const femaleLeads = getMessages(
      genderInsights.find((insight) => insight.gender === 'female'),
    ).messages

    const maleLeads = getMessages(
      genderInsights.find((insight) => insight.gender === 'male'),
    ).messages

    const unknownLeads = getMessages(
      genderInsights.find((insight) => insight.gender === 'unknown'),
    ).messages

    const ageInsights = await facebookApi.getInsights({
      since: startDate,
      until: endDate,
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

    const ageInsightsArray = Array.from(ageHashMap.entries())
    const ageInsightsSorted = ageInsightsArray.sort((a, b) => b[1] - a[1])
    const topAgeInsights = ageInsightsSorted

    const platformsIsights = await facebookApi.getInsights({
      since: startDate,
      until: endDate,
      breakdowns: 'publisher_platform',
      id: account.ad_account_id,
      access_token: account.marker,
    })

    const platformСoverageInPercent = platformsIsights.map((insight) => ({
      publisher_platform: insight.publisher_platform,
      percentage: (getMessages(insight).messages / insightsAllData[0]?.messages) * 100,
    }))

    const countryInsights = await facebookApi.getInsights({
      since: startDate,
      until: endDate,
      breakdowns: 'country',
      id: account.ad_account_id,
      access_token: account.marker,
    })

    const countryCoverageInPercent = countryInsights.map((insight) => ({
      country: insight.country,
      percentage: (getMessages(insight).messages / insightsAllData[0]?.messages) * 100,
    }))

    const regionInsights = await facebookApi.getInsights({
      since: startDate,
      until: endDate,
      breakdowns: 'region',
      id: account.ad_account_id,
      access_token: account.marker,
    })

    const regionCoverageInPercent = regionInsights.map((insight) => ({
      region: insight.region,
      percentage: (insight.impressions / insightsAllData[0]?.impressions) * 100,
    }))

    const html = getHTMLTemplate({
      date: `${startDate} по ${endDate}`,
      link_clicks_all: insightsAllData[0]?.link_clicks,
      cost_per_link_click_all: roundToTwoDecimals(insightsAllData[0]?.cost_per_link_click),
      messages_all: insightsAllData[0]?.messages,
      cost_per_message_all: roundToTwoDecimals(insightsAllData[0]?.cost_per_message),
      spend_all: insightsAllData[0]?.spend,
      conversion: roundToTwoDecimals(
        (insightsAllData[0]?.messages / insightsAllData[0]?.link_clicks) * 100,
      ),
      top_age: topAgeInsights,
      platform_coverage: platformСoverageInPercent,
      country_coverage: countryCoverageInPercent,
      region_coverage: regionCoverageInPercent,
      creative_insights: insightsAdLevelData,
      account,
    })
    const pdf = await createPdf(html)
    const file = new InputFile(pdf, `Отчет - (${startDate} по ${endDate}).pdf`) 
    return file
  } catch (error) {
    console.error(error)
    await ctx.reply('Произошла ошибка при формировании отчета')
  }
}

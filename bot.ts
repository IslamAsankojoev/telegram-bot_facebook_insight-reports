import { Bot } from 'grammy'
import { facebookApi } from './entities/facebook/api'

const bot = new Bot('7564964890:AAGt2JEIwgM-13A8aHSV-TrFXT2jna1KVQw')

bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))
bot.on('message', async (ctx) => {
  const insights = await facebookApi.getInsights()
  console.log(insights[0].impressions)
  return ctx.reply(`impressions ${insights[0].impressions}`)
})
bot.start()

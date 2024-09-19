import { Bot } from 'grammy'
import { facebookApi } from './entities/facebook/api'
import { getDayReport } from './entities/facebook/libs/dayReport'

const bot = new Bot('7564964890:AAGt2JEIwgM-13A8aHSV-TrFXT2jna1KVQw')

bot.command('start', (ctx) => ctx.reply('Бот активирован.'))
bot.on('message', async (ctx) => {
  const insights = await getDayReport('2024-08-20', '2024-09-18')
  console.log(JSON.stringify(insights, null, 2))
  return ctx.reply(insights)
})
bot.start()

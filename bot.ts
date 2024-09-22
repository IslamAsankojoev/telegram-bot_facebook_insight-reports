import { Bot, Context, session, SessionFlavor } from 'grammy'
import {
  dateRangeReportCommand,
  lastMonthReportCommand,
  lastWeekReportCommand,
  yesterdayReportCommand,
} from './entities/facebook/commands'
import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import { hydrateReply } from '@grammyjs/parse-mode'
import { Account, Accounts } from './constants/markers'
import { Menu } from '@grammyjs/menu'

interface SessionData {
  activeAccount: Account
}

export type BotContext = ParseModeFlavor<Context> & SessionFlavor<SessionData>

const bot = new Bot<BotContext>('7564964890:AAGt2JEIwgM-13A8aHSV-TrFXT2jna1KVQw')

bot.use(hydrateReply)

//block access for users that are not in allowedUsers array
const allowedUsers = [973320422, 1367716681]

bot.use(async (ctx, next) => {
  const userId = ctx.from?.id || 0
  const messageText = ctx.message?.text || ''

  const isChatIdCommand = messageText.startsWith('/chat_id')

  if (!allowedUsers.includes(userId)) {
    if (isChatIdCommand) {
      await next()
    } else {
      return ctx.reply('У вас нет доступа к этому боту')
    }
  } else {
    await next()
  }
})

// Initialize session
function initial(): SessionData {
  return {
    activeAccount: Accounts[0],
  }
}
bot.use(session({ initial }))

// Create menu
const menu = new Menu<BotContext>('accounts')
bot.use(menu)

Accounts.forEach((account) => {
  menu
    .text(account.name, (ctx) => {
      ctx.session.activeAccount = account
      ctx.reply(`Выбран аккаунт ${account.name}`)
    })
    .row()
})

// Commands
bot.api.setMyCommands([
  { command: 'yesterday_report', description: 'Получить отчет за вчерашний день' },
  { command: 'last_week_report', description: 'Получить отчет за неделю' },
  { command: 'last_month_report', description: 'Получить отчет за месяц' },
  { command: 'date_range_report', description: 'Получить отчет за период (YYYY-MM-DD YYYY-MM-DD)' },
  { command: 'accounts', description: 'Выбрать аккаунт' },
  { command: 'current_account', description: 'Показать текущий аккаунт' },
  { command: 'chat_id', description: 'Показать chat_id' },
  { command: 'help', description: 'Показать справку' },
])

bot.command('yesterday_report', (ctx) => yesterdayReportCommand(ctx, ctx.session.activeAccount))
bot.command('last_week_report', (ctx) => lastWeekReportCommand(ctx, ctx.session.activeAccount))
bot.command('last_month_report', (ctx) => lastMonthReportCommand(ctx, ctx.session.activeAccount))
bot.command('date_range_report', (ctx) => dateRangeReportCommand(ctx, ctx.session.activeAccount))
bot.command('chat_id', (ctx) => ctx.reply(`chat_id: ${ctx.chat.id}`))
bot.command('accounts', (ctx) =>
  ctx.reply('Выберите аккаунт', {
    reply_markup: menu,
  }),
)
bot.command('current_account', (ctx) =>
  ctx.reply(`Текущий аккаунт: ${ctx.session.activeAccount.name}`),
)

bot.command('help', (ctx) =>
  ctx.reply(`
Доступные команды: 

/yesterday_report: 
Получить отчет за вчерашний день,

/last_week_report: 
Получить отчет за неделю,

/date_range_report: 
Получить отчет за период надо указать даты начала и конца периода`),
)

bot.start()

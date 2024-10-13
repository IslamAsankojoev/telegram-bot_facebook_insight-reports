import { Bot, Context, InlineKeyboard } from 'grammy'
import {
  dateRangeReportCommand,
  lastMonthReportCommand,
  lastWeekReportCommand,
  todayReportCommand,
  yesterdayReportCommand,
} from './entities/facebook/commands'
import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import { hydrateReply } from '@grammyjs/parse-mode'
import { strapiApi } from './entities/accounts/api'
import { telegrammChatIdsApi } from './entities/telegramChatIds/api'
import { TAccount, TAccounts } from './entities/accounts/model'
import * as dotenv from 'dotenv'
dotenv.config()

export type BotContext = ParseModeFlavor<Context>

const bot = new Bot<BotContext>(process.env.BOT_TOKEN!)

bot.use(hydrateReply)

bot.use(async (ctx, next) => {
  const allowedUsers = await telegrammChatIdsApi.getChatIdsArray()
  const userId = ctx.from?.id || 0
  const messageText = ctx.message?.text || ''

  const isChatIdCommand = messageText.startsWith('/chat_id')

  if (!allowedUsers?.includes(userId.toString())) {
    if (isChatIdCommand) {
      await next()
    } else {
      return ctx.reply('🚫 У вас нет доступа к этому боту')
    }
  } else {
    await next()
  }
})

bot.api.setMyCommands([
  { command: 'accounts', description: 'Выбрать аккаунт' },
  // { command: 'all_accounts', description: 'Показать все аккаунты' },
  { command: 'reports', description: 'Выбрать отчет' },
  { command: 'chat_id', description: 'Получить чат ID' },
  { command: 'current_account', description: 'Текущий аккаунт' },
])

bot.command('chat_id', (ctx) => {
  ctx.reply(`Ваш чат ID: ${ctx.from?.id}`)
})

bot.command('current_account', async (ctx) => {
  const account = await strapiApi.getActiveAccount()
  ctx.reply(`Текущий аккаунт: ${account?.name}`)
})

// -------------------------------------

const active_accounts = 'accounts'
bot.command('accounts', async (ctx) => {
  const accountsKeyboard = new InlineKeyboard()
  const accounts = (await strapiApi.getAccounts()) as TAccounts
  const activeAccounts = accounts.data.filter((account) => account.active)

  activeAccounts.forEach((account) => {
    accountsKeyboard
      .text(account.name, `${active_accounts}|${account.name}|${account.documentId}`)
      .row()
  })

  await ctx.reply('Выберите аккаунт', {
    reply_markup: accountsKeyboard,
  })
})

// -------------------------------------

const reportActions = [
  {
    text: 'Отчет за сегодня',
    callback: todayReportCommand,
  },
  {
    text: 'Отчет за вчерашний день',
    callback: yesterdayReportCommand,
  },
  {
    text: 'Отчет за неделю',
    callback: lastWeekReportCommand,
  },
  {
    text: 'Отчет за месяц',
    callback: lastMonthReportCommand,
  },
  {
    text: 'Отчет за период YYYY-MM-DD YYYY-MM-DD',
    callback: dateRangeReportCommand,
  },
]

const reports = 'reports'
bot.command('reports', async (ctx) => {
  const reportKeyboard = new InlineKeyboard()

  reportActions.forEach((action) => {
    reportKeyboard.text(action.text, `${reports}|${action.text}`).row()
  })
  const account = (await strapiApi.getActiveAccount()) as TAccount
  ctx.reply(`Выберите отчет по проекту: ${account.name}`, {
    reply_markup: reportKeyboard,
  })
})

bot.on('callback_query:data', async (ctx) => {
  const data = ctx.callbackQuery.data.split('|')
  const account = (await strapiApi.getActiveAccount()) as TAccount
  const action = data[0]
  switch (action) {
    case reports:
      const report = reportActions.find((action) => action.text === data[1])
      await report?.callback(ctx, account)
      await ctx.editMessageText(`${account.name}`)
      break
    case active_accounts:
      const accountName = data[1]
      const documentId = data[2]
      await strapiApi.setCurrentAccount(documentId)

      const reportKeyboard = new InlineKeyboard()

      reportActions.forEach((action) => {
        reportKeyboard.text(action.text, `${reports}|${action.text}`).row()
      })

      await ctx.editMessageText(`Выберите отчет по проекту: ${accountName}`)

      await ctx.editMessageReplyMarkup({
        reply_markup: reportKeyboard,
      })
      break
  }
})

bot.catch((err) => {
  console.error('Error occurred:', err)
})

bot.start()

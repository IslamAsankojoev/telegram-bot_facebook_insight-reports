import { Bot, Context, InlineKeyboard, Keyboard } from 'grammy'
import {
  dateRangeReportCommand,
  lastMonthReportCommand,
  lastWeekReportCommand,
  yesterdayReportCommand,
} from './entities/facebook/commands'
import type { ParseModeFlavor } from '@grammyjs/parse-mode'
import { hydrateReply } from '@grammyjs/parse-mode'
import { strapiApi } from './entities/accounts/api'
import { TAccount, TAccounts } from './entities/accounts/model'
import * as dotenv from 'dotenv';
dotenv.config();

export type BotContext = ParseModeFlavor<Context>

const bot = new Bot<BotContext>('7564964890:AAGt2JEIwgM-13A8aHSV-TrFXT2jna1KVQw')

bot.use(hydrateReply)

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


bot.api.setMyCommands([
  { command: 'get_server', description: 'IP сервера' },
  { command: 'active_accounts', description: 'Выбрать аккаунт' },
  { command: 'all_accounts', description: 'Показать все аккаунты' },
  { command: 'reports', description: 'Выбрать отчет' },
  { command: 'chat_id', description: 'Получить chat_id' },
  { command: 'current_account', description: 'Текущий аккаунт' },
])

// Обработчик команды /start
bot.command('reports', (ctx) => {
  ctx.reply('Выберите отчет', {
    reply_markup: {
      keyboard: reportKeyboard.keyboard,
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  })
})

bot.command('get_server', (ctx) => {
  ctx.reply(`IP сервера: ${process.env.SERVER_URL}`)
})

bot.command('chat_id', (ctx) => {
  ctx.reply(`Ваш чат ID: ${ctx.from?.id}`)
})

bot.command('current_account', async (ctx) => {
  const account = await strapiApi.getActiveAccount()
  ctx.reply(`Текущий аккаунт: ${account?.name}`)
})

bot.command('all_accounts', async (ctx) => {
  const accountsKeyboard = new InlineKeyboard()
  const accounts = await strapiApi.getAccounts() as TAccounts
  accounts.data.forEach((account) => {
    accountsKeyboard.text(account.name, `all_accounts|${account.name}`).row()
  })

  ctx.reply('Выберите аккаунт', {
    reply_markup: accountsKeyboard,
  })
})

// -------------------------------------
bot.command('active_accounts', async (ctx) => {
  const accountsKeyboard = new InlineKeyboard()
  const accounts = await strapiApi.getAccounts() as TAccounts
  const activeAccounts = accounts.data.filter((account) => account.active)
  activeAccounts.forEach((account) => {
    accountsKeyboard.text(account.name, `select_account|${account.name}|${account.documentId}`).row()
  })

  ctx.reply('Выберите аккаунт', {
    reply_markup: accountsKeyboard,
  })
})
// -------------------------------------

const reportKeyboard = new Keyboard()

const reportActions = [{
  text: 'Отчет за вчерашний день',
  callback: yesterdayReportCommand,
}, {
  text: 'Отчет за неделю',
  callback: lastWeekReportCommand,
}, {
  text: 'Отчет за месяц',
  callback: lastMonthReportCommand,
}, {
  text: 'Отчет за период YYYY-MM-DD YYYY-MM-DD',
  callback: dateRangeReportCommand,
}]

reportActions.forEach((action) => {
  reportKeyboard.text(action.text).row()
  reportKeyboard.placeholder('Выберите отчет')
  bot.hears(action.text, async (ctx) => {
    const account = (await strapiApi.getActiveAccount()) as TAccount
    await action.callback(ctx, account)
  })
})

// -------------------------------------

bot.on('callback_query:data', async (ctx) => {
  await bot.api.answerCallbackQuery(ctx.callbackQuery.id)
  const [type, name, documentId] = ctx.callbackQuery.data.split('|')
  if(type === 'select_account') {
    await strapiApi.setCurrentAccount(documentId)
    ctx.reply(`Выбран аккаунт ${name}`)
  }
  if(type === 'all_accounts') {
    ctx.reply(`Выбирать аккаунт можно только из списка активных аккаунтов`)
  }
})

bot.catch((err) => {
  console.error('Error occurred:', err)
})

bot.start()
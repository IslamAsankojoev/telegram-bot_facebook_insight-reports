import { Bot, Context, InlineKeyboard, InputFile } from 'grammy'
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
import cron from 'node-cron'
dotenv.config()

export type BotContext = ParseModeFlavor<Context>

const bot = new Bot<BotContext>(process.env.BOT_TOKEN!)

console.log('Cron работает по часовому поясу:', Intl.DateTimeFormat().resolvedOptions().timeZone)
console.log('Текущее время:', new Date().toLocaleString())
cron.schedule(
  '0 19 * * *',
  async () => {
    try {
      const report = reportActions.find((action) => action.text === 'Отчет за вчерашний день')
      const allAccoutns = await strapiApi.getAccounts()
      allAccoutns?.data.forEach(async (account) => {
        const group = account.telegramm_group
        await report?.callback(null, account, -4559054834) // to our group
        if (group && group?.chat_id) {
          await report?.callback(null, account, Number(group?.chat_id))
          console.log('group', group?.name, account.name)
        } else {
          // ctx.editMessageText(`Не найден чат для ${account.name}`)
        }
      })
      console.log('Сообщение успешно отправлено')
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err)
    }

    try {
      const report = reportActions.find((action) => action.text === 'Отчет за неделю')
      const allAccoutns = await strapiApi.getAccounts()
      allAccoutns?.data.forEach(async (account) => {
        const weeklyStartDate = account.weeklyStartDate
        const today = new Date()
        const start = weeklyStartDate ? new Date(weeklyStartDate) : null

        if (start) {
          start.setHours(0, 0, 0, 0)
          today.setHours(0, 0, 0, 0)

          const diffInDays = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

          if (diffInDays >= 0 && diffInDays % 7 === 0) {
            const group = account.telegramm_group
            await report?.callback(null, account, -4559054834)
            if (group?.chat_id) {
              await report?.callback(null, account, Number(group.chat_id))
              console.log('group', group.name, account.name)
            }
          }
        }
      })
      console.log('Сообщение успешно отправлено')
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err)
    }
  },
  {
    timezone: 'Asia/Bishkek',
  },
)

bot.use(hydrateReply)

bot.api.setMyCommands([{ command: 'commands', description: 'Выбрать команду' }])

// -------------------------------------

const commands = [
  {
    name: 'accounts',
    description: 'Выбрать аккаунт',
    callback: async (ctx: Context) => {
      const accountsKeyboard = new InlineKeyboard()
      const accounts = (await strapiApi.getAccounts()) as TAccounts
      const activeAccounts = accounts.data.filter((account) => account.active)

      activeAccounts.forEach((account) => {
        accountsKeyboard.text(account.name, `accounts|${account.name}|${account.documentId}`).row()
      })

      await ctx.editMessageText('Выберите аккаунт', {
        reply_markup: accountsKeyboard,
      })
    },
  },
  {
    name: 'reports',
    description: 'Выбрать отчет',
    callback: async (ctx: Context) => {
      const reportKeyboard = new InlineKeyboard()

      reportActions.forEach((action) => {
        reportKeyboard.text(action.text, `reports|chat|${action.text}`).row()
      })
      const account = (await strapiApi.getActiveAccount()) as TAccount
      ctx.editMessageText(`Выберите отчет по проекту: ${account.name}`, {
        reply_markup: reportKeyboard,
      })
    },
  },
  {
    name: 'mail',
    description: 'Рассылка',
    callback: async (ctx: Context) => {
      const reportsKeyboard = new InlineKeyboard()

      reportActions.forEach((action) => {
        reportsKeyboard.text(action.text, `reports|group|${action.text}`).row()
      })
      ctx.editMessageText(`Выберите отчет для рассылки:`, {
        reply_markup: reportsKeyboard,
      })
    },
  },
  // {
  //   name: 'current_account',
  //   description: 'Текущий аккаунт',
  //   callback: async (ctx:Context) => {
  //     const account = await strapiApi.getActiveAccount()
  //     ctx.editMessageText(`Текущий аккаунт: ${account?.name}`)
  //   },
  // },
  {
    name: 'chat_id',
    description: 'Получить chat_id',
    callback: async (ctx: Context) => {
      ctx.editMessageText(`Ваш chat_id: ${ctx.chat?.id}`)
    },
  },
]

bot.command('commands', async (ctx) => {
  const commandsKeyboard = new InlineKeyboard()
  const allowedChats = await telegrammChatIdsApi.getChatIdsArray()
  const chatId = ctx.chat?.id || 0
  const isAllowedChat = allowedChats?.includes(chatId.toString())
  commands.forEach((command) => {
    if (command.name !== 'chat_id' && !isAllowedChat) {
      return null
    }
    commandsKeyboard.text(command.description, `commands|${command.name}`).row()
  })

  await ctx.reply('Выберите команду', {
    reply_markup: commandsKeyboard,
  })
})

// -------------------------------------

const reportActions = [
  {
    text: 'Отчет за сегодня',
    callback: async (ctx: BotContext | null, account: TAccount, chat_id: number) => {
      console.log('report', account, chat_id)
      const result = await todayReportCommand(ctx, account)
      if (!result || !result.file) return ctx && ctx.reply(`Нет данных за сегодня ${account.name}`)
      const { file, leads, spend } = result
      bot.api.sendDocument(chat_id, file as InputFile, {
        caption: `
${account.name}
Отчет за сегодня
Заявки: ${leads}
Расход: ${spend}$
`,
      })
    },
  },
  {
    text: 'Отчет за вчерашний день',
    callback: async (ctx: BotContext | null, account: TAccount, chat_id: number) => {
      const result = await yesterdayReportCommand(ctx, account)
      if (!result || !result.file)
        return ctx && ctx.reply(`Нет данных за вчерашний день ${account.name}`)
      const { file, leads, spend } = result
      bot.api.sendDocument(chat_id, file as InputFile, {
        caption: `
${account.name}
Отчет за вчерашний день
Заявки: ${leads}
Расход: ${spend}$
        `,
      })
    },
  },
  {
    text: 'Отчет за неделю',
    callback: async (ctx: BotContext | null, account: TAccount, chat_id: number) => {
      const result = await lastWeekReportCommand(ctx, account)
      if (!result || !result.file) return ctx && ctx.reply(`Нет данных за неделю ${account.name}`)
      const { file, leads, spend } = result
      bot.api.sendDocument(chat_id, file as InputFile, {
        caption: `
${account.name}
Отчет за неделю
Заявки: ${leads}
Расход: ${spend}$
        `,
      })
    },
  },
  {
    text: 'Отчет за месяц',
    callback: async (ctx: BotContext | null, account: TAccount, chat_id: number) => {
      const result = await lastMonthReportCommand(ctx, account)
      if (!result || !result.file) return ctx && ctx.reply(`Нет данных за месяц ${account.name}`)
      const { file, leads, spend } = result
      bot.api.sendDocument(chat_id, file as InputFile, {
        caption: `
${account.name}
Отчет за месяц
Заявки: ${leads}
Расход: ${spend}$
        `,
      })
    },
  },
  //   {
  //     text: 'Отчет за период YYYY-MM-DD YYYY-MM-DD',
  //     callback: async (ctx:BotContext, account:TAccount, chat_id:number)=>{
  //       const result = await dateRangeReportCommand(ctx, account)
  //       if (!result || !result.file) return ctx.reply('Нет данных за этот период')
  //         const { file, leads, spend } = result
  //       bot.api.sendDocument(chat_id, file as InputFile, {
  //         caption: `
  // Отчет за период
  // Заявки: ${leads}
  // Расход: ${spend}$
  //         `,
  //       })
  //     },
  //   },
]

bot.on('callback_query:data', async (ctx) => {
  console.log(ctx.callbackQuery.data)
  const data = ctx.callbackQuery.data.split('|')
  const currentAccount = (await strapiApi.getActiveAccount()) as TAccount
  const action = data[0]
  switch (action) {
    case 'reports':
      const report = reportActions.find((action) => action.text === data[2])
      if (data[1] === 'group') {
        const allAccoutns = await strapiApi.getAccounts()
        allAccoutns?.data.forEach(async (account) => {
          const group = account.telegramm_group
          await report?.callback(ctx, account, -4559054834) // to our group
          if (group && group?.chat_id) {
            await report?.callback(ctx, account, Number(group?.chat_id))
            console.log('group', group?.name, account.name)
            // ctx.editMessageText(`${data[2]} отправлен в ${group?.name}`)
          } else {
            // ctx.editMessageText(`Не найден чат для ${account.name}`)
          }
        })
      }
      if (data[1] === 'chat') {
        console.log('chat')
        await report?.callback(ctx, currentAccount, ctx.from?.id as number)
        await ctx.editMessageText(`${currentAccount.name}`)
      }
      break
    case 'accounts':
      await strapiApi.setCurrentAccount(data[2])

      const reportKeyboard = new InlineKeyboard()

      reportActions.forEach((action) => {
        reportKeyboard.text(action.text, `reports|chat|${action.text}`).row()
      })

      await ctx.editMessageText(`Выберите отчет по проекту: ${data[1]}`)

      await ctx.editMessageReplyMarkup({
        reply_markup: reportKeyboard,
      })
      break
    case 'commands':
      const command = commands.find((command) => command.name === data[1])
      await command?.callback(ctx)
      break
  }
})

bot.catch((err) => {
  console.error('Error occurred:', err)
})

bot.start()

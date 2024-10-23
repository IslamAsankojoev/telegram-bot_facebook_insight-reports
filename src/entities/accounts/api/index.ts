import { strapiApiConfig } from '../../../config'
import type { TAccount, TAccounts, TCurrentAccount, TTelegramGroup } from '../model'

export const strapiApi = {
  async getAccounts(): Promise<TAccounts | undefined> {
    try {
      const { data } = await strapiApiConfig.get('accounts?populate=*')
      return data as TAccounts
    } catch (err) {
      console.log('api error', err)
    }
  },
  async updateAccount(account: TAccount): Promise<TAccount | undefined> {
    try {
      const { data } = await strapiApiConfig.put(`accounts/${account.documentId}`, {
        data: {
          active: account.active
        },
      })
      return data
    } catch (err) {
      console.log('api error', err)
    }
  },
  async getCurrentAccount(): Promise<TCurrentAccount | undefined> {
    try {
      const { data } = await strapiApiConfig.get('current-account?populate=*')
      return data as TCurrentAccount
    } catch (err) {
      console.log('api error', err)
    }
  },
  async setCurrentAccount(documentId: string): Promise<TAccount | undefined> {
    try {
      const { data } = await strapiApiConfig.put(`current-account`, {
        data: {
          account: documentId,
        },
      })
      return data.data
    } catch (err) {
      console.log('api error', err)
    }
  },
  async getActiveAccount(): Promise<TAccount | undefined> {
    const currentAccount = await strapiApi.getCurrentAccount()
    const accounts = await strapiApi.getAccounts()
    return accounts?.data.find(
      (account) => account.documentId === currentAccount?.data.account.documentId,
    ) as TAccount
  },
  async getAllTelegramGroups(): Promise<Response<TTelegramGroup[]> | undefined> {
    try {
      const { data } = await strapiApiConfig.get('telegramm-groups?populate=*')
      return data as Response<TTelegramGroup[]>
    } catch (err) {
      console.log('api error', err)
    }
  }
}


//write generic for response
interface Response<T> {
  data: T
  meta: null
}
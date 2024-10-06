import { strapiApiConfig } from '../../../config'
import type { TChatIds } from '../model'

export const telegrammChatIdsApi = {
  async getChatIds(): Promise<TChatIds[] | undefined> {
    try {
      const { data } = await strapiApiConfig.get('telegramm-chat-ids?populate=*')
      return data.data as TChatIds[]
    } catch (err) {
      console.log('api error', err)
    }
  },
  async getChatIdsArray(): Promise<string[] | undefined> {
    const chatIds = await telegrammChatIdsApi.getChatIds()
    return chatIds?.map((chatId) => chatId.chat_id)
  }
}

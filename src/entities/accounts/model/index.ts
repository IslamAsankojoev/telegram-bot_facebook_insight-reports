export type TAccount = {
  id: number
  documentId: string
  name: string
  marker: string
  ad_account_id: string
  active: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: null
  logo: Media
  telegramm_group?: TTelegramGroup
}

export type TAccounts = {
  data: TAccount[]
  meta: null
}

export type TCurrentAccount = {
  data: {
    id: number
    documentId: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    locale: null
    account: {
      id: number
      documentId: string
      name: string
      marker: string
      ad_account_id: string
      active: true
      createdAt: string
      updatedAt: string
      publishedAt: string
      locale: null
    }
  }
  meta: null
}

export type TUpdateCurrentAccount = {
  data: {
    account: number
  }
}

export type TTelegramGroup = {
  id: number
  documentId: string
  name: string
  chat_id: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  accounts: TAccount[]
}

interface Media {
  id: number
  name: string
  alternativeText: string
  caption: string
  width: number
  height: number
  formats: {
    thumbnail: MediaFormat
    small: MediaFormat
    medium: MediaFormat
    large: MediaFormat
  }
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string
  provider: string
  createdAt: Date
  updatedAt: Date
}

interface MediaFormat {
  name: string
  hash: string
  ext: string
  mime: string
  width: number
  height: number
  size: number
  path: string
  url: string
}
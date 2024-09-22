export interface Account {
  id: string
  name: string
  ad_obj_id: string
  accessToken: string
  logo?: string
}

export const Accounts: Account[] = [
  {
    id: '1654815048631023',
    name: 'Доскар',
    ad_obj_id: 'act_1654815048631023',
    logo: 'doscar.png',
    accessToken:
      'EAARJmZCZBYTg4BO2wroWfLZCwvkq7eXTDPZCPVOK8yPfbW7EH0XtTiDTO8kbULiPQuvZBgs1MMkMuQqqUT1l6bRxb4rj9MiZBmif7hZBrZB9F5ZCtSCzudXRTW7DZB9C7R5vdDSbZAsghOOKiz2eAlJSM2UUZCMJti1vF9KB4jTBPnPQG8fD4OMzOy4ngyPpmU1e7Uva',
    },
  {
    id: '1134706723618523',
    name: 'Стоматолог',
    ad_obj_id: 'act_1134706723618523',
    accessToken:
      'EAAXzY1fy8pABOZCJyCGw8CkodPEFByME84KuOXYubZADM1WlBUBojYRQtFZCKQuC1zPZBrXdZCltg5ZAvhxQLw1uKltK2J8O7jSwHb5NNXv70fLMlvRu0Y3ftfKlkYQy1nb0diHNfmiZApuhzw1pnm8HvsgVh6XAmPmGVVKDubNzAFQFKZBotV7G3SwV5jsPYfIw1ZCMCpvKxx0QwPBtr',
    },
]
import { Account } from '../../../constants/markers'
import fs from 'fs'
import path from 'path'

interface IHTMLTemplate {
  date: string
  link_clicks_all: number
  cost_per_link_click_all: number
  messages_all: number
  cost_per_message_all: number
  spend_all: number
  conversion: number
  top_age?: [string, number][]
  platform_coverage?: { publisher_platform: string; percentage: number }[]
  country_coverage?: { country: string; percentage: number }[]
  region_coverage?: { region: string; percentage: number }[]
  creative_insights: {
    ad_name: string
    messages: number
    cost_per_message: number
    spend: number
  }[]
  account?: Account
}

export const getHTMLTemplate = (props: IHTMLTemplate) => {

  const imagePath = path.join(process.cwd(), 'public', 'images', props.account?.logo || 'logo.png')
  const imageBase64 = fs.readFileSync(imagePath).toString('base64')
  const imageSrc = `data:image/jpeg;base64,${imageBase64}`

  const verifyPath = path.join(process.cwd(), 'verfy-icon.png')
  const verifyBase64 = fs.readFileSync(verifyPath).toString('base64')
  const verifySrc = `data:image/jpeg;base64,${verifyBase64}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Отчет за ${props.date}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 10px 20px; padding: 0 20px; }
    b { color: #333; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    h4 { margin: 10px 0px; }
    .section { margin-bottom: 20px; }
    .money { color: #33ba7c; }
    .head { background-color: #d7d7d7; }
    .verify {
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    .verify img {
      width: 30px;
      height: 30px;
      margin-left: 10px;
    }
    .verify p {
      font-size: 24px;
      font-weight: bold;
    }
    .logo {
      margin-top: 10px;
      width: auto;
      height: 40px;
    }
    .page-break { 
      page-break-before: always; /* Разрыв страницы перед этим блоком */
    }
  </style>
</head>
<body>

  ${imageSrc ? `<img class="logo" src=${imageSrc} />`: ''}
  
  <h2>Отчет за ${props.date}</h2>
  <div class="section">
    <h4>Общая статистика</h4>
    <table>
      <tr class="head">
        <th>Показатель</th>
        <th>Значение</th>
      </tr>
      <tr>
        <td>Всего кликов по ссылке</td>
        <td>${props.link_clicks_all}</td>
      </tr>
      <tr>
        <td>Стоимость за клик по ссылке</td>
        <td>${props.cost_per_link_click_all}<span class="money">$</span></td>
      </tr>
      <tr>
        <td>Всего заявок</td>
        <td>${props.messages_all}</td>
      </tr>
      <tr>
        <td>Стоимость за заявку</td>
        <td>${props.cost_per_message_all}<span class="money">$</span></td>
      </tr>
      <tr>
        <td>Всего расходов</td>
        <td>${props.spend_all}<span class="money">$</span></td>
      </tr>
      <tr>
        <td
        colspan="2"
        ><b>Конверсия:из клика в заявку = ${props.conversion}%</b></td>
      </tr>
    </table>
  </div>
  
  ${props.top_age ? `<div class="section">
    <table>
      <tr class="head">
        <th>Возрастная группа</th>
        <th>Заявок</th>
      </tr>
      ${props.top_age
        .map(
          ([ageGroup, ageMessages]) => `
        <tr>
          <td>${ageGroup}</td>
          <td>${ageMessages}</td>
        </tr>
      `,
        )
        .join('')}
    </table>
  </div>` : ''}
  
  ${props.platform_coverage ? `<div class="section">
    <table>
     <tr class="head">
        <th>Платформа</th>
        <th>Процент</th>
      </tr>
      ${props.platform_coverage
        .map(
          (platform) => `
        <tr>
          <td>${platform.publisher_platform}</td>
          <td>${platform.percentage}%</td>
        </tr>
      `,
        )
        .join('')}
    </table>
  </div>` : ''}
  
  ${props.country_coverage ? `<div class="section">
    <table>
      <tr class="head">
        <th>Страна</th>
        <th>Процент</th>
      </tr>
      ${props.country_coverage
        .map(
          (country) => `
        <tr>
          <td>${country.country}</td>
          <td>${country.percentage}%</td>
        </tr>
      `,
        )
        .join('')}
    </table>
  </div>` : ''}
  
  ${props.region_coverage ? `<div class="section">
    <table>
      <tr class="head">
        <th>Регион</th>
        <th>Процент</th>
      </tr>
      ${props.region_coverage
        .map(
          (region) => `
        <tr>
          <td>${region.region}</td>
          <td>${region.percentage}%</td>
        </tr>
      `,
        )
        .join('')}
    </table>
  </div>` : ''}

  ${props.top_age || props.platform_coverage || props.country_coverage || props.region_coverage ? '<div class="page-break"></div>' : ''}

  <br><br>
  <div class="section">
    <table>
      <tr class="head">
        <th>Креатив</th>
        <th>Заявки</th>
        <th>Цена за заявку</th>
      </tr>
      ${props.creative_insights
        .map(
          (insights) => `
        <tr>
          <td>${insights.ad_name}</td>
          <td>${insights.messages}</td>
          <td>${insights.cost_per_message}<span class="money">$</span></td>
        </tr>
      `,
        )
        .join('')}
    </table>
  </div>
  <div class="verify">
  <p>EldiyarGet</p>
  <img  src=${verifySrc} alt="Facebook">
  </div>

</body>
</html>
  `
}

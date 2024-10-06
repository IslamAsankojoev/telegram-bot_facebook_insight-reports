import puppeteer from 'puppeteer'

export async function createPdf(htmlContent: string) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage()
  await page.setContent(htmlContent)
  const pdfBuffer = await page.pdf({ format: 'A4' })
  await browser.close()
  return pdfBuffer
}

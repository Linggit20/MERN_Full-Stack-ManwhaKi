import puppeteer from "puppeteer"

export const scrapeData = async (req, res) => {
  try {
    const link = req.query.link
    const browser = await puppeteer.launch({ headless: "new" })
    const page = await browser.newPage()
    await page.goto(link)


    await page.waitForSelector('.entry-content img')
    const imageUrls = await page.$$eval('.entry-content img', images => images.map(img => img.src))

    await browser.close()

    res.status(200).json({ imageUrls })
  } catch (err) {
    console.log('Error while scraping:', err)
    res.status(500).json({ error: 'Error while scraping' })
  }
}
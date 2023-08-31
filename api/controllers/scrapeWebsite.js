import puppeteer from "puppeteer"

export const scrapeData = async (req, res) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: 
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  })
  try {
    const link = req.query.link
    const page = await browser.newPage()
    
    await page.goto(link, { waitUntil: "domcontentloaded" })

    const timeoutMs = 60000
    await page.waitForSelector('.entry-content img', { timeout: timeoutMs })
    const imageUrls = await page.$$eval('.entry-content img', images => images.map(img => img.src))

    res.status(200).json({ imageUrls })
  } catch (err) {
    console.log('Error while scraping:', err)
    res.status(500).json({ error: 'Error while scraping' })
  } finally {
    await browser.close()
  }
}
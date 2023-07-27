import MangaView from "../models/MangaView.js"
import Manga from "../models/Manga.js"


/**=============================================================== DASHBOARD CONTROLLER ============================================================*/

//  Get popular manga by Views
export const getMangaViews = async (req, res) => {
  try {
    const mangaViews = await MangaView.find().sort({ views: 1 })
    if (!mangaViews) return res.status(404).send("MangaViews not found")

    const mangaIds = mangaViews.map((mangaView) => mangaView.mangaId)
    const mangaList = await Manga.find({ _id: { $in: mangaIds } }).select("title coverURL")

    const popularManga = mangaViews.map((mangaView) => {
      const manga = mangaList.find((manga) => manga._id.toString() === mangaView.mangaId.toString())
      return { mangaView, manga }
    })

    popularManga.sort((a, b) => b.mangaView.views - a.mangaView.views)
    res.status(200).json({ popularManga })
  } catch (err) {
    console.log(err)
    res.status(500).send("Something went wrong")
  }
} 
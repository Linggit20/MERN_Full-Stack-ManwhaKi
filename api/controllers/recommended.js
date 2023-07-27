import Recommended from "../models/Recommended.js"
import Manga from "../models/Manga.js"


/**=============================================================== DASHBOARD CONTROLLER ============================================================*/

//  Add a featured manga - HERO SECTION
export const addRecommended = async (req, res) => {
  try {
    const { mangaId } = req.params

    const existingRecommended = await Recommended.findOne({ manga: mangaId })
    if (existingRecommended) return res.status(409).json({ error: "Manga already exists in the recommended list" })

    const recommended = new Recommended({
      manga: mangaId,
    })

    await recommended.save()

    res.status(200).send("Manga is successfully added to the recommended")
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}


export const removeRecommended = async (req, res) => {
  try {
    const { mangaId } = req.params

    const recommended = await Recommended.deleteOne({ manga: mangaId })
    if (!recommended ) return res.status(404).json({ error: "Featured manga not found" })


    res.status(200).send("Manga is successfully removed to the recommended")
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}


export const getAllRecommended = async (req, res) => {
  try {
    const recommendedManga = await Recommended.find()
    const completeMangaList = []

    for (const recommendManga of recommendedManga) {
      const mangaDetails = await Manga.findById(recommendManga.manga)
      if (mangaDetails) {
        completeMangaList.push(mangaDetails)
      }
    }

    res.status(200).json({ recommendedManga: completeMangaList })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}
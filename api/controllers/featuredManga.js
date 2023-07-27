import FeaturedManga from "../models/FeaturedManga.js"
import Manga from "../models/Manga.js"


/**=============================================================== DASHBOARD CONTROLLER ============================================================*/

//  Add a featured manga - HERO SECTION
export const createFeaturedManga = async (req, res) => {
  try {
    const { mangaId } = req.params

    const existingFeaturedManga = await FeaturedManga.findOne({ manga: mangaId })
    if (existingFeaturedManga) return res.status(409).json({ error: "Manga already exists in the featured manga list" })

    const featuredManga = new FeaturedManga({
      manga: mangaId,
    })

    await featuredManga.save()

    res.status(200).send("Manga is successfully added to the featured")
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}


//  Remove from featured manga - HERO SECTION
export const removeFeaturedManga = async (req, res) => {
  try {
    const { mangaId } = req.params

    const featuredManga = await FeaturedManga.deleteOne({ manga: mangaId })
    if (!featuredManga) return res.status(404).json({ error: "Featured manga not found" })


    res.status(200).send("Featured manga removed successfully")
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}



/**=============================================================== CLIENT CONTROLLER ============================================================*/

//  CLient - get  all featured manga - HERO SECTION
export const getAllFeaturedManga = async (req, res) => {
  try {
    const featuredMangaList = await FeaturedManga.find()
    const completeMangaList = []

    for (const featuredManga of featuredMangaList) {
      const mangaDetails = await Manga.findById(featuredManga.manga)
      if (mangaDetails) {
        completeMangaList.push(mangaDetails)
      }
    }

    res.status(200).json({ featuredMangaList: completeMangaList })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}
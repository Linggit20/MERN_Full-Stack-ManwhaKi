import Manga from "../models/Manga.js"
import Chapter from "../models/Chapter.js"
import BookmarkCount from "../models/BookmarkCount.js"
import MangaView from "../models/MangaView.js"


/**=============================================================== DASHBOARD CONTROLLER ============================================================*/

//  Upload Manga
export const uploadManga = async (req, res) => {
  try {
    const isMatch = await Manga.findOne({ slug: req.body.slug })
    if (isMatch) return res.status(409).json({ error: "The manga is already exist" })

    const newManga = new Manga({
      ...req.body
    })

    await newManga.save()
    res.status(201).send("Manga successfully uploaded")
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong"})
  }
}

//  Update Manga
export const updateManga = async (req, res) => {
  try {
    const { mangaId } = req.params
    const updateData = req.body

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") {
        delete updateData[key]
      }
    })

    const updatedManga = await Manga.findByIdAndUpdate(mangaId, updateData, { new: true }) 
    if (!updatedManga) return res.status(404).json({ error: "Manga not found" })

    res.status(200).send("Manga updated successfully")
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went  wrong" })
  }
}


//  Delete a Manga
export const deleteManga = async (req, res) => {
  try {
    const { mangaId } = req.params  

    const deleteManga = await Manga.findByIdAndDelete(mangaId)
    if (!deleteManga) return res.status(404).json({ error: "Manga not found"})

    await MangaView.findOneAndRemove({ mangaId: mangaId})
    
    res.status(200).send("Manga deleted successfully")
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong"})
  }
}


//  Get  all manga with bookmark count and views
export const getMangaList = async (req, res) => {
  try {
    const mangaList = await Manga.find()

    const manga = await Promise.all(
      mangaList.map(async (manga) => {
        const bookmarkCountDoc = await BookmarkCount.findOne({ mangaId: manga._id })
        const bookmarkCount = bookmarkCountDoc ? bookmarkCountDoc.count : 0

        const mangaView = await MangaView.findOne({ mangaId: manga._id })
        const views = mangaView ? mangaView.views : 0

        return { ...manga.toObject(), bookmarkCount, views }
      })
    )
    
    manga.sort((a, b) => b.createdAt - a.createdAt)
    res.status(200).json({ manga: manga })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
}

//  Get Get  all manga with bookmark count and views - paginated
export const getMangaListPaginated = async (req, res) => {
  try {
    const limit = 10; // Change the limit as per your requirement
    const { page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * limit;

    const mangaList = await Manga.find().sort({ updatedAt: -1 }).skip(skip).limit(limit);

    const manga = await Promise.all(
      mangaList.map(async (manga) => {
        const bookmarkCountDoc = await BookmarkCount.findOne({ mangaId: manga._id });
        const bookmarkCount = bookmarkCountDoc ? bookmarkCountDoc.count : 0;

        const mangaView = await MangaView.findOne({ mangaId: manga._id });
        const views = mangaView ? mangaView.views : 0;

        return { ...manga.toObject(), bookmarkCount, views };
      })
    );

    const hasNextPage = mangaList.length >= limit;

    res.status(200).json({ manga: manga, hasNextPage });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


/**=============================================================== CLIENT CONTROLLER ============================================================*/

// CLient - Get recent updated manga paginated
export const getRecentUpdate = async (req, res) => {
  try {
    const limit = 16
    const { page = 1 } = req.query
    const skip = (parseInt(page) - 1) * limit

    const mangaList = await Manga.find().skip(skip).limit(limit).sort({ updatedAt: -1 })
    const latestUpdate = []

    for (const manga of mangaList) {
      const chapters = await Chapter.find({ manga: manga._id })
        .sort({ createdAt: -1 })
        .limit(3)

      latestUpdate.push({
        manga: manga,
        chapters: chapters,
      })
    }

    const hasNextPage = mangaList.length >= limit
    res.status(200).json({ latestUpdate, hasNextPage })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}


// CLient - Get all manga
export const getAllManga = async (req, res) => {
  try{
    const mangaList = await Manga.find()

    res.status(200).json({ mangaList })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}


//  CLient - Get a single manga
export const getSingleManga = async (req, res) => {
  try {
    const { slug } = req.params

    const mangaBySlug = await Manga.findOne({ slug: slug })
    if (!mangaBySlug) return res.status(404).send("Manga not found")

    const mangaId = mangaBySlug._id
    const bookmarkCount = await BookmarkCount.findOne({ mangaId }).select("count")

    const manga = {
      ...mangaBySlug._doc,
      bookmarkCount: bookmarkCount ? bookmarkCount.count : 0
    }

    res.status(200).send(manga)
  } catch (err) {
    console.log(err)
    res.status(500).send("Something went wrong")
  }
}
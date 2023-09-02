import Chapter from "../models/Chapter.js"
import Manga from "../models/Manga.js"


/**=============================================================== DASHBOARD CONTROLLER ============================================================*/

//  Add new chapter
export const uploadChapter = async (req, res) => {
  try {
    const { mangaId } = req.params

    const manga = await Manga.findById(mangaId)
    if (!manga) return res.status(404).json({ error: "Manga not found" })

    const { fullTitle, slug, shortTitle, chapterNum, chapterNav } = req.body

    const existingChapter = await Chapter.findOne({
      fullTitle,
      slug,
      shortTitle,
      chapterNum,
      chapterNav,
    })
    if (existingChapter) return res.status(409).json({ error: "Chapter already exists" })

    const newChapter = new Chapter({
      manga: mangaId,
      ...req.body,
    })

    await newChapter.save()

    manga.updatedAt = Date.now()
    await manga.save()
    res.status(201).send("The chapter has been uploaded successfully")
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}


//  Update a chapter
export const updateChapter = async (req, res) => {
  try {
    const { chapterId } = req.params
    const updateData = req.body

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === "") {
        delete updateData[key]
      }
    })

    const updatedChapter = await Chapter.findByIdAndUpdate(chapterId, updateData, { new: true })
    if (!updatedChapter) return res.status(404).json({ error: "Chapter not found" })

    res.status(200).send("Manga updated successfully")
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}

// Update domains in content URLs for all chapters
export const updateContentURLs = async (req, res) => {
  try {
    const { id: mangaId } = req.params
    const { oldDomain, newDomain } = req.body

    if (!oldDomain || !newDomain) {
      return res.status(400).json({ error: "Both oldDomain and newDomain are required in the request body" })
    }

    const manga = await Manga.findById(mangaId)
    if (!manga) return res.status(404).json({ error: "Manga not found" })

    const chapters = await Chapter.find({ manga: mangaId })

    const updateURL = (url) => {
      return url.replace(new RegExp(oldDomain, 'g'), newDomain)
    }

    for (const chapter of chapters) {
      chapter.contentURL = chapter.contentURL.map(updateURL)

      await chapter.save()
    }


    res.status(200).json({ message: "Content URLs updated successfully" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}



//  Delete a chapter
export const deleteChapter = async (req, res) => {
  try {
    const { chapterId }  = req.params

    const chapter = await Chapter.findByIdAndDelete(chapterId)
    if (!chapter) return res.status(404).json({ error: "Chapter not found" })

    res.status(200).send("Chapter is successfully deleted" )
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}


// Get all chapter
export const getAllChapter = async (req, res) => {
  try {
    const { mangaId } = req.params

    const manga = await Manga.findById(mangaId)
    if (!manga) return res.status(404).send("Manga not found")

    const foundMangaId = manga._id
    const allChapter = await Chapter.find({ manga: foundMangaId })

    const chapters = allChapter.map(chapter => chapter.toObject())
    const chapterData = chapters.map(chapter => {
      const { manga, ...chapterData } = chapter
      return chapterData
    })

    chapterData.sort((a, b) => b.chapterNum - a.chapterNum)
    res.status(200).json({ chapterData })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  } 
}


/**=============================================================== CLIENT CONTROLLER ============================================================*/

// Get all chapter
export const allChapter = async (req, res) => {
  try {
    const { slug } = req.params

    const manga = await Manga.findOne({ slug: slug })
    if (!manga)  return res.status(404).send("Manga not found")

    const mangaId = manga._id
    const allChapter = await Chapter.find({ manga: mangaId })
  
    const chapters = allChapter.map(chapter => chapter.toObject())
    const chapterData = chapters.map(chapter => {
      const { manga, ...chapterData } = chapter
      return chapterData
    })

    chapterData.sort((a, b) => b.chapterNum - a.chapterNum)
    res.status(200).json({ mangaId: mangaId, chapterData })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: err.message})
  } 
}


//  Get a single  chapter
export const getSingleChapter = async (req, res) => {
  try {
    const { slug } = req.params
    
    const chapterBySlug = await Chapter.findOne({ slug: slug })

    if (!chapterBySlug) return res.status(404).send("Chapter not found")

    res.status(200).send(chapterBySlug)
  } catch (err)  {
    console.log(err)
    res.status(500).send("Something went wrong")
  }
}
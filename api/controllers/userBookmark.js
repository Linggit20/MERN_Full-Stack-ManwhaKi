import UserBookmark from "../models/UserBookmark.js"
import BookmarkCount from "../models/BookmarkCount.js"
import UserChapterBookmark from "../models/UserChapterBookmark.js"


/**=============================================================== CLIENT CONTROLLER ============================================================*/

// Add manga to bookmark
export const addToBookmarks = async (req, res) => {
  try {
    const { mangaId } = req.params
    const userId = req.id

    const bookmarkExists = await UserBookmark.exists({ userId, mangaIds: mangaId })
    if(bookmarkExists) return res.status(409).json({ error: "Manga already bookmarked" })

    await UserBookmark.findOneAndUpdate(
      { userId }, 
      { $push: { mangaIds: mangaId } }, 
      { upsert: true }
    )
    
    await BookmarkCount.findOneAndUpdate(
      { mangaId },
      { $inc: { count: 1 } },
      { upsert: true }
    )

    res.status(200).send("Manga added to bookmarks successfully")
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}

//  Remove manga from bookmark
export const removeFromBookmarks = async (req, res)  => {
  try {
    const { mangaId } = req.params
    const userId = req.id

    const bookmarkedManga = await UserBookmark.exists({ userId, mangaIds: mangaId })
    if (!bookmarkedManga) return res.status(400).json({ error: "Manga is not bookmarked" })

    await UserBookmark.findOneAndUpdate(
      { userId },
      { $pull: { mangaIds: mangaId } }
    )

    await BookmarkCount.findOneAndUpdate(
      { mangaId },
      { $inc: { count: -1 } }
    )

    res.status(200).send("Manga removed from bookmarks successfully")
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}


//  Get user manga bookmark with the latest chapter read
export const getBookmarkedManga = async (req, res) => {
  try {
    const userId = req.id

    const mangaBookmark = await UserBookmark.findOne({ userId }).populate("mangaIds", "title slug coverURL")
    if (!mangaBookmark || mangaBookmark.mangaIds.length === 0) return res.status(200).send("Your bookmark is empty")

    const bookmarkedManga = mangaBookmark.mangaIds
    const bookmarkedMangaIds = bookmarkedManga.map(manga => manga._id)

    const chapterBookmark = await UserChapterBookmark.find({ userId, mangaId: { $in: bookmarkedMangaIds } }).select("mangaId chapters")

    const mergedBookmarks = bookmarkedManga.map(manga => {
      const chapters = chapterBookmark.find(bookmark => bookmark.mangaId.toString() === manga._id.toString())
      const mergedManga = manga.toObject()
      mergedManga.chapters = chapters ? chapters.chapters.slice(0, 3) : null
      return { manga: mergedManga }
    })

    mergedBookmarks.reverse()
    res.status(200).json({ bookmarkedManga: mergedBookmarks })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}
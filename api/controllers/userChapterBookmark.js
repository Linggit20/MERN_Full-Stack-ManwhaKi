import UserChapterBookmark from "../models/UserChapterBookmark.js"
import Chapter from "../models/Chapter.js"
import MangaView from "../models/MangaView.js"


/**=============================================================== CLIENT CONTROLLER ============================================================*/

//  Add chapter to chapter bookmark
export const addToChapterBookmark = async (req, res) => {
  try {
    const { mangaId, chapterId } = req.params;
    const userId = req.id;

    const chapter = await Chapter.findById(chapterId).select("shortTitle slug chapterNav");
    if (!chapter) {
      return res.status(404).send("Chapter not found");
    }

    const updateBookmark = {
      $addToSet: { chapters: chapter },
    };
    await UserChapterBookmark.findOneAndUpdate(
      { userId, mangaId },
      updateBookmark,
      { upsert: true, new: true }
    );

    let mangaView = await MangaView.findOne({ mangaId });

    if (!mangaView) {
      // Create a new manga view document if it doesn't exist
      mangaView = new MangaView({ mangaId });
    }

    if (!mangaView.viewedBy.includes(userId)) {
      mangaView.viewedBy.push(userId);
      mangaView.views++;
      await mangaView.save();
    }

    res.status(200).send("Chapter added to bookmark");
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};



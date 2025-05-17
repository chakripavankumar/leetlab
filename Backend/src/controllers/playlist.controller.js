import { db } from "../libs/db.js";
// CREATE PLAYLIST
export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });
    res.status(200).json({
      success: true,
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    console.error(" problem in Playlist creation", error);
    res.status(500).json({ error: "problem in Playlist creation" });
  }
};
// ADD PROBLEM TO THE LIST
export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problemIds" });
    }
    const added = await db.problemPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
      skipDuplicates: true,
    });
    res.status(200).json({
      success: true,
      message: "Problems added to playlist successfully",
      added,
    });
  } catch (error) {
    console.error("Error adding problems to playlist:", error);
    res.status(500).json({ error: "Failed to add problems to playlist" });
  }
};
// GET THE PLAYLISTS BY USER
export const getAllListDetails = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      playlists,
    });
  } catch (error) {
    console.error(" problem in getAllListDetails", error);
    res.status(500).json({ error: "problem in getAllListDetails" });
  }
};
// GET PARTICULAR LIST DETAILS BY USER
export const getPlayListDetails = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
    res.status(200).json({
      success: true,
      message: "Playlist fetched successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error fetching playlist:", error);
    res.status(500).json({ error: "Failed to fetch playlist" });
  }
};
// DELETE PLAYLSIT
export const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  try {
    const deletePlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });
    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
      deletePlaylist,
    });
  } catch (error) {
    console.error("Playlist deleted successfully", error);
    res.status(500).json({ error: "Playlist deleted successfully" });
  }
};
// REEMOVE PARTICULAR PROBLEM FROM LIST
export const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(201).json({ error: "Invalid or missing problemsId" });
    }
    const deleteProblem = await db.problemPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "Problem removed from playlist successfully",
      deleteProblem,
    });
  } catch (error) {
    console.error("Error removing problem from playlist:", error.message);
    res.status(500).json({ error: "Failed to remove problem from playlist" });
  }
};

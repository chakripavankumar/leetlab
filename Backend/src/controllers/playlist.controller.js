import { db } from "../libs/db.js";
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
export const getAllListDetails = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where: {
        user: req.user.id,
      },
      include: {
        problems: {
          problem: true,
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
export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "invalid or missing problemIds" });
    }
    const problemPlaylist = await db.problemsInPlaylist.createMany({
      data: playlistId.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });
    res.status(200).json({
      success: true,
      message: "Problems added to playlist successfully",
      problemPlaylist,
    });
  } catch (error) {
    console.error("Error Adding problem in  playlist:", error);
    res.status(500).json({ error: "Failed to adding problem in playlist" });
  }
};
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
export const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemId) || problemId.length === 0) {
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

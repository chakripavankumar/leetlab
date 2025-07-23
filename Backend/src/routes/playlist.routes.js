import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createPlaylist,
  deletePlaylist,
  addProblemsToPlaylist,
  addSingleProblemToPlaylist,
  getAllPlaylistDetails,
  getPlaylistById,
  removeProblemsFromPlaylist,
  removeSingleProblemFromPlaylist,
} from "../controllers/playlist.controller.js";

const playlistRoutes = express.Router();

playlistRoutes.post('/create', authMiddleware, createPlaylist);
playlistRoutes.post('/:playlistId/add-problems', authMiddleware, addProblemsToPlaylist);
playlistRoutes.post('/add-problem', authMiddleware, addSingleProblemToPlaylist);
playlistRoutes.get('/get-all', authMiddleware, getAllPlaylistDetails);
playlistRoutes.get('/:playlistId', authMiddleware, getPlaylistById);
playlistRoutes.delete('/delete/:playlistId', authMiddleware, deletePlaylist);
playlistRoutes.delete('/:playlistId/remove-problems', authMiddleware, removeProblemsFromPlaylist);
playlistRoutes.delete('/remove-problem/:entryId', authMiddleware, removeSingleProblemFromPlaylist);

export default playlistRoutes;

import axios from 'axios';

const createPlaylist = (payload) => axios.post('/playlist/create', payload);

const getAllPlaylist = () => axios.get('/playlist/get-all');

const getPlaylistById = (id) => axios.get(`/playlist/${id}`);

const addSingleProblemToPlaylist = (payload) => axios.post(`/playlist/add-problem`, payload);

const removeProblemsFromPlaylist = (playlistId, payload) =>
  axios.delete(`/playlist/${playlistId}/remove-problems`, payload);

const deletePlaylist = (playlistId) => axios.delete(`/playlist/delete/${playlistId}`);

const removeSingleProblemFromPlaylist = (entryId) =>
  axios.delete(`/playlist/remove-problem/${entryId}`);

const playlistApis = {
  createPlaylist,
  getAllPlaylist,
  getPlaylistById,
  addSingleProblemToPlaylist,
  removeProblemsFromPlaylist,
  deletePlaylist,
  removeSingleProblemFromPlaylist,
};

export default playlistApis;

import { useMutation, useQuery } from 'react-query';
import playlistApis from '../../apis/playlistApis';
import { QUERY_KEYS } from '../../constants/keys';

export const useCreatePlaylist = () => useMutation(playlistApis.createPlaylist);

export const useGetAllPlaylists = () =>
  useQuery({
    queryKey: QUERY_KEYS.PLAYLISTS,
    queryFn: () => playlistApis.getAllPlaylist(),
  });

export const useGetPlaylistById = (playlistId) =>
  useQuery({
    queryKey: [QUERY_KEYS.PLAYLISTS, playlistId],
    queryFn: () => playlistApis.getPlaylistById(playlistId),
    enabled: !!playlistId,
  });

export const useAddProblemsToPlaylist = () => useMutation(playlistApis.addSingleProblemToPlaylist);

export const useDeletePlaylistById = () => useMutation(playlistApis.deletePlaylist);

export const useRemoveSingleProblemFromPlaylist = () =>
  useMutation(playlistApis.removeSingleProblemFromPlaylist);

import { BookMarked, List, Play, PlusCircle, Shuffle, Trash2, UserCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDeletePlaylistById, useGetAllPlaylists } from '../../hooks/reactQuery/usePlaylistApi';
import { DeleteModal, MyLoader } from '../common';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import queryClient from '../../utils/queryClient';
import { QUERY_KEYS } from '../../constants/keys';
import timeAgo from '../../utils/timeAgo';
import CreatePlaylistModal from './CreatePlaylistModal';

const PlaylistSet = () => {
  const [playlistToDeleted, setPlaylistToDeleted] = useState(null);

  const { mutate: deletePlaylist } = useDeletePlaylistById();
  const { data, isLoading } = useGetAllPlaylists();

  const navigate = useNavigate();

  const { isAuthenticated, removePlaylist } = useAuthStore();

  const handleDeletePlaylist = (id) => {
    if (!id) {
      toast.error('Please select a playlist to perform this action');
      return;
    }
    deletePlaylist(id, {
      onSuccess: ({ message }) => {
        toast.success(message || 'Playlist deleted successfully');
        queryClient.invalidateQueries(QUERY_KEYS.PLAYLISTS);
        removePlaylist(id);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.error || 'Something went wrong');
      },
    });
  };
  // console.log(data);

  if (isLoading) return <MyLoader />;

  return (
    <div className="min-h-screen bg-base-200 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <BookMarked className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">My Playlists</h1>
                  <p className="text-base-content/70 text-lg">
                    Organize and manage your coding problem collections
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="stats shadow">
                  <div className="stat">
                    <div className="stat-title text-xs">Total Playlists</div>
                    <div className="stat-value text-2xl text-primary">
                      {data?.data?.length || 0}
                    </div>
                  </div>
                </div>

                <div
                  className="tooltip tooltip-bottom"
                  data-tip={isAuthenticated ? 'Create a new playlist' : 'Login to create playlist'}
                >
                  <button
                    className="btn btn-primary gap-2"
                    type="button"
                    onClick={() => document.getElementById('create_playlist').showModal()}
                    disabled={!isAuthenticated}
                  >
                    <PlusCircle className="w-5 h-5" />
                    Create Playlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Playlists Grid Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-300">
              <h2 className="card-title text-2xl flex items-center gap-2">
                <List className="w-6 h-6 text-primary" />
                Your Collections
              </h2>
            </div>

            <div className="p-6">
              {data?.data?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data?.data?.map((playlist) => (
                    <div
                      key={playlist?.id}
                      className="card bg-base-200 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] duration-200"
                    >
                      <div className="card-body">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Play className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="card-title text-xl">{playlist?.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-base-content/60">
                                <UserCircle className="w-4 h-4" />
                                {playlist?.user?.name}
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-base-content/70 line-clamp-2">{playlist?.description}</p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="stat p-2">
                            <div className="stat-title text-xs">Problems</div>
                            <div className="stat-value text-lg text-primary">
                              {playlist?.problems?.length || 0}
                            </div>
                          </div>
                          <div className="badge badge-outline ml-2 opacity-70">
                            <span className="px-2 whitespace-nowrap">
                              {timeAgo(playlist?.updatedAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 justify-between">
                          <div
                            className="tooltip tooltip-bottom"
                            data-tip={
                              isAuthenticated ? 'Explore the playlist' : 'Login to explore playlist'
                            }
                          >
                            <button
                              onClick={() => navigate(`/playlists/${playlist?.id}`)}
                              type="button"
                              className="btn btn-primary btn-sm gap-2 flex-1"
                              disabled={!isAuthenticated}
                            >
                              <Shuffle className="w-4 h-4" />
                              Explore
                            </button>
                          </div>

                          <div
                            className="tooltip tooltip-bottom"
                            data-tip={isAuthenticated ? 'Delete the playlist' : 'Unauthorized'}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setPlaylistToDeleted(playlist);
                                document.getElementById('delete_playlist_modal').showModal();
                              }}
                              className="btn btn-error btn-sm"
                              disabled={!isAuthenticated}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-base-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BookMarked className="w-8 h-8 text-base-content/40" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No playlists yet</h3>
                  <p className="text-base-content/60 mb-4">
                    Create your first playlist to organize your favorite problems
                  </p>
                  <button
                    className="btn btn-primary gap-2"
                    onClick={() => document.getElementById('create_playlist').showModal()}
                    disabled={!isAuthenticated}
                  >
                    <PlusCircle className="w-5 h-5" />
                    Create Your First Playlist
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Playlist Modal */}
        <CreatePlaylistModal />

        {/* Delete Modal */}
        <DeleteModal
          modalId="delete_playlist_modal"
          title="Delete Playlist"
          message={`Are you sure you want to delete "${playlistToDeleted?.name}"? This selected playlist will be deleted permanently, along with all its problems. This action cannot be undone.`}
          onDelete={() => {
            handleDeletePlaylist(playlistToDeleted?.id);
            setPlaylistToDeleted(null);
          }}
        />
      </div>
    </div>
  );
};

export default PlaylistSet;

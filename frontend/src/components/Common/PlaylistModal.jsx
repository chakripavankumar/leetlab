import { useAuthStore } from '../../stores/useAuthStore';
import { useAddProblemsToPlaylist } from '../../hooks/reactQuery/usePlaylistApi';
import toast from 'react-hot-toast';
import { useState } from 'react';
import queryClient from '../../utils/queryClient';
import { QUERY_KEYS } from '../../constants/keys';
import { PlayCircle, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const PlaylistModal = ({ problemId, allPlaylists }) => {
  const [playlistAddDetails, setPlaylistAddDetails] = useState({
    playlistId: null,
  });

  const { mutate: addProblemToPlaylist } = useAddProblemsToPlaylist();

  const { isAuthenticated } = useAuthStore();

  const addToPlaylist = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add problem to playlist');
      return;
    }
    if (!playlistAddDetails.playlistId || !problemId) {
      toast.error('Please select a playlist');
      return;
    }

    const modal = document.getElementById('add_to_playlist');
    if (modal) {
      modal.close();
    }

    addProblemToPlaylist(
      {
        playlistId: playlistAddDetails.playlistId,
        problemId,
      },
      {
        onSuccess: (res) => {
          toast.success(res?.message || 'Added to playlist successfully');
          queryClient.invalidateQueries(QUERY_KEYS.PLAYLISTS);
        },
        onError: (err) => {
          toast.error(err?.response?.data?.error || 'Something went wrong');
        },
      }
    );
    setPlaylistAddDetails({
      problemId: null,
      playlistId: null,
    });
  };

  return (
    <div>
      {/* playlist add modal */}
      <dialog id="add_to_playlist" className="modal">
        <div className="modal-box max-w-md">
          {/* Close Button */}
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 hover:bg-base-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </form>

          {/* Playlist Icon */}
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <PlayCircle className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-xl text-center mb-3">Add to Playlist</h3>

          {/* Message */}
          <p className="text-base-content/70 text-center mb-6 leading-relaxed">
            Select a playlist to add this problem to your collection
          </p>

          {/* Content */}
          {allPlaylists?.length > 0 ? (
            <div className="space-y-4">
              {/* Playlist Selection */}
              <select
                className="select select-primary select-lg w-full bg-base-100 border-2 focus:border-primary transition-colors"
                onChange={(e) =>
                  setPlaylistAddDetails((prev) => ({ ...prev, playlistId: e.target.value }))
                }
                value={playlistAddDetails.playlistId || 'default'}
              >
                <option disabled={true} value="default">
                  Select a playlist to add this problem
                </option>
                {allPlaylists?.map((playlist) => (
                  <option key={playlist.id} value={playlist?.id}>
                    {playlist?.name}
                  </option>
                ))}
              </select>

              {/* Action Buttons */}
              <div className="modal-action justify-center gap-3 mt-6">
                <form method="dialog" className="flex gap-3">
                  <button className="btn btn-outline btn-lg px-8 hover:bg-base-200 transition-colors">
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary btn-lg px-8 hover:btn-primary/90 transition-colors gap-2"
                    onClick={addToPlaylist}
                    disabled={!playlistAddDetails.playlistId}
                    type="button"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-base-content/70 mb-6">
                No playlists available. Please create a new{' '}
                <Link to="/playlists" className="text-primary link-hover">
                  playlist
                </Link>{' '}
                first.
              </p>

              {/* Single Close Button for No Playlists */}
              <div className="modal-action justify-center">
                <form method="dialog">
                  <button className="btn btn-outline btn-lg px-8 hover:bg-base-200 transition-colors">
                    Close
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Modal Backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default PlaylistModal;

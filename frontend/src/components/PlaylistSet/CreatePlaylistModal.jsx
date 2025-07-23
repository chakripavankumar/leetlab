import { BookMarked, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useCreatePlaylist } from '../../hooks/reactQuery/usePlaylistApi';
import queryClient from '../../utils/queryClient';
import { QUERY_KEYS } from '../../constants/keys';
import { useAuthStore } from '../../stores/useAuthStore';

const CreatePlaylistModal = ({ modalId = 'create_playlist' }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const { mutate: createPlaylist } = useCreatePlaylist();
  const { addPlaylist } = useAuthStore();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast.error('Please fill in all the fields');
      return;
    }

    createPlaylist(formData, {
      onSuccess: ({ message, data }) => {
        toast.success(message || 'Playlist created successfully');
        setFormData({ name: '', description: '' });
        const modal = document.getElementById(modalId);
        if (modal) modal.close();
        queryClient.invalidateQueries(QUERY_KEYS.PLAYLISTS);
        addPlaylist({ id: data?.id, name: data?.name });
      },
      onError: (err) => {
        toast.error(err.response?.data?.error || 'Something went wrong');
      },
    });
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookMarked className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-bold text-xl">Create New Playlist</h3>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label" htmlFor="name">
              <span className="label-text font-medium">Playlist Name</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter playlist name"
              className="input input-bordered w-full"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="form-control">
            <label className="label" htmlFor="description">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              id="description"
              placeholder="Enter playlist description"
              className="textarea textarea-bordered w-full h-24"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => document.getElementById(modalId)?.close()}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary gap-2">
              <PlusCircle className="w-4 h-4" />
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CreatePlaylistModal;

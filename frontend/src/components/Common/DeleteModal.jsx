import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteModal = ({
  modalId,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  onDelete,
}) => {
  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box max-w-md">
        {/* Close Button */}
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 hover:bg-base-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </form>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-error/10 rounded-full">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-xl text-center mb-3">{title}</h3>

        {/* Message */}
        <p className="text-base-content/70 text-center mb-6 leading-relaxed">{message}</p>

        {/* Action Buttons */}
        <div className="modal-action justify-center gap-3 mt-6">
          <form method="dialog" className="flex gap-3">
            <button className="btn btn-outline btn-lg px-8 hover:bg-base-200 transition-colors">
              Cancel
            </button>
            <button
              className="btn btn-error btn-lg px-8 hover:btn-error/90 transition-colors"
              onClick={() => {
                onDelete();
                document.getElementById(modalId).close();
              }}
              type="button"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {/* Modal Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default DeleteModal;

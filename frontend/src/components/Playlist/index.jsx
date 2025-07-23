import {
  Book,
  BookMarked,
  LinkIcon,
  Trash,
  UserCircle,
  Clock,
  Tag,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  useGetPlaylistById,
  useRemoveSingleProblemFromPlaylist,
} from '../../hooks/reactQuery/usePlaylistApi';
import { DeleteModal, MyLoader, PaginatedTable } from '../common';
import { useAuthStore } from '../../stores/useAuthStore';
import toast from 'react-hot-toast';
import queryClient from '../../utils/queryClient';
import { QUERY_KEYS } from '../../constants/keys';
import timeAgo from '../../utils/timeAgo';

const Playlist = () => {
  const [entryToDelete, setEntryToDelete] = useState(null);
  const { playlistId } = useParams();

  const { problemsSolved } = useAuthStore();

  const { data, isLoading } = useGetPlaylistById(playlistId);
  const { mutate: removeProblem } = useRemoveSingleProblemFromPlaylist();

  const handleDeleteProblem = () => {
    if (!entryToDelete) {
      return;
    }

    removeProblem(entryToDelete, {
      onSuccess: ({ message }) => {
        toast.success(message || 'Problem removed successfully');
        queryClient.invalidateQueries([QUERY_KEYS.PLAYLISTS, playlistId]);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.error || 'Something went wrong');
      },
    });

    setEntryToDelete(null);
  };

  if (isLoading) {
    return <MyLoader />;
  }

  const totalProblems = data?.data?.problems?.length || 0;
  const solvedProblems =
    data?.data?.problems?.filter((problem) => problemsSolved.includes(problem?.problemId)).length ||
    0;

  const difficultyStats = data?.data?.problems?.reduce((acc, problem) => {
    const difficulty = problem?.problem?.difficulty || 'UNKNOWN';
    acc[difficulty] = (acc[difficulty] || 0) + 1;
    return acc;
  }, {});

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
                  <h1 className="text-4xl font-bold mb-2">{data?.data?.name}</h1>
                  <p className="text-base-content/70 text-lg mb-2">{data?.data?.description}</p>
                  <div className="flex items-center gap-2 text-base-content/60">
                    <UserCircle className="w-5 h-5" />
                    <span className="text-sm">Created by {data?.data?.user?.name}</span>
                  </div>
                </div>
              </div>

              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title text-xs">Progress</div>
                  <div className="stat-value text-2xl text-success">
                    {solvedProblems}/{totalProblems}
                  </div>
                  <div className="stat-desc">Problems Solved</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Total Problems</p>
                  <p className="text-3xl font-bold text-info">{totalProblems}</p>
                </div>
                <div className="p-3 bg-info/10 rounded-lg">
                  <Book className="w-8 h-8 text-info" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Completed</p>
                  <p className="text-3xl font-bold text-success">{solvedProblems}</p>
                </div>
                <div className="p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Remaining</p>
                  <p className="text-3xl font-bold text-warning">
                    {totalProblems - solvedProblems}
                  </p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <Clock className="w-8 h-8 text-warning" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Completion</p>
                  <p className="text-3xl font-bold text-primary">
                    {totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0}%
                  </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Tag className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Difficulty Breakdown Card */}
        {totalProblems > 0 && (
          <div className="card bg-base-100 shadow-2xl">
            <div className="card-body p-0">
              <div className="p-6 border-b border-base-300">
                <h2 className="card-title text-2xl flex items-center gap-2">
                  <Tag className="w-6 h-6 text-primary" />
                  Difficulty Breakdown
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <div className="w-5 h-5 bg-success rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/60">Easy</p>
                      <p className="text-lg font-semibold">{difficultyStats?.EASY || 0} problems</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <div className="w-5 h-5 bg-warning rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/60">Medium</p>
                      <p className="text-lg font-semibold">
                        {difficultyStats?.MEDIUM || 0} problems
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-error/10 rounded-lg">
                      <div className="w-5 h-5 bg-error rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-base-content/60">Hard</p>
                      <p className="text-lg font-semibold">{difficultyStats?.HARD || 0} problems</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Problems Table Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-300">
              <h2 className="card-title text-2xl flex items-center gap-2">
                <Book className="w-6 h-6 text-primary" />
                Playlist Problems
                <div className="badge badge-outline badge-lg">
                  {totalProblems} {totalProblems === 1 ? 'Problem' : 'Problems'}
                </div>
              </h2>
            </div>

            <div className="p-6">
              <PaginatedTable
                data={data?.data?.problems || []}
                // itemsPerPage={10}
                columns={[
                  { label: '#', sortKey: '' },
                  { label: 'Solved', sortKey: '' },
                  { label: 'Title', sortKey: '' },
                  { label: 'Tags', sortKey: '' },
                  { label: 'Added', sortKey: '' },
                  { label: 'Difficulty', sortKey: '' },
                  { label: 'Actions', sortKey: '' },
                ]}
                renderRow={(entry, index) => (
                  <tr key={entry.id} className="hover:bg-base-200/50 transition-colors">
                    <td className="text-center font-medium">{index + 1}</td>
                    <td className="text-center">
                      {problemsSolved.includes(entry?.problemId) ? (
                        <div className="flex justify-center">
                          <CheckCircle className="w-5 h-5 text-success" />
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <XCircle className="w-5 h-5 text-base-content/30" />
                        </div>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/problems/${entry?.problemId}`}
                        className="text-primary hover:text-primary-focus transition-colors font-medium"
                      >
                        {entry?.problem?.title}
                      </Link>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {entry?.problem?.tags?.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="badge badge-ghost badge-sm capitalize">
                            {tag}
                          </span>
                        )) || <span className="text-base-content/50">No tags</span>}
                        {entry?.problem?.tags?.length > 2 && (
                          <span className="badge badge-ghost badge-sm">
                            +{entry.problem.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="w-4 h-4 text-base-content/50" />
                        <span className="text-sm">{timeAgo(entry?.createdAt)}</span>
                      </div>
                    </td>
                    <td className="text-center">
                      <span
                        className={`badge font-medium ${
                          entry?.problem?.difficulty === 'EASY'
                            ? 'badge-success'
                            : entry?.problem?.difficulty === 'MEDIUM'
                            ? 'badge-warning'
                            : 'badge-error'
                        }`}
                      >
                        {entry?.problem?.difficulty === 'EASY'
                          ? 'Easy'
                          : entry?.problem?.difficulty === 'MEDIUM'
                          ? 'Medium'
                          : 'Hard'}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setEntryToDelete(entry?.id);
                          document.getElementById('delete_problem_in_playlist_modal').showModal();
                        }}
                        className="btn btn-sm btn-outline btn-error hover:btn-error gap-1 transition-all"
                        title="Remove from playlist"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )}
                noDataMessage={
                  <tr>
                    <td colSpan="7" className="text-center py-12">
                      <div className="space-y-4">
                        <div className="p-4 bg-base-200/50 rounded-xl inline-block">
                          <BookMarked className="w-12 h-12 text-base-content/30 mx-auto" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-base-content/70 mb-2">
                            No problems in this playlist yet
                          </p>
                          <p className="text-sm text-base-content/50 mb-4">
                            Start building your playlist by adding problems from the problems page.
                          </p>
                          <Link to="/problems" className="btn btn-primary gap-2">
                            <LinkIcon className="w-4 h-4" />
                            Browse Problems
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                }
              />
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        <DeleteModal
          modalId="delete_problem_in_playlist_modal"
          title="Remove Problem from Playlist"
          message="Are you sure you want to remove this problem from the playlist? This action cannot be undone."
          onDelete={handleDeleteProblem}
        />
      </div>
    </div>
  );
};

export default Playlist;

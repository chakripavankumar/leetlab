import { useEffect, useState } from 'react';
import {
  FileJson,
  Trash,
  Search,
  BookmarkPlusIcon,
  Tag,
  BriefcaseBusiness,
  Filter,
  Code,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGetAllProblems } from '../../hooks/reactQuery/useProblemApi';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../stores/useAuthStore';
import { DeleteModal, MyLoader, PaginatedTable, PlaylistModal } from '../common';
import { useDeleteProblem } from '../../hooks/reactQuery/useAdminApi';
import queryClient from '../../utils/queryClient';
import { QUERY_KEYS } from '../../constants/keys';

const ProblemSet = () => {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [problemIdForPlaylist, setProblemIdForPlaylist] = useState(null);
  const [problemToDelete, setProblemToDelete] = useState({ id: null, title: null });

  const { data, isLoading, isError, error } = useGetAllProblems();
  // const { data: allPlaylists } = useGetAllPlaylists();
  const { mutate: deleteProblem } = useDeleteProblem();

  const { authUser, isAuthenticated, problemsSolved, playlists: myPlaylists } = useAuthStore();

  useEffect(() => {
    if (!data?.data) return;

    const updatedData = data.data
      .map((p) => ({
        ...p,
        solved: problemsSolved.includes(p.id), // inject "solved" status
      }))
      .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => (difficultyFilter ? p.difficulty === difficultyFilter : true))
      .filter((p) => (companyFilter ? p.companies.includes(companyFilter) : true))
      .filter((p) => (tagFilter ? p.tags.includes(tagFilter) : true))
      .sort((a, b) => {
        if (!sortBy) return 0;

        if (sortBy === 'solved') {
          return sortAsc
            ? Number(b.solved) - Number(a.solved)
            : Number(a.solved) - Number(b.solved);
        }

        const valA = a[sortBy];
        const valB = b[sortBy];

        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
          return sortAsc ? valA - valB : valB - valA;
        }
      });

    setFilteredProblems(updatedData);
  }, [data, problemsSolved, search, difficultyFilter, companyFilter, tagFilter, sortBy, sortAsc]);

  const handleSortChange = ({ key, asc }) => {
    setSortBy(key);
    setSortAsc(asc);
  };

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.showModal();
    } else return;
  };

  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.close();
    } else return;
  };

  const handleDeleteProblem = () => {
    if (!problemToDelete.id) {
      toast.error('Please select a problem to delete');
      return;
    }
    deleteProblem(problemToDelete.id, {
      onSuccess: ({ message }) => {
        toast.success(message || 'Problem deleted successfully');
        setProblemToDelete({ id: null, title: null });
        queryClient.invalidateQueries(QUERY_KEYS.PROBLEMS);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.error || 'Something went wrong');
      },
    });
    closeModal('delete_problem_modal');
  };

  if (isLoading) {
    return <MyLoader />;
  }

  if (isError) {
    toast.error(error?.error || 'Something went wrong');
  }

  // console.log(data?.data?.map((p) => p.tags).flat());
  const availableCompanies = Array.from(new Set(data?.data?.flatMap((p) => p?.companies)));
  const availableTags = Array.from(new Set(data?.data?.flatMap((p) => p?.tags)));

  // console.log(availableCompanies);
  // console.log(availableTags);

  return (
    <div className="min-h-screen bg-base-200 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <FileJson className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Problem Set</h1>
                  <p className="text-base-content/70 text-lg">
                    Practice coding problems and improve your skills
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="input input-bordered flex items-center gap-2">
                  <Search className="w-4 h-4 text-base-content/60" />
                  <input
                    type="search"
                    placeholder="Search problems..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="grow"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Filters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Difficulty</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option value="">All Difficulties</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Topics</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                >
                  <option value="">All Topics</option>
                  {availableTags.map((tag) => (
                    <option key={tag} value={tag} className="capitalize">
                      {tag.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Companies</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                >
                  <option value="">All Companies</option>
                  {availableCompanies.map((comp) => (
                    <option key={comp} value={comp} className="capitalize">
                      {comp.toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Problems Table Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-300">
              <h2 className="card-title text-2xl flex items-center gap-2">
                <Code className="w-6 h-6 text-primary" />
                Problems
              </h2>
            </div>

            <div className="p-6">
              <PaginatedTable
                data={filteredProblems}
                itemsPerPage={10}
                columns={[
                  { label: '#', sortKey: '' },
                  { label: 'Status', sortKey: 'solved' },
                  { label: 'Title', sortKey: 'title' },
                  { label: 'Difficulty', sortKey: 'difficulty' },
                  { label: 'Company', sortKey: '' },
                  { label: 'Topics', sortKey: '' },
                  { label: 'Actions', sortKey: '' },
                ]}
                sortConfig={{ key: sortBy, asc: sortAsc }}
                onSortChange={handleSortChange}
                renderRow={(problem, index) => (
                  <tr key={problem.id} className="hover:bg-base-200/50 transition-colors">
                    <td className="text-center">{index + 1}</td>

                    <td className="text-center">
                      <div className="flex justify-center">
                        {problemsSolved.includes(problem?.id) ? (
                          <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-success-content" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-base-300"></div>
                        )}
                      </div>
                    </td>

                    <td className="text-left ">
                      <Link
                        to={`/problems/${problem?.id}`}
                        className="font-medium text-primary hover:text-primary-focus transition-colors mr-2"
                      >
                        {problem?.title}
                      </Link>
                      {import.meta.env.VITE_DEMO_PROBLEM_ID?.includes(problem?.id) && (
                        <span className="badge badge-sm badge-info">Demo</span>
                      )}
                    </td>

                    <td className="text-center">
                      <span
                        className={`badge badge-lg ${
                          problem.difficulty === 'EASY'
                            ? 'badge-success'
                            : problem.difficulty === 'MEDIUM'
                            ? 'badge-warning'
                            : 'badge-error'
                        }`}
                      >
                        {problem.difficulty === 'EASY'
                          ? 'Easy'
                          : problem.difficulty === 'MEDIUM'
                          ? 'Medium'
                          : 'Hard'}
                      </span>
                    </td>

                    <td className="text-center">
                      <div
                        className="tooltip tooltip-top"
                        data-tip={
                          problem.companies?.length ? problem.companies.join(', ') : 'No company'
                        }
                      >
                        <div className="p-2 bg-base-200 rounded-lg inline-block">
                          <BriefcaseBusiness className="w-4 h-4 text-base-content" />
                        </div>
                      </div>
                    </td>

                    <td className="text-center">
                      <div
                        className="tooltip tooltip-top"
                        data-tip={problem.tags?.length ? problem.tags.join(', ') : 'No topics'}
                      >
                        <div className="p-2 bg-base-200 rounded-lg inline-block">
                          <Tag className="w-4 h-4 text-base-content" />
                        </div>
                      </div>
                    </td>

                    <td className="text-center">
                      <div className="flex justify-center gap-2">
                        <div
                          className="tooltip tooltip-top"
                          data-tip={
                            isAuthenticated ? 'Save to playlist' : 'Login to save to playlist'
                          }
                        >
                          <button
                            type="button"
                            onClick={() => {
                              openModal('add_to_playlist');
                              setProblemIdForPlaylist(problem?.id);
                            }}
                            className="btn btn-sm btn-outline btn-primary gap-1"
                            disabled={!isAuthenticated}
                          >
                            <BookmarkPlusIcon className="w-4 h-4" />
                          </button>
                        </div>

                        {isAuthenticated && authUser?.role === 'ADMIN' && (
                          <div className="tooltip tooltip-top" data-tip="Delete Problem">
                            <button
                              className="btn btn-sm btn-outline btn-error gap-1"
                              onClick={() => {
                                setProblemToDelete({
                                  id: problem?.id,
                                  title: problem?.title,
                                });
                                openModal('delete_problem_modal');
                              }}
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
        <PlaylistModal allPlaylists={myPlaylists} problemId={problemIdForPlaylist} />

        <DeleteModal
          modalId="delete_problem_modal"
          title="Delete this problem?"
          message={`Are you sure you want to delete the problem "${problemToDelete.title}"? This action cannot be undone.`}
          onDelete={handleDeleteProblem}
        />
      </div>
    </div>
  );
};

export default ProblemSet;

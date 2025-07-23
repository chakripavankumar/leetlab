import { Link } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, XCircle, Code, Zap, BarChart3 } from 'lucide-react';
import { useGetAllSubmissions } from '../../hooks/reactQuery/useSubmissionApi';
import toast from 'react-hot-toast';
import { MyLoader, PaginatedTable } from '../common';
import { calculateAverageMemory, calculateAverageTime } from '../../utils/calculation';
import timeAgo from '../../utils/timeAgo';

const SubmissionsSet = () => {
  const { data, isLoading, isError, error } = useGetAllSubmissions();

  if (isLoading) return <MyLoader />;
  if (isError) toast.error(error?.error || 'Something went wrong');

  const submissions = data?.data || [];
  const acceptedSubmissions = submissions.filter((sub) => sub.status === 'Accepted').length;
  const totalSubmissions = submissions.length;
  const acceptanceRate =
    totalSubmissions > 0 ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1) : 0;

  // Get unique languages
  const uniqueLanguages = [...new Set(submissions.map((sub) => sub.language))].length;

  return (
    <div className="min-h-screen bg-base-200 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">My Submissions</h1>
                  <p className="text-base-content/70 text-lg">
                    Track your coding progress and submission history
                  </p>
                </div>
              </div>

              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title text-xs">Total Submissions</div>
                  <div className="stat-value text-2xl text-primary">{totalSubmissions}</div>
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
                  <p className="text-sm text-base-content/60">Accepted</p>
                  <p className="text-3xl font-bold text-success">{acceptedSubmissions}</p>
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
                  <p className="text-sm text-base-content/60">Rejected</p>
                  <p className="text-3xl font-bold text-error">
                    {totalSubmissions - acceptedSubmissions}
                  </p>
                </div>
                <div className="p-3 bg-error/10 rounded-lg">
                  <XCircle className="w-8 h-8 text-error" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Acceptance Rate</p>
                  <p className="text-3xl font-bold text-info">{acceptanceRate}%</p>
                </div>
                <div className="p-3 bg-info/10 rounded-lg">
                  <BarChart3 className="w-8 h-8 text-info" />
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/60">Languages Used</p>
                  <p className="text-3xl font-bold text-warning">{uniqueLanguages}</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <Code className="w-8 h-8 text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Table Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-0">
            <div className="p-6 border-b border-base-300">
              <h2 className="card-title text-2xl flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                Submission History
              </h2>
            </div>

            <div className="p-6">
              {submissions.length > 0 ? (
                <PaginatedTable
                  data={[...submissions].reverse()}
                  itemsPerPage={20}
                  columns={[
                    { label: '#', sortKey: null },
                    { label: 'Problem', sortKey: null },
                    { label: 'Status', sortKey: null },
                    { label: 'Language', sortKey: null },
                    { label: 'Performance', sortKey: null },
                    { label: 'Submitted', sortKey: null },
                  ]}
                  renderRow={(submission, index) => {
                    const avgTime = calculateAverageTime(submission.time).toFixed(2);
                    const avgMemory = calculateAverageMemory(submission.memory).toFixed(0);

                    return (
                      <tr key={submission?.id} className="hover:bg-base-200/50 transition-colors">
                        <td className="text-center">{index + 1}</td>

                        <td className="text-left">
                          <Link
                            to={`/submissions/${submission?.id}`}
                            className="font-medium text-primary hover:text-primary-focus transition-colors"
                          >
                            {submission?.problem?.title}
                          </Link>
                        </td>

                        <td className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            {submission?.status === 'Accepted' ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-success" />
                                <span className="text-success font-medium">Accepted</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-error" />
                                <span className="text-error font-medium">{submission.status}</span>
                              </>
                            )}
                          </div>
                        </td>

                        <td className="text-center">
                          <span className="badge badge-outline badge-sm">
                            {submission.language}
                          </span>
                        </td>

                        <td className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="p-1 bg-info/10 rounded">
                              <Zap className="w-3 h-3 text-info" />
                            </div>
                            <span className="text-sm font-mono">
                              {avgTime}ms | {avgMemory}KB
                            </span>
                          </div>
                        </td>

                        <td className="text-center text-base-content/60">
                          {timeAgo(submission?.createdAt)}
                        </td>
                      </tr>
                    );
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-base-200 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-base-content/40" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No submissions yet</h3>
                  <p className="text-base-content/60 mb-4">
                    Start solving problems to see your submission history here
                  </p>
                  <Link to="/problems" className="btn btn-primary">
                    Browse Problems
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsSet;

import { Link, useParams } from 'react-router-dom';
import { useGetSubmissionByProblemId } from '../../hooks/reactQuery/useSubmissionApi';
import toast from 'react-hot-toast';
import { MyLoader } from '../common';
import timeAgo from '../../utils/timeAgo';
import { Clock, Code, CheckCircle, XCircle, Calendar } from 'lucide-react';

const SubmissionHistory = () => {
  const { problemId } = useParams();

  const { data, isError, error, isLoading } = useGetSubmissionByProblemId(problemId);

  if (isError) {
    toast.error(error?.error || 'Something went wrong');
  }

  if (isLoading) {
    return <MyLoader />;
  }

  const submissions = data?.data || [];

  return (
    <div className="space-y-6">
      {/* Submissions Table Card */}
      <div className="card bg-base-100 shadow-2xl">
        <div className="card-body p-0">
          <div className="p-6 border-b border-base-300">
            <h3 className="card-title text-xl flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Recent Submissions
            </h3>
          </div>

          <div className="overflow-x-auto">
            {submissions.length > 0 ? (
              <table className="table w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th className="text-center font-semibold">#</th>
                    <th className="text-center font-semibold">Status</th>
                    <th className="text-center font-semibold">Submission Time</th>
                    <th className="text-center font-semibold">Language</th>
                  </tr>
                </thead>
                <tbody>
                  {[...submissions].reverse().map((submission, index) => (
                    <tr className="hover:bg-base-200 transition-colors" key={submission?.id}>
                      <td className="text-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                          <span className="text-sm font-semibold">{index + 1}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <Link
                          to={`/submissions/${submission?.id}`}
                          className={`badge badge-sm px-4 py-2 font-semibold transition-colors hover:scale-105 ${
                            submission?.status === 'Accepted'
                              ? 'badge-success text-success-content'
                              : 'badge-error text-error-content'
                          }`}
                        >
                          {submission.status}
                        </Link>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4 text-base-content/60" />
                          <span className="font-medium">
                            {timeAgo(submission?.createdAt, true)}
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="badge badge-outline badge-sm capitalize font-medium">
                          {submission.language?.toLowerCase()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <div className="p-4 bg-base-200 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <Code className="w-10 h-10 text-base-content/40" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Submissions Yet</h3>
                <p className="text-base-content/60">
                  Start coding to see your submission history here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHistory;

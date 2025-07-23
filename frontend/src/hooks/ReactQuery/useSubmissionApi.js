import { useQuery } from 'react-query';
import { QUERY_KEYS } from '../../constants/keys';
import submissionApis from '../../apis/submissionApis';

export const useGetAllSubmissions = () =>
  useQuery({
    queryKey: QUERY_KEYS.SUBMISSIONS,
    queryFn: () => submissionApis.getAllSubmissions(),
  });

export const useGetSubmissionById = (id) =>
  useQuery({
    queryKey: [QUERY_KEYS.SUBMISSIONS, id],
    queryFn: () => submissionApis.getSubmissionById(id),
    enabled: !!id,
  });

export const useGetSubmissionByProblemId = (problemId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SUBMISSIONS, problemId],
    queryFn: () => submissionApis.getAllSubmissionsByProblemId(problemId),
    enabled: !!problemId,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

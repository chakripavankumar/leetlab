import { useMutation, useQuery } from "react-query";
import problemApis from "../../apis/problemApi";
import { QUERY_KEYS } from "../../constants/keys";

export const useGetAllProblems = () =>
  useQuery({
    queryKey: QUERY_KEYS.PROBLEMS,
    queryFn: () => problemApis.getAllProblems(),
  });
export const useGetProblemById = (id) =>
  useQuery({
    queryKey: [QUERY_KEYS.PROBLEMS, id],
    queryFn: () => problemApis.getProblemById(id),
    enabled: !!id,
  });

export const useRunProblem = () => useMutation(problemApis.runTheProblem);

export const useSubmitProblem = () => useMutation(problemApis.submitTheProblem);

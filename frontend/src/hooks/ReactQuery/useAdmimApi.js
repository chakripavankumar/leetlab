import { useMutation } from "react-query";
import adminApis from "../../apis/adminApi";

export const useCreateProblem = () => useMutation(adminApis.createProblem);

export const useDeleteProblem = () => useMutation(adminApis.deleteProblem);

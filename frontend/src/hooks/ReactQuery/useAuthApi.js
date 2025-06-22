import { useMutation, useQuery } from "react-query";
import authApis from "../../apis/authApi";
import { QUERY_KEYS } from "../../constants/keys";

export const useAuthLogin = () => useMutation(authApis.login);

export const useAuthRegister = () => useMutation(authApis.register);

export const useAuthLogout = () => useMutation(authApis.logout);

export const useAuthProfile = () =>
  useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: () => authApis.profile(),
    staleTime: 0,
    retry: false,
  });

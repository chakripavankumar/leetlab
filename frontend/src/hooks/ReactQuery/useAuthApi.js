import { useMutation, useQuery } from 'react-query';
import authApis from '../../apis/authApis';
import { QUERY_KEYS } from '../../constants/keys';

export const useAuthLogin = () => useMutation(authApis.login);

export const useAuthRegister = () => useMutation(authApis.register);

export const useAuthLogout = () => useMutation(authApis.logout);

export const useAuthProfile = () =>
  useQuery({
    queryKey: QUERY_KEYS.PROFILE,
    queryFn: () => authApis.profile(),
    staleTime: 0, // 5 minutes - clear query when logout
    retry: false,
  });

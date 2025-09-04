import { fetchUsers } from '@redux/slices/MediaSlice';
import { RootState } from '@redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useUsers = () => {
  const dispatch = useDispatch();
  const { users, usersLoading, usersError } = useSelector(
    (state: RootState) => state.media,
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return { users, usersLoading, usersError };
};

export default useUsers;

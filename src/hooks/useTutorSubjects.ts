import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export interface TutorSubject {
  maMon: number;
  tenMon: string;
  moTa: string | null;
  trinhDo: string;
  hocPhiMoiGio: number;
}

export interface TutorSubjectRequest {
  tenMon: string;
  trinhDo: string;
  hocPhiMoiGio: number;
}

export function useTutorSubjects() {
  const queryClient = useQueryClient();

  const getMySubjects = () =>
    useQuery({
      queryKey: ['my-subjects'],
      queryFn: () => apiClient<TutorSubject[]>('/gia-su-mon-hoc/me'),
    });

  const addSubject = useMutation({
    mutationFn: (data: TutorSubjectRequest) =>
      apiClient<TutorSubject>('/gia-su-mon-hoc/me', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subjects'] });
    },
  });

  const updateSubject = useMutation({
    mutationFn: ({ maMon, data }: { maMon: number; data: TutorSubjectRequest }) =>
      apiClient<TutorSubject>(`/gia-su-mon-hoc/me/${maMon}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subjects'] });
    },
  });

  const removeSubject = useMutation({
    mutationFn: (maMon: number) =>
      apiClient(`/gia-su-mon-hoc/me/${maMon}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-subjects'] });
    },
  });

  return { getMySubjects, addSubject, updateSubject, removeSubject };
}

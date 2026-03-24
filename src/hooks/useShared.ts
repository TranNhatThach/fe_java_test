import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export interface Class {
  id: string;
  name: string;
  subject: string;
  tutorName: string;
  studentName: string;
  status: string;
  nextSession?: string;
}

export function useShared() {
  const getMyClasses = () =>
    useQuery({
      queryKey: ['my-classes'],
      queryFn: () => apiClient<Class[]>('/lop-hoc/cua-toi'),
    });

  return { getMyClasses };
}

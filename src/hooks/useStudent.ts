import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export interface Tutor {
  id: string;
  username: string;
  name: string;
  subjects: string[];
  trinhDo: string;
  viTri: string;
  rating: number;
  price: number;
  avatar?: string;
}


export interface JobRequest {
  id: string;
  title: string;
  subject: string;
  grade: string;
  budget: number;
  description: string;
}

export interface Applicant {
  id: string;
  tutorId: string;
  tutorName: string;
  status: string;
  appliedAt: string;
}

export function useStudent() {
  const queryClient = useQueryClient();

  const searchTutors = (params: Record<string, string>) =>
    useQuery({
      queryKey: ['tutors', params],
      queryFn: async () => {
        const data = await apiClient<any[]>('/gia-su/search', {
          params: {
            tenMon: params.subject || params.q,
            trinhDo: params.level,
            viTri: params.location,
            minGia: params.minPrice,
            maxGia: params.maxPrice
          }
        });
        
        // Map backend GiaSuResponse to frontend Tutor interface
        return data.map((item: any) => ({
          id: item.username, // Use username as ID if no ID provided
          username: item.username,
          name: item.username, // Display username as name for now
          subjects: item.monHoc ? [item.monHoc] : [],
          trinhDo: item.trinhDo,
          viTri: item.viTri,
          rating: 5, // Default rating
          price: item.hocPhiMoiGio || 0,
          avatar: item.avatar
        }));
      },
    });


  const createRequest = useMutation({
    mutationFn: (data: Partial<JobRequest>) =>
      apiClient('/dang-bai', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-requests'] }),
  });

  const getApplicants = (requestId: string) =>
    useQuery({
      queryKey: ['applicants', requestId],
      queryFn: () => apiClient<Applicant[]>(`/tuyen-dung/danh-sach-ung-vien/${requestId}`),
      enabled: !!requestId,
    });

  const approveTutor = useMutation({
    mutationFn: (data: { requestId: string; tutorId: string }) =>
      apiClient('/tuyen-dung/hoc-vien-duyet', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['applicants', variables.requestId] });
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });

  const getSubjects = () =>
    useQuery({
      queryKey: ['subjects'],
      queryFn: () => apiClient<any[]>('/mon-hoc'),
    });

  return { searchTutors, createRequest, getApplicants, approveTutor, getSubjects };
}


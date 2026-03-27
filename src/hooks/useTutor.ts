import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export interface Job {
  id: string;
  title: string;
  subject: string;
  grade: string;
  budget: number;
  location: string;
}

export interface Invitation {
  id: string;
  studentName: string;
  subject: string;
  message: string;
  sentAt: string;
}

export function useTutor() {
  const queryClient = useQueryClient();

  const getJobList = () =>
    useQuery({
      queryKey: ['jobs'],
      queryFn: async () => {
        const data = await apiClient<any[]>('/danh-sach-yeu-cau');
        return data.map((item: any) => ({
          id: item.maYeuCau?.toString() || Math.random().toString(),
          title: item.moTa ? (item.moTa.length > 50 ? item.moTa.substring(0, 50) + '...' : item.moTa) : `Cần gia sư ${item.monHoc?.tenMon || ''}`,
          subject: item.monHoc?.tenMon || 'Môn học khác',
          grade: item.trinhDo || 'Tất cả trình độ',
          budget: item.nganSachMax || item.nganSachMin || 0,
          location: item.diaDiem || 'Toàn quốc'
        }));
      },
    });


  const applyJob = useMutation({
    mutationFn: (data: { maGiaSu: number; maYeuCau: number; loiNhan: string; mucHocPhiDeXuat: number }) =>
      apiClient('/tuyen-dung/ung-tuyen', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });

  const getInvitations = (tutorId: string) =>
    useQuery({
      queryKey: ['invitations', tutorId],
      queryFn: () => apiClient<Invitation[]>(`/tuyen-dung/loi-moi/${tutorId}`),
      enabled: !!tutorId,
    });

  const acceptInvitation = useMutation({
    mutationFn: (invitationId: string) =>
      apiClient('/tuyen-dung/gia-su-dong-y', {
        method: 'POST',
        body: JSON.stringify({ invitationId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });

  return { getJobList, applyJob, getInvitations, acceptInvitation };
}

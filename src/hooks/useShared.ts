import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export interface Class {
  maLop: number;
  tenHocVien: string;
  tenGiaSu: string;
  tenMonHoc: string;
  trangThai: string;
  lichHoc?: string;
  ghiChu?: string;
  hocPhiThoaThuan?: number;
  ngayBatDau?: string;
}

export function useShared() {
  const queryClient = useQueryClient();
  const getMyClasses = () =>
    useQuery({
      queryKey: ['my-classes'],
      queryFn: () => apiClient<Class[]>('/lop-hoc/cua-toi'),
    });

  const updateSchedule = useMutation({
    mutationFn: ({ id, lichHoc, ghiChu }: { id: number; lichHoc: string; ghiChu?: string }) =>
      apiClient(`/lop-hoc/${id}/lich-hoc`, {
        method: 'PUT',
        params: { 
          lichHoc, 
          ghiChu: ghiChu || ''
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    }
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiClient(`/lop-hoc/${id}/status`, {
        method: 'PUT',
        params: { status },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });

  return { getMyClasses, updateSchedule, updateStatus };
}

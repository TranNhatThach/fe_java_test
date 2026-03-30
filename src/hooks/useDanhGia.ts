import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

export interface DanhGia {
  maDanhGia: number;
  maLop: number;
  diem: number;
  nhanXet: string;
  thoiGianDanhGia: string;
}

export interface DanhGiaRequest {
  maLop: number;
  diem: number;
  nhanXet: string;
}

export function useDanhGia() {
  const queryClient = useQueryClient();

  const getDanhGiaByLop = (maLop: number) =>
    useQuery({
      queryKey: ['danh-gia', 'lop', maLop],
      queryFn: () => apiClient<DanhGia[]>(`/danh-gia/lop-hoc/${maLop}`),
      enabled: maLop > 0,
    });

  const createDanhGia = useMutation({
    mutationFn: (data: DanhGiaRequest) =>
      apiClient<DanhGia>('/danh-gia', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['danh-gia', 'lop', variables.maLop] });
      queryClient.invalidateQueries({ queryKey: ['my-classes'] });
    },
  });

  const updateDanhGia = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<DanhGiaRequest, 'maLop'> }) =>
      apiClient<DanhGia>(`/danh-gia/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['danh-gia'] });
    },
  });

  return { getDanhGiaByLop, createDanhGia, updateDanhGia };
}

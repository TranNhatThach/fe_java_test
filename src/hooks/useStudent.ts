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
  truongDaiHoc?: string;
  chuyenNganh?: string;
  soNamKinhNghiem?: number;
  maGiaSu?: number;
  diemDanhGia?: number;
  soHocVien?: number;
  moTa?: string;
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

  const searchTutors = (params: Record<string, string | number | undefined>) =>
    useQuery({
      queryKey: ['tutors', params],
      queryFn: async () => {
        const response = await apiClient<any>('/gia-su/search', {
          params: {
            tenMon: params.subject ? String(params.subject) : (params.q ? String(params.q) : undefined),
            trinhDo: params.level || undefined,
            viTri: params.location || undefined,
            minGia: params.minPrice || undefined,
            maxGia: params.maxPrice || undefined,
            page: params.page || 0,
            size: params.size || 12
          }
        });
        
        // Map backend GiaSuResponse to frontend Tutor interface
        const content = response?.content || [];
        const mappedContent = content.map((item: any) => ({
          id: item.username, // Use username as ID if no ID provided
          username: item.username,
          name: item.hoTen || item.username, // Ưu tiên họ tên thật, fallback username
          subjects: item.monHoc ? [item.monHoc] : [],
          trinhDo: item.trinhDo,
          viTri: item.viTri,
          rating: 5, // Mặc định
          price: item.hocPhiMoiGio || 0,
          avatar: item.avatar,
          truongDaiHoc: item.truongDaiHoc,
          chuyenNganh: item.chuyenNganh,
          soNamKinhNghiem: item.soNamKinhNghiem,
          maGiaSu: item.maGiaSu,
          diemDanhGia: item.diemDanhGia,
          soHocVien: item.soHocVien,
          moTa: item.moTa
        }));

        return {
          ...response,
          content: mappedContent
        };
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

  const getTutorById = (id: string | number) =>
    useQuery({
      queryKey: ['tutor', id],
      queryFn: async () => {
        const item = await apiClient<any>(`/gia-su/${id}`);
        return {
          id: item.username,
          username: item.username,
          name: item.hoTen || item.username, // Ưu tiên họ tên thật
          subjects: item.monHoc ? [item.monHoc] : [],
          trinhDo: item.trinhDo,
          viTri: item.viTri,
          rating: 5,
          price: item.hocPhiMoiGio || 0,
          avatar: item.avatar,
          truongDaiHoc: item.truongDaiHoc,
          chuyenNganh: item.chuyenNganh,
          soNamKinhNghiem: item.soNamKinhNghiem,
          maGiaSu: item.maGiaSu,
          diemDanhGia: item.diemDanhGia,
          soHocVien: item.soHocVien,
          moTa: item.moTa
        } as Tutor;
      },
      enabled: !!id,
    });

  const inviteTutor = useMutation({
    mutationFn: (data: any) =>
      apiClient('/tuyen-dung/gui-loi-moi', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });

  const getSubjects = () =>
    useQuery({
      queryKey: ['subjects'],
      queryFn: () => apiClient<any[]>('/mon-hoc'),
    });

  return { searchTutors, createRequest, getApplicants, approveTutor, getSubjects, getTutorById, inviteTutor };
}


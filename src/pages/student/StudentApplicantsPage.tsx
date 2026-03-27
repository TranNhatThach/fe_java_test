import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import {
  Users, BookOpen, Loader2, ChevronDown, ChevronUp, CheckCircle2,
  XCircle, Clock, DollarSign, MapPin, GraduationCap, MessageSquare, Info
} from 'lucide-react';

interface YeuCau {
  maYeuCau: number;
  moTa: string;
  trangThai: string;
  monHoc?: { tenMon: string };
  trinhDo?: string;
  diaDiem?: string;
  nganSachMin?: number;
  nganSachMax?: number;
}

interface UngVien {
  giaSu: {
    maGiaSu: number;
    taiKhoan: { hoTen: string; email: string; viTri: string };
    truongDaiHoc?: string;
    chuyenNganh?: string;
    soNamKinhNghiem?: number;
  };
  yeuCauTimGiaSu: { maYeuCau: number };
  loiNhan?: string;
  mucHocPhiDeXuat?: number;
  trangThai: string;
  ngayUngTuyen?: string;
}

export function StudentApplicantsPage() {
  const { user } = useAuthStore();
  const [yeuCauList, setYeuCauList] = useState<YeuCau[]>([]);
  const [applicantsMap, setApplicantsMap] = useState<Record<number, UngVien[]>>({});
  const [expandedRequest, setExpandedRequest] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await apiClient<YeuCau[]>('/danh-sach-yeu-cau');
      setYeuCauList(data);
    } catch (err) {
      console.error('Loi khi tai danh sach yeu cau:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchApplicants = async (maYeuCau: number) => {
    if (applicantsMap[maYeuCau]) {
      setExpandedRequest(expandedRequest === maYeuCau ? null : maYeuCau);
      return;
    }
    try {
      const data = await apiClient<UngVien[]>(`/tuyen-dung/danh-sach-ung-vien/${maYeuCau}`);
      setApplicantsMap((prev) => ({ ...prev, [maYeuCau]: data }));
      setExpandedRequest(maYeuCau);
    } catch (err) {
      console.error('Loi khi tai danh sach ung vien:', err);
    }
  };

  const handleApprove = async (maGiaSu: number, maYeuCau: number) => {
    const key = `approve-${maGiaSu}-${maYeuCau}`;
    setActionLoading(key);
    try {
      await apiClient('/tuyen-dung/hoc-vien-duyet', {
        method: 'POST',
        params: { maHocVien: user?.userId, maGiaSu, maYeuCau }
      });
      // Refresh applicants
      const data = await apiClient<UngVien[]>(`/tuyen-dung/danh-sach-ung-vien/${maYeuCau}`);
      setApplicantsMap((prev) => ({ ...prev, [maYeuCau]: data }));
      alert('Da duyet gia su thanh cong! Lop hoc da duoc tao.');
    } catch (err: any) {
      alert('Loi: ' + (err.message || 'Khong the duyet gia su.'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (maGiaSu: number, maYeuCau: number) => {
    const key = `reject-${maGiaSu}-${maYeuCau}`;
    setActionLoading(key);
    try {
      await apiClient('/tuyen-dung/hoc-vien-tu-choi', {
        method: 'POST',
        params: { maHocVien: user?.userId, maGiaSu, maYeuCau }
      });
      const data = await apiClient<UngVien[]>(`/tuyen-dung/danh-sach-ung-vien/${maYeuCau}`);
      setApplicantsMap((prev) => ({ ...prev, [maYeuCau]: data }));
      alert('Da tu choi gia su.');
    } catch (err: any) {
      alert('Loi: ' + (err.message || 'Khong the tu choi.'));
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Dang tai danh sach...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto font-sans space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-emerald-600" /> Gia su ung tuyen
        </h1>
        <p className="text-slate-500 text-lg mt-2">Xem danh sach gia su da ung tuyen vao cac yeu cau cua ban</p>
      </div>

      {yeuCauList.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Info className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Chua co yeu cau nao</h2>
          <p className="text-slate-500">Ban chua dang yeu cau tim gia su nao. Hay dang bai de tim gia su phu hop!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {yeuCauList.map((yc) => (
            <div key={yc.maYeuCau} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              {/* Request Header */}
              <button
                onClick={() => fetchApplicants(yc.maYeuCau)}
                className="w-full p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {yc.monHoc?.tenMon || 'Mon hoc'} - {yc.trinhDo || 'Tat ca trinh do'}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-1">
                      {yc.moTa || 'Khong co mo ta'}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {yc.diaDiem && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {yc.diaDiem}
                        </span>
                      )}
                      {(yc.nganSachMin || yc.nganSachMax) && (
                        <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {yc.nganSachMin?.toLocaleString() || '?'}d - {yc.nganSachMax?.toLocaleString() || '?'}d
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    yc.trangThai === 'Dang tim' ? 'bg-amber-50 text-amber-600' :
                    yc.trangThai === 'Da ghep' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-slate-50 text-slate-500'
                  }`}>
                    {yc.trangThai}
                  </span>
                  {expandedRequest === yc.maYeuCau
                    ? <ChevronUp className="w-5 h-5 text-slate-400" />
                    : <ChevronDown className="w-5 h-5 text-slate-400" />
                  }
                </div>
              </button>

              {/* Applicants List */}
              {expandedRequest === yc.maYeuCau && (
                <div className="border-t border-slate-100 px-6 pb-6">
                  {!applicantsMap[yc.maYeuCau] || applicantsMap[yc.maYeuCau].length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-slate-400 italic">Chua co gia su nao ung tuyen cho yeu cau nay.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-4">
                      {applicantsMap[yc.maYeuCau].map((uv) => (
                        <div key={uv.giaSu.maGiaSu} className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:shadow-sm transition-all">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600 font-bold text-xl">
                            {(uv.giaSu.taiKhoan.hoTen || 'G')[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-slate-900">{uv.giaSu.taiKhoan.hoTen}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                uv.trangThai === 'Cho duyet' ? 'bg-amber-100 text-amber-700' :
                                uv.trangThai === 'Da duyet' ? 'bg-emerald-100 text-emerald-700' :
                                uv.trangThai === 'Tu choi' ? 'bg-red-100 text-red-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {uv.trangThai}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-2">
                              {uv.giaSu.truongDaiHoc && (
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3" /> {uv.giaSu.truongDaiHoc}
                                </span>
                              )}
                              {uv.giaSu.soNamKinhNghiem != null && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {uv.giaSu.soNamKinhNghiem} nam KN
                                </span>
                              )}
                              {uv.mucHocPhiDeXuat != null && (
                                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                                  <DollarSign className="w-3 h-3" /> {uv.mucHocPhiDeXuat.toLocaleString()}d/h
                                </span>
                              )}
                            </div>
                            {uv.loiNhan && (
                              <p className="text-sm text-slate-600 italic bg-white p-3 rounded-xl border border-dashed border-slate-200 flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                {uv.loiNhan}
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          {uv.trangThai === 'Cho duyet' && (
                            <div className="flex flex-col gap-2 shrink-0">
                              <button
                                onClick={() => handleApprove(uv.giaSu.maGiaSu, yc.maYeuCau)}
                                disabled={actionLoading === `approve-${uv.giaSu.maGiaSu}-${yc.maYeuCau}`}
                                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all disabled:opacity-60"
                              >
                                {actionLoading === `approve-${uv.giaSu.maGiaSu}-${yc.maYeuCau}`
                                  ? <Loader2 className="w-4 h-4 animate-spin" />
                                  : <CheckCircle2 className="w-4 h-4" />
                                }
                                Duyet
                              </button>
                              <button
                                onClick={() => handleReject(uv.giaSu.maGiaSu, yc.maYeuCau)}
                                disabled={actionLoading === `reject-${uv.giaSu.maGiaSu}-${yc.maYeuCau}`}
                                className="flex items-center gap-1.5 px-4 py-2 bg-white text-red-600 border border-red-200 rounded-xl text-sm font-bold hover:bg-red-50 transition-all disabled:opacity-60"
                              >
                                {actionLoading === `reject-${uv.giaSu.maGiaSu}-${yc.maYeuCau}`
                                  ? <Loader2 className="w-4 h-4 animate-spin" />
                                  : <XCircle className="w-4 h-4" />
                                }
                                Tu choi
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

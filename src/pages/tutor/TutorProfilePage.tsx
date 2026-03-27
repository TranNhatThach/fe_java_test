import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { apiClient } from '../../api/client';
import { User, Mail, Phone, MapPin, BookOpen, Award, Save, Loader2, Camera, GraduationCap, Briefcase } from 'lucide-react';

interface TutorProfileData {
  hoTen: string;
  email: string;
  soDienThoai: string;
  viTri: string;
  gioiTinh: string;
  truongDaiHoc: string;
  chuyenNganh: string;
  namSinh: string;
  soNamKinhNghiem: string;
  moTa: string;
}

export function TutorProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState<TutorProfileData>({
    hoTen: '',
    email: '',
    soDienThoai: '',
    viTri: '',
    gioiTinh: '',
    truongDaiHoc: '',
    chuyenNganh: '',
    namSinh: '',
    soNamKinhNghiem: '',
    moTa: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient<any>('/tai-khoan/profile');
        setFormData({
          hoTen: data.hoTen || '',
          email: data.email || '',
          soDienThoai: data.soDienThoai || '',
          viTri: data.viTri || '',
          gioiTinh: data.gioiTinh || '',
          truongDaiHoc: data.truongDaiHoc || '',
          chuyenNganh: data.chuyenNganh || '',
          namSinh: data.namSinh ? String(data.namSinh) : '',
          soNamKinhNghiem: data.soNamKinhNghiem ? String(data.soNamKinhNghiem) : '',
          moTa: data.moTa || '',
        });
      } catch (err) {
        console.error('Lỗi khi tải hồ sơ:', err);
        setErrorMsg('Không thể tải hồ sơ. Vui lòng thử lại.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const payload: any = { ...formData };
      if (payload.namSinh) payload.namSinh = parseInt(payload.namSinh);
      if (payload.soNamKinhNghiem) payload.soNamKinhNghiem = parseInt(payload.soNamKinhNghiem);

      await apiClient('/tai-khoan/profile', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      setSuccessMsg('Cập nhật hồ sơ thành công!');
      // Đồng bộ tên mới vào authStore (cập nhật sidebar/header)
      if (payload.hoTen) updateUser({ name: payload.hoTen });
    } catch (err: any) {
      setErrorMsg('Lỗi: ' + (err.message || 'Không thể cập nhật hồ sơ.'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Đang tải hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-slate-500 text-lg">Hoàn thiện thông tin để thu hút nhiều học viên hơn</p>
      </div>

      {successMsg && (
        <div className="mb-6 px-5 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl font-medium">
          ✓ {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-6 px-5 py-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-medium">
          ✕ {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Avatar & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-emerald-500/10 -z-10"></div>
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-3xl bg-white shadow-xl border-4 border-white overflow-hidden mx-auto">
                <img
                  src={`https://picsum.photos/seed/${user?.id}/200/200`}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-emerald-700 transition-all">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{formData.hoTen || user?.name}</h2>
            <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4">Gia sư chuyên nghiệp</p>

            <div className="flex items-center justify-center gap-4 py-4 border-t border-slate-50">
              <div className="text-center">
                <p className="text-xl font-black text-slate-900">{formData.soNamKinhNghiem || '0'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Năm KN</p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="text-center">
                <p className="text-xl font-black text-slate-900">{formData.namSinh || '—'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Năm sinh</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 mb-2">Trạng thái hồ sơ</h3>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: `${calculateProfileCompletion(formData)}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Hồ sơ của bạn đã hoàn thiện {calculateProfileCompletion(formData)}%. Thêm thông tin để đạt 100%.
            </p>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            {/* Thông tin cơ bản */}
            <div>
              <h3 className="font-bold text-slate-800 mb-4 text-base">Thông tin cơ bản</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" /> Họ và tên
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.hoTen}
                    onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-600" /> Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none opacity-70 cursor-not-allowed"
                    value={formData.email}
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" /> Số điện thoại
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.soDienThoai}
                    onChange={(e) => setFormData({ ...formData, soDienThoai: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" /> Khu vực dạy
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.viTri}
                    onChange={(e) => setFormData({ ...formData, viTri: e.target.value })}
                    placeholder="Ví dụ: Hà Nội, TP.HCM..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Giới tính</label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.gioiTinh}
                    onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Năm sinh</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.namSinh}
                    onChange={(e) => setFormData({ ...formData, namSinh: e.target.value })}
                    placeholder="Ví dụ: 2000"
                    min="1950"
                    max="2010"
                  />
                </div>
              </div>
            </div>

            {/* Thông tin chuyên môn */}
            <div>
              <h3 className="font-bold text-slate-800 mb-4 text-base">Thông tin chuyên môn</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-600" /> Trường đại học
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.truongDaiHoc}
                    onChange={(e) => setFormData({ ...formData, truongDaiHoc: e.target.value })}
                    placeholder="Ví dụ: ĐH Bách Khoa HN"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" /> Chuyên ngành
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.chuyenNganh}
                    onChange={(e) => setFormData({ ...formData, chuyenNganh: e.target.value })}
                    placeholder="Ví dụ: Sư phạm Toán"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-emerald-600" /> Số năm kinh nghiệm
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={formData.soNamKinhNghiem}
                    onChange={(e) => setFormData({ ...formData, soNamKinhNghiem: e.target.value })}
                    placeholder="Ví dụ: 3"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Giới thiệu */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" /> Giới thiệu bản thân
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                value={formData.moTa}
                onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                placeholder="Mô tả kinh nghiệm, phương pháp giảng dạy của bạn..."
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 disabled:opacity-70"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function calculateProfileCompletion(data: TutorProfileData): number {
  const fields = [
    data.hoTen, data.email, data.soDienThoai, data.viTri,
    data.gioiTinh, data.truongDaiHoc, data.chuyenNganh,
    data.namSinh, data.soNamKinhNghiem, data.moTa
  ];
  const filled = fields.filter((f) => f && String(f).trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

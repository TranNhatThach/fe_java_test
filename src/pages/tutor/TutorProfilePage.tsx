import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, Mail, Phone, MapPin, BookOpen, Award, Save, Loader2, Camera } from 'lucide-react';

export function TutorProfilePage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '0987654321',
    location: 'Hà Nội',
    bio: 'Tôi là giáo viên có 5 năm kinh nghiệm dạy Toán cấp 3 và ôn thi đại học.',
    subjects: 'Toán, Lý, Hóa',
    experience: '5 năm',
    education: 'Đại học Sư Phạm Hà Nội'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Cập nhật hồ sơ thành công!');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-slate-500 text-lg">Hoàn thiện thông tin để thu hút nhiều học viên hơn</p>
      </div>

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
            <h2 className="text-xl font-bold text-slate-900 mb-1">{user?.name}</h2>
            <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4">Gia sư chuyên nghiệp</p>
            
            <div className="flex items-center justify-center gap-4 py-4 border-t border-slate-50">
              <div className="text-center">
                <p className="text-xl font-black text-slate-900">4.9</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Đánh giá</p>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="text-center">
                <p className="text-xl font-black text-slate-900">12</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Lớp học</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 mb-2">Trạng thái hồ sơ</h3>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[85%]"></div>
            </div>
            <p className="text-xs text-slate-500 font-medium">Hồ sơ của bạn đã hoàn thiện 85%. Thêm chứng chỉ để đạt 100%.</p>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" /> Họ và tên
                </label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" /> Email
                </label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
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
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" /> Khu vực dạy
                </label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Môn học đảm nhận
              </label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                value={formData.subjects}
                onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                placeholder="Ví dụ: Toán, Lý, Hóa..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" /> Giới thiệu bản thân
              </label>
              <textarea 
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
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

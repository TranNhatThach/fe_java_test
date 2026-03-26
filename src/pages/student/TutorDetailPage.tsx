import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudent } from '../../hooks/useStudent';
import { useAuthStore } from '../../store/authStore';
import { 
  User, MapPin, BookOpen, Clock, Star, ArrowLeft, 
  DollarSign, GraduationCap, Send, Loader2, Calendar, 
  Map as MapIcon, Info, CheckCircle2 
} from 'lucide-react';

export function TutorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTutorById, inviteTutor, getSubjects } = useStudent();
  const { user } = useAuthStore();
  const { data: tutor, isLoading, isError } = getTutorById(id || '');
  const { data: allSubjects } = getSubjects();
  
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invitationSent, setInvitationSent] = useState(false);
  const [inviteData, setInviteData] = useState({
    tenMon: '',
    trinhDo: '',
    lichHocDuKien: '',
    hinhThuc: 'Trực tiếp',
    diaDiem: '',
    nganSachMin: 150000,
    nganSachMax: 250000,
    moTa: '',
    loiNhan: ''
  });

  const mutation = inviteTutor;

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId) {
      alert('Bạn cần đăng nhập với vai trò học viên để mời dạy!');
      return;
    }

    try {
      await mutation.mutateAsync({
        maGiaSu: tutor?.maGiaSu,
        maHocVien: user.userId,
        ...inviteData
      });
      setInvitationSent(true);
      setTimeout(() => {
        setShowInviteModal(false);
        setInvitationSent(false);
      }, 3000);
    } catch (err: any) {
      alert('Gửi lời mời thất bại: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Đang tải thông tin gia sư...</p>
      </div>
    );
  }

  if (isError || !tutor) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
        <Info className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Không tìm thấy gia sư</h2>
        <p className="text-slate-500 mb-6">Có lỗi xảy ra hoặc gia sư này không tồn tại.</p>
        <button 
          onClick={() => navigate('/student/search')}
          className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all"
        >
          Quay lại tìm kiếm
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Header / Back Button */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-emerald-600 font-bold transition-colors group"
        >
          <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mr-3 group-hover:bg-emerald-50 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Quay lại
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar - Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-emerald-600/5 -z-10"></div>
            
            <div className="text-center mb-6">
              <div className="w-32 h-32 rounded-[2rem] bg-white shadow-xl border-4 border-white overflow-hidden mx-auto mb-4">
                <img 
                  src={tutor.avatar || `https://picsum.photos/seed/${tutor.maGiaSu}/200/200`} 
                  alt={tutor.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{tutor.name}</h1>
              <p className="text-emerald-600 font-bold text-xs uppercase tracking-[0.2em]">Gia sư xác thực</p>
            </div>

            <div className="flex justify-center gap-6 py-6 border-y border-slate-50 mb-6">
              <div className="text-center">
                <p className="text-xl font-black text-slate-900">{tutor.diemDanhGia || 0}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Đánh giá</p>
              </div>
              <div className="w-px h-10 bg-slate-100"></div>
              <div className="text-center">
                <p className="text-xl font-black text-slate-900">{tutor.soHocVien || 0}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Học viên</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm font-medium">{tutor.viTri || "Toàn quốc"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm font-medium">{tutor.trinhDo || "Gia sư"}</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-600 font-bold text-xl px-2">
                <DollarSign className="w-6 h-6" />
                <span>{tutor.price.toLocaleString()}đ</span>
                <span className="text-slate-400 text-sm font-normal ml-1">/ giờ</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-xl font-bold mb-4 relative z-10">Bạn thấy phù hợp?</h3>
            <p className="text-emerald-50 text-sm leading-relaxed mb-6 opacity-90 relative z-10">
              Gửi lời mời ngay để bắt đầu hành trình chinh phục kiến thức cùng gia sư {tutor.name}.
            </p>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="w-full bg-white text-emerald-600 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-lg active:scale-95 relative z-10"
            >
              Mời dạy ngay
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <User className="w-6 h-6 text-emerald-600" /> Thông tin chuyên môn
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Học vấn & Bằng cấp</h3>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{tutor.truongDaiHoc || "Đại học Sư Phạm"}</p>
                      <p className="text-sm text-slate-500">{tutor.chuyenNganh || "Chuyên ngành Sư phạm"}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Kinh nghiệm</h3>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{tutor.soNamKinhNghiem || 0} năm giảng dạy</p>
                      <p className="text-sm text-slate-500">Đã đồng hành cùng hàng chục học viên</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Môn học đảm nhận</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map(s => (
                      <span key={s} className="px-4 py-2 bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-100 italic">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Thông tin bổ sung</h3>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <p className="text-sm text-amber-800 leading-relaxed font-medium">
                      Gia sư cam kết mang lại chất lượng học tập tốt nhất, phương pháp dạy dễ hiểu, phù hợp với năng lực từng học viên.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <Star className="w-6 h-6 text-emerald-600" /> Giới thiệu bản thân
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg italic bg-slate-50/50 p-6 rounded-3xl border border-dashed border-slate-200">
              "Chào bạn, tôi là {tutor.name}. Với niềm đam mê giảng dạy và kinh nghiệm tích lũy, tôi tin rằng mình có thể giúp bạn không chỉ đạt được điểm số cao mà còn khơi gợi tình yêu với môn học. Tôi luôn ưu tiên phương pháp tư duy thay vì học thuộc lòng."
            </p>
          </div>
        </div>
      </div>

      {/* Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}></div>
          
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
            {invitationSent ? (
              <div className="p-12 text-center py-20">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Đã gửi lời mời!</h2>
                <p className="text-slate-500 text-lg">Hệ thống đã gửi thông báo đến gia sư {tutor.name}. Vui lòng chờ phản hồi nhé!</p>
              </div>
            ) : (
              <>
                <div className="bg-emerald-600 p-8 text-white relative">
                  <button 
                    onClick={() => setShowInviteModal(false)}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <h2 className="text-2xl font-bold mb-2">Mời gia sư {tutor.name} dạy</h2>
                  <p className="text-emerald-100 opacity-90">Vui lòng điền thông tin lớp học dự kiến</p>
                </div>

                <form onSubmit={handleInviteSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Môn học</label>
                      <select 
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={inviteData.tenMon}
                        onChange={(e) => setInviteData({...inviteData, tenMon: e.target.value})}
                      >
                        <option value="">Chọn môn học</option>
                        {allSubjects?.map((s: any) => (
                          <option key={s.maMon} value={s.tenMon}>{s.tenMon}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trình độ mong muốn</label>
                      <select 
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={inviteData.trinhDo}
                        onChange={(e) => setInviteData({...inviteData, trinhDo: e.target.value})}
                      >
                        <option value="">Chọn trình độ</option>
                        <option value="Cơ bản">Cơ bản</option>
                        <option value="Nâng cao">Nâng cao</option>
                        <option value="Luyện thi">Luyện thi</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hình thức học</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          type="button"
                          onClick={() => setInviteData({...inviteData, hinhThuc: 'Trực tiếp'})}
                          className={`px-4 py-2 rounded-xl border font-bold text-sm transition-all ${inviteData.hinhThuc === 'Trực tiếp' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                          Trực tiếp
                        </button>
                        <button 
                          type="button"
                          onClick={() => setInviteData({...inviteData, hinhThuc: 'Online'})}
                          className={`px-4 py-2 rounded-xl border font-bold text-sm transition-all ${inviteData.hinhThuc === 'Online' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                        >
                          Online
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Địa điểm / Nền tảng</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Nhập địa chỉ hoặc app học (Zoom, Meet...)"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        value={inviteData.diaDiem}
                        onChange={(e) => setInviteData({...inviteData, diaDiem: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lịch học dự kiến</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ví dụ: T2-T4-T6, từ 18h đến 20h"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                      value={inviteData.lichHocDuKien}
                      onChange={(e) => setInviteData({...inviteData, lichHocDuKien: e.target.value})}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lời nhắn gửi gia sư</label>
                    <textarea 
                      rows={3}
                      placeholder="Viết vài dòng giới thiệu về tình hình học tập và mong muốn của bạn..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      value={inviteData.loiNhan}
                      onChange={(e) => setInviteData({...inviteData, loiNhan: e.target.value})}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      type="submit"
                      disabled={mutation.isPending}
                      className="px-10 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 disabled:opacity-70"
                    >
                      {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                      Gửi lời mời
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

import { useShared } from '../../hooks/useShared';
import { useAuthStore } from '../../store/authStore';
import { Calendar, User, BookOpen, Loader2, ChevronRight, Clock, CheckCircle2, Edit2, X, Save, Star, MessageSquarePlus, CheckSquare, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import React, { useState } from 'react';
import { Class } from '../../hooks/useShared';
import { DanhGiaModal } from '../../components/DanhGiaModal';
import { useDanhGia } from '../../hooks/useDanhGia';

// Nút đánh giá — chỉ hiển thị với học viên khi lớp đã HOAN_THANH
function ClassReviewButton({ cls }: { cls: Class }) {
  const { getDanhGiaByLop } = useDanhGia();
  const { data: reviews } = getDanhGiaByLop(cls.maLop);
  const [showModal, setShowModal] = useState(false);
  const existingReview = reviews && reviews.length > 0 ? reviews[0] : null;

  if (cls.trangThai !== 'HOAN_THANH') {
    return (
      <span className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100">
        <AlertTriangle className="w-3.5 h-3.5" />
        Chưa hoàn thành
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all
          bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-500 hover:text-white hover:border-amber-500 hover:shadow-lg hover:shadow-amber-100"
      >
        {existingReview ? (
          <>
            <Star className="w-4 h-4 fill-current" />
            <span className="flex items-center gap-1">
              {existingReview.diem}
              <span className="text-amber-400">★</span>
              Đã đánh giá
            </span>
          </>
        ) : (
          <>
            <MessageSquarePlus className="w-4 h-4" />
            Đánh giá ngay
          </>
        )}
      </button>
      {showModal && (
        <DanhGiaModal
          cls={cls}
          existingDanhGia={existingReview}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export function MyClassesPage() {
  const { user } = useAuthStore();
  const { getMyClasses, updateSchedule, updateStatus } = useShared();

  const handleKetThucLop = async (cls: Class) => {
    if (!window.confirm(`Bạn có chắc muốn kết thúc lớp "${cls.tenMonHoc}"? Học viên sẽ có thể đánh giá sau khi lớp kết thúc.`)) return;
    try {
      await updateStatus.mutateAsync({ id: cls.maLop, status: 'HOAN_THANH' });
    } catch {
      alert('Không thể cập nhật trạng thái lớp học.');
    }
  };
  const { data: classes, isLoading } = getMyClasses();
  
  // Sắp xếp lớp học: 'HOAN_THANH' đẩy xuống cuối
  const sortedClasses = React.useMemo(() => {
    if (!classes) return [];
    return [...classes].sort((a, b) => {
      if (a.trangThai === 'HOAN_THANH' && b.trangThai !== 'HOAN_THANH') return 1;
      if (a.trangThai !== 'HOAN_THANH' && b.trangThai === 'HOAN_THANH') return -1;
      return 0;
    });
  }, [classes]);

  const [view, setView] = useState<'list' | 'schedule'>('list');
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [scheduleInput, setScheduleInput] = useState('');
  const [noteInput, setNoteInput] = useState('');

  const handleOpenEdit = (cls: Class) => {
    setEditingClass(cls);
    setScheduleInput(cls.lichHoc || '');
    setNoteInput(cls.ghiChu || '');
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    try {
      await updateSchedule.mutateAsync({ 
        id: editingClass.maLop, 
        lichHoc: scheduleInput,
        ghiChu: noteInput
      });
      setEditingClass(null);
      alert('Đã cập nhật lịch học thành công!');
    } catch (error) {
      alert('Không thể cập nhật lịch học.');
    }
  };

  const today = new Date();
  const currentDay = today.getDay();
  const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'].map((name, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { name, dateStr: format(d, 'dd/MM') };
  });

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Lớp học của tôi</h1>
          <p className="text-slate-500 text-lg">Quản lý lộ trình học tập và thanh toán</p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm self-start">
          <button 
            onClick={() => setView('list')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              view === 'list' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' : 'text-slate-500 hover:text-emerald-600'
            }`}
          >
            Danh sách
          </button>
          <button 
            onClick={() => setView('schedule')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              view === 'schedule' ? 'bg-emerald-600 text-white shadow-md shadow-emerald-100' : 'text-slate-500 hover:text-emerald-600'
            }`}
          >
            Lịch học
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Đang tải dữ liệu lớp học...</p>
        </div>
      ) : (
        <>
          {view === 'list' ? (
            <div className="grid grid-cols-1 gap-6">
              {sortedClasses.map((cls) => (
                <div key={cls.maLop} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors"></div>
                  
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">Môn: {cls.tenMonHoc || 'Chưa cập nhật'}</h3>
                        <div className="flex items-center gap-4 text-sm font-medium">
                          <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 font-bold">Lớp #{cls.maLop}</span>
                          <span className="text-slate-500 flex items-center gap-1.5 group/edit hover:text-emerald-600 transition-colors cursor-pointer" onClick={() => handleOpenEdit(cls)}>
                            <Clock className="w-4 h-4" /> 
                            <span>{cls.lichHoc || 'Chưa cập nhật lịch học'}</span>
                            <Edit2 className="w-3 h-3 text-slate-300 opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 xl:max-w-3xl">
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {user?.role === 'HOC_VIEN' ? 'Gia sư' : 'Học viên'}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <User className="w-3 h-3 text-slate-500" />
                          </div>
                          <p className="text-sm font-bold text-slate-700 truncate">
                            {user?.role === 'HOC_VIEN' ? cls.tenGiaSu : cls.tenHocVien}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ngày mở lớp</p>
                        <div className="flex items-center gap-2 text-slate-700">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <p className="text-sm font-bold truncate">
                            {cls.ngayBatDau ? format(new Date(cls.ngayBatDau), 'dd/MM/yyyy') : 'Chưa xếp lịch'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thanh toán</p>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <p className="text-sm font-bold text-emerald-600">Đã hoàn tất</p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trạng thái</p>
                        <div className="flex items-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                            cls.trangThai === 'HOAN_THANH'
                              ? 'bg-blue-500 text-white'
                              : 'bg-emerald-500 text-white'
                          }`}>
                            {cls.trangThai === 'HOAN_THANH' ? 'HOÀN THÀNH' : (cls.trangThai || 'ĐANG HỌC')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Nút đánh giá - chỉ hiện với học viên */}
                      {user?.role === 'HOC_VIEN' && (
                        <ClassReviewButton cls={cls} />
                      )}
                      {/* Nút kết thúc lớp - chỉ hiện với gia sư khi lớp đang học */}
                      {user?.role === 'GIA_SU' && cls.trangThai !== 'HOAN_THANH' && (
                        <button
                          onClick={() => handleKetThucLop(cls)}
                          disabled={updateStatus.isPending}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:shadow-blue-100 disabled:opacity-50"
                        >
                          {updateStatus.isPending
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : <CheckSquare className="w-4 h-4" />}
                          Kết thúc lớp
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenEdit(cls)}
                        className="bg-slate-50 p-4 rounded-2xl text-slate-400 hover:bg-emerald-600 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-emerald-100"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              {/* Header các thứ trong tuần */}
              <div className="flex border-b border-slate-100 bg-slate-50 sticky top-0 z-20">
                <div className="w-[80px] md:w-[100px] shrink-0 border-r border-slate-100 bg-white flex items-center justify-center">
                  <Clock className="w-5 h-5 text-slate-300" />
                </div>
                <div className="flex-1 grid grid-cols-7">
                  {weekDays.map(day => (
                    <div key={day.name} className="text-center py-3 border-r border-slate-100 last:border-r-0 flex flex-col justify-center">
                      <span className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest">{day.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-0.5">{day.dateStr}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Nội dung các hàng khung giờ */}
              <div className="flex flex-col bg-slate-50/30 overflow-y-auto">
                {[
                  { id: 'Sáng', label: 'Sáng', desc: '07:00 - 11:30' },
                  { id: 'Chiều', label: 'Chiều', desc: '13:00 - 17:30' },
                  { id: 'Tối', label: 'Tối', desc: '18:00 - 22:00' },
                  { id: 'Khác', label: 'Khác', desc: 'Chưa rõ giờ' }
                ].map((slot) => {
                  
                  // Lấy toàn bộ class hiển thị cho hàng này để ẩn nếu "Khác" rỗng
                  const classesInSlot = classes?.filter(cls => {
                    if (!cls.lichHoc) return slot.id === 'Khác';
                    const l = cls.lichHoc.toLowerCase();
                    let timeSlot = 'Khác';
                    const matchHour = l.match(/(\d{1,2})(?:h|:)/);
                    if (l.includes('sáng')) timeSlot = 'Sáng';
                    else if (l.includes('chiều')) timeSlot = 'Chiều';
                    else if (l.includes('tối')) timeSlot = 'Tối';
                    else if (matchHour) {
                      const hour = parseInt(matchHour[1]);
                      if (hour >= 5 && hour <= 12) timeSlot = 'Sáng';
                      else if (hour > 12 && hour < 18) timeSlot = 'Chiều';
                      else if (hour >= 18 || hour < 5) timeSlot = 'Tối';
                    }
                    return timeSlot === slot.id;
                  }) || [];

                  // Ẩn dòng "Khác" nếu không có lớp nào chưa rõ giờ
                  if (slot.id === 'Khác' && classesInSlot.length === 0) return null;

                  return (
                    <div key={slot.id} className="flex border-b border-slate-100 last:border-b-0 min-h-[140px] group">
                      {/* Cột hiển thị thời gian */}
                      <div className="w-[80px] md:w-[100px] shrink-0 border-r border-slate-100 bg-white p-2 flex flex-col items-center justify-center text-center group-hover:bg-slate-50 transition-colors">
                        <span className="font-black text-slate-700 text-xs md:text-sm">{slot.label}</span>
                        <span className="text-[9px] md:text-[10px] font-bold text-slate-400 mt-1">{slot.desc}</span>
                      </div>

                      {/* Các cột ngày trong tuần của hàng này */}
                      <div className="flex-1 grid grid-cols-7">
                        {['2', '3', '4', '5', '6', '7', 'cn'].map((dayKey) => {
                          const cellClasses = classesInSlot.filter(cls => {
                            if (!cls.lichHoc) return false;
                            const l = cls.lichHoc.toLowerCase();
                            if (dayKey === 'cn') return l.includes('cn') || l.includes('chủ nhật');
                            return l.includes(`thứ ${dayKey}`) || l.includes(`t${dayKey}`) || l.match(new RegExp(`\\b${dayKey}\\b`));
                          });

                          return (
                            <div key={`${slot.id}-${dayKey}`} className="border-r border-slate-100 last:border-r-0 p-1.5 md:p-2.5 flex flex-col gap-2 hover:bg-emerald-50/30 transition-colors">
                              {cellClasses.map((cls, i) => (
                                <div 
                                  key={`${cls.maLop}-${i}`} 
                                  onClick={() => handleOpenEdit(cls)}
                                  className="bg-white rounded-xl p-2 md:p-3 border border-emerald-100 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.1)] border-l-[3px] border-l-emerald-500 hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer group/card"
                                >
                                  <h4 className="font-bold text-emerald-800 text-[10px] md:text-xs mb-1 md:mb-1.5 leading-tight group-hover/card:text-emerald-600 transition-colors line-clamp-2">
                                    {cls.tenMonHoc || 'Môn học'}
                                  </h4>
                                  <p className="text-[9px] md:text-[10px] font-medium text-slate-500 leading-relaxed truncate">
                                    {cls.lichHoc}
                                  </p>
                                  
                                  {cls.ghiChu && (
                                    <div className="mt-2 pt-2 border-t border-emerald-50 text-[9px] md:text-[10px] font-medium text-emerald-700 leading-relaxed bg-emerald-50/50 p-2 rounded-lg line-clamp-2" title={cls.ghiChu}>
                                      📝 {cls.ghiChu}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {classes?.length === 0 && (
            <div className="text-center py-32 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa có lớp học nào</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Hãy tìm kiếm gia sư và bắt đầu hành trình học tập của bạn ngay hôm nay!</p>
            </div>
          )}

          {/* Sidebar Cập nhật Lịch học */}
          {editingClass && (
            <div 
              className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setEditingClass(null)}
            >
              <div 
                className="bg-white w-full max-w-md h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right-8 duration-300 flex flex-col border-l border-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
                  <h3 className="text-xl font-bold text-slate-900">Cập nhật lịch học</h3>
                  <button 
                    onClick={() => setEditingClass(null)}
                    className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full text-slate-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleSaveSchedule} className="p-6 flex-1 flex flex-col">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">Lớp học hiện tại</label>
                      <input 
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 font-medium focus:outline-none" 
                        value={`Môn: ${editingClass.tenMonHoc || 'Trống'}`} 
                        disabled 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-2 block">Lịch học mong muốn</label>
                      <textarea 
                        autoFocus
                        required
                        rows={3}
                        placeholder="VD: Thứ 2, 4, 6 (19h30 - 21h00)"
                        value={scheduleInput}
                        onChange={(e) => setScheduleInput(e.target.value)}
                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all text-slate-900 font-medium resize-none shadow-sm"
                      />
                    </div>
                    {user?.role === 'GIA_SU' && (
                      <div>
                        <label className="text-sm font-bold text-slate-700 mb-2 block">Dặn dò phần chuẩn bị tới (Ghi chú)</label>
                        <textarea 
                          rows={3}
                          placeholder="Nhắc học viên bài mới, chuẩn bị kiểm tra..."
                          value={noteInput}
                          onChange={(e) => setNoteInput(e.target.value)}
                          className="w-full px-4 py-3.5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition-all text-emerald-900 font-medium resize-none shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-8 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setEditingClass(null)}
                      className="flex-1 py-3.5 px-4 font-bold rounded-xl border-2 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
                    >
                      Hủy bỏ
                    </button>
                    <button 
                      type="submit" 
                      disabled={updateSchedule.isPending}
                      className="flex-1 py-3.5 px-4 font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex justify-center items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {updateSchedule.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

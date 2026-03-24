import { useShared } from '../../hooks/useShared';
import { useAuthStore } from '../../store/authStore';
import { Calendar, User, BookOpen, Loader2, ChevronRight, Clock, CreditCard, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';

export function MyClassesPage() {
  const { user } = useAuthStore();
  const { getMyClasses } = useShared();
  const { data: classes, isLoading } = getMyClasses();
  const [view, setView] = useState<'list' | 'schedule'>('list');

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
              {classes?.map((cls) => (
                <div key={cls.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors"></div>
                  
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                        <BookOpen className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{cls.name}</h3>
                        <div className="flex items-center gap-4 text-sm font-medium">
                          <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">{cls.subject}</span>
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> 2 buổi / tuần
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
                          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                            <User className="w-3 h-3 text-slate-500" />
                          </div>
                          <p className="text-sm font-bold text-slate-700">
                            {user?.role === 'HOC_VIEN' ? cls.tutorName : cls.studentName}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Buổi học tới</p>
                        <div className="flex items-center gap-2 text-slate-700">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <p className="text-sm font-bold">
                            {cls.nextSession ? format(new Date(cls.nextSession), 'eeee, dd/MM', { locale: vi }) : 'Chưa xếp lịch'}
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
                          <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500 text-white shadow-sm">
                            Đang học
                          </span>
                        </div>
                      </div>
                    </div>

                    <button className="bg-slate-50 p-4 rounded-2xl text-slate-400 hover:bg-emerald-600 hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-emerald-100">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="grid grid-cols-7 gap-4 mb-8">
                {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                  <div key={day} className="text-center text-xs font-black text-slate-400 uppercase tracking-widest py-2">{day}</div>
                ))}
                {Array.from({ length: 31 }).map((_, i) => (
                  <div key={i} className={`aspect-square rounded-2xl border flex flex-col p-3 transition-all ${
                    [3, 10, 17, 24].includes(i + 1) 
                    ? 'bg-emerald-50 border-emerald-200 ring-2 ring-emerald-100' 
                    : 'bg-slate-50/50 border-slate-100 hover:border-emerald-200'
                  }`}>
                    <span className={`text-sm font-bold mb-2 ${[3, 10, 17, 24].includes(i + 1) ? 'text-emerald-700' : 'text-slate-400'}`}>{i + 1}</span>
                    {[3, 10, 17, 24].includes(i + 1) && (
                      <div className="bg-white p-1.5 rounded-lg shadow-sm border border-emerald-100">
                        <p className="text-[10px] font-black text-emerald-600 truncate">18:00 - Toán 12</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center gap-6 p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-900">Buổi học tiếp theo</h4>
                  <p className="text-emerald-700 text-sm">Toán 12 - Ôn thi đại học vào lúc 18:00 Thứ Tư, ngày 25/03</p>
                </div>
                <button className="ml-auto bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
                  Vào lớp học
                </button>
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
        </>
      )}
    </div>
  );
}

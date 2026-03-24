import { useAuthStore } from '../../store/authStore';
import { BookOpen, Clock, Calendar, Star, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function StudentDashboardPage() {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Lớp đang học', value: '0', icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Giờ đã học', value: '0h', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Buổi học tới', value: 'Chưa có', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Đánh giá TB', value: '-', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const upcomingSessions: any[] = [];


  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Chào mừng trở lại, {user?.name}! 👋</h1>
          <p className="text-slate-500 text-lg">Hôm nay bạn muốn bắt đầu bài học nào?</p>
        </div>
        <Link 
          to="/student/search" 
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
        >
          Tìm gia sư mới <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Sessions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" /> Lịch học sắp tới
            </h2>
            <Link to="/student/classes" className="text-sm font-bold text-emerald-600 hover:underline">Xem tất cả</Link>
          </div>
          
          <div className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div key={session.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <span className="text-xs font-black uppercase">{session.date.split(',')[0]}</span>
                      <span className="text-lg font-black leading-none">{session.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{session.subject}</h3>
                      <p className="text-sm text-slate-500">Gia sư: {session.tutor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{session.time}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{session.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-slate-500 italic">Bạn chưa có buổi học nào sắp tới.</p>
              </div>
            )}
          </div>

        </div>

        {/* Recent Activity / Recommendations */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" /> Gợi ý cho bạn
          </h2>
          <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-xl font-bold mb-4 relative z-10">Nâng cao kỹ năng Tiếng Anh?</h3>
            <p className="text-emerald-50 mb-6 text-sm leading-relaxed relative z-10 opacity-90">
              Chúng tôi vừa cập nhật danh sách 50+ gia sư IELTS 8.0+ mới. Đừng bỏ lỡ cơ hội học tập tốt nhất!
            </p>
            <Link 
              to="/student/search" 
              className="inline-block bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-all relative z-10"
            >
              Khám phá ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

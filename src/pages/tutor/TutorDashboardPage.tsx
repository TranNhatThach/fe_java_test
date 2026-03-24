import { useAuthStore } from '../../store/authStore';
import { useTutor } from '../../hooks/useTutor';
import { Briefcase, Clock, Users, DollarSign, ArrowRight, TrendingUp, Mail, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function TutorDashboardPage() {
  const { user } = useAuthStore();
  const { getJobList } = useTutor();
  const { data: jobs, isLoading } = getJobList();

  const stats = [
    { label: 'Lớp đang dạy', value: '0', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Giờ đã dạy', value: '0h', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Thu nhập tháng', value: '0', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Lời mời mới', value: '0', icon: Mail, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  // Map real jobs to the dashboard format
  const recentJobs = jobs?.slice(0, 3).map(job => ({
    id: job.id,
    title: job.title,
    budget: `${job.budget.toLocaleString()}đ/buổi`,
    location: job.location,
    time: 'Mới đăng'
  })) || [];


  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Chào mừng trở lại, {user?.name}! 👋</h1>
          <p className="text-slate-500 text-lg">Bạn đã sẵn sàng cho những buổi dạy mới chưa?</p>
        </div>
        <Link 
          to="/tutor/jobs" 
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
        >
          Tìm việc làm mới <ArrowRight className="w-4 h-4" />
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
        {/* Recent Jobs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" /> Việc làm mới nhất
            </h2>
            <Link to="/tutor/jobs" className="text-sm font-bold text-emerald-600 hover:underline">Xem tất cả</Link>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              </div>
            ) : recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-500">{job.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">{job.budget}</p>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{job.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-[2rem] border border-dashed border-slate-200">
                <p className="text-slate-500 italic">Hiện tại chưa có yêu cầu mới nào.</p>
              </div>
            )}
          </div>

        </div>

        {/* Performance / Tips */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" /> Hiệu suất dạy học
          </h2>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">Độ hài lòng</span>
              <span className="text-sm font-black text-emerald-600">98%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[98%]"></div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Bạn đang làm rất tốt! Hãy tiếp tục duy trì phong độ để được ưu tiên hiển thị trên trang tìm kiếm.
            </p>
            <div className="pt-4 border-t border-slate-50">
              <Link 
                to="/tutor/profile" 
                className="flex items-center justify-center gap-2 w-full bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-all"
              >
                Cập nhật hồ sơ <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useTutor } from '../../hooks/useTutor';
import { Briefcase, MapPin, Clock, DollarSign, Loader2, CheckCircle2 } from 'lucide-react';

export function JobListPage() {
  const { getJobList, applyJob } = useTutor();
  const { data: jobs, isLoading } = getJobList();

  const handleApply = async (jobId: string) => {
    try {
      await applyJob.mutateAsync(jobId);
      alert('Ứng tuyển thành công!');
    } catch (err) {
      alert('Có lỗi xảy ra khi ứng tuyển.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Việc làm mới nhất</h1>
        <p className="text-slate-500">Tìm kiếm các yêu cầu học tập phù hợp với chuyên môn của bạn</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {jobs?.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                    {job.subject}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5" />
                    {job.grade}
                  </div>
                  <div className="flex items-center font-semibold text-slate-900">
                    <DollarSign className="w-4 h-4 mr-1 text-emerald-600" />
                    {(job?.budget || 0).toLocaleString()}đ / buổi
                  </div>

                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => handleApply(job.id)}
                  disabled={applyJob.isPending}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-70"
                >
                  {applyJob.isPending ? 'Đang xử lý...' : 'Ứng tuyển ngay'}
                </button>
              </div>
            </div>
          ))}

          {jobs?.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500">Hiện chưa có yêu cầu mới nào phù hợp.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

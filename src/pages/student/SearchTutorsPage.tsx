import React, { useState } from 'react';
import { useStudent } from '../../hooks/useStudent';
import { Search, Star, MapPin, DollarSign, Loader2, Filter, X, ChevronDown } from 'lucide-react';

export function SearchTutorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    subject: '',
    location: '',
    level: ''
  });

  const { searchTutors, getSubjects } = useStudent();
  const { data: allSubjects } = getSubjects();
  const { data: tutors, isLoading } = searchTutors({ 
    q: searchTerm,
    ...filters
  });


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      subject: '',
      location: '',
      level: ''
    });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Tìm kiếm gia sư</h1>
          <p className="text-slate-500 text-lg">Khám phá hàng ngàn gia sư giỏi sẵn sàng đồng hành cùng bạn</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
              placeholder="Môn học, tên gia sư..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold transition-all border ${
              showFilters 
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200' 
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Bộ lọc
            {Object.values(filters).some(v => v !== '') && (
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-600" />
              Lọc kết quả nâng cao
            </h3>
            <button onClick={clearFilters} className="text-sm text-emerald-600 font-bold hover:underline flex items-center gap-1">
              <X className="w-4 h-4" /> Xóa tất cả
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Môn học</label>
              <select 
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
              >
                <option value="">Tất cả môn</option>
                {allSubjects?.map((sub: any) => (
                  <option key={sub.maMon} value={sub.tenMon}>{sub.tenMon}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Địa điểm</label>
              <select 
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Toàn quốc</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Hải Phòng">Hải Phòng</option>
                <option value="Cần Thơ">Cần Thơ</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trình độ</label>
              <select 
                name="level"
                value={filters.level}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="">Tất cả</option>
                <option value="Sinh viên">Sinh viên</option>
                <option value="Giáo viên">Giáo viên</option>
                <option value="Giảng viên">Giảng viên</option>
                <option value="Cử nhân">Cử nhân</option>
                <option value="Thạc sĩ">Thạc sĩ</option>
              </select>
            </div>


            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Giá từ (đ)</label>
              <input 
                type="number"
                name="minPrice"
                placeholder="0"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đến (đ)</label>
              <input 
                type="number"
                name="maxPrice"
                placeholder="500,000"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Đang tìm kiếm gia sư phù hợp...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {tutors?.map((tutor) => (
            <div key={tutor.id} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-12 -mt-12 group-hover:bg-emerald-500/10 transition-colors"></div>
              
              <div className="flex items-start justify-between mb-6 relative">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 overflow-hidden border-2 border-white shadow-md">
                  <img 
                    src={tutor.avatar || `https://picsum.photos/seed/${tutor.id}/100/100`} 
                    alt={tutor.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center text-amber-500 bg-amber-50 px-3 py-1.5 rounded-2xl text-sm font-bold shadow-sm border border-amber-100">
                  <Star className="w-4 h-4 mr-1.5 fill-current" />
                  {tutor.rating || 0}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{tutor.name || tutor.username}</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {(tutor.subjects || []).map((s) => (
                  <span key={s} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                    {s}
                  </span>
                ))}
                {(!tutor.subjects || tutor.subjects.length === 0) && (
                  <span className="text-xs text-slate-400 italic">Chưa cập nhật môn học</span>
                )}
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center text-slate-500 text-sm font-medium">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                  </div>
                  {tutor.viTri || 'Chưa cập nhật địa điểm'}
                </div>
                <div className="flex items-center text-slate-900 font-bold text-lg">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mr-3">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  {(tutor.price || 0).toLocaleString()}đ <span className="text-slate-400 text-sm font-normal ml-1">/ giờ</span>
                </div>
              </div>


              <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-[0.98]">
                Xem chi tiết & Mời dạy
              </button>
            </div>
          ))}
          
          {tutors?.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy gia sư</h3>
              <p className="text-slate-500">Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

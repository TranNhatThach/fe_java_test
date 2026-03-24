import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MoveLeft, FileQuestion } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center">
        {/* Animated Icon Container */}
        <div className="relative inline-block mb-8">
          <div className="absolute inset-0 bg-indigo-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-indigo-50">
            <FileQuestion className="w-20 h-20 text-indigo-600 animate-bounce" />
          </div>
        </div>

        <h1 className="text-8xl font-black text-slate-200 mb-2">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 mb-4 font-sans uppercase tracking-tight">
          Trang không tồn tại
        </h2>
        
        <p className="text-slate-500 mb-10 leading-relaxed text-lg">
          Rất tiếc, chúng tôi không tìm thấy trang mà bạn đang tìm kiếm. Có vẻ như đường dẫn đã bị thay đổi hoặc không còn tồn tại.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 shadow-sm"
          >
            <MoveLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200 active:scale-95"
          >
            <Home className="w-5 h-5" />
            <span>Về trang chủ</span>
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200">
          <p className="text-slate-400 text-sm italic">
            "Không phải tất cả những ai lang thang đều lạc lối..."
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

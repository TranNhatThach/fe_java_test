import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCcw, ShieldAlert, LifeBuoy } from 'lucide-react';

const ServerErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 py-12 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-500/10 border border-red-500/20 mb-8 animate-pulse">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>

        <h1 className="text-7xl font-extrabold text-white mb-4 tracking-tighter">500</h1>
        <h2 className="text-3xl font-bold text-slate-100 mb-6 uppercase">
          Lỗi Hệ Thống
        </h2>
        
        <p className="text-slate-400 mb-12 text-lg max-w-lg mx-auto leading-relaxed">
          Đã có lỗi xảy ra phía máy chủ. Đội ngũ kỹ thuật của chúng tôi đang nỗ lực khắc phục sự cố này. Vui lòng thử lại sau vài phút.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <button 
            onClick={handleRefresh}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-950 font-bold rounded-2xl hover:bg-slate-100 transition-all duration-200 shadow-xl shadow-white/5 active:scale-95"
          >
            <RefreshCcw className="w-5 h-5" />
            <span>Tải lại trang</span>
          </button>
          
          <button 
            onClick={() => window.open('mailto:support@example.com')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 border border-slate-700 transition-all duration-200 active:scale-95"
          >
            <LifeBuoy className="w-5 h-5" />
            <span>Liên hệ hỗ trợ</span>
          </button>
        </div>

        <div className="mt-20">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 inline-block">
            <code className="text-red-400 text-sm font-mono">
              ERROR_CODE: INTERNAL_SERVER_ERROR_500
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerErrorPage;

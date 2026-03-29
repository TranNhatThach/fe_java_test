import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Banknote,
  Smartphone,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../utils/cn';

interface Transaction {
  id: string;
  type: 'PAYMENT' | 'WITHDRAWAL' | 'REFUND' | 'INCOME';
  amount: number;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  description: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-001', type: 'PAYMENT', amount: 500000, date: '2024-03-25 14:30', status: 'COMPLETED', description: 'Thanh toán học phí lớp Toán 12' },
  { id: 'TRX-002', type: 'INCOME', amount: 1200000, date: '2024-03-24 09:00', status: 'COMPLETED', description: 'Thu nhập từ lớp Tiếng Anh' },
  { id: 'TRX-003', type: 'WITHDRAWAL', amount: 1000000, date: '2024-03-22 16:45', status: 'PENDING', description: 'Rút tiền về tài khoản ngân hàng' },
  { id: 'TRX-004', type: 'PAYMENT', amount: 300000, date: '2024-03-20 10:20', status: 'FAILED', description: 'Thanh toán lớp Lý 11' },
  { id: 'TRX-005', type: 'REFUND', amount: 150000, date: '2024-03-18 11:30', status: 'COMPLETED', description: 'Hoàn tiền phí dịch vụ' },
];

export function PaymentPage() {
  const { user } = useAuthStore();
  const isStudent = user?.role === 'HOC_VIEN';
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'methods'>('overview');
  const [showModal, setShowModal] = useState(false);

  const stats = isStudent ? [
    { label: 'Số dư tài khoản', value: '1.250.000đ', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Tổng chi tiêu tháng này', value: '2.300.000đ', icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Số buổi chờ thanh toán', value: '3 buổi', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ] : [
    { label: 'Số dư khả dụng', value: '4.850.000đ', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Thu nhập trong tháng', value: '12.500.000đ', icon: ArrowDownLeft, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Lệnh rút đang xử lý', value: '1.000.000đ', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isStudent ? 'Quản lý thanh toán' : 'Quản lý thu nhập'}
          </h1>
          <p className="text-slate-500 mt-1 text-lg">
            {isStudent ? 'Theo dõi học phí và lịch sử giao dịch của bạn' : 'Theo dõi thu nhập và yêu cầu rút tiền'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-200 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>{isStudent ? 'Nạp tiền' : 'Rút tiền'}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-4 rounded-2xl group-hover:scale-110 transition-transform", stat.bg)}>
                <stat.icon className={cn("w-7 h-7", stat.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-10">
        <div className="border-b border-slate-100 px-6 sm:px-10 py-6">
          <div className="flex items-center gap-8">
            {[
              { id: 'overview', label: 'Tổng quan' },
              { id: 'history', label: 'Lịch sử giao dịch' },
              { id: 'methods', label: 'Phương thức thanh toán' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "relative py-2 text-sm font-bold transition-all",
                  activeTab === tab.id ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute -bottom-[25px] left-0 right-0 h-1 bg-emerald-600 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <AnimatePresence mode="wait">
            {activeTab === 'history' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm giao dịch..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                      <Filter className="w-4 h-4" />
                      Lọc
                    </button>
                    <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                      <Download className="w-4 h-4" />
                      Xuất file
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã giao dịch</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nội dung</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Số tiền</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày thực hiện</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Trạng thái</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_TRANSACTIONS.map((trx) => (
                        <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4 font-mono text-sm text-slate-600">{trx.id}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-900">{trx.description}</p>
                            <span className="text-xs text-slate-400 capitalize">{trx.type.toLowerCase()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "text-sm font-bold",
                              trx.type === 'INCOME' || trx.type === 'REFUND' ? "text-emerald-600" : "text-red-500"
                            )}>
                              {trx.type === 'INCOME' || trx.type === 'REFUND' ? '+' : '-'}{trx.amount.toLocaleString('vi-VN')}đ
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{trx.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center">
                              {trx.status === 'COMPLETED' ? (
                                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                  <CheckCircle2 className="w-3 h-3" /> Thành công
                                </span>
                              ) : trx.status === 'PENDING' ? (
                                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                                  <Clock className="w-3 h-3" /> Đang xử lý
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                                  <AlertCircle className="w-3 h-3" /> Thất bại
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 hover:bg-slate-100 rounded-lg">
                              <MoreVertical className="w-4 h-4 text-slate-400" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10"
              >
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 border-l-4 border-emerald-500 pl-4">Thẻ của tôi</h3>
                  <div className="relative group perspective-1000">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[2rem] text-white shadow-2xl overflow-hidden relative aspect-[1.6/1]">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -mr-24 -mt-24" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-16 -mb-16" />
                      
                      <div className="flex justify-between items-start relative z-10">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-400 uppercase tracking-[0.2em]">Tên chủ thẻ</p>
                          <p className="text-lg font-bold tracking-wide uppercase">{user?.name}</p>
                        </div>
                        <CreditCard className="w-10 h-10 text-slate-500/50" />
                      </div>

                      <div className="mt-12 relative z-10">
                        <p className="text-2xl font-mono tracking-[0.25em] flex items-center gap-4">
                          <span>••••</span>
                          <span>••••</span>
                          <span>••••</span>
                          <span>4242</span>
                        </p>
                      </div>

                      <div className="mt-auto flex justify-between items-end relative z-10 pt-8">
                        <div>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Hiệu lực</p>
                          <p className="text-sm font-bold">12/28</p>
                        </div>
                        <div className="w-12 h-8 bg-amber-400/20 rounded-md flex items-center justify-center">
                          <div className="w-6 h-4 bg-amber-400/50 rounded-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Thêm phương thức mới
                  </button>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 border-l-4 border-emerald-500 pl-4">Chi tiêu gần đây</h3>
                  <div className="space-y-4">
                    {MOCK_TRANSACTIONS.slice(0, 3).map((trx) => (
                      <div key={trx.id} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "p-3 rounded-xl",
                            trx.type === 'PAYMENT' ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                          )}>
                            {trx.type === 'PAYMENT' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{trx.description}</p>
                            <p className="text-xs text-slate-500">{trx.date}</p>
                          </div>
                        </div>
                        <p className={cn(
                          "font-black text-sm",
                          trx.type === 'PAYMENT' ? "text-slate-900" : "text-emerald-600"
                        )}>
                          {trx.type === 'PAYMENT' ? '-' : '+'}{trx.amount.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    ))}
                    <button 
                      onClick={() => setActiveTab('history')}
                      className="w-full py-3 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Xem tất cả giao dịch
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'methods' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {[
                  { icon: Banknote, label: 'Thanh toán trực tiếp', desc: 'Thanh toán bằng tiền mặt cho gia sư' },
                  { icon: Building2, label: 'Chuyển khoản ngân hàng', desc: 'Hỗ trợ tất cả ngân hàng tại Việt Nam', primary: true },
                  { icon: Smartphone, label: 'Ví điện tử MoMo/ZaloPay', desc: 'Thanh toán nhanh qua ứng dụng di động' },
                  { icon: CreditCard, label: 'Thẻ tín dụng/Ghi nợ', desc: 'Visa, Mastercard, JCB' },
                ].map((item, idx) => (
                  <div key={idx} className="p-6 rounded-3xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all cursor-pointer group flex gap-5">
                    <div className={cn(
                      "p-4 rounded-2xl h-fit",
                      item.primary ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                    )}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.label}</h4>
                      <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                      {item.primary && <span className="inline-block mt-3 text-[10px] bg-emerald-100 text-emerald-700 font-black px-2 py-0.5 rounded uppercase tracking-wider">Khuyên dùng</span>}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mock Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                    <Wallet className="w-8 h-8" />
                  </div>
                  <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                    <MoreVertical className="w-6 h-6 rotate-90" />
                  </button>
                </div>
                
                <h2 className="text-2xl font-black text-slate-900 mb-2">Thực hiện {isStudent ? 'nạp tiền' : 'rút tiền'}</h2>
                <p className="text-slate-500 mb-8">Nhập số tiền và chọn phương thức để tiếp tục.</p>

                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 block">Số tiền (VNĐ)</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₫</span>
                      <input 
                        type="number" 
                        placeholder="0"
                        className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-12 pr-6 text-3xl font-black text-slate-900 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all placeholder:text-slate-300"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {['500.000', '1.000.000', '2.000.000', '5.000.000'].map(val => (
                      <button key={val} className="whitespace-nowrap px-4 py-2 rounded-xl bg-slate-50 text-slate-600 text-sm font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-transparent hover:border-emerald-100">
                        {val}đ
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => {
                      alert('Tính năng đang được phát triển!');
                      setShowModal(false);
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-[0.98]"
                  >
                    Xác nhận {isStudent ? 'nạp tiền' : 'rút tiền'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

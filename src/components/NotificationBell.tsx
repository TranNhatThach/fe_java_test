import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, X, CheckCheck, Info, BookOpen, Users, Loader2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';

interface ThongBao {
  maThongBao: number;
  noiDung: string;
  loai: string; // TUYEN_DUNG | LOP_HOC | HE_THONG
  daDoc: boolean;
  ngayTao: string;
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

function loaiIcon(loai: string) {
  switch (loai) {
    case 'TUYEN_DUNG': return <Users className="w-4 h-4 text-emerald-600" />;
    case 'LOP_HOC':    return <BookOpen className="w-4 h-4 text-blue-500" />;
    default:           return <Info className="w-4 h-4 text-slate-400" />;
  }
}

function loaiBg(loai: string) {
  switch (loai) {
    case 'TUYEN_DUNG': return 'bg-emerald-50';
    case 'LOP_HOC':    return 'bg-blue-50';
    default:           return 'bg-slate-50';
  }
}

export function NotificationBell() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<ThongBao[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // maTaiKhoan: dùng userId (số nguyên) lưu trong store
  const maTaiKhoan = user?.userId;

  const fetchNotifications = useCallback(async () => {
    if (!maTaiKhoan) return;
    try {
      const data = await apiClient<ThongBao[]>(`/notifications/${maTaiKhoan}`);
      setNotifications(data || []);
    } catch { /* silent */ }
  }, [maTaiKhoan]);

  // Fetch ngay khi mount, sau đó polling mỗi 30s
  useEffect(() => {
    fetchNotifications();
    pollRef.current = setInterval(fetchNotifications, 30_000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [fetchNotifications]);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.daDoc).length;

  const markAsRead = async (maThongBao: number) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.maThongBao === maThongBao ? { ...n, daDoc: true } : n))
    );
    try {
      await apiClient(`/notifications/${maThongBao}/read`, { method: 'PUT' });
    } catch { /* rollback nếu cần */ }
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.daDoc);
    setNotifications((prev) => prev.map((n) => ({ ...n, daDoc: true })));
    await Promise.all(unread.map((n) => apiClient(`/notifications/${n.maThongBao}/read`, { method: 'PUT' }).catch(() => {})));
  };

  const handleOpen = () => {
    setOpen((o) => !o);
    if (!open) fetchNotifications(); // refresh khi mở
  };

  return (
    <div ref={panelRef} className="relative">
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative p-2 text-slate-400 hover:text-emerald-600 transition-colors rounded-xl hover:bg-slate-100"
        aria-label="Thông báo"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-12 w-[360px] bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="font-bold text-slate-900">Thông báo</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-emerald-600 font-bold hover:underline flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Đọc tất cả
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-6">
                <Bell className="w-12 h-12 text-slate-200 mb-3" />
                <p className="text-slate-400 text-sm font-medium">Không có thông báo nào</p>
              </div>
            ) : (
              <div>
                {notifications.map((n) => (
                  <button
                    key={n.maThongBao}
                    onClick={() => markAsRead(n.maThongBao)}
                    className={`w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0 ${
                      !n.daDoc ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {/* Icon vòng tròn theo loại */}
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${loaiBg(n.loai)}`}>
                      {loaiIcon(n.loai)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-snug ${!n.daDoc ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                        {n.noiDung}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">{timeAgo(n.ngayTao)}</p>
                    </div>
                    {/* Chấm xanh = chưa đọc */}
                    {!n.daDoc && (
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-1 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

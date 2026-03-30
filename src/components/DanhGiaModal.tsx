import React, { useState } from 'react';
import { X, Star, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useDanhGia, DanhGia } from '../hooks/useDanhGia';
import { Class } from '../hooks/useShared';

interface DanhGiaModalProps {
  cls: Class;
  existingDanhGia?: DanhGia | null;
  onClose: () => void;
}

const LABEL_MAP: Record<number, { label: string; color: string }> = {
  1: { label: 'Rất tệ', color: 'text-red-500' },
  2: { label: 'Tệ', color: 'text-orange-500' },
  3: { label: 'Bình thường', color: 'text-amber-500' },
  4: { label: 'Tốt', color: 'text-emerald-500' },
  5: { label: 'Xuất sắc!', color: 'text-emerald-600' },
};

export function DanhGiaModal({ cls, existingDanhGia, onClose }: DanhGiaModalProps) {
  const { createDanhGia, updateDanhGia } = useDanhGia();
  const [diem, setDiem] = useState<number>(existingDanhGia?.diem ?? 0);
  const [hover, setHover] = useState<number>(0);
  const [nhanXet, setNhanXet] = useState(existingDanhGia?.nhanXet ?? '');
  const [success, setSuccess] = useState(false);

  const isEditing = !!existingDanhGia;
  const isPending = createDanhGia.isPending || updateDanhGia.isPending;
  const activeStar = hover || diem;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (diem === 0) return;

    try {
      if (isEditing && existingDanhGia) {
        await updateDanhGia.mutateAsync({
          id: existingDanhGia.maDanhGia,
          data: { diem, nhanXet },
        });
      } else {
        await createDanhGia.mutateAsync({ maLop: cls.maLop, diem, nhanXet });
      }
      setSuccess(true);
      setTimeout(() => onClose(), 1800);
    } catch {
      // error handled by react-query
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 px-8 pt-8 pb-12 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <p className="text-emerald-100 text-sm font-semibold mb-1 uppercase tracking-widest">
            {isEditing ? 'Chỉnh sửa đánh giá' : 'Đánh giá lớp học'}
          </p>
          <h2 className="text-2xl font-black">{cls.tenMonHoc || 'Lớp học'}</h2>
          <p className="text-emerald-100 text-sm mt-1">Gia sư: {cls.tenGiaSu}</p>
          {/* Decorative circles */}
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 translate-y-12" />
          <div className="absolute bottom-4 right-8 w-16 h-16 bg-white/10 rounded-full" />
        </div>

        {/* Body */}
        <div className="-mt-6 bg-white rounded-t-[2rem] px-8 pt-8 pb-8">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Đánh giá thành công! 🎉</h3>
              <p className="text-slate-500">Cảm ơn bạn đã chia sẻ trải nghiệm học tập.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div className="text-center">
                <p className="text-sm font-bold text-slate-500 mb-4 uppercase tracking-wider">
                  Chọn số sao đánh giá
                </p>
                <div className="flex justify-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setDiem(star)}
                      className="transition-all duration-150 hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-10 h-10 transition-all duration-150 ${
                          star <= activeStar
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {activeStar > 0 && (
                  <p
                    className={`text-base font-black animate-in fade-in duration-200 ${LABEL_MAP[activeStar]?.color}`}
                  >
                    {LABEL_MAP[activeStar]?.label}
                  </p>
                )}
                {diem === 0 && (
                  <p className="text-xs text-slate-400 font-medium mt-1">Vui lòng chọn ít nhất 1 sao</p>
                )}
              </div>

              {/* Nhan xet */}
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block">
                  Nhận xét chi tiết <span className="text-slate-400 font-normal">(không bắt buộc)</span>
                </label>
                <textarea
                  rows={4}
                  value={nhanXet}
                  onChange={(e) => setNhanXet(e.target.value)}
                  placeholder={`VD: Thầy/cô dạy rất nhiệt tình, giải thích dễ hiểu...`}
                  className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 outline-none transition-all text-slate-800 font-medium resize-none placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              {/* Error */}
              {(createDanhGia.isError || updateDanhGia.isError) && (
                <p className="text-sm text-red-500 font-semibold bg-red-50 px-4 py-3 rounded-xl">
                  Có lỗi xảy ra. Vui lòng thử lại.
                </p>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3.5 font-bold rounded-xl border-2 border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={diem === 0 || isPending}
                  className="flex-1 py-3.5 font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> {isEditing ? 'Cập nhật' : 'Gửi đánh giá'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

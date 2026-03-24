import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, User, UserCheck, ArrowLeft, Loader2 } from "lucide-react";
import { apiClient } from "../../api/client";
import { address, p } from "motion/react-client";

export function RegisterPage() {
  const [role, setRole] = useState<"HOC_VIEN" | "GIA_SU">("HOC_VIEN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient<any>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: name,
          email,
          password,
          confirmPassword,
          role,
          phone,
          address,
        }),
      });

      if (response.success) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        alert(
          "Đăng ký thất bại: " + (response.message || "Lỗi không xác định."),
        );
      }
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra trong quá trình đăng ký.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full -mr-24 -mt-24 blur-3xl"></div>

        <div className="mb-8">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại đăng nhập
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-200">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              TutorConnect
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-slate-500 text-lg">
            Bắt đầu hành trình kết nối tri thức ngay hôm nay
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole("HOC_VIEN")}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                role === "HOC_VIEN"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
              }`}
            >
              <User className="w-8 h-8" />
              <span className="font-bold">Học viên</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("GIA_SU")}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                role === "GIA_SU"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200"
              }`}
            >
              <UserCheck className="w-8 h-8" />
              <span className="font-bold">Gia sư</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Họ và tên
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="Nguyễn Văn A"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="Tối thiểu 6 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Số điện thoại
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Địa chỉ
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                placeholder="Nhập địa chỉ"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <a href="#" className="text-emerald-600 underline">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#" className="text-emerald-600 underline">
              Chính sách bảo mật
            </a>{" "}
            của chúng tôi.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center disabled:opacity-70 active:scale-[0.98]"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Đăng ký tài khoản"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-emerald-600 font-bold hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}

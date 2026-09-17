import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, Building, Shield, Send, CheckCircle2, Save, Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileView: React.FC = () => {
  const { currentUser, updateUser, users, setIsLineModalOpen } = useApp();
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [password, setPassword] = useState(currentUser.password || 'password123');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [department, setDepartment] = useState(currentUser.department);
  const [lineUserId, setLineUserId] = useState(currentUser.lineUserId || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setError('กรุณาระบุชื่อผู้ใช้ (Username)');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      return;
    }

    // Check duplicate username if changed
    const duplicate = users.find(
      (u) => u.username.toLowerCase() === cleanUsername.toLowerCase() && u.id !== currentUser.id
    );
    if (duplicate) {
      setError(`ชื่อผู้ใช้ "${cleanUsername}" มีผู้อื่นใช้งานแล้ว กรุณาเลือกชื่ออื่น`);
      return;
    }

    await updateUser(currentUser.id, {
      name,
      username: cleanUsername,
      password: cleanPassword,
      phone,
      department,
      lineUserId
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-500/20"
          />
          <div>
            <h1 className="text-lg font-bold text-slate-900">{currentUser.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-semibold">
                @{currentUser.username}
              </span>
              <span className="text-xs text-slate-400">{currentUser.email}</span>
            </div>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 capitalize">
              {currentUser.role === 'admin'
                ? 'ผู้ดูแลระบบ (Admin)'
                : currentUser.role === 'technician'
                ? 'ช่างซ่อม (Technician)'
                : 'ผู้แจ้งซ่อม (User)'}
            </span>
          </div>
        </div>

        {saved && (
          <div className="my-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>บันทึกการเปลี่ยนแปลงข้อมูลและรหัสผ่านส่วนตัวสำเร็จ</span>
          </div>
        )}

        {error && (
          <div className="my-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">ชื่อ - สกุล</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 border rounded-xl"
              required
            />
          </div>

          {/* Account Credentials Section */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 space-y-3">
            <div className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>ข้อมูลการเข้าสู่ระบบ (Username & Password)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อผู้ใช้ (Username)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                    @
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 border rounded-xl font-mono text-xs bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">รหัสผ่าน (Password)</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 border rounded-xl font-mono text-xs bg-white"
                    required
                    minLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">แผนก / สาขาวิชา</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2.5 border rounded-xl"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์ติดต่อ</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2.5 border rounded-xl"
            />
          </div>

          {/* LINE ID Connect */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-emerald-600" />
                เชื่อมต่อบัญชี LINE เพื่อรับการแจ้งเตือนงานซ่อม
              </span>
              <button
                type="button"
                onClick={() => setIsLineModalOpen(true)}
                className="text-[11px] text-emerald-700 hover:underline font-semibold"
              >
                ดูวิธีเชื่อมต่อ
              </button>
            </div>
            <input
              type="text"
              placeholder="LINE User ID (เช่น U1234567890abcdef...)"
              value={lineUserId}
              onChange={(e) => setLineUserId(e.target.value)}
              className="w-full p-2.5 border border-emerald-300 rounded-xl bg-white font-mono text-[11px]"
            />
            <p className="text-[10px] text-emerald-700">
              ข้อความสถานะงานซ่อมจะถูกส่งไปยัง LINE อัตโนมัติเมื่อช่างมีความเคลื่อนไหว
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกข้อมูล</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

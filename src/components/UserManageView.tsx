import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit3,
  Trash2,
  Shield,
  Wrench,
  User as UserIcon,
  CheckCircle2,
  X,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  Copy,
  Check,
  Save
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';

export const UserManageView: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Quick Password Reset Modal
  const [resetTargetUser, setResetTargetUser] = useState<User | null>(null);
  const [quickPassword, setQuickPassword] = useState('');
  const [showQuickPassword, setShowQuickPassword] = useState(false);

  // Delete confirmation state
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('user');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setEmail('');
    setUsername(`user_${Date.now().toString().slice(-4)}`);
    setPassword('password123');
    setShowPassword(false);
    setRole('user');
    setDepartment('สาขาวิชาวิทยาการคอมพิวเตอร์');
    setPhone('081-xxx-xxxx');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u: User) => {
    setEditingId(u.id);
    setName(u.name);
    setEmail(u.email);
    setUsername(u.username);
    setPassword(u.password || 'password123');
    setShowPassword(false);
    setRole(u.role);
    setDepartment(u.department);
    setPhone(u.phone || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      alert('กรุณาระบุชื่อผู้ใช้ (Username)');
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      alert('กรุณาระบุรหัสผ่านอย่างน้อย 4 ตัวอักษร');
      return;
    }

    // Check unique username
    const duplicate = users.find(
      (u) => u.username.toLowerCase() === cleanUsername.toLowerCase() && u.id !== editingId
    );
    if (duplicate) {
      alert(`ชื่อผู้ใช้ "${cleanUsername}" มีอยู่แล้วในระบบ กรุณาใช้ชื่ออื่น`);
      return;
    }

    if (editingId) {
      await updateUser(editingId, {
        name,
        email,
        username: cleanUsername,
        password: cleanPassword,
        role,
        department,
        phone
      });
      setToastMessage(`แก้ไขข้อมูล "${name}" (ชื่อผู้ใช้: ${cleanUsername}) เรียบร้อยแล้ว`);
    } else {
      await addUser({
        name,
        email,
        username: cleanUsername,
        password: cleanPassword,
        role,
        department,
        phone
      });
      setToastMessage(`เพิ่มผู้ใช้งาน "${name}" (ชื่อผู้ใช้: ${cleanUsername}) เรียบร้อยแล้ว`);
    }
    setTimeout(() => setToastMessage(null), 3500);
    setIsModalOpen(false);
  };

  const handleOpenQuickReset = (u: User) => {
    setResetTargetUser(u);
    setQuickPassword(u.password || 'password123');
    setShowQuickPassword(false);
  };

  const handleSaveQuickReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTargetUser) return;
    const cleanPassword = quickPassword.trim();
    if (!cleanPassword || cleanPassword.length < 4) {
      alert('รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร');
      return;
    }

    await updateUser(resetTargetUser.id, { password: cleanPassword });
    setToastMessage(`เปลี่ยนรหัสผ่านสำหรับ "${resetTargetUser.name}" (@${resetTargetUser.username}) สำเร็จ`);
    setTimeout(() => setToastMessage(null), 3500);
    setResetTargetUser(null);
  };

  const handleCopyCredentials = (u: User) => {
    const text = `ชื่อผู้ใช้: ${u.username}\nรหัสผ่าน: ${u.password || 'password123'}`;
    navigator.clipboard?.writeText(text);
    setCopiedId(u.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmUser) return;
    setIsDeleting(true);
    const uName = deleteConfirmUser.name;
    try {
      await deleteUser(deleteConfirmUser.id);
      setToastMessage(`ลบผู้ใช้งาน "${uName}" เรียบร้อยแล้ว`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch {
      setToastMessage(`เกิดข้อผิดพลาดในการลบผู้ใช้งาน`);
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmUser(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            การจัดการข้อมูลผู้ใช้งานและกำหนดสิทธิ์ (User & Role Management)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            จัดการบัญชีผู้ใช้ กำหนดบทบาทสิทธิ์ (RBAC) และข้อมูลแผนกสังกัด
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาผู้ใช้ หรือ แผนก..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>เพิ่มผู้ใช้งานใหม่</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3.5 px-4">ชื่อ - นามสกุล</th>
                <th className="py-3.5 px-4">ชื่อผู้ใช้ (Username)</th>
                <th className="py-3.5 px-4">รหัสผ่าน (Password)</th>
                <th className="py-3.5 px-4">แผนก / สังกัด</th>
                <th className="py-3.5 px-4">เบอร์โทรศัพท์</th>
                <th className="py-3.5 px-4">บทบาท (Role)</th>
                <th className="py-3.5 px-4">สถานะ</th>
                <th className="py-3.5 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div>{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-100 font-mono text-slate-800 font-semibold text-[11px]">
                      <span>@{u.username}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-slate-400 tracking-wider text-[13px]">
                        ••••••••
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenQuickReset(u)}
                        className="inline-flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-medium hover:underline cursor-pointer"
                        title="คลิกเพื่อเปลี่ยนรหัสผ่าน"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>เปลี่ยน</span>
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{u.department}</td>
                  <td className="py-3.5 px-4 text-slate-600">{u.phone || '-'}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin'
                          ? 'bg-indigo-100 text-indigo-800'
                          : u.role === 'technician'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {u.role === 'admin'
                        ? 'ผู้ดูแลระบบ (Admin)'
                        : u.role === 'technician'
                        ? 'ช่างซ่อม (Technician)'
                        : 'ผู้แจ้งซ่อม (User)'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      เปิดใช้งาน
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleCopyCredentials(u)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        title="คัดลอกชื่อผู้ใช้และรหัสผ่าน"
                      >
                        {copiedId === u.id ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenQuickReset(u)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                        title="เปลี่ยนรหัสผ่านผู้ใช้งานนี้"
                      >
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title="แก้ไขข้อมูลและรหัสผ่าน"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmUser(u)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="ลบข้อมูลผู้ใช้งาน"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit3 className="w-4 h-4 text-indigo-600" />
                    <span>แก้ไขข้อมูลและรหัสผ่านผู้ใช้งาน</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-indigo-600" />
                    <span>เพิ่มผู้ใช้งานใหม่</span>
                  </>
                )}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อ - นามสกุล *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              {/* Username & Password Grid */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                    <Lock className="w-3.5 h-3.5 text-indigo-600" />
                    ข้อมูลบัญชีสำหรับเข้าสู่ระบบ (Credentials)
                  </span>
                  <button
                    type="button"
                    onClick={() => setPassword('password123')}
                    className="text-[10px] text-indigo-700 hover:text-indigo-900 font-semibold underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    รีเซ็ตรหัสเป็น password123
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      ชื่อผู้ใช้ (Username) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">
                        @
                      </span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="เช่น prasit_tech"
                        className="w-full pl-7 pr-3 py-2 border rounded-xl font-mono text-xs bg-white"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">ใช้เข้าสู่ระบบ (ตัวอักษรภาษาอังกฤษ/ตัวเลข)</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      รหัสผ่าน (Password) *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="ระบุรหัสผ่านใหม่"
                        className="w-full pl-3 pr-8 py-2 border rounded-xl font-mono text-xs bg-white"
                        required
                        minLength={4}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">ขั้นต่ำ 4 ตัวอักษร</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">บทบาทสิทธิ์ (Role) *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full p-2.5 border rounded-xl bg-white font-semibold"
                  >
                    <option value="user">ผู้แจ้งซ่อม (User)</option>
                    <option value="technician">ช่างซ่อม (Technician)</option>
                    <option value="admin">ผู้ดูแลระบบ (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">อีเมลองค์กร *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@institution.ac.th"
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">แผนก / สังกัด *</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="ระบุแผนก"
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08x-xxx-xxxx"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-xs"
                >
                  {editingId ? 'บันทึกการแก้ไข' : 'บันทึกผู้ใช้ใหม่'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Password Reset Modal */}
      {resetTargetUser && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setResetTargetUser(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0 border border-indigo-100">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">เปลี่ยนรหัสผ่านผู้ใช้งาน</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  กำหนดรหัสผ่านใหม่สำหรับ {resetTargetUser.name}
                </p>
                <span className="inline-block mt-1 font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                  @{resetTargetUser.username}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveQuickReset} className="space-y-3.5 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">รหัสผ่านใหม่ (New Password) *</label>
                  <button
                    type="button"
                    onClick={() => setQuickPassword('password123')}
                    className="text-[10px] text-indigo-600 hover:underline font-semibold"
                  >
                    ตั้งเป็น password123
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showQuickPassword ? 'text' : 'password'}
                    value={quickPassword}
                    onChange={(e) => setQuickPassword(e.target.value)}
                    placeholder="กรอกรหัสผ่านใหม่"
                    className="w-full pl-3 pr-8 py-2 border rounded-xl font-mono text-xs"
                    required
                    minLength={4}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowQuickPassword(!showQuickPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showQuickPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetTargetUser(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>บันทึกรหัสผ่าน</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App User Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => !isDeleting && setDeleteConfirmUser(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl shrink-0 border border-rose-100">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  ยืนยันการลบข้อมูลผู้ใช้งาน
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  คุณต้องการลบบัญชีผู้ใช้งานนี้ออกจากระบบใช่หรือไม่? การกระทำนี้จะส่งผลให้ผู้ใช้รายนี้ไม่สามารถเข้าใช้งานระบบได้อีก
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ชื่อ-นามสกุล:</span>
                <span className="font-semibold text-slate-800">{deleteConfirmUser.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">ชื่อบัญชี (Username):</span>
                <span className="font-mono text-slate-700 bg-slate-200/60 px-2 py-0.5 rounded text-[11px]">
                  {deleteConfirmUser.username}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">แผนก / สังกัด:</span>
                <span className="text-slate-600">{deleteConfirmUser.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">บทบาทสิทธิ์:</span>
                <span className="font-semibold text-indigo-700">
                  {deleteConfirmUser.role === 'admin' ? 'ผู้ดูแลระบบ (Admin)' : deleteConfirmUser.role === 'technician' ? 'ช่างเทคนิค (Technician)' : 'ผู้ใช้งานทั่วไป (User)'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <span>กำลังลบ...</span>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ยืนยันลบผู้ใช้งาน</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Success/Info Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs backdrop-blur-sm border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

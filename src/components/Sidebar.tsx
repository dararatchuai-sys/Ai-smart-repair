import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  History,
  Laptop,
  MessageSquare,
  Bell,
  User,
  Wrench,
  BarChart3,
  Users,
  Activity,
  ListTodo,
  AlertCircle,
  Lock,
  LogOut,
  Receipt,
  Shield,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

interface SidebarMenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const {
    currentRole,
    currentUser,
    activeView,
    setActiveView,
    repairs,
    notifications,
    messages,
    openLogin
  } = useApp();

  const unreadNotifs = notifications.filter((n) => !n.isRead).length;
  const unreadMessages = messages.filter((m) => !m.isRead).length;
  const unassignedRepairsCount = repairs.filter(
    (r) => !r.technicianId || ['reported', 'pending'].includes(r.status)
  ).length;
  const myAssignedCount = repairs.filter((r) => r.technicianId === currentUser.id).length;

  // Menu items for User (ผู้แจ้งซ่อม)
  const userMenuItems: SidebarMenuItem[] = [
    { id: 'dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
    { id: 'new_repair', label: 'แจ้งซ่อมทันที', icon: PlusCircle, highlight: true },
    { id: 'my_repairs', label: 'งานที่แจ้งไว้ (ของฉัน)', icon: ListTodo },
    { id: 'track_status', label: 'ติดตามสถานะงาน', icon: Clock },
    { id: 'repair_history', label: 'ประวัติการซ่อม', icon: History },
    { id: 'my_equipment', label: 'อุปกรณ์ในระบบ', icon: Laptop },
    { id: 'chat', label: 'แชตคุยกับช่าง', icon: MessageSquare, badge: unreadMessages > 0 ? unreadMessages : undefined },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined }
  ];

  // Menu items for Technician (ช่างซ่อม)
  const techMenuItems: SidebarMenuItem[] = [
    { id: 'dashboard', label: 'แดชบอร์ดช่าง', icon: LayoutDashboard },
    {
      id: 'unassigned_jobs',
      label: 'งานใหม่รอรับเรื่อง',
      icon: AlertCircle,
      badge: unassignedRepairsCount > 0 ? unassignedRepairsCount : undefined,
      highlight: unassignedRepairsCount > 0
    },
    {
      id: 'my_assigned',
      label: 'งานที่รับผิดชอบ',
      icon: Wrench,
      badge: myAssignedCount > 0 ? myAssignedCount : undefined
    },
    { id: 'tech_jobs', label: 'จัดการงานซ่อม (ช่าง)', icon: ListTodo },
    { id: 'monthly_expenses', label: 'สรุปค่าใช้จ่ายรายเดือน', icon: Receipt, highlight: true },
    { id: 'chat', label: 'แชตกับผู้แจ้ง', icon: MessageSquare, badge: unreadMessages > 0 ? unreadMessages : undefined },
    { id: 'equipment_health', label: 'สุขภาพอุปกรณ์', icon: Activity },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell, badge: unreadNotifs > 0 ? unreadNotifs : undefined },
    { id: 'profile', label: 'โปรไฟล์', icon: User }
  ];

  // Menu items for Admin (ผู้ดูแลระบบ)
  const adminMenuItems: SidebarMenuItem[] = [
    { id: 'dashboard', label: 'แดชบอร์ดภาพรวม', icon: LayoutDashboard },
    { id: 'analytics', label: 'วิเคราะห์ปัญหา (กราฟ)', icon: BarChart3 },
    { id: 'monthly_expenses', label: 'สรุปค่าใช้จ่ายรายเดือน', icon: Receipt, highlight: true },
    { id: 'all_repairs', label: 'จัดการงานแจ้งซ่อม', icon: ListTodo },
    { id: 'equipment_manage', label: 'จัดการอุปกรณ์', icon: Laptop },
    { id: 'user_manage', label: 'จัดการผู้ใช้งาน', icon: Users },
    { id: 'chat', label: 'แชตระบบ', icon: MessageSquare },
    { id: 'equipment_health', label: 'ประวัติสุขภาพอุปกรณ์', icon: Activity }
  ];

  const currentMenu =
    currentRole === 'technician'
      ? techMenuItems
      : currentRole === 'admin'
      ? adminMenuItems
      : userMenuItems;

  const handleNavClick = (viewId: string) => {
    setActiveView(viewId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Role identifier badge in sidebar */}
        <div className="p-4 border-b border-slate-800">
          <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
            มุมมองปัจจุบัน (Active Role)
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                currentRole === 'admin'
                  ? 'bg-indigo-400'
                  : currentRole === 'technician'
                  ? 'bg-emerald-400'
                  : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-white block truncate">
                {currentRole === 'admin'
                  ? 'ผู้ดูแลระบบ (Admin)'
                  : currentRole === 'technician'
                  ? 'ช่างซ่อมคอมพิวเตอร์'
                  : 'ผู้แจ้งซ่อมทั่วไป'}
              </span>
            </div>
          </div>

          {/* Quick Staff Login Trigger (when in user mode) */}
          {currentRole === 'user' && (
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                id="sidebar-quick-tech-login"
                onClick={() => {
                  openLogin('technician');
                  onCloseMobile();
                }}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-emerald-300 hover:text-white text-[11px] font-semibold transition-all cursor-pointer"
                title="เข้าสู่ระบบช่างซ่อมคอมพิวเตอร์"
              >
                <Wrench className="w-3 h-3 text-emerald-400" />
                <span>ช่างซ่อม</span>
              </button>
              <button
                type="button"
                id="sidebar-quick-admin-login"
                onClick={() => {
                  openLogin('admin');
                  onCloseMobile();
                }}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-indigo-300 hover:text-white text-[11px] font-semibold transition-all cursor-pointer"
                title="เข้าสู่ระบบผู้ดูแลระบบ (Admin)"
              >
                <Shield className="w-3 h-3 text-indigo-400" />
                <span>ผู้ดูแลระบบ</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {currentMenu.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-link-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : item.highlight
                    ? 'bg-slate-800/70 text-blue-400 hover:bg-slate-800 hover:text-blue-300'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Staff Login Buttons (shown when user is 'user') */}
        {currentRole === 'user' && (
          <div className="p-3 border-t border-slate-800 bg-slate-950/70 space-y-2">
            <div className="px-1 text-[11px] font-bold text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>เข้าสู่ระบบเจ้าหน้าที่</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">สำหรับช่าง / แอดมิน</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {/* ปุ่มเข้าสู่ระบบช่างซ่อม */}
              <button
                type="button"
                id="sidebar-btn-login-tech"
                onClick={() => {
                  openLogin('technician');
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.99] text-white text-xs font-semibold shadow-md shadow-emerald-950/40 border border-emerald-400/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/40 text-emerald-100 flex items-center justify-center shrink-0 border border-emerald-300/30">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold leading-tight">เข้าสู่ระบบช่างซ่อม</p>
                    <p className="text-[10px] text-emerald-200/80 font-normal">ระบบรับงานซ่อมคอมพิวเตอร์</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-200 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>

              {/* ปุ่มเข้าสู่ระบบผู้ดูแลระบบ */}
              <button
                type="button"
                id="sidebar-btn-login-admin"
                onClick={() => {
                  openLogin('admin');
                  onCloseMobile();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] text-white text-xs font-semibold shadow-md shadow-indigo-950/40 border border-indigo-400/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/40 text-indigo-100 flex items-center justify-center shrink-0 border border-indigo-300/30">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold leading-tight">เข้าสู่ระบบผู้ดูแลระบบ</p>
                    <p className="text-[10px] text-indigo-200/80 font-normal">จัดการระบบและรายงาน IT</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-200 group-hover:translate-x-0.5 transition-transform shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* Staff User Profile / Logout (shown only for technician / admin) */}
        {currentRole !== 'user' && (
          <div className="p-3 border-t border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 mb-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentRole === 'technician' ? 'ช่างเทคนิคคอมพิวเตอร์' : 'ผู้ดูแลระบบ IT'}
                </p>
              </div>
            </div>
            <button
              id="sidebar-btn-logout-switch"
              onClick={() => handleNavClick('login')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>สลับบัญชี / หน้าล็อกอิน</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

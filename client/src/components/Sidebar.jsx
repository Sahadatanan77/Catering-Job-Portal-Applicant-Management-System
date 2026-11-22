import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  XCircle,
  Briefcase,
  PlusCircle,
  UserCheck,
} from 'lucide-react';

const Sidebar = () => {
  const links = [
    {
      to: '/hirer/dashboard',
      label: 'Admin Overview',
      icon: LayoutDashboard,
    },
    {
      to: '/hirer/applicants',
      label: 'All Applicants',
      icon: Users,
    },
    {
      to: '/hirer/shortlisted',
      label: 'Shortlisted Staff',
      icon: CheckCircle,
    },
    {
      to: '/hirer/rejected',
      label: 'Rejected Applications',
      icon: XCircle,
    },
    {
      to: '/hirer/manage-jobs',
      label: 'Manage Jobs',
      icon: Briefcase,
    },
    {
      to: '/hirer/create-job',
      label: 'Post New Job',
      icon: PlusCircle,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0 hidden lg:flex">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Hirer Control Panel
          </p>
          <nav className="space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/hirer/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
          <div className="flex items-center gap-2 mb-1.5 text-emerald-800">
            <UserCheck className="w-4 h-4" />
            <span className="text-xs font-bold">Hirer Access</span>
          </div>
          <p className="text-[11px] text-emerald-700 leading-relaxed">
            Review applicant CVs, verify Bangladeshi contact info, and update application statuses directly.
          </p>
        </div>
      </div>

      <div className="px-3 py-2 text-[11px] text-slate-400 text-center border-t border-slate-100">
        Single Catering Service Admin Mode
      </div>
    </aside>
  );
};

export default Sidebar;

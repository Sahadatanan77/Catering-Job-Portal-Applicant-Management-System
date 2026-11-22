import React from 'react';
import { Clock, Eye, CheckCircle2, UserCheck, XCircle, HelpCircle } from 'lucide-react';

const StatusBadge = ({ status, size = 'md' }) => {
  const normStatus = (status || 'pending').toLowerCase();

  const configs = {
    pending: {
      label: 'Pending Review',
      classes: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10',
      icon: Clock,
      dot: 'bg-amber-500',
    },
    reviewed: {
      label: 'Reviewed',
      classes: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10',
      icon: Eye,
      dot: 'bg-blue-500',
    },
    shortlisted: {
      label: 'Shortlisted',
      classes: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500/10',
      icon: CheckCircle2,
      dot: 'bg-purple-500',
    },
    hired: {
      label: 'Hired / Accepted',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
      icon: UserCheck,
      dot: 'bg-emerald-500',
    },
    accepted: {
      label: 'Accepted',
      classes: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
      icon: UserCheck,
      dot: 'bg-emerald-500',
    },
    rejected: {
      label: 'Rejected',
      classes: 'bg-red-50 text-red-700 border-red-200 ring-red-500/10',
      icon: XCircle,
      dot: 'bg-red-500',
    },
  };

  const current = configs[normStatus] || {
    label: normStatus,
    classes: 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10',
    icon: HelpCircle,
    dot: 'bg-slate-400',
  };

  const Icon = current.icon;
  const isSm = size === 'sm';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ring-1 capitalize ${
        current.classes
      } ${isSm ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      <Icon className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {current.label}
    </span>
  );
};

export default StatusBadge;

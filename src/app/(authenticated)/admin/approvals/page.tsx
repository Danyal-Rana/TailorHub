'use client';
import { useEffect, useState } from 'react';
import { listPendingApprovals, approveUser, rejectUser } from '@/services/adminService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Check, X, Loader2, UserCheck } from 'lucide-react';
import { RoleGate } from '@/components/auth/RoleGate';

export default function ApprovalsPage() {
  const { appUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await listPendingApprovals();
      setUsers(data);
    } catch {
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleApprove = async (uid: string) => {
    if (!appUser) return;
    try {
      await approveUser(uid, appUser.uid);
      toast.success('User approved');
      fetchUsers();
    } catch {
      toast.error('Failed to approve user');
    }
  };

  const handleReject = async (uid: string) => {
    if (!confirm('Are you sure you want to reject this user?')) return;
    try {
      await rejectUser(uid);
      toast.success('User rejected');
      fetchUsers();
    } catch {
      toast.error('Failed to reject user');
    }
  };

  return (
    <RoleGate allow={['admin']}>
      <div className="space-y-6">
        <h1 className="page-title">Pending Approvals</h1>

        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-10 flex justify-center">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-slate-300 dark:text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300">All clear!</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">No pending approvals.</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="table-header">
                <tr>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Joined</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {users.map(u => (
                  <tr key={u.uid} className="table-row">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{u.displayName}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{u.email || u.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 rounded-full font-semibold capitalize text-xs">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500 dark:text-slate-400 text-xs">
                      {u.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleApprove(u.uid)}
                          className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                          title="Approve"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(u.uid)}
                          className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </RoleGate>
  );
}

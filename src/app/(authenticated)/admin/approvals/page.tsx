'use client';
import { useEffect, useState } from 'react';
import { listPendingApprovals, approveUser, rejectUser } from '@/services/adminService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Check, X, Loader2 } from 'lucide-react';
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
    } catch (e: any) {
      toast.error('Failed to load pending approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (uid: string) => {
    if (!appUser) return;
    try {
      await approveUser(uid, appUser.uid);
      toast.success('User approved');
      fetchUsers();
    } catch (e: any) {
      toast.error('Failed to approve user');
    }
  };

  const handleReject = async (uid: string) => {
    if (!confirm('Are you sure you want to reject this user?')) return;
    try {
      await rejectUser(uid);
      toast.success('User rejected');
      fetchUsers();
    } catch (e: any) {
      toast.error('Failed to reject user');
    }
  };

  return (
    <RoleGate allow={['admin']}>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-black text-slate-900">Pending Approvals</h1>
        
        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>
          ) : users.length === 0 ? (
            <div className="p-10 text-center text-slate-500">No pending approvals found.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.uid} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{u.displayName}</p>
                      <p className="text-slate-500">{u.email || u.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full font-medium capitalize text-xs">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {u.createdAt?.toDate().toLocaleDateString() || 'N/A'}
                    </td>
                    <td className="p-4 flex gap-2 justify-end">
                      <button onClick={() => handleApprove(u.uid)} className="p-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleReject(u.uid)} className="p-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
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

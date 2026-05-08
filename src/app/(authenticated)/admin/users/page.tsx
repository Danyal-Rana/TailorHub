'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Loader2, Search } from 'lucide-react';
import { RoleGate } from '@/components/auth/RoleGate';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    } catch (e: any) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone?.includes(searchTerm)
  );

  return (
    <RoleGate allow={['admin']}>
      <div className="space-y-6">
        <h1 className="text-3xl font-display font-black text-slate-900">User Management</h1>
        
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
          
          {loading ? (
            <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 text-brand-600 animate-spin" /></div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-10 text-center text-slate-500">No users found.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4 font-semibold">User</th>
                  <th className="p-4 font-semibold">Contact</th>
                  <th className="p-4 font-semibold">Role</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr key={u.uid} className="hover:bg-slate-50/50">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{u.displayName}</p>
                    </td>
                    <td className="p-4 text-slate-500">
                      <p>{u.email}</p>
                      <p>{u.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-medium capitalize text-xs">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full font-medium text-xs ${
                        u.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        u.status === 'pending_approval' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {u.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {u.createdAt?.toDate().toLocaleDateString() || 'N/A'}
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

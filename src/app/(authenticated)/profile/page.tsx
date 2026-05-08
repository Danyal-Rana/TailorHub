import { ProfileEditor } from '@/components/profile/ProfileEditor';

export const metadata = { title: 'My Profile — TailorHub' };

export default function ProfilePage() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-display font-black text-slate-900">Profile Settings</h1>
        <p className="text-slate-500 mt-2">Manage your account information and preferences.</p>
      </div>

      <ProfileEditor />
    </div>
  );
}

import { AdminShell } from '@/src/components/admin/AdminShell';

export const metadata = {
  title: 'Back office',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}

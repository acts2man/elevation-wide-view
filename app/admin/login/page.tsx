'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    setSubmitting(false);
    if (!res.ok) { setError('Incorrect password.'); return; }
    router.push(params.get('from') || '/admin');
    router.refresh();
  };
  return (
    <form onSubmit={submit} style={{ background: '#fff', padding: 32, borderRadius: 12, width: 'min(360px, 90vw)', boxShadow: '0 18px 40px -24px rgba(36,51,48,.5)' }}>
      <h1 style={{ font: '550 22px Manrope, sans-serif', color: '#2c4634', marginBottom: 8 }}>Admin sign in</h1>
      <p style={{ fontSize: 13, color: '#667c59', marginBottom: 20 }}>Enter the admin password to open the studio.</p>
      <input type="password" autoFocus value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
        style={{ width: '100%', height: 43, padding: '10px 12px', border: '1px solid #dce6d1', borderRadius: 5, fontSize: 14, marginBottom: 12 }} />
      {error && <p style={{ color: '#b3441f', fontSize: 13, marginBottom: 12 }}>{error}</p>}
      <button type="submit" disabled={submitting || !password} style={{ width: '100%', height: 43, borderRadius: 5, background: '#2c4634', color: '#fff', fontSize: 14, fontWeight: 500 }}>
        {submitting ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <main style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6f3' }}>
      <Suspense fallback={null}>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}

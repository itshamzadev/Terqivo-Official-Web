import { apiFetch } from '../../lib/api';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Code2, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Successfully logged in');
        login(data.user);
        navigate('/admin');
      } else {
        setError(data.message || 'Login failed');
        toast.error(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
      toast.error('Network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <SEO title="Admin Login | TERQIVO" description="TERQIVO Secure Admin Portal" />
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 ring-1 ring-primary/20">
            <Code2 size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin Portal</h1>
          <p className="text-muted-foreground text-sm mt-3 font-medium">Secure access to TERQIVO management</p>
        </div>

        <div className="bg-card border border-border/50 p-8 rounded-3xl shadow-xl shadow-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full pointer-events-none" />
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2 group">
              <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Email Address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border/60 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                placeholder="admin@terqivo.com"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2 group">
              <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border/60 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-medium hover:bg-primary-hover transition-all flex items-center justify-center disabled:opacity-70 shadow-lg shadow-primary/20 hover:shadow-primary/30"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

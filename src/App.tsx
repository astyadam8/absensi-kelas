import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  History,
  Send,
  Loader2,
  Calendar,
  ChevronDown,
  Lock,
  User,
  LogOut,
  Camera,
  GraduationCap,
  UserCircle,
  Home,
  BarChart3,
  FileText,
  ShieldCheck,
  Info,
  MessageCircle,
  Phone,
  Heart,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Download,
  Printer
} from 'lucide-react';

interface AttendanceRecord {
  id: number;
  timestamp: string;
  nama: string;
  kelas: string;
  status: string;
  keterangan: string;
}

const SCHOOL_LOGO_URL = "https://ais-dev-wsl27zbocte3skt3eerzqd-322979270979.asia-southeast1.run.app/api/chat/image/90";

const STUDENTS = [
  { name: "Agresia A. Cika", parentPhone: "6281234567890" },
  { name: "Yohana A. Adam", parentPhone: "6281234567891" },
  { name: "Maria Y.T. Dangur", parentPhone: "6281234567892" },
  { name: "Oswaldus A.Jelahu", parentPhone: "6281234567893" },
  { name: "Agustinus G. Nggeal", parentPhone: "6281234567894" },
  { name: "Yorimus O. Adu", parentPhone: "6281234567895" },
  { name: "Aleksius Hugo", parentPhone: "6281234567896" },
  { name: "Almira P.E. Syamlan", parentPhone: "6281234567897" },
  { name: "Amelia Celsi Anul", parentPhone: "6281234567898" },
  { name: "Maria K.M.Batumali", parentPhone: "6281234567899" },
  { name: "Efrasia F.Latar", parentPhone: "6281234567900" },
  { name: "Gregorius R.Jerni", parentPhone: "6281234567901" },
  { name: "Maria S.Jehambur", parentPhone: "6281234567902" },
  { name: "Marsela V.Indriani", parentPhone: "6281234567903" },
  { name: "Michela M. Lioran", parentPhone: "6281234567904" },
  { name: "Modestus M. Jemadi", parentPhone: "6281234567905" },
  { name: "Monika Y.Stiani", parentPhone: "6281234567906" },
  { name: "Natalia Nabit", parentPhone: "6281234567907" },
  { name: "Oktavianus Kasu", parentPhone: "6281234567908" },
  { name: "Reinaldus Jorsen", parentPhone: "6281234567909" },
  { name: "Sevrianus Areh", parentPhone: "6281234567910" },
  { name: "Simfronianus D. Agol", parentPhone: "6281234567911" },
  { name: "Vinsensius V.Jalar", parentPhone: "6281234567912" },
  { name: "Yoalita A.D. Jeneo", parentPhone: "6281234567913" },
  { name: "Yohanes Florentino", parentPhone: "6281234567914" },
  { name: "Yonesius Balsano", parentPhone: "6281234567915" }
];

const STATUS_OPTIONS = [
  { id: 'Hadir', label: 'Hadir', color: 'bg-emerald-500', icon: CheckCircle2 },
  { id: 'Izin', label: 'Izin', color: 'bg-amber-500', icon: Clock },
  { id: 'Sakit', label: 'Sakit', color: 'bg-blue-500', icon: AlertCircle },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginRole, setLoginRole] = useState<'guru' | 'siswa' | 'orangtua' | null>(null);
  const [activeTab, setActiveTab] = useState<'beranda' | 'laporan' | 'peraturan' | 'rekap'>('beranda');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 2, 1)); // Start at March 2026

  const [nama, setNama] = useState('');
  const [status, setStatus] = useState('Hadir');
  const [keterangan, setKeterangan] = useState('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/attendance');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecords();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (!isLoggedIn && !loginRole) {
      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
        }
      };
      startCamera();
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isLoggedIn, loginRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setLoginError('Username atau password salah');
      }
    } catch (error) {
      setLoginError('Terjadi kesalahan jaringan');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginRole(null);
    setUsername('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, status, keterangan }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Data berhasil disimpan dengan aman!' });
        setNama('');
        setKeterangan('');
        setStatus('Hadir');
        fetchRecords();
      } else {
        setMessage({ type: 'error', text: 'Gagal mengirim presensi.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderCalendar = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Empty slots for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }
    
    // Days of the month
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === 4 && month === 2 && year === 2026; // Today is March 4, 2026
      const hasAttendance = records.some(r => {
        const rDate = new Date(r.timestamp);
        return rDate.getDate() === d && rDate.getMonth() === month && rDate.getFullYear() === year;
      });

      days.push(
        <div 
          key={d} 
          className={`h-10 w-10 flex items-center justify-center rounded-full text-sm font-bold transition-all relative
            ${isToday ? 'bg-cokelat-tua text-white shadow-lg' : 'text-cokelat-tua hover:bg-krem'}
          `}
        >
          {d}
          {hasAttendance && !isToday && (
            <div className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full" />
          )}
        </div>
      );
    }
    
    return days;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-krem flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-cokelat-tua/10 overflow-hidden border border-white"
        >
          <AnimatePresence mode="wait">
            {!loginRole ? (
              <motion.div
                key="role-selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-10 space-y-8"
              >
                <div className="text-center">
                  <div className="flex flex-col items-center mb-4">
                    <img 
                      src={SCHOOL_LOGO_URL} 
                      alt="Logo SMAK SETIA BAKTI RUTENG" 
                      className="w-14 h-14 rounded-full border-2 border-cokelat-muda/20 mb-2 object-cover shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <h2 className="text-[10px] font-extrabold text-cokelat-muda uppercase tracking-[0.2em]">SMAK SETIA BAKTI RUTENG</h2>
                  </div>
                  <h1 className="text-3xl font-extrabold text-cokelat-tua mb-2">Pilih Peran</h1>
                  <p className="text-sm text-cokelat-muda font-medium">Silakan pilih peran Anda untuk masuk</p>
                </div>

                {/* Face Screen (Camera Preview) */}
                <div className="relative aspect-square w-full max-w-[240px] mx-auto rounded-full overflow-hidden border-4 border-cokelat-muda/20 shadow-inner bg-zinc-100 group">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-white/40 rounded-full animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-3/4 h-3/4 border-2 border-cokelat-muda/30 rounded-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white/50" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-cokelat-tua/80 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">Face Scan Ready</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => setLoginRole('guru')}
                    className="group flex items-center gap-4 p-5 rounded-2xl border-2 border-zinc-100 hover:border-cokelat-muda hover:bg-cokelat-muda/5 transition-all text-left"
                  >
                    <div className="w-12 h-12 bg-cokelat-tua rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-cokelat-tua/20">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-cokelat-tua">Masuk sebagai Guru</h3>
                      <p className="text-xs text-cokelat-muda font-medium">Akses dashboard & kelola data</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setLoginRole('siswa')}
                    className="group flex items-center gap-4 p-5 rounded-2xl border-2 border-zinc-100 hover:border-cokelat-muda hover:bg-cokelat-muda/5 transition-all text-left"
                  >
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-zinc-900/20">
                      <UserCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-cokelat-tua">Masuk sebagai Siswa</h3>
                      <p className="text-xs text-cokelat-muda font-medium">Isi presensi harian Anda</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setLoginRole('orangtua')}
                    className="group flex items-center gap-4 p-5 rounded-2xl border-2 border-zinc-100 hover:border-cokelat-muda hover:bg-cokelat-muda/5 transition-all text-left"
                  >
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-600/20">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-cokelat-tua">Masuk sebagai Orang Tua</h3>
                      <p className="text-xs text-cokelat-muda font-medium">Pantau kehadiran anak Anda</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="p-10 text-center border-b border-zinc-50 relative">
                  <button 
                    onClick={() => setLoginRole(null)}
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-xs font-bold text-cokelat-muda hover:text-cokelat-tua transition-colors uppercase tracking-widest"
                  >
                    Kembali
                  </button>
                  <div className="flex flex-col items-center mb-4">
                    <img 
                      src={SCHOOL_LOGO_URL} 
                      alt="Logo SMAK SETIA BAKTI RUTENG" 
                      className="w-10 h-10 rounded-full border border-cokelat-muda/20 mb-1 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <h2 className="text-[8px] font-extrabold text-cokelat-muda uppercase tracking-[0.2em]">SMAK SETIA BAKTI RUTENG</h2>
                  </div>
                  <div className="w-16 h-16 bg-cokelat-tua rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cokelat-tua/20">
                    {loginRole === 'guru' ? <GraduationCap className="w-8 h-8 text-white" /> : loginRole === 'siswa' ? <UserCircle className="w-8 h-8 text-white" /> : <Heart className="w-8 h-8 text-white" />}
                  </div>
                  <h1 className="text-3xl font-extrabold text-cokelat-tua mb-2">Login {loginRole === 'guru' ? 'Guru' : loginRole === 'siswa' ? 'Siswa' : 'Orang Tua'}</h1>
                  <p className="text-sm text-cokelat-muda font-medium">Silakan masukkan kredensial Anda</p>
                </div>

                <form onSubmit={handleLogin} className="p-10 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-cokelat-muda">Username</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Masukkan username..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-zinc-100 focus:ring-2 focus:ring-cokelat-muda focus:border-transparent outline-none transition-all bg-zinc-50 font-medium"
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cokelat-muda/50" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-cokelat-muda">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password..."
                        className="w-full pl-12 pr-4 py-4 rounded-2xl border border-zinc-100 focus:ring-2 focus:ring-cokelat-muda focus:border-transparent outline-none transition-all bg-zinc-50 font-medium"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cokelat-muda/50" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {loginError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold flex items-center gap-3 border border-rose-100"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {loginError}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full bg-cokelat-tua text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-cokelat-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-cokelat-tua/20 text-lg"
                  >
                    {isLoggingIn ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      "Masuk Sekarang"
                    )}
                  </button>

                  <div className="pt-4 text-center">
                    <p className="text-[10px] text-cokelat-muda/40 font-bold uppercase tracking-widest">
                      {loginRole === 'guru' || loginRole === 'siswa' ? 'Gunakan kredensial kelas XII C2 (absensi/123)' : 'Gunakan kredensial orang tua (ortu/123)'}
                    </p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-krem font-sans text-zinc-900 pb-12">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-cokelat-muda/20 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={SCHOOL_LOGO_URL} 
              alt="Logo SMAK SETIA BAKTI RUTENG" 
              className="w-8 h-8 rounded-full border border-cokelat-muda/20 object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="font-bold text-lg leading-tight text-cokelat-tua">Presensi XII C2</h1>
              <p className="text-[10px] text-cokelat-muda font-bold uppercase tracking-widest">SMAK SETIA BAKTI RUTENG</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-cokelat-muda">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50 transition-colors text-xs font-bold uppercase tracking-wider"
            >
              <LogOut className="w-3 h-3" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-cokelat-muda/10 sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'beranda', label: 'Beranda', icon: Home },
              { id: 'laporan', label: 'Laporan', icon: BarChart3 },
              { id: 'rekap', label: 'Rekap', icon: FileSpreadsheet },
              { id: 'peraturan', label: 'Peraturan', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-cokelat-tua text-cokelat-tua font-bold'
                    : 'border-transparent text-cokelat-muda/60 hover:text-cokelat-muda font-medium'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm uppercase tracking-wider">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'beranda' && (
            <motion.div
              key="beranda"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Form Section - Hidden for Parents */}
              {loginRole !== 'orangtua' && (
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-2xl shadow-xl shadow-cokelat-tua/5 overflow-hidden border border-white">
                    <div className="p-8 text-center border-b border-zinc-50">
                      <h2 className="font-extrabold text-2xl text-cokelat-tua mb-1">Presensi Siswa XII C2</h2>
                      <p className="text-sm text-cokelat-muda font-medium">Digitalisasi kehadiran yang akurat dan efisien.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                      {/* Nama Dropdown */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-cokelat-muda">Nama Lengkap</label>
                        <div className="relative">
                          <select
                            required
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            className="w-full appearance-none px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cokelat-muda focus:border-transparent outline-none transition-all bg-zinc-50 font-medium"
                          >
                            <option value="">Pilih Nama...</option>
                            {STUDENTS.map(s => (
                              <option key={s.name} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cokelat-muda pointer-events-none" />
                        </div>
                      </div>

                      {/* Status Radio Buttons */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-cokelat-muda">Status Kehadiran</label>
                        <div className="flex flex-wrap gap-4 pt-1">
                          {STATUS_OPTIONS.map((opt) => (
                            <label key={opt.id} className="flex items-center gap-2 cursor-pointer group">
                              <div className="relative flex items-center justify-center">
                                <input
                                  type="radio"
                                  name="status"
                                  value={opt.id}
                                  checked={status === opt.id}
                                  onChange={() => setStatus(opt.id)}
                                  className="peer appearance-none w-5 h-5 rounded-full border-2 border-zinc-200 checked:border-cokelat-muda transition-all cursor-pointer"
                                />
                                <div className="absolute w-2.5 h-2.5 rounded-full bg-cokelat-muda scale-0 peer-checked:scale-100 transition-transform" />
                              </div>
                              <span className={`text-sm font-semibold transition-colors ${status === opt.id ? 'text-cokelat-tua' : 'text-zinc-500 group-hover:text-cokelat-muda'}`}>
                                {opt.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Keterangan */}
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-cokelat-muda">Keterangan (Opsional)</label>
                        <textarea
                          value={keterangan}
                          onChange={(e) => setKeterangan(e.target.value)}
                          placeholder="Masukkan keterangan tambahan jika ada..."
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-cokelat-muda focus:border-transparent outline-none transition-all min-h-[80px] resize-none bg-zinc-50"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-cokelat-muda text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cokelat-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cokelat-muda/20"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Kirim Absensi
                          </>
                        )}
                      </button>

                      <AnimatePresence>
                        {message && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`p-4 rounded-xl text-sm font-bold flex items-center justify-center gap-3 ${
                              message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            {message.text}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </div>
                </div>
              )}

              {/* Parent Welcome Message */}
              {loginRole === 'orangtua' && (
                <div className="lg:col-span-12">
                  <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-900/10 mb-8 relative overflow-hidden">
                    <div className="relative z-10">
                      <h2 className="text-3xl font-black mb-2">Selamat Datang, Bapak/Ibu!</h2>
                      <p className="text-emerald-50/80 font-medium max-w-xl">
                        Terima kasih telah memantau kehadiran anak Anda di SMAK SETIA BAKTI RUTENG. 
                        Di sini Anda dapat melihat riwayat kehadiran harian secara transparan.
                      </p>
                    </div>
                    <Heart className="absolute -right-8 -bottom-8 w-48 h-48 text-emerald-500/20 rotate-12" />
                  </div>
                </div>
              )}

              {/* List Section */}
              <div className={loginRole === 'orangtua' ? "lg:col-span-12 space-y-6" : "lg:col-span-7 space-y-6"}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-cokelat-muda" />
                    <h2 className="font-bold text-lg text-cokelat-tua">Riwayat Kehadiran</h2>
                  </div>
                  <span className="text-[10px] font-extrabold text-cokelat-muda bg-white px-3 py-1.5 rounded-full border border-cokelat-muda/10 shadow-sm uppercase tracking-widest">
                    {records.length} Total Data
                  </span>
                </div>

                <div className="space-y-3">
                  {records.length === 0 ? (
                    <div className="bg-white/50 border-2 border-dashed border-cokelat-muda/20 rounded-2xl p-12 text-center">
                      <Users className="w-12 h-12 text-cokelat-muda/20 mx-auto mb-4" />
                      <p className="text-cokelat-muda/60 font-medium">Belum ada data presensi hari ini.</p>
                    </div>
                  ) : (
                    records.map((record, index) => (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={record.id}
                        className="bg-white border border-white p-4 rounded-2xl flex items-center gap-4 hover:shadow-xl hover:shadow-cokelat-tua/5 transition-all group shadow-sm"
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                          STATUS_OPTIONS.find(o => o.id === record.status)?.color || 'bg-zinc-200'
                        } text-white shadow-md`}>
                          {React.createElement(STATUS_OPTIONS.find(o => o.id === record.status)?.icon || UserCheck, { className: 'w-6 h-6' })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className="font-bold text-cokelat-tua truncate pr-4">{record.nama}</h3>
                            <span className="text-[10px] font-bold text-cokelat-muda whitespace-nowrap bg-krem px-2 py-0.5 rounded">{formatDate(record.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold text-cokelat-muda uppercase tracking-widest opacity-60">{record.kelas}</span>
                            {record.keterangan && (
                              <>
                                <span className="text-cokelat-muda/20">•</span>
                                <p className="text-xs text-cokelat-muda/70 truncate italic font-medium">"{record.keterangan}"</p>
                              </>
                            )}
                          </div>
                        </div>
                        {loginRole === 'guru' && (
                          <button
                            onClick={() => {
                              const student = STUDENTS.find(s => s.name === record.nama);
                              if (student) {
                                const message = `Halo Bapak/Ibu, kami dari SMAK SETIA BAKTI RUTENG menginformasikan bahwa ${record.nama} hari ini berstatus: ${record.status}${record.keterangan ? ` (Ket: ${record.keterangan})` : ''}. Terima kasih.`;
                                window.open(`https://wa.me/${student.parentPhone}?text=${encodeURIComponent(message)}`, '_blank');
                              }
                            }}
                            className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-colors shadow-sm border border-emerald-100"
                            title="Hubungi Orang Tua"
                          >
                            <MessageCircle className="w-5 h-5" />
                          </button>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'laporan' && (
            <motion.div
              key="laporan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Stats */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                      { label: 'Hadir', count: records.filter(r => r.status === 'Hadir').length, color: 'bg-emerald-500', icon: CheckCircle2 },
                      { label: 'Izin', count: records.filter(r => r.status === 'Izin').length, color: 'bg-amber-500', icon: Clock },
                      { label: 'Sakit', count: records.filter(r => r.status === 'Sakit').length, color: 'bg-blue-500', icon: AlertCircle },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white p-6 rounded-3xl border border-white shadow-xl shadow-cokelat-tua/5 flex flex-col items-center text-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-cokelat-muda uppercase tracking-widest mb-1">{stat.label}</p>
                          <h3 className="text-2xl font-black text-cokelat-tua">{stat.count}</h3>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-3xl border border-white shadow-xl shadow-cokelat-tua/5 p-8">
                    <h3 className="font-bold text-lg text-cokelat-tua mb-6 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-cokelat-muda" />
                      Statistik Kehadiran
                    </h3>
                    <div className="space-y-6">
                      {['Hadir', 'Izin', 'Sakit'].map(status => {
                        const count = records.filter(r => r.status === status).length;
                        const percentage = records.length > 0 ? (count / records.length) * 100 : 0;
                        return (
                          <div key={status} className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                              <span className="text-cokelat-tua">{status}</span>
                              <span className="text-cokelat-muda">{count} Siswa ({Math.round(percentage)}%)</span>
                            </div>
                            <div className="h-3 bg-zinc-100 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                className={`h-full ${STATUS_OPTIONS.find(o => o.id === status)?.color}`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Calendar */}
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-3xl border border-white shadow-xl shadow-cokelat-tua/5 overflow-hidden">
                    <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
                      <h3 className="font-bold text-cokelat-tua flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-cokelat-muda" />
                        Kalender 2026
                      </h3>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1))}
                          className="p-1.5 rounded-lg hover:bg-krem text-cokelat-muda transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-cokelat-tua uppercase tracking-widest min-w-[100px] text-center">
                          {currentCalendarDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        </span>
                        <button 
                          onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1))}
                          className="p-1.5 rounded-lg hover:bg-krem text-cokelat-muda transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-7 gap-1 mb-4">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                          <div key={day} className="text-[10px] font-bold text-cokelat-muda/40 uppercase tracking-widest text-center">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1 justify-items-center">
                        {renderCalendar()}
                      </div>
                      <div className="mt-6 pt-6 border-t border-zinc-50">
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-cokelat-muda/60">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-cokelat-tua" />
                            Hari Ini
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            Ada Presensi
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'rekap' && (
            <motion.div
              key="rekap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-cokelat-tua">Rekapitulasi Absensi</h2>
                  <p className="text-sm text-cokelat-muda font-medium">Ringkasan kehadiran seluruh siswa kelas XII C2.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-cokelat-muda/20 text-cokelat-tua font-bold text-xs uppercase tracking-widest hover:bg-krem transition-all shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    Cetak
                  </button>
                  <button 
                    onClick={() => {
                      const headers = ['Nama', 'Hadir', 'Izin', 'Sakit', 'Total'];
                      const data = STUDENTS.map(s => {
                        const sRecords = records.filter(r => r.nama === s.name);
                        return [
                          s.name,
                          sRecords.filter(r => r.status === 'Hadir').length,
                          sRecords.filter(r => r.status === 'Izin').length,
                          sRecords.filter(r => r.status === 'Sakit').length,
                          sRecords.length
                        ];
                      });
                      const csvContent = [headers, ...data].map(e => e.join(",")).join("\n");
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement("a");
                      const url = URL.createObjectURL(blob);
                      link.setAttribute("href", url);
                      link.setAttribute("download", `rekap_absensi_XII_C2_${new Date().toLocaleDateString()}.csv`);
                      link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cokelat-tua text-white font-bold text-xs uppercase tracking-widest hover:bg-cokelat-hover transition-all shadow-lg shadow-cokelat-tua/20"
                  >
                    <Download className="w-4 h-4" />
                    Unduh CSV
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-white shadow-xl shadow-cokelat-tua/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-100">
                        <th className="px-6 py-4 text-[10px] font-black text-cokelat-muda uppercase tracking-[0.2em]">Nama Siswa</th>
                        <th className="px-6 py-4 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] text-center">Hadir</th>
                        <th className="px-6 py-4 text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] text-center">Izin</th>
                        <th className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] text-center">Sakit</th>
                        <th className="px-6 py-4 text-[10px] font-black text-cokelat-tua uppercase tracking-[0.2em] text-center">Total</th>
                        <th className="px-6 py-4 text-[10px] font-black text-cokelat-muda uppercase tracking-[0.2em] text-center">Persentase</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {STUDENTS.map((student) => {
                        const studentRecords = records.filter(r => r.nama === student.name);
                        const hadir = studentRecords.filter(r => r.status === 'Hadir').length;
                        const izin = studentRecords.filter(r => r.status === 'Izin').length;
                        const sakit = studentRecords.filter(r => r.status === 'Sakit').length;
                        const total = studentRecords.length;
                        const percentage = total > 0 ? Math.round((hadir / total) * 100) : 0;

                        return (
                          <tr key={student.name} className="hover:bg-zinc-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-krem flex items-center justify-center text-cokelat-tua font-bold text-xs">
                                  {student.name.charAt(0)}
                                </div>
                                <span className="font-bold text-cokelat-tua text-sm">{student.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center font-bold text-emerald-600 text-sm">{hadir}</td>
                            <td className="px-6 py-4 text-center font-bold text-amber-600 text-sm">{izin}</td>
                            <td className="px-6 py-4 text-center font-bold text-blue-600 text-sm">{sakit}</td>
                            <td className="px-6 py-4 text-center font-bold text-cokelat-tua text-sm">{total}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3 justify-center">
                                <div className="flex-1 h-1.5 w-16 bg-zinc-100 rounded-full overflow-hidden hidden sm:block">
                                  <div 
                                    className="h-full bg-emerald-500 rounded-full" 
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                                <span className="text-xs font-black text-cokelat-muda">{percentage}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-krem/30 rounded-2xl p-6 border border-cokelat-muda/10">
                <div className="flex gap-4">
                  <Info className="w-5 h-5 text-cokelat-muda shrink-0 mt-0.5" />
                  <p className="text-xs text-cokelat-muda font-medium leading-relaxed">
                    Data rekapitulasi ini dihitung berdasarkan seluruh riwayat presensi yang tersimpan dalam sistem. 
                    Gunakan tombol <strong>Unduh CSV</strong> untuk mengolah data lebih lanjut menggunakan Microsoft Excel atau Google Sheets.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'peraturan' && (
            <motion.div
              key="peraturan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="bg-white rounded-3xl border border-white shadow-xl shadow-cokelat-tua/5 overflow-hidden">
                <div className="bg-cokelat-tua p-8 text-white">
                  <h3 className="text-2xl font-black mb-2 flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8" />
                    Tata Tertib Presensi
                  </h3>
                  <p className="text-white/70 text-sm font-medium">SMAK SETIA BAKTI RUTENG - KELAS XII C2</p>
                </div>
                <div className="p-8 space-y-6">
                  {[
                    { title: 'Ketepatan Waktu', desc: 'Siswa wajib melakukan presensi sebelum jam pelajaran dimulai (Pukul 07.00 WITA).' },
                    { title: 'Status Izin', desc: 'Izin hanya diberikan untuk alasan yang mendesak dan wajib menyertakan keterangan yang jelas.' },
                    { title: 'Status Sakit', desc: 'Siswa yang sakit wajib memberikan informasi melalui wali kelas atau guru piket.' },
                    { title: 'Kejujuran', desc: 'Setiap siswa wajib melakukan presensi atas namanya sendiri. Kecurangan akan dikenakan sanksi.' },
                  ].map((rule, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-krem flex items-center justify-center shrink-0 text-cokelat-tua font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-cokelat-tua mb-1">{rule.title}</h4>
                        <p className="text-sm text-cokelat-muda leading-relaxed">{rule.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-zinc-50 p-6 flex items-start gap-4 border-t border-zinc-100">
                  <Info className="w-5 h-5 text-cokelat-muda shrink-0 mt-0.5" />
                  <p className="text-xs text-cokelat-muda font-medium leading-relaxed">
                    Peraturan ini dibuat untuk meningkatkan kedisiplinan dan ketertiban di lingkungan sekolah. 
                    Harap dipatuhi demi kelancaran proses belajar mengajar.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-12 border-t border-cokelat-muda/10 mt-12 text-center">
        <p className="text-xs text-cokelat-muda font-bold uppercase tracking-[0.2em] mb-2">Sistem Absensi XII C2</p>
        <p className="text-[10px] text-cokelat-muda/40 font-medium">© {new Date().getFullYear()} Digitalisasi Kehadiran yang Akurat dan Efisien.</p>
      </footer>
    </div>
  );
}

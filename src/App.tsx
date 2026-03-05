import React, { useState, useEffect } from 'react';
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
  LogOut,
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
  const [loginRole, setLoginRole] = useState<'guru' | 'siswa' | 'orangtua' | null>(null);
  const [activeTab, setActiveTab] = useState<'beranda' | 'laporan' | 'peraturan' | 'rekap'>('beranda');
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 2, 1)); // Start at March 2026

  const [nama, setNama] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [status, setStatus] = useState('Hadir');
  const [keterangan, setKeterangan] = useState('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/attendance');
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Failed to fetch records:', error);
      setMessage({ type: 'error', text: 'Gagal memuat riwayat kehadiran.' });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecords();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginRole(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama) {
      setMessage({ type: 'error', text: 'Silakan pilih nama Anda terlebih dahulu.' });
      return;
    }

    if (loginRole === 'orangtua') {
      setMessage({ type: 'error', text: 'Orang tua hanya memiliki akses untuk melihat laporan.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      // Check for duplicate today
      const today = new Date().toISOString().split('T')[0];
      const isDuplicate = records.some(r => {
        const rDate = new Date(r.timestamp).toISOString().split('T')[0];
        return r.nama === nama && rDate === today;
      });

      if (isDuplicate) {
        setMessage({ type: 'info', text: `Absensi untuk ${nama} sudah dikirim hari ini.` });
        return;
      }

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, status, keterangan }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Data berhasil disimpan dengan aman!' });
        setNama('');
        setKeterangan('');
        setStatus('Hadir');
        fetchRecords();
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal mengirim presensi.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan. Periksa koneksi internet Anda.' });
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
      const today = new Date();
      const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
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
          <div className="p-10 space-y-8">
            <div className="text-center">
              <div className="flex flex-col items-center mb-4">
                <img 
                  src={SCHOOL_LOGO_URL} 
                  alt="Logo SMAK SETIA BAKTI RUTENG" 
                  className="w-20 h-20 rounded-full border-2 border-cokelat-muda/20 mb-2 object-cover shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <h2 className="text-[12px] font-extrabold text-cokelat-muda uppercase tracking-[0.2em]">SMAK SETIA BAKTI RUTENG</h2>
              </div>
              <h1 className="text-3xl font-extrabold text-cokelat-tua mb-2">Pilih Peran</h1>
              <p className="text-sm text-cokelat-muda font-medium">Silakan pilih peran Anda untuk masuk</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => {
                  setLoginRole('guru');
                  setIsLoggedIn(true);
                }}
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
                onClick={() => {
                  setLoginRole('siswa');
                  setIsLoggedIn(true);
                }}
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
                onClick={() => {
                  setLoginRole('orangtua');
                  setIsLoggedIn(true);
                }}
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
          </div>
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
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cokelat-muda/10 border border-cokelat-muda/20">
              <div className={`w-2 h-2 rounded-full ${
                loginRole === 'guru' ? 'bg-cokelat-tua' : 
                loginRole === 'siswa' ? 'bg-zinc-900' : 'bg-emerald-600'
              }`} />
              <span className="text-[10px] font-black text-cokelat-tua uppercase tracking-widest">
                {loginRole === 'guru' ? 'Guru' : loginRole === 'siswa' ? 'Siswa' : 'Orang Tua'}
              </span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-cokelat-muda">
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
                    
                    <form onSubmit={handleSubmit} className="p-8 space-y-6" aria-label="Formulir Presensi Siswa">
                      {/* Nama Dropdown with Search */}
                      <div className="space-y-2">
                        <label id="label-nama" className="text-xs font-bold uppercase tracking-wider text-cokelat-muda">Nama Lengkap</label>
                        <div className="relative">
                          <div 
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all font-medium ${!nama && message?.type === 'error' ? 'border-rose-500 bg-rose-50' : 'border-zinc-200 bg-zinc-50'} focus-within:ring-2 focus-within:ring-cokelat-muda focus-within:border-transparent`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            role="combobox"
                            aria-expanded={isDropdownOpen}
                            aria-haspopup="listbox"
                            aria-labelledby="label-nama"
                          >
                            <span className={nama ? 'text-cokelat-tua' : 'text-cokelat-muda/50'}>
                              {nama || 'Cari atau pilih nama...'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-cokelat-muda transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                          </div>

                          <AnimatePresence>
                            {isDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-zinc-100 overflow-hidden"
                              >
                                <div className="p-2 border-b border-zinc-50">
                                  <input
                                    autoFocus
                                    type="text"
                                    placeholder="Ketik nama untuk mencari..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-100 focus:outline-none focus:ring-1 focus:ring-cokelat-muda bg-zinc-50"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </div>
                                <div className="max-h-60 overflow-y-auto no-scrollbar" role="listbox">
                                  {STUDENTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 ? (
                                    <div className="p-4 text-center text-xs text-cokelat-muda italic">Nama tidak ditemukan</div>
                                  ) : (
                                    STUDENTS.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                                      <div
                                        key={s.name}
                                        onClick={() => {
                                          setNama(s.name);
                                          setIsDropdownOpen(false);
                                          setSearchTerm('');
                                        }}
                                        role="option"
                                        aria-selected={nama === s.name}
                                        className={`px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-krem ${nama === s.name ? 'bg-cokelat-muda/10 text-cokelat-tua font-bold' : 'text-cokelat-muda'}`}
                                      >
                                        {s.name}
                                      </div>
                                    ))
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        {isDropdownOpen && <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />}
                      </div>

                      {/* Status Radio Buttons */}
                      <div className="space-y-2" role="radiogroup" aria-labelledby="label-status">
                        <label id="label-status" className="text-xs font-bold uppercase tracking-wider text-cokelat-muda">Status Kehadiran</label>
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
                                  className="peer appearance-none w-5 h-5 rounded-full border-2 border-zinc-200 checked:border-cokelat-muda transition-all cursor-pointer focus:ring-2 focus:ring-cokelat-muda focus:ring-offset-2"
                                  aria-label={opt.label}
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
                              message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 
                              message.type === 'info' ? 'bg-blue-50 text-blue-700' : 
                              'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : message.type === 'info' ? <Info className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
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
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-2xl shadow-xl shadow-cokelat-tua/5 overflow-hidden border border-white p-8 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-black text-cokelat-tua">Mode Pantau</h2>
                    <p className="text-sm text-cokelat-muda font-medium leading-relaxed">
                      Anda masuk sebagai <strong>Orang Tua</strong>. Dalam mode ini, Anda dapat memantau riwayat kehadiran anak Anda secara langsung.
                    </p>
                    <div className="bg-emerald-50 p-4 rounded-xl flex gap-3 items-start">
                      <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-emerald-700 font-bold leading-relaxed">
                        Formulir pengiriman absensi dinonaktifkan untuk peran Orang Tua demi keamanan data.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* List Section */}
              <div className={loginRole === 'orangtua' ? "lg:col-span-7 space-y-6" : "lg:col-span-7 space-y-6"}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5 text-cokelat-muda" />
                    <h2 className="font-bold text-lg text-cokelat-tua">Riwayat Kehadiran</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={fetchRecords}
                      disabled={isSubmitting}
                      className="p-1.5 rounded-lg hover:bg-white text-cokelat-muda transition-all disabled:opacity-50"
                      title="Segarkan Data"
                      aria-label="Segarkan Riwayat Kehadiran"
                    >
                      <Loader2 className={`w-4 h-4 ${isSubmitting ? 'animate-spin' : ''}`} />
                    </button>
                    <span className="text-[10px] font-extrabold text-cokelat-muda bg-white px-3 py-1.5 rounded-full border border-cokelat-muda/10 shadow-sm uppercase tracking-widest">
                      {records.length} Total Data
                    </span>
                  </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" role="region" aria-label="Ringkasan Statistik">
                    {[
                      { label: 'Hadir', count: records.filter(r => r.status === 'Hadir').length, color: 'bg-emerald-500', icon: CheckCircle2 },
                      { label: 'Izin', count: records.filter(r => r.status === 'Izin').length, color: 'bg-amber-500', icon: Clock },
                      { label: 'Sakit', count: records.filter(r => r.status === 'Sakit').length, color: 'bg-blue-500', icon: AlertCircle },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-white p-6 rounded-3xl border border-white shadow-xl shadow-cokelat-tua/5 flex flex-col items-center text-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg`} aria-hidden="true">
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-cokelat-muda uppercase tracking-widest mb-1">{stat.label}</p>
                          <h3 className="text-2xl font-black text-cokelat-tua" aria-label={`${stat.count} siswa ${stat.label}`}>{stat.count}</h3>
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
                  <table className="w-full text-left border-collapse" aria-label="Tabel Rekapitulasi Absensi Siswa">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-100">
                        <th scope="col" className="px-6 py-4 text-[10px] font-black text-cokelat-muda uppercase tracking-[0.2em]">Nama Siswa</th>
                        <th scope="col" className="px-6 py-4 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] text-center">Hadir</th>
                        <th scope="col" className="px-6 py-4 text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] text-center">Izin</th>
                        <th scope="col" className="px-6 py-4 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] text-center">Sakit</th>
                        <th scope="col" className="px-6 py-4 text-[10px] font-black text-cokelat-tua uppercase tracking-[0.2em] text-center">Total</th>
                        <th scope="col" className="px-6 py-4 text-[10px] font-black text-cokelat-muda uppercase tracking-[0.2em] text-center">Persentase</th>
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

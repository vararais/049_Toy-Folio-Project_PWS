import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Key, Terminal } from 'lucide-react'; 

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('user');
    const [apiKey, setApiKey] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));

        if (!token || !userData) {
            alert('Sesi habis, login lagi ya!');
            navigate('/');
            return;
        }

        setUser(userData);
        setRole(userData.role);
        if (userData.api_key) setApiKey(userData.api_key);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleCopy = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            alert('✅ API Key berhasil disalin!');
        }
    };

    const handleBuyPlan = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:3000/api/auth/buy-plan', {}, { headers: { 'Authorization': `Bearer ${token}` } });
            
            const updatedUser = { ...user, api_key: res.data.api_key };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setApiKey(res.data.api_key);
            alert('✅ Upgrade Berhasil! Anda sekarang Premium.');
        } catch (error) { alert('Gagal transaksi.'); }
    };

    // === TAMPILAN ADMIN (BOS) ===
    if (role === 'admin') {
        return (
            <div className="container mt-5 text-center">
                <div className="card shadow-lg border-danger p-5">
                    <h1 className="display-4">👑 ADMIN PANEL</h1>
                    <p className="lead">Halo Bos <b>{user?.nama}</b>, selamat bekerja.</p>
                    <div className="mt-4">
                        <button onClick={() => navigate('/admin')} className="btn btn-danger btn-lg me-3">🛠️ Masuk Dashboard Admin</button>
                        <button onClick={handleLogout} className="btn btn-outline-secondary btn-lg">Logout</button>
                    </div>
                </div>
            </div>
        );
    }

    // === TAMPILAN USER BIASA (MEMBER) ===
    return (
        <div className="container mt-5 mb-5">
            {/* HEADER */}
            <div className="d-flex justify-content-between mb-4">
                <h2>👋 Halo, {user?.nama}!</h2>
                <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
            </div>

            {/* 1. KARTU STATUS MEMBER (UTAMA) */}
            <div className="card shadow-sm text-center p-5 mb-5">
                {apiKey ? (
                    <div>
                        <h1 className="text-primary display-4 fw-bold">💎 MEMBER PREMIUM</h1>
                        <p className="text-muted">API Key Anda:</p>
                        
                        <div className="alert alert-secondary d-inline-block fw-bold font-monospace user-select-all px-4 py-2 border-primary">
                            {apiKey}
                        </div>
                        
                        <div className="d-flex gap-2 justify-content-center mt-4">
                            <button className="btn btn-outline-secondary d-flex align-items-center gap-2" onClick={handleCopy}>
                                <Key size={18}/> Copy Key
                            </button>
                            <button className="btn btn-success fw-bold px-4 d-flex align-items-center gap-2" onClick={() => navigate('/docs')}>
                                <Terminal size={18}/> TEST API SEKARANG &rarr;
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1>🔒 Akun Gratis</h1>
                        <p className="text-muted">Beli akses untuk mendapatkan data katalog HotWheels kami.</p>
                        <button onClick={handleBuyPlan} className="btn btn-primary btn-lg mt-3">
                            ⚡ Beli Akses API (Gratis)
                        </button>
                    </div>
                )}
            </div>

            {/* 2. SECTION TUTORIAL (PANDUAN) */}
            <div>
                <h3 className="mb-4 fw-bold">📚 Panduan Penggunaan API</h3>
                <div className="row g-4">
                    {/* Step 1: Beli */}
                    <div className="col-md-4">
                        <div className="card h-100 p-4 border-0 shadow-sm">
                            <div className="mb-3 text-primary">
                                <ShoppingCart size={40} />
                            </div>
                            <h5>1. Beli Akses</h5>
                            <p className="text-muted small">
                                Klik tombol <b>"Beli Akses API"</b> di atas. Sistem otomatis meng-generate <b>API Key</b> unik dan memberikan kuota 1000 hits untuk akun Anda.
                            </p>
                        </div>
                    </div>

                    {/* Step 2: Salin Key */}
                    <div className="col-md-4">
                        <div className="card h-100 p-4 border-0 shadow-sm">
                            <div className="mb-3 text-primary">
                                <Key size={40} />
                            </div>
                            <h5>2. Salin Kunci</h5>
                            <p className="text-muted small">
                                Klik <b>"Copy Key"</b> untuk menyalin kode rahasia. Jangan berikan kode ini ke orang lain! Ini adalah tiket Anda untuk mengambil data.
                            </p>
                        </div>
                    </div>

                    {/* Step 3: Integrasi Luar (UPDATED) */}
                    <div className="col-md-4">
                        <div className="card h-100 p-4 border-0 shadow-sm">
                            <div className="mb-3 text-primary">
                                <Terminal size={40} />
                            </div>
                            <h5>3. Integrasi Luar</h5>
                            <p className="text-muted small">
                                Gunakan di <b>Postman</b> atau <b>Aplikasi Anda</b>.<br/>
                                <hr className="my-2"/>
                                Endpoint: <code className="bg-light p-1 rounded">GET /api/catalog</code><br/>
                                Header Wajib: <br/>
                                <code className="bg-light p-1 rounded">x-api-key: [Key-Anda]</code>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
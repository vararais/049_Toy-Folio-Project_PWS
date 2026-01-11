import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

    // FUNGSI COPY + POP UP ALERT
    const handleCopy = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            alert('✅ API Key berhasil disalin ke clipboard!');
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

    // TAMPILAN ADMIN
    if (role === 'admin') {
        return (
            <div className="container mt-5 text-center">
                <div className="card shadow-lg border-danger p-5">
                    <h1 className="display-4">ADMIN PANEL</h1>
                    <p className="lead">Halo Admin <b>{user?.nama}</b>, selamat bekerja.</p>
                    <div className="mt-4">
                        <button onClick={() => navigate('/admin')} className="btn btn-danger btn-lg me-3">🛠️ Masuk Dashboard Admin</button>
                        <button onClick={handleLogout} className="btn btn-outline-secondary btn-lg">Logout</button>
                    </div>
                </div>
            </div>
        );
    }

    // TAMPILAN USER BIASA (Ada Tombol Copy)
    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between mb-4">
                <h2>👋 Halo, {user?.nama}!</h2>
                <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
            </div>
            <div className="card shadow-sm text-center p-5">
                {apiKey ? (
                    <div>
                        <h1 className="text-success display-4">💎 MEMBER PREMIUM</h1>
                        <p>API Key Anda:</p>
                        
                        {/* API Key Box */}
                        <div className="alert alert-secondary d-inline-block fw-bold font-monospace user-select-all">
                            {apiKey}
                        </div>
                        
                        {/* TOMBOL AKSI (Copy & Test) */}
                        <div className="d-flex gap-2 justify-content-center mt-4">
                            <button className="btn btn-outline-primary" onClick={handleCopy}>
                                📋 Copy Key
                            </button>
                            <button className="btn btn-success fw-bold px-4" onClick={() => navigate('/docs')}>
                                🚀 Test API Sekarang &rarr;
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1>🔒 Akun Gratis</h1>
                        <p>Beli akses untuk mendapatkan data katalog.</p>
                        <button onClick={handleBuyPlan} className="btn btn-primary btn-lg">⚡ Beli Akses API (Gratis)</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
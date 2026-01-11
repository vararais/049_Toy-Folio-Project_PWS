import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/auth/register', { nama_lengkap: nama, email, password });
            alert('✅ Pendaftaran Berhasil!');
            navigate('/');
        } catch (error) {
            alert('❌ Gagal Daftar! Email mungkin sudah dipakai.');
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow p-4" style={{width: '400px'}}>
                <h3 className="text-center mb-4">Daftar Akun Baru</h3>
                <form onSubmit={handleRegister}>
                    <div className="mb-3"><label>Nama Lengkap</label><input type="text" className="form-control" value={nama} onChange={e => setNama(e.target.value)} required /></div>
                    <div className="mb-3"><label>Email</label><input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                    <div className="mb-3"><label>Password</label>
                        <div className="input-group">
                            <input type={showPassword ? "text" : "password"} className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success w-100">Daftar Sekarang</button>
                </form>
                <div className="text-center mt-3">
                    <small>Sudah punya akun? <span className="text-primary fw-bold" style={{cursor: 'pointer'}} onClick={() => navigate('/')}>Login di sini</span></small>
                </div>
            </div>
        </div>
    );
};

export default Register;
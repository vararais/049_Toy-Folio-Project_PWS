import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            alert(`Selamat datang, ${res.data.user.nama}!`);
            navigate('/dashboard');
        } catch (err) {
            alert('Login Gagal: Cek Email/Password');
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow p-4" style={{width: '400px'}}>
                <h2 className="text-center mb-4">Login ToyFolio</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <input type={showPassword ? "text" : "password"} className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                            <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">MASUK</button>
                </form>
                <div className="text-center mt-3">
                    <small>Belum punya akun? <span className="text-primary fw-bold" style={{cursor: 'pointer'}} onClick={() => navigate('/register')}>Daftar di sini</span></small>
                </div>
            </div>
        </div>
    );
};

export default Login;
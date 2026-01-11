import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [users, setUsers] = useState([]);
    
    // Form State
    const [formData, setFormData] = useState({ 
        item_name: '', price: '', year: '', condition: 'Mint', description: '' 
    });

    useEffect(() => { fetchUsers(); }, []);
    
    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:3000/api/admin/users');
            setUsers(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/admin/add', formData);
            alert('✅ Barang Masuk!');
            setFormData({ item_name: '', price: '', year: '', condition: 'Mint', description: '' });
        } catch (error) { alert('❌ Gagal Simpan!'); }
    };

    return (
        <div className="d-flex" style={{ minHeight: '100vh' }}>
            {/* SIDEBAR */}
            <div className="bg-dark text-white p-3 d-flex flex-column" style={{ width: '280px', minHeight: '100vh' }}>
                <h4 className="mb-4 text-center">👑 Admin</h4>
                <ul className="nav nav-pills flex-column mb-auto">
                    <li className="nav-item mb-2">
                        <button className={`nav-link w-100 text-start ${activeTab === 'dashboard' ? 'active' : 'text-white'}`} onClick={() => setActiveTab('dashboard')}>
                            📊 Monitoring User
                        </button>
                    </li>
                    <li className="nav-item mb-2">
                        <button className={`nav-link w-100 text-start ${activeTab === 'inventory' ? 'active' : 'text-white'}`} onClick={() => setActiveTab('inventory')}>
                            📦 Input Barang
                        </button>
                    </li>
                </ul>
                <hr/>
                <button onClick={() => navigate('/dashboard')} className="btn btn-outline-light w-100">⬅️ Kembali</button>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-grow-1 p-5 bg-light" style={{ overflowY: 'auto' }}>
                
                {/* TAB 1: MONITORING USER */}
                {activeTab === 'dashboard' && (
                    <div className="animate-fade-in">
                        <h2 className="mb-4">Daftar Member & Kunci Akses</h2>
                        <div className="card shadow border-0">
                            <div className="card-body p-0">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="p-3">Nama User</th>
                                            <th className="p-3">Email</th>
                                            <th className="p-3">API Key (User Token)</th> {/* <--- KOLOM TAMBAHAN */}
                                            <th className="p-3">Status</th>                {/* <--- STATUS TETAP ADA */}
                                            <th className="p-3 text-center">Sisa Kuota</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(u => (
                                            <tr key={u.user_id}>
                                                <td className="p-3 fw-bold">{u.nama_lengkap}</td>
                                                <td className="p-3">{u.email}</td>
                                                
                                                {/* DATA API KEY (Font Hacker) */}
                                                <td className="p-3">
                                                    {u.api_key ? (
                                                        <code className="text-primary fw-bold" style={{ fontSize: '0.9em' }}>
                                                            {u.api_key}
                                                        </code>
                                                    ) : (
                                                        <span className="text-muted small">-</span>
                                                    )}
                                                </td>

                                                {/* STATUS (Premium/Free) */}
                                                <td className="p-3">
                                                    {u.api_key ? 
                                                        <span className="badge bg-success">Premium</span> : 
                                                        <span className="badge bg-secondary">Free</span>
                                                    }
                                                </td>

                                                {/* KUOTA */}
                                                <td className="p-3 text-center fw-bold">
                                                    {u.api_key ? u.credits : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: INPUT BARANG (TETAP SAMA) */}
                {activeTab === 'inventory' && (
                    <div className="animate-fade-in">
                        <h2 className="mb-4">Tambah Stok Gudang</h2>
                        <div className="card shadow border-0">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="row mb-3">
                                        <div className="col"><label>Nama Barang</label><input type="text" className="form-control" value={formData.item_name} onChange={e => setFormData({...formData, item_name: e.target.value})} required/></div>
                                        <div className="col"><label>Harga</label><input type="number" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required/></div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col"><label>Tahun</label><input type="number" className="form-control" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required/></div>
                                        <div className="col"><label>Kondisi</label><select className="form-select" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}><option value="Mint">Mint</option><option value="Loose">Loose</option></select></div>
                                    </div>
                                    <div className="mb-3"><label>Deskripsi</label><textarea className="form-control" rows="2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea></div>
                                    <button type="submit" className="btn btn-primary px-5">💾 SIMPAN DATA</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
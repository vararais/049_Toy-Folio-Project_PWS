import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ApiDocs = () => {
    const [apiKey, setApiKey] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleTestApi = async () => {
        setLoading(true); setError(''); setResult(null);
        try {
            const response = await axios.get('http://localhost:3000/api/catalog', { headers: { 'x-api-key': apiKey } });
            setResult(response.data);
        } catch (err) { setError(err.response?.data?.error || 'Error Jaringan'); } 
        finally { setLoading(false); }
    };

    return (
        <div className="container mt-5">
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline-secondary mb-4 d-flex align-items-center gap-2">
                <ArrowLeft size={18}/> Kembali
            </button>
            
            <div className="row">
                {/* KOLOM KIRI: INPUT */}
                <div className="col-md-5">
                    <div className="card shadow-sm p-3">
                        <label className="fw-bold">API Key</label>
                        <input type="text" className="form-control mb-3" placeholder="toy-sk-..." value={apiKey} onChange={e => setApiKey(e.target.value)}/>
                        <button onClick={handleTestApi} className="btn btn-primary w-100" disabled={loading}>
                            {loading ? '...' : '🚀 Test GET Data'}
                        </button>
                    </div>
                </div>

                {/* KOLOM KANAN: OUTPUT (Ada Badge 200 OK) */}
                <div className="col-md-7">
                    <div className="card bg-dark text-white h-100">
                        {/* HEADER KOTAK HITAM */}
                        <div className="card-header border-secondary d-flex justify-content-between align-items-center">
                            <span>🖥️ Terminal Output (JSON)</span>
                            {/* LOGIKA BADGE HIJAU */}
                            {result && <span className="badge bg-success">Status: 200 OK</span>}
                        </div>

                        {/* BODY KOTAK HITAM */}
                        <div className="card-body font-monospace" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {result ? (
                                <pre className="m-0">{JSON.stringify(result, null, 2)}</pre>
                            ) : error ? (
                                <div className="text-danger">❌ {error}</div>
                            ) : (
                                <div className="text-muted">Menunggu Request...</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiDocs;
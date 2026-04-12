import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Ticket } from 'lucide-react';

const Success = () => {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '100px 24px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.5s ease-in-out' }}>
            <CheckCircle size={80} color="var(--primary)" style={{ marginBottom: '24px' }} />
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)' }}>Успішно оплачено!</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '40px', maxWidth: '400px' }}>
                Ваші квитки успішно оформлено. Дякуємо, що обрали <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>NyaRail</span>!
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button 
                    onClick={() => navigate('/')}
                    style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', background: 'var(--card-bg)', border: '2px solid var(--border)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-main)' }}
                >
                    <Home size={18} /> На головну
                </button>
                <button 
                    onClick={() => navigate('/my-tickets')}
                    style={{ padding: '12px 24px', borderRadius: 'var(--radius-md)', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                >
                    <Ticket size={18} /> Мої квитки
                </button>
            </div>
        </div>
    );
};

export default Success;

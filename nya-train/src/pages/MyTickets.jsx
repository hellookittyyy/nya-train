import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, ArrowLeft, Cat } from 'lucide-react';
import { BookingService } from '../services/BookingService';
import { trains } from '../data/trains';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        BookingService.getAllBookings().then(data => {

            const mapped = data.map(t => {
                const trainDetails = trains.find(train => train.id === t.trainId) || 
                                     { route: { from: '?', to: '?' }, number: '???', departure: t.date };
                return { ...t, trainDetails };
            });

            setTickets(mapped.reverse());
        });
    }, []);

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px', minHeight: '100vh' }}>
            <button 
                onClick={() => navigate('/')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '32px', cursor: 'pointer', fontSize: '1rem', padding: 0 }}
            >
                <ArrowLeft size={20} /> На головну
            </button>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-main)' }}>
                <Ticket size={40} color="var(--primary)" /> Мої квитки
            </h1>

            {tickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <Cat size={64} color="var(--border)" style={{ marginBottom: '16px', display: 'inline-block' }} />
                    <h2 style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>Ви ще не забронювали жодного квитка</h2>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {tickets.map(ticket => (
                        <div key={ticket.id} style={{ background: 'var(--card-bg)', padding: '24px', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', borderLeft: '6px solid var(--primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border)', paddingBottom: '16px', marginBottom: '16px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-main)' }}>
                                        {ticket.trainDetails.route.from} → {ticket.trainDetails.route.to}
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', margin: 0, fontWeight: '500', fontSize: '1.05rem' }}>
                                        {new Date(ticket.trainDetails.departure).toLocaleString('uk-UA', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })} | Поїзд {ticket.trainDetails.number}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ background: 'var(--secondary)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 'bold' }}>Вагон {ticket.wagonId}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {ticket.user.map((p, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', color: 'var(--text-main)', background: 'var(--background)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                                        <span><strong>Місце {ticket.seats[idx]}</strong>: {p.firstName} {p.lastName}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>
                                            {p.bedding && '🛏️ '}
                                            {p.drinks > 0 && `☕ x${p.drinks}`}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTickets;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, ArrowLeft, Cat, Trash2 } from 'lucide-react';
import { BookingService } from '../services/BookingService';
import { trains } from '../data/trains';
import { toast } from 'react-toastify';

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    const fetchTickets = () => {
        BookingService.getAllBookings().then(data => {
            const mapped = data.map(t => {
                const trainDetails = trains.find(train => train.id === t.trainId) || 
                                     { route: { from: '?', to: '?' }, number: '???', departure: t.date };
                return { ...t, trainDetails };
            });
            setTickets(mapped.reverse());
        });
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleClear = async () => {
        if (window.confirm("Are you sure you want to clear all booking history?")) {
            await BookingService.clearAllBookings();
            toast.info("Booking history cleared.");
            fetchTickets();
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <button 
                    onClick={() => navigate('/')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: '600', cursor: 'pointer', fontSize: '1rem', padding: 0 }}
                >
                    <ArrowLeft size={20} /> Back to Home
                </button>
                {tickets.length > 0 && (
                    <button 
                        onClick={handleClear}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: '1px solid #ffcdd2', color: '#e53935', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#ffebee'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'none'}
                    >
                        <Trash2 size={18} /> Clear All
                    </button>
                )}
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-main)' }}>
                <Ticket size={40} color="var(--primary)" /> My Tickets
            </h1>

            {tickets.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 24px', background: 'var(--card-bg)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
                    <Cat size={64} color="var(--border)" style={{ marginBottom: '16px', display: 'inline-block' }} />
                    <h2 style={{ color: 'var(--text-muted)', fontSize: '1.4rem' }}>You haven't booked any tickets yet</h2>
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
                                        {new Date(ticket.trainDetails.departure).toLocaleString('en-US', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })} | Train {ticket.trainDetails.number}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ background: 'var(--secondary)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 'bold' }}>Wagon {ticket.wagonId}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {ticket.user.map((p, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', color: 'var(--text-main)', background: 'var(--background)', padding: '12px 16px', borderRadius: 'var(--radius-sm)' }}>
                                        <span><strong>Seat {ticket.seats[idx]}</strong>: {p.firstName} {p.lastName}</span>
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

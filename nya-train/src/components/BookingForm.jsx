import React, { useState, useEffect } from 'react';
import { MoreVertical, Plus } from 'lucide-react';
import styles from './BookingForm.module.css';

const BookingForm = ({ selectedSeats, selectedWagon, onSubmit, onChange }) => {

    const [passengers, setPassengers] = useState([]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [errors, setErrors] = useState({});


    useEffect(() => {
        setPassengers(prev => {
            const mapped = selectedSeats.map(seat => {
                const existing = prev.find(p => p.seat === seat);
                if (existing) return existing;
                return { seat, name: '', lastName: '', bedding: false, drinks: false };
            });
            return mapped;
        });
    }, [selectedSeats]);

    useEffect(() => {
        if (onChange) {
            onChange(passengers);
        }
    }, [passengers, onChange]);

    const handleChange = (idx, field, value) => {
        const newPass = [...passengers];
        newPass[idx][field] = value;
        setPassengers(newPass);
    };

    const validatePassenger = (idx) => {
        const p = passengers[idx];
        const newErrors = {};
        if (!p.name.trim()) newErrors.name = "Ім'я обов'язкове";
        if (!p.lastName.trim()) newErrors.lastName = "Прізвище обов'язкове";
        return newErrors;
    };

    const handleNextPassenger = (e, idx) => {
        e.preventDefault();
        const errs = validatePassenger(idx);
        if (Object.keys(errs).length > 0) {
            setErrors({ ...errors, [idx]: errs });
        } else {
            const cleanErrs = { ...errors };
            delete cleanErrs[idx];
            setErrors(cleanErrs);
            if (idx < passengers.length - 1) {
                setActiveIdx(idx + 1);
            }
        }
    };


    useEffect(() => {

    }, [passengers]);

    const handleGlobalSubmit = (e) => {
        e.preventDefault();

        let allValid = true;
        let allErrors = {};
        passengers.forEach((p, idx) => {
            const errs = validatePassenger(idx);
            if (Object.keys(errs).length > 0) {
                allValid = false;
                allErrors[idx] = errs;
            }
        });
        if (!allValid) {
            setErrors(allErrors);
            setActiveIdx(parseInt(Object.keys(allErrors)[0]));
            return;
        }
        onSubmit(passengers);
    };

    return (
        <form onSubmit={handleGlobalSubmit} id="booking-multi-form" className={styles.container}>
            {passengers.map((p, idx) => {
                const isActive = activeIdx === idx;
                const err = errors[idx] || {};

                if (!isActive) {
                    return (
                        <div key={p.seat} className={styles.collapsedCard} onClick={() => setActiveIdx(idx)}>
                            <div className={styles.collapsedHeader}>
                                <div>
                                    <span style={{ fontWeight: 600 }}>{p.name || p.lastName ? `${p.lastName} ${p.name}` : `Пасажир ${idx + 1}`}</span>
                                    <span className={styles.seatBadge}>{selectedWagon?.number} вагон, {p.seat} місце</span>
                                </div>
                                <MoreVertical size={18} color="#6B6B6B" />
                            </div>
                            {(p.bedding || p.drinks) && (
                                <div className={styles.collapsedDetails}>
                                    {p.bedding && "Постіль"} {p.bedding && p.drinks && " • "} {p.drinks && "Напій"}
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <div key={p.seat} className={styles.activeCard}>
                        <div className={styles.activeHeader}>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Пасажир {idx + 1}</span>
                            <span className={styles.seatBadge}>{selectedWagon?.number} вагон, {p.seat} місце</span>
                            <div style={{ flexGrow: 1 }} />
                            <MoreVertical size={18} color="#6B6B6B" />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Ім'я</label>
                                <input 
                                    type="text" 
                                    value={p.name}
                                    onChange={(e) => handleChange(idx, 'name', e.target.value)}
                                />
                                {err.name && <span className={styles.error}>{err.name}</span>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Прізвище</label>
                                <input 
                                    type="text" 
                                    value={p.lastName}
                                    onChange={(e) => handleChange(idx, 'lastName', e.target.value)}
                                />
                                {err.lastName && <span className={styles.error}>{err.lastName}</span>}
                            </div>
                        </div>

                        <div className={styles.addPrivilege}>
                            <Plus size={16} /> Додати пільгу
                        </div>

                        <div className={styles.togglesGrid}>
                            <div className={styles.toggleCard}>
                                <div className={styles.toggleInfo}>
                                    <span style={{fontWeight: 600}}>Постіль</span>
                                    <span style={{fontSize: '0.8.5rem', color: 'var(--text-muted)'}}>+95 ₴</span>
                                </div>
                                <label className={styles.switch}>
                                    <input type="checkbox" checked={p.bedding} onChange={(e) => handleChange(idx, 'bedding', e.target.checked)} />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                            <div className={styles.toggleCard}>
                                <div className={styles.toggleInfo}>
                                    <span style={{fontWeight: 600}}>Напій</span>
                                    <span style={{fontSize: '0.8.5rem', color: 'var(--text-muted)'}}>+20 ₴</span>
                                </div>
                                <label className={styles.switch}>
                                    <input type="checkbox" checked={p.drinks} onChange={(e) => handleChange(idx, 'drinks', e.target.checked)} />
                                    <span className={styles.slider}></span>
                                </label>
                            </div>
                        </div>

                        {idx < passengers.length - 1 && (
                            <button className={styles.nextBtn} onClick={(e) => handleNextPassenger(e, idx)}>
                                Наступний пасажир
                            </button>
                        )}
                        {idx === passengers.length - 1 && (
                            <button type="submit" className={styles.nextBtn}>
                                Перейти до оплати
                            </button>
                        )}
                    </div>
                );
            })}
        </form>
    );
};

export default BookingForm;

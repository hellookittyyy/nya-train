import React from 'react';
import { X } from 'lucide-react';
import styles from './CartSummary.module.css';

const CartSummary = ({ 
    selectedSeats, 
    selectedWagon, 
    pricePerSeat, 
    step, 
    passengersData,
    onNextStep, 
    onSubmit, 
    onRemoveSeat,
    isSubmitting 
}) => {
    if (selectedSeats.length === 0) {
        return (
            <div className={styles.cartContainer}>
                <div className={styles.emptyCart}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💺</div>
                    <span>No seats selected</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                        Select seats on the wagon map on the left.
                    </span>
                </div>
            </div>
        );
    }

    const calculateItemPrice = (seat) => {
        let base = pricePerSeat;
        const pData = passengersData?.find(p => p.seat === seat);
        if (pData) {
            if (pData.bedding) base += 95;
            if (pData.drinks) base += 20;
        }
        return base;
    };

    const total = selectedSeats.reduce((sum, seat) => sum + calculateItemPrice(seat), 0);

    return (
        <div className={styles.cartContainer}>
            <div className={styles.seatList}>
                {selectedSeats.map(seat => {
                    const itemPrice = calculateItemPrice(seat);
                    return (
                        <div key={seat} className={styles.seatItem}>
                            <span>Wagon {selectedWagon?.number}, Seat {seat}</span>
                            <div className={styles.seatPriceWrap}>
                                <span>{itemPrice.toFixed(2)} ₴</span>
                                <button className={styles.removeBtn} onClick={() => onRemoveSeat(seat)}>
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className={styles.totalsSection}>
                <div className={styles.totalRow}>
                    <span>Total</span>
                    <span>{total.toFixed(2)} ₴</span>
                </div>
                
                {step === 'seats' ? (
                    <button className={styles.primaryBtn} onClick={onNextStep}>
                        Proceed to passengers
                    </button>
                ) : (
                    <button 
                        className={styles.primaryBtn} 
                        onClick={onSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Proceed to payment'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CartSummary;

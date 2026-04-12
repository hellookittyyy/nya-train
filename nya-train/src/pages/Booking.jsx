import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { trains } from '../data/trains';
import { BookingService } from '../services/BookingService';
import { BookingProvider, useBooking } from '../context/BookingContext';
import WagonSelector from '../components/WagonSelector';
import SeatMap from '../components/SeatMap';
import BookingForm from '../components/BookingForm';
import CartSummary from '../components/CartSummary';
import styles from './Booking.module.css';

const BookingContent = () => {
    const { trainId } = useParams();
    const navigate = useNavigate();
    const [train, setTrain] = useState(null);
    const [wagons, setWagons] = useState([]);
    const [bookedSeats, setBookedSeats] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState('seats');

    const [passengersData, setPassengersData] = useState([]);

    const { 
        selectedWagon, 
        setSelectedWagon, 
        selectedSeats, 
        toggleSeat, 
        clearSelection 
    } = useBooking();


    useEffect(() => {
        const foundTrain = trains.find(t => t.id === parseInt(trainId));
        if (!foundTrain) {
            toast.error("Train not found!");
            navigate('/');
            return;
        }
        setTrain(foundTrain);

        BookingService.getWagonsForTrain(foundTrain.id).then(data => {
            setWagons(data);
            if (data.length > 0) {
                setSelectedWagon(data[0]);
            }
        });
    }, [trainId, navigate, setSelectedWagon]);

    useEffect(() => {
        if (train && selectedWagon) {
            BookingService.getBookedSeats(train.id, selectedWagon.id).then(seats => {
                setBookedSeats(seats);
            });
        }
    }, [train, selectedWagon]);

    const handleWagonSelect = (wagon) => {
        if (selectedWagon?.id !== wagon.id) {
            setSelectedWagon(wagon);
            clearSelection();
            setSelectedWagon(wagon); 
        }
    };

    const handleNextStep = () => {
        if (selectedSeats.length === 0) {
            toast.warn("Please select at least one seat.");
            return;
        }
        setStep('passengers');
    };

    const handleRemoveSeat = (seatId) => {
        toggleSeat(seatId);
        if (selectedSeats.length === 1 && step === 'passengers') {
            setStep('seats');
        }
    };

    const handleBookingSubmit = async (finalPassengersData) => {
        setIsSubmitting(true);
        try {
            await BookingService.saveBooking(train.id, selectedWagon.id, selectedSeats, finalPassengersData);
            clearSelection();
            navigate('/success');
        } catch (error) {
            toast.error(error.message || "Failed to complete booking.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const triggerFormSubmit = () => {
        const form = document.getElementById('booking-multi-form');
        if (form) {
            form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };

    if (!train || wagons.length === 0) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>Loading booking details...</div>;
    }

    const pricePerSeat = train.price * (selectedWagon?.priceMultiplier || 1);
    
    const departureDate = new Date(train.departure);
    const formattedDate = departureDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
    const formattedTime = departureDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`animate-fade-in ${styles.container}`}>
            <header className={styles.header}>
                <button className={styles.backBtn} onClick={() => step === 'passengers' ? setStep('seats') : navigate('/')}>
                    <ArrowLeft size={20} /> {step === 'passengers' ? 'Back to seat selection' : 'Back to schedule'}
                </button>
            </header>

            <div className={styles.content}>

                <div className={styles.mainColumnTop}>
                    {step === 'seats' && (
                        <WagonSelector 
                            wagons={wagons} 
                            selectedWagon={selectedWagon} 
                            onSelect={handleWagonSelect} 
                        />
                    )}
                </div>


                <div className={styles.sidebarColumnTop}>
                    <div className={styles.trainInfo}>
                        <h1 className={styles.routeHeader}>
                            {train.route.from} <span className={styles.routeArrow}>→</span> {train.route.to}
                        </h1>
                        <p className={styles.timeInfo}>{formattedDate}, {formattedTime}</p>
                        <p className={styles.trainNumber}>{train.number} {train.type}</p>
                    </div>
                </div>


                <div className={styles.mainColumn}>
                    {step === 'seats' ? (
                        <>
                            {selectedWagon && (
                                <SeatMap 
                                    capacity={selectedWagon.capacity}
                                    bookedSeats={bookedSeats}
                                    selectedSeats={selectedSeats}
                                    onToggleSeat={toggleSeat}
                                />
                            )}
                        </>
                    ) : (
                        <BookingForm 
                            selectedSeats={selectedSeats}
                            selectedWagon={selectedWagon}
                            pricePerSeat={pricePerSeat}
                            onSubmit={handleBookingSubmit}
                            onChange={(data) => setPassengersData(data)}
                        />
                    )}
                </div>


                <div className={styles.sidebarColumn}>
                    <CartSummary 
                        selectedSeats={selectedSeats}
                        selectedWagon={selectedWagon}
                        pricePerSeat={pricePerSeat}
                        step={step}
                        passengersData={passengersData}
                        onNextStep={handleNextStep}
                        onRemoveSeat={handleRemoveSeat}
                        onSubmit={triggerFormSubmit}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
};

const Booking = () => {
    return (
        <BookingProvider>
            <BookingContent />
        </BookingProvider>
    );
};

export default Booking;

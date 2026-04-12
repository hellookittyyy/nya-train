const WAGONS_MOCK_DATA = [
  { id: 'w1', number: '03', type: 'Platzkart', priceMultiplier: 1.0, capacity: 54 },
  { id: 'w2', number: '04', type: 'Coupe', priceMultiplier: 1.5, capacity: 36 },
  { id: 'w3', number: '07', type: 'Platzkart', priceMultiplier: 1.0, capacity: 54 },
  { id: 'w4', number: '08', type: 'Coupe', priceMultiplier: 1.5, capacity: 36 },
];

export const BookingService = {
  getWagonsForTrain: async (trainId) => {
    return new Promise(resolve => {
      setTimeout(() => resolve([...WAGONS_MOCK_DATA]), 300);
    });
  },

  getBookedSeats: async (trainId, wagonId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const key = `booked_${trainId}_${wagonId}`;
        const data = localStorage.getItem(key);
        if (data) {
            resolve(JSON.parse(data));
        } else {
            const wIdStr = String(wagonId);
            const seed = parseInt(wIdStr.replace(/\D/g,'')) || 1;
            const count = (seed * 7) % 12 + 8;
            const booked = [];
            for (let i = 0; i < count; i++) {
                let s = ((seed * (i + 1) * 11) % 35) + 1;
                if (!booked.includes(s)) booked.push(s);
            }
            localStorage.setItem(key, JSON.stringify(booked));
            resolve(booked);
        }
      }, 200);
    });
  },

  getAllBookings: async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            const bookingHistoryKey = 'nya_booking_history';
            const history = JSON.parse(localStorage.getItem(bookingHistoryKey) || '[]');
            resolve(history);
        }, 300);
    });
  },

  saveBooking: async (trainId, wagonId, selectedSeats, userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const key = `booked_${trainId}_${wagonId}`;
          const existingData = localStorage.getItem(key);
          const bookedSeats = existingData ? JSON.parse(existingData) : [];
          const alreadyBooked = selectedSeats.some(seat => bookedSeats.includes(seat));
          if (alreadyBooked) {
             reject(new Error("Some selected seats are already booked."));
             return;
          }

          const newBookedSeats = [...bookedSeats, ...selectedSeats];
          localStorage.setItem(key, JSON.stringify(newBookedSeats));

          const bookingHistoryKey = 'nya_booking_history';
          const existingHistory = JSON.parse(localStorage.getItem(bookingHistoryKey) || '[]');
          
          existingHistory.push({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            trainId,
            wagonId,
            seats: selectedSeats,
            user: userData
          });
          
          localStorage.setItem(bookingHistoryKey, JSON.stringify(existingHistory));
          
          resolve({ success: true });
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }
};

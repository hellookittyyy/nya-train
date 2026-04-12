import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trains } from '../data/trains';
import TrainList from '../components/TrainList';
import SearchFilters from '../components/SearchFilters';
import { MousePointer2, Train, Ticket } from 'lucide-react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchRoute, setSearchRoute] = useState('');
  const navigate = useNavigate();

  const filteredTrains = trains.filter(train => {
    const matchesNumber = train.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoute = train.route.to.toLowerCase().includes(searchRoute.toLowerCase()) || 
                         train.route.from.toLowerCase().includes(searchRoute.toLowerCase());
    return matchesNumber && matchesRoute;
  });

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '100px', position: 'relative' }}>
      <button 
        onClick={() => navigate('/my-tickets')}
        style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '100px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)' }}
      >
        <Ticket size={18} /> My Tickets
      </button>
      <header style={{ 
        padding: '60px 0 20px', 
        textAlign: 'center' 
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--secondary)',
          color: 'var(--primary)',
          padding: '8px 20px',
          borderRadius: '100px',
          fontSize: '0.85rem',
          fontWeight: '700',
          marginBottom: '20px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          <Train size={16} />
          Nya Central Hub
        </div>
        
        <h1 style={{ 
          fontSize: '4.5rem', 
          fontWeight: '800', 
          lineHeight: '0.9',
          letterSpacing: '-0.02em',
          marginBottom: '8px',
          color: 'var(--text-main)'
        }}>
          Find Your <br />
          <span style={{ 
            fontFamily: 'serif', 
            fontStyle: 'italic', 
            color: 'var(--primary)',
            fontWeight: '400'
          }}>Purr-fect</span> Train.
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--text-muted)',
          maxWidth: '500px',
          margin: '20px auto 0'
        }}>
          The most comfortable and reliable railway system for you and your fluffy companions.
        </p>
      </header>

      <SearchFilters 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        searchRoute={searchRoute} 
        setSearchRoute={setSearchRoute} 
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          Available Routes <span style={{ 
            fontSize: '0.9rem', 
            background: 'var(--secondary)', 
            color: 'var(--primary)',
            padding: '2px 10px',
            borderRadius: '100px',
            marginLeft: '8px',
            verticalAlign: 'middle'
          }}>{filteredTrains.length}</span>
        </h2>
        <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: '600', cursor: 'pointer' }}>View all schedules</span>
      </div>

      <TrainList trains={filteredTrains} />
      
      

      <div style={{ 
        marginTop: '80px', 
        textAlign: 'center',
        opacity: 0.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.05em' }}>
          NYA<span style={{ color: 'var(--primary)' }}>RAIL</span>
        </div>
        <div style={{ fontSize: '0.8rem', fontWeight: '600' }}>© 2026 UKRZALIZNYTSIA - NYA EDITION</div>
      </div>
    </div>
  );
};

export default Home;

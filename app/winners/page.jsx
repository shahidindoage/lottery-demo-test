'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function WinnersPage() {
  const [lang, setLang] = useState('en');
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  const translations = {
    en: {
      title: '🏆 Lottery Winners',
      noWinners: 'No winners yet! Stay tuned.',
      loading: 'Loading winners...',
      customerId: 'Customer ID',
      prize: 'Prize',
      en: 'EN',
      ru: 'RU'
    },
    ru: {
      title: '🏆 Победители Лотереи',
      noWinners: 'Победителей пока нет! Следите за обновлениями.',
      loading: 'Загрузка победителей...',
      customerId: 'Идентификатор клиента',
      prize: 'Приз',
      en: 'EN',
      ru: 'RU'
    }
  };

  const t = translations[lang];

  useEffect(() => {
    const fetchWinners = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/winners');
        const data = await res.json();
        setWinners(data.winners || []);
      } catch (err) {
        console.error(err);
        setWinners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWinners();
  }, []);

  return (
    <div style={wrapperStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' ,}} className='logo-doremi2'>
                        <Image src="/logo.PNG" alt="Logo" width={200} height={200} priority />
                      </div>
      {/* Language Toggle */}
      <div className="lang-toggle1">
        <button className={lang==='en'?'active':''} onClick={()=>setLang('en')}>EN</button>
        <button className={lang==='ru'?'active':''} onClick={()=>setLang('ru')}>RU</button>
      </div>

      <h1 style={titleStyle} >{t.title}</h1>

      {loading ? (
        <p style={loadingStyle}>{t.loading}</p>
      ) : winners.length === 0 ? (
        <p style={noWinnerStyle}>{t.noWinners}</p>
      ) : (
        <div style={cardsContainerStyle}>
          {winners.map((w, idx) => (
            <div key={idx} style={cardStyle}>
              {/* <div style={prizeBadgeStyle}>{t.prize}: {w.prize}</div> */}
              <h2 style={nameStyle}>{w.name}</h2>
              <p style={idStyle}>{t.customerId}: {w.uniqueId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Styles ----------

const wrapperStyle = {
  minHeight: '100vh',
  padding: '40px 20px',
  background: '#0f0f0f',
  color: '#fff',
  fontFamily: "'Poppins', sans-serif",
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};



const titleStyle = {
  fontSize: '2.5rem',
  marginBottom: 30,
  textAlign: 'center',
  background: '#d6af66',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
 fontFamily:"PP-NEUE"
};

const loadingStyle = { fontSize: '1.2rem', color: '#ffd700', marginBottom: 20 };
const noWinnerStyle = { fontSize: '1.2rem', color: '#f5f5f5' };

const cardsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '20px',
  width: '100%',
  maxWidth: 1200,
};

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 15,
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  transition: 'transform 0.3s, box-shadow 0.3s',
  cursor: 'default',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  fontFamily:"playfair-display-v2"
};

const prizeBadgeStyle = {
  background: 'linear-gradient(90deg, #ffd700, #ff8c00)',
  color: '#000',
  fontWeight: 'bold',
  padding: '8px 16px',
  borderRadius: 50,
  marginBottom: 15,
  fontSize: '1rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
};

const nameStyle = { fontSize: '1.4rem', fontWeight: 600, marginBottom: 5 };
const idStyle = { fontSize: '1rem', color: '#f5f5f5' };

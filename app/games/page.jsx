'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GamesPage() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.replace('/');
  };

  return (
    <div className="games-container">
      {/* 🌐 Language Toggle + Logout */}
      <div className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="lang-toggle">
          <button
            onClick={() => setLang('en')}
            style={{
              background: lang === 'en' ? '#f5c400' : 'transparent',
              color: lang === 'en' ? '#000' : '#fff',
            }}
          >
            EN
          </button>
          <button
            onClick={() => setLang('ru')}
            style={{
              background: lang === 'ru' ? '#f5c400' : 'transparent',
              color: lang === 'ru' ? '#000' : '#fff',
            }}
          >
            RU
          </button>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: '6px 14px',
            background: '#f44336',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            position: 'absolute',
    top: '20px',
    left: '20px',
    overflow: 'hidden'
          }}
        >
          {t.logout}
        </button>
      </div>

      <h1 className="page-title">{t.gamesTitle}</h1>

      <div className="games-grid">
        <div
          className="game-card"
          onClick={() => {
            document.cookie = 'lottery_user=true; path=/';
            setTimeout(() => router.push('/lottery'), 200);
          }}
        >
          <img src="spin.png" alt="Spin the Wheel" />
          <h2 className="spin-title">{t.spinTitle}</h2>
          <p>{t.spinDesc}</p>
          <button className="play-btn">
            <Link style={{ textDecoration: 'none', color: 'black' }} href="/lottery">
              {t.playNow}
            </Link>
          </button>
        </div>

        <div className="game-card" onClick={() => router.push('/flip')}>
          <img src="card-game.png" alt="Flip the Card" />
          <h2 className="spin-title">{t.flipTitle}</h2>
          <p>{t.flipDesc}</p>
          <button className="play-btn" style={{ textDecoration: 'none', color: 'black' }}>
            {t.playNow}
          </button>
        </div>
      </div>
    </div>
  );
}

const translations = {
  en: {
    gamesTitle: '🎮 Choose Your Game!',
    spinTitle: 'Spin the Wheel',
    spinDesc: 'Try your luck and spin to win exciting prizes!',
    flipTitle: 'Flip the Card',
    flipDesc: 'Find matching pairs and reveal hidden rewards!',
    playNow: 'Play Now',
    logout: 'Logout',
  },
  ru: {
    gamesTitle: '🎮 Выберите игру!',
    spinTitle: 'Крутите колесо',
    spinDesc: 'Испытайте удачу и выиграйте призы!',
    flipTitle: 'Переверни карту',
    flipDesc: 'Найдите пары и получите награды!',
    playNow: 'Играть',
    logout: 'Выйти',
  },
};

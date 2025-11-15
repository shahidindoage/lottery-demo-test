'use client';
import { useEffect, useState } from 'react';

export default function ThankYouPage() {
  const [lang, setLang] = useState('en');
  const [customerId, setCustomerId] = useState('');

  // ✅ Get uniqueId from cookie (set by API after form submission)
 useEffect(() => {
  const match = document.cookie.match(/(^| )lottery_user=([^;]+)/);
  if (match) setCustomerId(match[2]);
}, []);


console.log(customerId)
  const t = translations[lang];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f0f0f',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: "'Poppins', sans-serif",
        padding: 20,
      }}
    >
      {/* Language Toggle */}
      <div className="lang-toggle" style={{ marginBottom: 20 }}>
        <button
          onClick={() => setLang('en')}
          style={{
            background: lang === 'en' ? '#d6af66' : 'transparent',
            color: lang === 'en' ? '#000' : '#fff',
            marginRight: 8,
          }}
        >
          EN
        </button>
        <button
          onClick={() => setLang('ru')}
          style={{
            background: lang === 'ru' ? '#d6af66' : 'transparent',
            color: lang === 'ru' ? '#000' : '#fff',
          }}
        >
          RU
        </button>
      </div>

  <div style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
 <img src='logo.PNG' width={230} height={230}/>
        </div>
      <h1 style={{ fontSize: '2.2rem', color: '#d6af66', marginBottom: 10 }} className='thank-title'>
        🎉 {t.thankYou}
      </h1>
      <p style={{ fontSize: '1rem', color: '#ccc', maxWidth: 500 }} className='font2'>
        {t.success}
      </p>

      {customerId ? (
        <p style={{ marginTop: 20, fontSize: '1.2rem', color: '#d6af66' }} className='font2'>
          {t.customerId}: <strong>{customerId}</strong>
        </p>
      ) : (
        <p style={{ marginTop: 20, color: '#aaa' }}>{t.loading}</p>
      )}
    </div>
  );
}

const translations = {
  en: {
    thankYou: 'Thank You for Registering!',
    success: 'Your entry has been successfully submitted. Winners will be announced soon!',
    customerId: 'Your Customer ID',
    loading: 'Loading your details...',
  },
  ru: {
    thankYou: 'Спасибо за регистрацию!',
    success: 'Ваша заявка успешно отправлена. Победители будут объявлены в ближайшее время!',
    customerId: 'Ваш идентификатор клиента',
    loading: 'Загрузка ваших данных...',
  },
};

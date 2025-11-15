'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function FlipPage() {
  const router = useRouter();
  const [card, setCard] = useState(null);
  const [assignedWinners, setAssignedWinners] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [popupText, setPopupText] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [lang, setLang] = useState('en');
  const [winnerLimit, setWinnerLimit] = useState(1);
  const [started, setStarted] = useState(false);
  const [cardNumber, setCardNumber] = useState(1); // start from 1


  const t = {
    en: { 
      title: 'Choose the Winner', 
      youWon: 'Winner', 
      close: 'Close', 
      chooseAgain: 'Choose Again',
      resetSuccess: 'Game has been successfully reset!',
      back: 'Back',
      limitPlaceholder: 'Number of Winners'
    },
    ru: { 
      title: 'Выберите победителя', 
      youWon: 'Победитель', 
      close: 'Закрыть', 
      chooseAgain: 'Выбрать снова',
      resetSuccess: 'Игра успешно сброшена!',
      back: 'Назад',
      limitPlaceholder: 'Количество победителей'
    }
  }[lang];

  const prize = 'Grand Prize';

  useEffect(() => {
    setCard({ flipped: false, winner: null, fixed: false });

    fetch('/api/users')
      .then(res => res.json())
      .then(data => setAllUsers(data.users || []));
  }, [lang]);

  // Flip the card to choose a winner
  const handleFlip = async () => {
    if (!card || card.flipped || card.fixed || !started) return;

    // Filter users who are not already winners
    const availableUsers = allUsers.filter(u => 
      !assignedWinners.some(w => w.uniqueId === u.uniqueId)
    );

    if (availableUsers.length === 0) return;

    const winner = availableUsers[Math.floor(Math.random() * availableUsers.length)];

    await fetch('/api/assign-winner', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    uniqueId: winner.uniqueId, 
    prize, 
    cardNumber 
  }),
});


    // Flip card animation
    setCard({ ...card, flipped: true, winner, fixed: true });
    setAssignedWinners(prev => [...prev, winner]);

    // setTimeout(() => {
    //   setPopupText(`${t.youWon}\n\nCustomer ID: ${winner.uniqueId}`);
    //   setShowPopup(true);
    // }, 500);
  };

  // Reset the game
  const handleReset = async () => {
    const res = await fetch('/api/reset-winners', { method: 'POST' });
    if (res.ok) {
      setCard({ flipped: false, winner: null, fixed: false });
      setAssignedWinners([]);
      setStarted(false);
      setPopupText(t.resetSuccess);
      setShowPopup(true);
    }
  };

  // Choose again without repeating
  const handleChooseAgain = () => {
  if (assignedWinners.length >= winnerLimit) return;
  setCardNumber(prev => prev + 1); // 🆕 move to next card
  setCard({ flipped: false, winner: null, fixed: false });
  setShowPopup(false);
};


  const closePopup = () => setShowPopup(false);

  // Start game with limit
  const startGame = () => {
    if (winnerLimit <= 0 || winnerLimit > allUsers.length) {
      alert(`Please enter a valid number between 1 and ${allUsers.length}`);
      return;
    }
    setStarted(true);
    handleFlip();
  };

  const handleBack = () => {
    router.back();
    setTimeout(() => {
      window.location.reload();
    }, 100); // small delay to ensure navigation happens first
  };


  return (
    <div className='flip-wrapper'>
      {/* Back Button */}
      <button 
        onClick={handleBack}
        style={{ position: 'absolute', top: 20, left: 20, zIndex: 100, padding: '8px 12px', borderRadius: 6, border: 'none', background: '#d6af66', cursor: 'pointer' }}
      >
        {t.back}
      </button>

      {/* Language Toggle */}
      <div className="lang-toggle1">
        <button className={lang==='en'?'active':''} onClick={()=>setLang('en')}>EN</button>
        <button className={lang==='ru'?'active':''} onClick={()=>setLang('ru')}>RU</button>
      </div>
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' ,}} className='logo-doremi4'>
                  <Image src="/logo.PNG" alt="Logo" width={200} height={200} priority />
                </div>
     <h1 className="flip-title" style={{ fontFamily: "PP-NEUE", textTransform: "uppercase", fontWeight: "100" }}>
  { !started ? (lang === 'en' ? 'Select the number of winners' : 'Выберите количество победителей') : t.title }
</h1>

      {/* Set Winner Limit */}
      {!started && (
        <div style={{ marginBottom: 20,    gap: '10px',width: '100%', maxWidth: '300px' ,display:'flex',flexDirection:'column'}}>
          <input 
            type="number" 
            min={1} 
            max={allUsers.length} 
            value={winnerLimit} 
            onChange={e => setWinnerLimit(parseInt(e.target.value))}
            placeholder={t.limitPlaceholder}
            style={{ padding: '13px 35px', fontSize: '1rem', borderRadius: 8, border: '1px solid #ccc', marginRight: 10,fontWeight: "100" ,width:'100%',textAlign:"center" ,fontFamily:"playfair-display-v2" }}
          />

           <button
           onClick={startGame}
            style={{
              padding: '10px 20px',
              background: '#d6af66',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              textTransform:"uppercase",
              fontSize: '1.3rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              fontFamily:"PP-NEUE",
              fontWeight:"100"
            }}
          >
           Start
          </button>
          {/* <button onClick={startGame} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: '#d6af66', cursor: 'pointer' }}>Start</button> */}
        </div>
      )}

      {/* Flip Card */}
      {started && (
        <div
          className={`card1 ${card?.flipped ? 'flipped' : ''}`}
          onClick={handleFlip}
          style={{
            width: 300,
            height: 400,
            perspective: 1000,
            margin: '0 auto',
          }}
        >
          <div className="flip-card-inner">
            <div className="front" style={{fontWeight:"100"}}><span>?</span></div>
            <div className="back" style={{fontWeight:"100"}}>
              {card?.winner ? <>
                  <span style={{fontFamily:"playfair-display-v2"}}> Winner</span> <br />
                    <span style={{color:'green',fontFamily:"playfair-display-v2",fontWeight:"100",marginTop:"-10%"}}>
                      ID - {card.winner.uniqueId}
                    </span>
                  </> : ''}
            </div>
          </div>
        </div>
      )}

      {/* Choose Again & Reset */}
      {started && (
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
          {assignedWinners.length < winnerLimit && (
            <button
              onClick={handleChooseAgain}
              style={{
                padding: '10px 20px',
                background: '#d6af66',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                textTransform:"uppercase",
                fontSize: '1.3rem',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                fontFamily:"PP-NEUE",
                fontWeight:"100"
              }}
            >
              {t.chooseAgain}
            </button>
          )}
          <button
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              background: '#d6af66',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              textTransform:"uppercase",
              fontSize: '1.3rem',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              fontFamily:"PP-NEUE",
              fontWeight:"100"
            }}
          >
            Reset Game
          </button>
        </div>
      )}

      {/* Popup */}
      {showPopup && (
        <div className="popup1">
          <div className="popup-content1">
            <pre style={{ whiteSpace: 'pre-line', fontFamily:"playfair-display-v2", fontWeight:"100" }}>{popupText}</pre>
            <button onClick={closePopup} style={{ fontFamily:"playfair-display-v2", marginTop:10, fontWeight:"100" }}>{t.close}</button>
          </div>
        </div>
      )}
    </div>
  );
}

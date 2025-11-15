'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LotteryPage() {
  const [lang, setLang] = useState('en');
  const router = useRouter();

  // 🌍 Translation data
  const translations = {
    en: {
      spin: 'SPIN',
      close: 'Close',
      lose: '😢 Sorry, you lost this time.\nBetter luck next time!',
      prize: '🎁 You have been entered into the Prize Draw!\nWe will contact you if you win.',
      win: '🎉 You have won',
      language: 'English',
      logout:'Logout',
      labels: {
        iphone: 'iPhone 16',
        prizeDraw: 'Prize Draw',
        fridge: 'Refrigerator',
        trip: 'GOA Trip',
        lose: 'You Lose',
        laptop: 'MacBook Air'
      }
    },
    ru: {
      spin: 'КРУТИ',
      close: 'Закрыть',
      lose: '😢 К сожалению, вы проиграли.\nПовезёт в следующий раз!',
      prize: '🎁 Вы участвуете в розыгрыше приза!\nМы свяжемся с вами, если вы выиграете.',
      win: '🎉 Вы выиграли',
      language: 'Русский',
       logout: 'Выйти',
      labels: {
        iphone: 'Айфон 16',
        prizeDraw: 'Розыгрыш приза',
        fridge: 'Холодильник',
        trip: 'Поездка в ГОА',
        lose: 'Вы проиграли',
        laptop: 'Макбук Эйр'
      }
    }
  };

  const t = translations[lang];

  useEffect(() => {
    // ✅ Clear any previous event listeners to avoid duplicate or stale ones
    const spinEl = document.querySelector("#spin");
    const popupEl = document.getElementById("popup");
    const wheel = document.querySelector("#wheel");
    const oldCtx = wheel?.getContext?.("2d");
    if (oldCtx) oldCtx.clearRect(0, 0, wheel.width, wheel.height);
    const newSpinEl = spinEl.cloneNode(true);
    spinEl?.parentNode?.replaceChild(newSpinEl, spinEl);

    // 🎯 Build sectors dynamically based on current language
    const sectors = [
      { color: "#FFBC03", text: "#333", label: t.labels.iphone, image: "/images/apple.png" },
      { color: "#FF5A10", text: "#333", label: t.labels.prizeDraw, image: "/images/prize.png" },
      { color: "#FFBC03", text: "#333", label: t.labels.fridge, image: "/images/fridge.png" },
      { color: "#FF5A10", text: "#333", label: t.labels.prizeDraw, image: "/images/prize.png" },
      { color: "#FFBC03", text: "#333", label: t.labels.trip, image: "/images/airplane.png" },
      { color: "#FF5A10", text: "#333", label: t.labels.lose, image: "/images/lose.png" },
      { color: "#FFBC03", text: "#333", label: t.labels.prizeDraw, image: "/images/prize.png" },
      { color: "#FF5A10", text: "#333", label: t.labels.laptop, image: "/images/laptop.png" }
    ];

    const events = {
      listeners: {},
      addListener(event, fn) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(fn);
      },
      fire(event, ...args) {
        if (this.listeners[event]) {
          for (let fn of this.listeners[event]) fn(...args);
        }
      },
      clear() {
        this.listeners = {};
      }
    };

    const rand = (m, M) => Math.random() * (M - m) + m;
    const tot = sectors.length;
    const ctx = document.querySelector("#wheel").getContext("2d");
    const dia = ctx.canvas.width;
    const rad = dia / 2;
    const PI = Math.PI;
    const TAU = 2 * PI;
    const arc = TAU / sectors.length;
    const friction = 0.991;
    let angVel = 0;
    let ang = 0;
    let spinButtonClicked = false;

    const getIndex = () => Math.floor(tot - (ang / TAU) * tot) % tot;

    function drawSector(sector, i) {
      const angle = arc * i;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = sector.color;
      ctx.moveTo(rad, rad);
      ctx.arc(rad, rad, rad, angle, angle + arc);
      ctx.lineTo(rad, rad);
      ctx.fill();

      const img = new Image();
      img.src = sector.image;
      img.onload = () => {
        ctx.save();
        ctx.translate(rad, rad);
        ctx.rotate(angle + arc / 2);
        ctx.drawImage(img, rad * 0.5, -30, 40, 40);
        ctx.restore();
      };

      ctx.translate(rad, rad);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = "left";
      ctx.fillStyle = sector.text;
      ctx.font = "bold 16px 'Lato', sans-serif";
      ctx.fillText(sector.label, rad * 0.5 + 50, 10);
      ctx.restore();
    }

    function rotate() {
      const sector = sectors[getIndex()];
      ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
      newSpinEl.textContent = !angVel ? t.spin : sector.label;
      newSpinEl.style.background = sector.color;
      newSpinEl.style.color = sector.text;
    }

    function frame() {
      if (!angVel && spinButtonClicked) {
        const finalSector = sectors[getIndex()];
        events.fire("spinEnd", finalSector);
        spinButtonClicked = false;
        return;
      }
      angVel *= friction;
      if (angVel < 0.002) angVel = 0;
      ang += angVel;
      ang %= TAU;
      rotate();
    }

    function engine() {
      frame();
      requestAnimationFrame(engine);
    }

    function init() {
      ctx.clearRect(0, 0, dia, dia);
      sectors.forEach(drawSector);
      rotate();
      engine();
      newSpinEl.addEventListener("click", () => {
        if (!angVel) angVel = rand(0.25, 0.45);
        spinButtonClicked = true;
      });
    }

    function showPopup(message) {
      document.getElementById("popup-text").textContent = message;
      popupEl.style.display = "flex";
    }

    init();

    // ✅ Proper event listener with current translations
    events.clear();
    events.addListener("spinEnd", (sector) => {
      const label = sector.label.toLowerCase();
      if (label.includes(t.labels.lose.toLowerCase())) {
        showPopup(t.lose);
      } else if (label.includes(t.labels.prizeDraw.toLowerCase())) {
        showPopup(t.prize);
      } else {
        showPopup(`${t.win} ${sector.label}!`);
      }
    });

    return () => {
      events.clear();
    };
  }, [t, lang]); // ✅ depend on language to reinit everything fresh
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.replace('/');
  };
  return (
    <div className="spin-wrapper" style={{ position: 'relative' ,overflow:'hidden'}}>
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
      {/* 🌐 Language Toggle */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: '#222',
          borderRadius: 20,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={() => setLang('en')}
          style={{
            border: 'none',
            background: lang === 'en' ? '#f5c400' : 'transparent',
            color: lang === 'en' ? '#000' : '#fff',
            padding: '8px 14px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: '0.3s',
          }}
        >
          EN
        </button>
        <button
          onClick={() => setLang('ru')}
          style={{
            border: 'none',
            background: lang === 'ru' ? '#f5c400' : 'transparent',
            color: lang === 'ru' ? '#000' : '#fff',
            padding: '8px 14px',
            cursor: 'pointer',
            fontWeight: 600,
            transition: '0.3s',
          }}
        >
          RU
        </button>
      </div>

      <div id="spin_the_wheel">
        <canvas id="wheel" width="800" height="800"></canvas>

        <div id="popup">
          <div className="popup-content">
            <p id="popup-text"></p>
            <button
              onClick={() => {
                document.getElementById("popup").style.display = "none";
              }}
            >
              {t.close}
            </button>
          </div>
        </div>

        <div id="spin">{t.spin}</div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Setup from './Setup';
import Scoreboard from './Scoreboard';
import WeeklySeries from './WeeklySeries';

function SplashScreen() {
  return (
    <div className="splash-container">
      {/* Animated pulse rings + ball */}
      <div className="splash-ball-wrap">
        <div className="splash-pulse" />
        <div className="splash-pulse" />
        <div className="splash-ball">🏏</div>
      </div>

      {/* Brand name */}
      <div className="splash-brand">
        <span className="splash-active">ACTIVE</span>
        <span className="splash-11s">11'S</span>
      </div>

      {/* Tagline */}
      <div className="splash-tag">Cricket Scoring · Live</div>

      {/* Shimmer progress bar */}
      <div className="splash-bar-wrap">
        <div className="splash-bar-fill" />
      </div>
    </div>
  );
}

function PlayerSelection({ data, onStartMatch }) {
  const [b1, setB1] = useState('');
  const [b2, setB2] = useState('');
  const [bowler, setBowler] = useState('');

  const handleGo = () => {
    onStartMatch({
      ...data,
      batsmen: [b1 || 'Striker 1', b2 || 'Non-Striker 2'],
      bowler: bowler || 'Opening Bowler',
      events: []
    });
  };

  const inputStyle = {
    width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
    borderRadius: '12px', padding: '14px 16px', fontSize: '16px',
    outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: '#0f172a'
  };

  const cardStyle = {
    background: 'white', borderRadius: '20px', padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '16px'
  };

  const battingTeamLogo = data.battingTeam === data.teamA.name ? data.teamA.logo : data.teamB.logo;
  const bowlingTeamName = data.battingTeam === data.teamA.name ? data.teamB.name : data.teamA.name;
  const bowlingTeamLogo = data.battingTeam === data.teamA.name ? data.teamB.logo : data.teamA.logo;

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: '50px', paddingBottom: '10px', textAlign: 'center', padding: '50px 24px 10px' }}>
        <h1 style={{ fontFamily: 'Syncopate, sans-serif', fontSize: '18px', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>
          OPENING LINEUP
        </h1>
        <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '3px', marginTop: '6px' }}>
          Who takes the field first?
        </p>
      </div>

      <div style={{ margin: '20px 20px 0', background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '16px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>{battingTeamLogo}</span>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px' }}>Batting</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e40af' }}>{data.battingTeam}</div>
          </div>
        </div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', padding: '4px 10px', background: 'white', borderRadius: '8px' }}>
          {data.groundName}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'right' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Bowling</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{bowlingTeamName}</div>
          </div>
          <span style={{ fontSize: '24px' }}>{bowlingTeamLogo}</span>
        </div>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={cardStyle}>
          <label style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
            🏏 Opening Batsmen — {data.battingTeam}
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', marginBottom: '6px', textTransform: 'uppercase' }}>Striker</div>
              <input placeholder="Name or blank" value={b1} onChange={(e) => setB1(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase' }}>Non-Striker</div>
              <input placeholder="Name or blank" value={b2} onChange={(e) => setB2(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <label style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
            🎳 Opening Bowler — {bowlingTeamName}
          </label>
          <input placeholder="Name or blank" value={bowler} onChange={(e) => setBowler(e.target.value)} style={inputStyle} />
        </div>

        <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginBottom: '20px', fontStyle: 'italic' }}>
          Leave any field blank — we'll auto-fill it for you
        </p>

        <button onClick={handleGo} style={{
          width: '100%', background: '#2563eb', color: 'white', border: 'none',
          borderRadius: '16px', padding: '18px', fontSize: '16px', fontWeight: 800,
          cursor: 'pointer', boxShadow: '0 10px 30px rgba(37,99,235,0.25)',
          letterSpacing: '1px', fontFamily: 'inherit'
        }}>
          START SCORING →
        </button>
      </div>
    </div>
  );
}

// ── save match summary to localStorage ───────────────────────────────────────
function saveMatchSummary(summary) {
  try {
    const existing = JSON.parse(localStorage.getItem('active11s_history') || '[]');
    existing.unshift(summary);
    localStorage.setItem('active11s_history', JSON.stringify(existing.slice(0, 15)));
  } catch (e) { /* ignore storage errors */ }
}

function App() {
  const [screen, setScreen] = useState('splash');
  const [matchData, setMatchData] = useState(null);
  const [matchHistory, setMatchHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('active11s_history') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeMatch = localStorage.getItem('active11s_matchData');
      if (activeMatch) {
        setMatchData(JSON.parse(activeMatch));
        setScreen('scoreboard');
      } else {
        setScreen('setup');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSetupComplete = (data) => {
    setMatchData(data);
    setScreen('players');
  };

  const handleMatchStart = (finalData) => {
    setMatchData(finalData);
    localStorage.setItem('active11s_matchData', JSON.stringify(finalData));
    setScreen('scoreboard');
  };

  const handleUpdate = (updated) => setMatchData(updated);

  const handleMatchEnd = (summary) => {
    saveMatchSummary(summary);
    setMatchData(null);
    localStorage.removeItem('active11s_matchData');
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith('active11s_live_')) localStorage.removeItem(k);
    });
    // Refresh match history
    try {
      const updated = JSON.parse(localStorage.getItem('active11s_history') || '[]');
      setMatchHistory(updated);
    } catch {}
    setScreen('setup');
  };

  return (
    <>
      {screen === 'splash' && <SplashScreen />}
      {screen === 'setup' && (
        <div style={{ position: 'relative' }}>
          <Setup onSetupComplete={handleSetupComplete} />
          {/* Sunday Series floating button */}
          <button
            onClick={() => setScreen('weekly')}
            style={{
              position: 'fixed', bottom: '24px', right: '20px', left: '20px',
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              color: 'white', border: 'none', borderRadius: '18px',
              padding: '16px 20px', fontSize: '14px', fontWeight: 800,
              cursor: 'pointer', boxShadow: '0 8px 28px rgba(37,99,235,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              fontFamily: 'inherit', letterSpacing: '0.5px', zIndex: 50
            }}
          >
            <span style={{ fontSize: '20px' }}>🗓️</span>
            SUNDAY SERIES TRACKER
            <span style={{
              background: 'rgba(255,255,255,0.2)', borderRadius: '8px',
              padding: '2px 8px', fontSize: '11px'
            }}>Best of 3</span>
          </button>
        </div>
      )}
      {screen === 'weekly' && (
        <WeeklySeries onBack={() => setScreen('setup')} matchHistory={matchHistory} />
      )}
      {screen === 'players' && <PlayerSelection data={matchData} onStartMatch={handleMatchStart} />}
      {screen === 'scoreboard' && (
        <Scoreboard data={matchData} onUpdateMatchData={handleUpdate} onMatchEnd={handleMatchEnd} />
      )}
    </>
  );
}

export default App;
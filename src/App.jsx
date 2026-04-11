import { useState, useEffect } from 'react';
import Setup from './Setup';
import Scoreboard from './Scoreboard';

function SplashScreen() {
  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', background: 'white'
    }}>
      <div style={{ fontFamily: 'Syncopate, sans-serif', fontSize: '28px', fontWeight: 700, color: '#2563eb', letterSpacing: '-1px' }}>
        ACTIVE <span style={{ color: '#0f172a' }}>11'S</span>
      </div>
      <div style={{ width: '140px', height: '4px', background: '#f1f5f9', borderRadius: '2px', marginTop: '20px', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: '#2563eb', animation: 'load 2s ease-in-out forwards', width: '0%' }} className="loader-progress" />
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

  useEffect(() => {
    const timer = setTimeout(() => setScreen('setup'), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSetupComplete = (data) => {
    setMatchData(data);
    setScreen('players');
  };

  const handleMatchStart = (finalData) => {
    setMatchData(finalData);
    setScreen('scoreboard');
  };

  const handleUpdate = (updated) => setMatchData(updated);

  const handleMatchEnd = (summary) => {
    saveMatchSummary(summary);
    setMatchData(null);
    setScreen('setup');
  };

  return (
    <>
      {screen === 'splash' && <SplashScreen />}
      {screen === 'setup' && <Setup onSetupComplete={handleSetupComplete} />}
      {screen === 'players' && <PlayerSelection data={matchData} onStartMatch={handleMatchStart} />}
      {screen === 'scoreboard' && (
        <Scoreboard data={matchData} onUpdateMatchData={handleUpdate} onMatchEnd={handleMatchEnd} />
      )}
    </>
  );
}

export default App;
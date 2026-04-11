import { useState, useEffect } from 'react';
import { printScorecard } from './Scoreboard';

const TEAM_LOGOS = {
  Lion: '🦁', Dragon: '🐉', Eagle: '🦅', Tiger: '🐯',
  Shark: '🦈', Wolf: '🐺', Bull: '🐂', Phoenix: '🔥'
};
const logoKeys = Object.keys(TEAM_LOGOS);

function Setup({ onSetupComplete }) {
  const [teamA, setTeamA] = useState({ name: '', logo: '' });
  const [teamB, setTeamB] = useState({ name: '', logo: '' });
  const [venue, setVenue] = useState('');
  const [totalOvers, setTotalOvers] = useState(20);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [tossChoice, setTossChoice] = useState('');
  const [isEditing, setIsEditing] = useState(null);
  const [tempName, setTempName] = useState('');
  const [now, setNow] = useState(new Date());
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    try {
      const h = JSON.parse(localStorage.getItem('active11s_history') || '[]');
      setMatchHistory(h);
    } catch (e) {}
  }, []);

  const fmtTime = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const fmtDate = (d) => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const handleCircleClick = (side) => {
    setIsEditing(side);
    setTempName(side === 'A' ? teamA.name : teamB.name);
  };

  const saveTeamName = () => {
    const randomLogo = TEAM_LOGOS[logoKeys[Math.floor(Math.random() * logoKeys.length)]];
    if (isEditing === 'A') setTeamA({ name: tempName, logo: randomLogo });
    else setTeamB({ name: tempName, logo: randomLogo });
    setIsEditing(null);
    setTempName('');
  };

  const handleStart = () => {
    if (!teamA.name || !teamB.name || !venue || !tossWinner || !tossChoice) {
      alert('Fill Team names, Venue and Toss info!');
      return;
    }
    const battingTeam = tossChoice === 'Bat'
      ? (tossWinner === 'A' ? teamA.name : teamB.name)
      : (tossWinner === 'A' ? teamB.name : teamA.name);
    onSetupComplete({
      groundName: venue,
      teamA: { ...teamA },
      teamB: { ...teamB },
      tossWinner,
      tossChoice,
      battingTeam,
      totalOvers
    });
  };

  // Team Name Entry Screen
  if (isEditing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f8fafc' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '340px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Enter Team {isEditing} Name</h2>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>A random mascot logo will be assigned automatically</p>
          <input
            autoFocus
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveTeamName()}
            placeholder="e.g. Chennai Kings"
            style={{
              width: '100%', background: '#f8fafc', border: '2px solid #e2e8f0',
              borderRadius: '14px', padding: '16px', fontSize: '16px',
              outline: 'none', marginBottom: '16px', boxSizing: 'border-box'
            }}
          />
          <button
            onClick={saveTeamName}
            style={{
              width: '100%', background: '#2563eb', color: 'white', border: 'none',
              borderRadius: '14px', padding: '16px', fontSize: '16px', fontWeight: 700, cursor: 'pointer'
            }}
          >
            CONFIRM
          </button>
        </div>
      </div>
    );
  }

  // Main Match Center Screen
  const circleStyle = (active) => ({
    width: '90px', height: '90px', borderRadius: '50%',
    background: 'white', border: `4px solid ${active ? '#2563eb' : '#e2e8f0'}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '40px', boxShadow: active ? '0 0 0 6px rgba(37,99,235,0.1)' : '0 4px 15px rgba(0,0,0,0.06)',
    cursor: 'pointer', transition: 'all 0.3s ease'
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      {/* Header with live clock */}
      <div style={{ paddingTop: '50px', paddingBottom: '10px', textAlign: 'center', paddingLeft: '16px', paddingRight: '16px' }}>
        <h1 style={{ fontFamily: 'Syncopate, sans-serif', fontSize: '22px', fontWeight: 700, letterSpacing: '-1px', color: '#0f172a' }}>
          MATCH CENTER
        </h1>
        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#2563eb', letterSpacing: '-1px', lineHeight: 1 }}>
            {fmtTime(now)}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
            {fmtDate(now)}
          </div>
        </div>
      </div>

      {/* ===== TEAM CIRCLES ROW ===== */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '40px 32px',
        boxSizing: 'border-box'
      }}>
        {/* Team A — LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={circleStyle(!!teamA.name)} onClick={() => handleCircleClick('A')}>
            {teamA.logo || '🏏'}
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', maxWidth: '90px', textAlign: 'center', color: teamA.name ? '#2563eb' : '#94a3b8' }}>
            {teamA.name || 'Team A'}
          </span>
        </div>

        {/* + Button — CENTER */}
        <div
          onClick={() => !teamA.name ? handleCircleClick('A') : handleCircleClick('B')}
          style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: '#2563eb', color: 'white', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', fontWeight: 300, cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
            flexShrink: 0
          }}
        >
          +
        </div>

        {/* Team B — RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={circleStyle(!!teamB.name)} onClick={() => handleCircleClick('B')}>
            {teamB.logo || '🏏'}
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', maxWidth: '90px', textAlign: 'center', color: teamB.name ? '#2563eb' : '#94a3b8' }}>
            {teamB.name || 'Team B'}
          </span>
        </div>
      </div>

      {/* Match Info Card */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <label style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>
            Ground / Venue
          </label>
          <input
            placeholder="Where is the match?"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            style={{
              width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
              borderRadius: '12px', padding: '14px', fontSize: '16px',
              outline: 'none', boxSizing: 'border-box', marginBottom: '16px'
            }}
          />
          <label style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>
            Match Format — {totalOvers} Overs
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[{ label: 'T10', overs: 10 }, { label: 'T20', overs: 20 }, { label: 'ODI', overs: 50 }].map(({ label, overs }) => {
              const isActive = totalOvers === overs;
              return (
                <button key={label} onClick={() => setTotalOvers(overs)} style={{
                  padding: '12px 6px', borderRadius: '12px', border: '1.5px solid',
                  borderColor: isActive ? '#2563eb' : '#e2e8f0',
                  background: isActive ? '#eff6ff' : '#f8fafc',
                  color: isActive ? '#2563eb' : '#475569',
                  fontWeight: 800, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit'
                }}>{label}</button>
              );
            })}
            {/* Custom button — shows current value if not a preset */}
            {(() => {
              const isCustom = ![10, 20, 50].includes(totalOvers);
              return (
                <button
                  onClick={() => { setCustomInput(isCustom ? String(totalOvers) : ''); setShowCustomModal(true); }}
                  style={{
                    padding: '12px 6px', borderRadius: '12px', border: '1.5px solid',
                    borderColor: isCustom ? '#2563eb' : '#e2e8f0',
                    background: isCustom ? '#eff6ff' : '#f8fafc',
                    color: isCustom ? '#2563eb' : '#475569',
                    fontWeight: 800, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit'
                  }}
                >
                  {isCustom ? `${totalOvers}` : 'Custom'}
                </button>
              );
            })()}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <label style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '10px' }}>
            Toss Details
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <select
              value={tossWinner}
              onChange={(e) => setTossWinner(e.target.value)}
              style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px', fontSize: '14px', outline: 'none' }}
            >
              <option value="">Winner</option>
              <option value="A">{teamA.name || 'Team A'}</option>
              <option value="B">{teamB.name || 'Team B'}</option>
            </select>
            <select
              value={tossChoice}
              onChange={(e) => setTossChoice(e.target.value)}
              style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px', fontSize: '14px', outline: 'none' }}
            >
              <option value="">Choice</option>
              <option value="Bat">Batting</option>
              <option value="Bowl">Bowling</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleStart}
          style={{
            width: '100%', background: '#2563eb', color: 'white', border: 'none',
            borderRadius: '16px', padding: '18px', fontSize: '16px', fontWeight: 800,
            cursor: 'pointer', boxShadow: '0 10px 30px rgba(37,99,235,0.25)',
            letterSpacing: '1px', marginBottom: '16px'
          }}
        >
            START MATCH
        </button>

        {/* ── Match History Section ── */}
        {matchHistory.length > 0 && (
          <div style={{ marginBottom: '100px', marginTop: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px', paddingLeft: '4px' }}>
              Past Matches
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {matchHistory.map((m, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                  {/* Ground + Date + PDF */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>{m.ground}</div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#cbd5e1' }}>{m.date}</div>
                    </div>
                    <button
                      onClick={() => printScorecard(m)}
                      style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: '10px', padding: '6px 12px', fontSize: '11px', fontWeight: 800, color: '#2563eb', cursor: 'pointer', letterSpacing: '0.5px' }}
                    >
                      📄 PDF
                    </button>
                  </div>

                  {/* Team Scores */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '28px' }}>{m.teamALogo}</span>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 800 }}>{m.teamAName}</div>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#2563eb', letterSpacing: '-1px' }}>
                          {m.teamAScore !== undefined ? `${m.teamAScore}/${m.teamAWkts}` : '—'}
                        </div>
                        {m.teamAOvers && <div style={{ fontSize: '10px', color: '#94a3b8' }}>{m.teamAOvers} Ov</div>}
                      </div>
                    </div>
                    <div style={{ padding: '6px 12px', borderRadius: '20px', background: '#f8fafc', color: '#64748b', fontSize: '11px', fontWeight: 800, border: '1px solid #e2e8f0' }}>vs</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'right' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 800 }}>{m.teamBName}</div>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#64748b', letterSpacing: '-1px' }}>
                          {m.teamBScore !== undefined ? `${m.teamBScore}/${m.teamBWkts}` : 'Yet to bat'}
                        </div>
                        {m.teamBOvers && <div style={{ fontSize: '10px', color: '#94a3b8' }}>{m.teamBOvers} Ov</div>}
                      </div>
                      <span style={{ fontSize: '28px' }}>{m.teamBLogo}</span>
                    </div>
                  </div>

                  {/* Awards */}
                  {(m.potm || m.bestBowler) && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                      {m.potm && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '20px', padding: '4px 12px' }}>
                          <span style={{ fontSize: '13px' }}>🏆</span>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>POTM</div>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>{m.potm}</div>
                          </div>
                        </div>
                      )}
                      {m.bestBowler && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: '20px', padding: '4px 12px' }}>
                          <span style={{ fontSize: '13px' }}>🎳</span>
                          <div>
                            <div style={{ fontSize: '9px', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Best Bowler</div>
                            <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>{m.bestBowler}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Custom Overs Modal ── */}
      {showCustomModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', borderRadius: '28px 28px 0 0',
            padding: '28px 24px 44px', width: '100%', maxWidth: '480px'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>Custom Overs</div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
              Enter the number of overs for this match
            </div>
            <input
              autoFocus
              type="number"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const v = parseInt(customInput);
                  if (!isNaN(v) && v > 0) { setTotalOvers(v); setShowCustomModal(false); }
                }
              }}
              placeholder="e.g. 15"
              style={{
                width: '100%', background: '#f8fafc', border: '2px solid #2563eb',
                borderRadius: '14px', padding: '18px', fontSize: '24px', fontWeight: 800,
                outline: 'none', boxSizing: 'border-box', textAlign: 'center',
                color: '#0f172a', marginBottom: '16px', letterSpacing: '2px'
              }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => setShowCustomModal(false)}
                style={{
                  padding: '16px', borderRadius: '14px', border: '1.5px solid #e2e8f0',
                  background: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer',
                  fontFamily: 'inherit', color: '#475569'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const v = parseInt(customInput);
                  if (!isNaN(v) && v > 0) { setTotalOvers(v); setShowCustomModal(false); }
                }}
                style={{
                  padding: '16px', borderRadius: '14px', border: 'none',
                  background: '#2563eb', color: 'white', fontWeight: 800,
                  fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit'
                }}
              >
                Set {customInput || '?'} Overs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Setup;
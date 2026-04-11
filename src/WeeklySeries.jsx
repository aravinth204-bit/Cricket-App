import { useState, useEffect } from 'react';

const STORAGE_KEY = 'active11s_weekly_series';

function getWeekLabel(dateStr) {
  const d = dateStr ? new Date(dateStr) : new Date();
  // Get Sunday of that week
  const day = d.getDay();
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - day);
  return sunday.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getCurrentSundayLabel() {
  return getWeekLabel(null);
}

function loadSeries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

function saveSeries(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { }
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = '#2563eb', bg = '#eff6ff' }) {
  return (
    <div style={{
      background: bg, borderRadius: '18px', padding: '16px 20px',
      display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '0'
    }}>
      <div style={{ fontSize: '22px' }}>{icon}</div>
      <div style={{ fontSize: '22px', fontWeight: 900, color, letterSpacing: '-1px', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '10px', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
      {sub && <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}

// ── Match Result Badge ────────────────────────────────────────────────────────
function MatchBadge({ match, idx }) {
  if (!match) {
    return (
      <div style={{
        flex: 1, borderRadius: '12px', border: '2px dashed #e2e8f0',
        minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '4px'
      }}>
        <span style={{ fontSize: '18px', opacity: 0.3 }}>🏏</span>
        <span style={{ fontSize: '9px', color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase' }}>Match {idx + 1}</span>
      </div>
    );
  }

  const winner = match.winner;
  const winnerLogo = match.winnerLogo;
  const margin = match.margin;

  return (
    <div style={{
      flex: 1, borderRadius: '12px', background: '#f8fafc',
      border: '1.5px solid #e2e8f0', padding: '12px',
      display: 'flex', flexDirection: 'column', gap: '6px'
    }}>
      <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Match {idx + 1}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '20px' }}>{winnerLogo}</span>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>{winner}</div>
          <div style={{ fontSize: '9px', color: '#10b981', fontWeight: 700 }}>WON</div>
        </div>
      </div>
      {margin && <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>{margin}</div>}
      {match.potm && (
        <div style={{ fontSize: '9px', color: '#b45309', fontWeight: 700, background: '#fffbeb', borderRadius: '6px', padding: '2px 6px', display: 'inline-block' }}>
          🏆 {match.potm}
        </div>
      )}
    </div>
  );
}

// ── Week Card ────────────────────────────────────────────────────────────────
function WeekCard({ week, index, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const teamAWins = week.matches.filter(m => m && m.winner === week.teamA).length;
  const teamBWins = week.matches.filter(m => m && m.winner === week.teamB).length;
  const totalPlayed = week.matches.filter(Boolean).length;

  let weekWinner = null;
  let weekWinnerLogo = null;
  if (teamAWins >= 2) { weekWinner = week.teamA; weekWinnerLogo = week.teamALogo; }
  else if (teamBWins >= 2) { weekWinner = week.teamB; weekWinnerLogo = week.teamBLogo; }

  const isComplete = totalPlayed >= 3 || teamAWins >= 2 || teamBWins >= 2;

  // Tally best player votes from this week
  const playerVotes = {};
  week.matches.forEach(m => {
    if (m && m.potm) {
      playerVotes[m.potm] = (playerVotes[m.potm] || 0) + 1;
    }
  });
  const bestPlayer = Object.entries(playerVotes).sort((a, b) => b[1] - a[1])[0];

  return (
    <div style={{
      background: 'white', borderRadius: '20px', overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
      marginBottom: '12px'
    }}>
      {/* Week Header */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          padding: '16px 20px', display: 'flex', alignItems: 'center',
          gap: '12px', cursor: 'pointer', userSelect: 'none'
        }}
      >
        {/* Week Number Badge */}
        <div style={{
          width: '38px', height: '38px', borderRadius: '12px',
          background: weekWinner ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : '#f1f5f9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '13px', fontWeight: 900, color: weekWinner ? 'white' : '#94a3b8' }}>
            W{index + 1}
          </span>
        </div>

        {/* Week Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>
            Sunday, {week.sundayLabel}
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
            {week.teamALogo} {week.teamA} vs {week.teamB} {week.teamBLogo} · {totalPlayed}/3 matches
          </div>
        </div>

        {/* Result Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          {weekWinner ? (
            <div style={{
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              borderRadius: '20px', padding: '4px 10px',
              fontSize: '10px', fontWeight: 800, color: 'white',
              display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap'
            }}>
              {weekWinnerLogo} {weekWinner}
            </div>
          ) : isComplete ? (
            <div style={{ borderRadius: '20px', padding: '4px 10px', background: '#f1f5f9', fontSize: '10px', fontWeight: 700, color: '#64748b' }}>
              Ongoing
            </div>
          ) : (
            <div style={{ borderRadius: '20px', padding: '4px 10px', background: '#f0fdf4', fontSize: '10px', fontWeight: 700, color: '#16a34a', border: '1px solid #bbf7d0' }}>
              In Progress
            </div>
          )}
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
            {teamAWins}–{teamBWins}
          </div>
        </div>

        <div style={{ fontSize: '14px', color: '#cbd5e1', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div style={{ borderTop: '1px solid #f1f5f9', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Match results */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[0, 1, 2].map(i => (
              <MatchBadge key={i} match={week.matches[i] || null} idx={i} />
            ))}
          </div>

          {/* Best Player of the Week */}
          {bestPlayer && (
            <div style={{
              background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
              border: '1.5px solid #fde68a', borderRadius: '14px', padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <span style={{ fontSize: '24px' }}>🏅</span>
              <div>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Best Player of the Week
                </div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>{bestPlayer[0]}</div>
                <div style={{ fontSize: '10px', color: '#92400e' }}>{bestPlayer[1]} POTM award{bestPlayer[1] > 1 ? 's' : ''} this week</div>
              </div>
            </div>
          )}

          {/* Score line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, height: '8px', borderRadius: '99px', background: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '99px',
                width: `${(teamAWins / 3) * 100}%`,
                background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                transition: 'width 0.5s ease'
              }} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap' }}>
              {teamAWins} – {teamBWins}
            </div>
            <div style={{ flex: 1, height: '8px', borderRadius: '99px', background: '#e2e8f0', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '99px', marginLeft: 'auto',
                width: `${(teamBWins / 3) * 100}%`,
                background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                transition: 'width 0.5s ease',
                float: 'right'
              }} />
            </div>
          </div>

          {/* Delete Week */}
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(index); }}
            style={{
              background: 'none', border: '1.5px solid #fee2e2', borderRadius: '10px',
              padding: '8px', fontSize: '11px', fontWeight: 700, color: '#ef4444',
              cursor: 'pointer', alignSelf: 'flex-end'
            }}
          >
            🗑 Delete Week
          </button>
        </div>
      )}
    </div>
  );
}

// ── MAIN: WeeklySeries Component ──────────────────────────────────────────────
function WeeklySeries({ onBack, matchHistory }) {
  const [series, setSeries] = useState(() => loadSeries());
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(null);
  const [selectedMatchSlot, setSelectedMatchSlot] = useState(null);
  const [showNewWeek, setShowNewWeek] = useState(false);
  const [newTeamA, setNewTeamA] = useState('');
  const [newTeamB, setNewTeamB] = useState('');
  const [activeTab, setActiveTab] = useState('weeks'); // 'weeks' | 'stats'

  // Unlinked matches from history (not already in any series week)
  const linkedMatchDates = series.flatMap(w => w.matches.filter(Boolean).map(m => m.date));
  const unlinkedMatches = matchHistory.filter(m => !linkedMatchDates.includes(m.date));

  const handleSaveSeries = (updated) => {
    setSeries(updated);
    saveSeries(updated);
  };

  const handleDeleteWeek = (idx) => {
    if (!window.confirm('Delete this week\'s record?')) return;
    const updated = series.filter((_, i) => i !== idx);
    handleSaveSeries(updated);
  };

  const handleAddWeek = () => {
    if (!newTeamA.trim() || !newTeamB.trim()) {
      alert('Enter both team names!');
      return;
    }
    const newWeek = {
      sundayLabel: getCurrentSundayLabel(),
      teamA: newTeamA.trim(),
      teamALogo: '🏏',
      teamB: newTeamB.trim(),
      teamBLogo: '🏏',
      matches: [null, null, null],
      createdAt: new Date().toISOString()
    };
    handleSaveSeries([newWeek, ...series]);
    setShowNewWeek(false);
    setNewTeamA('');
    setNewTeamB('');
  };

  const handleLinkMatch = (match) => {
    if (selectedWeekIdx === null || selectedMatchSlot === null) return;
    const updated = series.map((w, wi) => {
      if (wi !== selectedWeekIdx) return w;
      const matches = [...w.matches];
      matches[selectedMatchSlot] = {
        date: match.date,
        winner: match.winner,
        winnerLogo: match.winner === match.teamAName ? match.teamALogo : match.teamBLogo,
        margin: match.margin || '',
        potm: match.potm || null,
        teamAScore: match.teamAScore,
        teamBScore: match.teamBScore,
        teamAName: match.teamAName,
        teamBName: match.teamBName,
      };
      return { ...w, matches };
    });
    handleSaveSeries(updated);
    setShowLinkModal(false);
    setSelectedWeekIdx(null);
    setSelectedMatchSlot(null);
  };

  const openLinkModal = (weekIdx, slot) => {
    setSelectedWeekIdx(weekIdx);
    setSelectedMatchSlot(slot);
    setShowLinkModal(true);
  };

  // ── Overall Stats ─────────────────────────────────────────────────────────
  const allCompletedWeeks = series.filter(w => {
    const aW = w.matches.filter(m => m && m.winner === w.teamA).length;
    const bW = w.matches.filter(m => m && m.winner === w.teamB).length;
    return aW >= 2 || bW >= 2;
  });

  const teamWinRecord = {};
  allCompletedWeeks.forEach(w => {
    const aW = w.matches.filter(m => m && m.winner === w.teamA).length;
    const bW = w.matches.filter(m => m && m.winner === w.teamB).length;
    const wTeam = aW >= 2 ? w.teamA : w.teamB;
    const lTeam = aW >= 2 ? w.teamB : w.teamA;
    teamWinRecord[wTeam] = (teamWinRecord[wTeam] || { wins: 0, losses: 0 });
    teamWinRecord[wTeam].wins++;
    teamWinRecord[lTeam] = (teamWinRecord[lTeam] || { wins: 0, losses: 0 });
    teamWinRecord[lTeam].losses++;
  });

  const playerAwards = {};
  series.forEach(w => w.matches.forEach(m => {
    if (m && m.potm) {
      playerAwards[m.potm] = (playerAwards[m.potm] || 0) + 1;
    }
  }));
  const topPlayers = Object.entries(playerAwards).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const totalMatchesPlayed = series.reduce((sum, w) => sum + w.matches.filter(Boolean).length, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', paddingBottom: '90px' }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(160deg, #0a1628 0%, #0f2050 100%)',
        padding: '50px 20px 24px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.4) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '12px',
            width: '40px', height: '40px', color: 'white', fontSize: '18px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>←</button>
          <div>
            <div style={{ fontFamily: 'Syncopate, sans-serif', fontSize: '16px', fontWeight: 700, color: 'white', letterSpacing: '1px' }}>
              SUNDAY SERIES
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Best of 3 · Weekly Tracker
            </div>
          </div>
          <button
            onClick={() => setShowNewWeek(true)}
            style={{
              marginLeft: 'auto', background: '#2563eb', border: 'none',
              borderRadius: '14px', padding: '10px 18px', color: 'white',
              fontSize: '12px', fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(37,99,235,0.4)', letterSpacing: '0.5px'
            }}
          >
            + NEW WEEK
          </button>
        </div>

        {/* Quick stats row */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', position: 'relative' }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 900, color: 'white' }}>{series.length}</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Weeks</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 900, color: 'white' }}>{allCompletedWeeks.length}</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Completed</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: '14px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#fbbf24' }}>{totalMatchesPlayed}</div>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Matches</div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', padding: '16px 20px 0', gap: '8px' }}>
        {[['weeks', '📅 Weeks'], ['stats', '📊 Stats']].map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '12px', borderRadius: '14px', border: 'none',
              background: activeTab === tab ? '#2563eb' : 'white',
              color: activeTab === tab ? 'white' : '#64748b',
              fontWeight: 800, fontSize: '13px', cursor: 'pointer',
              boxShadow: activeTab === tab ? '0 6px 20px rgba(37,99,235,0.25)' : '0 2px 8px rgba(0,0,0,0.04)',
              fontFamily: 'inherit', transition: 'all 0.2s'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Weeks Tab ── */}
      {activeTab === 'weeks' && (
        <div style={{ padding: '16px 20px' }}>
          {series.length === 0 ? (
            <div style={{
              background: 'white', borderRadius: '20px', padding: '48px 24px',
              textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗓️</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                No Sunday Series Yet
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                Tap "+ NEW WEEK" to start tracking your Sunday best-of-3 series!
              </div>
            </div>
          ) : (
            series.map((week, i) => (
              <div key={i}>
                <WeekCard week={week} index={i} onDelete={handleDeleteWeek} />
                {/* Link match buttons for each slot */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '-4px', marginBottom: '12px' }}>
                  {[0, 1, 2].map(slot => (
                    week.matches[slot] ? null : (
                      <button
                        key={slot}
                        onClick={() => openLinkModal(i, slot)}
                        style={{
                          flex: 1, padding: '8px', borderRadius: '10px',
                          border: '1.5px dashed #bfdbfe', background: '#eff6ff',
                          fontSize: '10px', fontWeight: 800, color: '#2563eb',
                          cursor: 'pointer', fontFamily: 'inherit'
                        }}
                      >
                        + Link Match {slot + 1}
                      </button>
                    )
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Stats Tab ── */}
      {activeTab === 'stats' && (
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Team Leaderboard */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px' }}>
              🏆 Team Win Table
            </div>
            {Object.keys(teamWinRecord).length === 0 ? (
              <div style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>
                No completed series weeks yet
              </div>
            ) : (
              Object.entries(teamWinRecord)
                .sort((a, b) => b[1].wins - a[1].wins)
                .map(([team, rec], i) => {
                  const total = rec.wins + rec.losses;
                  const pct = total > 0 ? (rec.wins / total) * 100 : 0;
                  return (
                    <div key={team} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '24px', height: '24px', borderRadius: '8px',
                            background: i === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : '#f1f5f9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '11px', fontWeight: 900, color: i === 0 ? 'white' : '#94a3b8'
                          }}>{i + 1}</div>
                          <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{team}</span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a' }}>
                          <span style={{ color: '#10b981' }}>{rec.wins}W</span>
                          <span style={{ color: '#94a3b8', margin: '0 4px' }}>·</span>
                          <span style={{ color: '#ef4444' }}>{rec.losses}L</span>
                        </div>
                      </div>
                      <div style={{ height: '6px', borderRadius: '99px', background: '#f1f5f9', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', width: `${pct}%`,
                          background: i === 0 ? 'linear-gradient(90deg, #2563eb, #7c3aed)' : '#94a3b8',
                          borderRadius: '99px', transition: 'width 0.6s ease'
                        }} />
                      </div>
                      <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '3px', fontWeight: 600 }}>
                        {pct.toFixed(0)}% win rate · {total} series played
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          {/* Player Awards Leaderboard */}
          <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px' }}>
              🌟 Player of the Match Awards
            </div>
            {topPlayers.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>
                No POTM awards recorded yet
              </div>
            ) : (
              topPlayers.map(([player, awards], i) => (
                <div key={player} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 0',
                  borderBottom: i < topPlayers.length - 1 ? '1px solid #f1f5f9' : 'none'
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
                    background: i === 0 ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                      : i === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)'
                        : i === 2 ? 'linear-gradient(135deg, #f97316, #ea580c)'
                          : '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: i < 3 ? '16px' : '12px', fontWeight: 900,
                    color: i < 3 ? 'white' : '#94a3b8'
                  }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{player}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
                      {awards} POTM award{awards > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '80px' }}>
                    {Array.from({ length: awards }).map((_, ai) => (
                      <span key={ai} style={{ fontSize: '14px' }}>🏆</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Stats Row */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <StatCard
              icon="📅"
              label="Total Sundays"
              value={series.length}
              color="#2563eb"
              bg="#eff6ff"
            />
            <StatCard
              icon="✅"
              label="Completed"
              value={allCompletedWeeks.length}
              color="#10b981"
              bg="#f0fdf4"
            />
            <StatCard
              icon="🏏"
              label="Matches"
              value={totalMatchesPlayed}
              color="#f59e0b"
              bg="#fffbeb"
            />
          </div>
        </div>
      )}

      {/* ── NEW WEEK Modal ── */}
      {showNewWeek && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', borderRadius: '28px 28px 0 0',
            padding: '28px 24px 44px', width: '100%', maxWidth: '480px'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 900, marginBottom: '6px' }}>🗓️ New Sunday Series</div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '24px' }}>
              Week of {getCurrentSundayLabel()} · Best of 3
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <input
                autoFocus
                placeholder="Team A name"
                value={newTeamA}
                onChange={e => setNewTeamA(e.target.value)}
                style={{
                  width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
                  borderRadius: '14px', padding: '16px', fontSize: '16px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit'
                }}
              />
              <div style={{ textAlign: 'center', fontSize: '20px', color: '#94a3b8' }}>⚔️</div>
              <input
                placeholder="Team B name"
                value={newTeamB}
                onChange={e => setNewTeamB(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddWeek()}
                style={{
                  width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0',
                  borderRadius: '14px', padding: '16px', fontSize: '16px', outline: 'none',
                  boxSizing: 'border-box', fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => { setShowNewWeek(false); setNewTeamA(''); setNewTeamB(''); }}
                style={{
                  padding: '16px', borderRadius: '14px', border: '1.5px solid #e2e8f0',
                  background: 'white', fontWeight: 700, fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit', color: '#475569'
                }}
              >Cancel</button>
              <button
                onClick={handleAddWeek}
                style={{
                  padding: '16px', borderRadius: '14px', border: 'none',
                  background: '#2563eb', color: 'white', fontWeight: 800,
                  fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit'
                }}
              >Create Week</button>
            </div>
          </div>
        </div>
      )}

      {/* ── LINK MATCH Modal ── */}
      {showLinkModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', borderRadius: '28px 28px 0 0',
            padding: '28px 24px 44px', width: '100%', maxWidth: '480px',
            maxHeight: '75vh', overflowY: 'auto'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 900, marginBottom: '6px' }}>
              🔗 Link Match {selectedMatchSlot !== null ? selectedMatchSlot + 1 : ''}
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>
              Pick a completed match from history to add to this week
            </div>
            {unlinkedMatches.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: '14px' }}>
                No unlinked matches found. Play a match first!
              </div>
            ) : (
              unlinkedMatches.map((m, i) => (
                <div
                  key={i}
                  onClick={() => handleLinkMatch(m)}
                  style={{
                    background: '#f8fafc', borderRadius: '16px', padding: '16px',
                    marginBottom: '10px', cursor: 'pointer', border: '1.5px solid #e2e8f0',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>{m.date}</div>
                    {m.potm && (
                      <div style={{ fontSize: '9px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '2px 8px', color: '#b45309', fontWeight: 700 }}>
                        🏆 {m.potm}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{m.teamALogo}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 800 }}>{m.teamAName}</div>
                      <div style={{ fontSize: '13px', fontWeight: 900, color: '#2563eb' }}>
                        {m.teamAScore !== undefined ? `${m.teamAScore}/${m.teamAWkts}` : '—'}
                      </div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>VS</div>
                    <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800 }}>{m.teamBName}</div>
                      <div style={{ fontSize: '13px', fontWeight: 900, color: '#64748b' }}>
                        {m.teamBScore !== undefined ? `${m.teamBScore}/${m.teamBWkts}` : '—'}
                      </div>
                    </div>
                    <span style={{ fontSize: '20px' }}>{m.teamBLogo}</span>
                  </div>
                  {m.winner && (
                    <div style={{ marginTop: '8px', fontSize: '10px', color: '#10b981', fontWeight: 800 }}>
                      ✅ {m.winner} won {m.margin ? `· ${m.margin}` : ''}
                    </div>
                  )}
                </div>
              ))
            )}
            <button
              onClick={() => { setShowLinkModal(false); setSelectedWeekIdx(null); setSelectedMatchSlot(null); }}
              style={{
                width: '100%', padding: '16px', borderRadius: '14px',
                border: '1.5px solid #e2e8f0', background: 'white',
                fontWeight: 700, fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit', color: '#475569',
                marginTop: '8px'
              }}
            >Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WeeklySeries;

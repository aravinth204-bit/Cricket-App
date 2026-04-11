import { useState } from 'react';

const TEAM_LOGOS = {
  Lion: '🦁',
  Dragon: '🐉',
  Eagle: '🦅',
  Tiger: '🐯',
  Shark: '🦈',
  Wolf: '🐺',
  Bull: '🐂',
  Phoenix: '🔥'
};

const logoKeys = Object.keys(TEAM_LOGOS);

function Setup({ onSetupComplete }) {
  const [teamA, setTeamA] = useState({ name: '', logo: '' });
  const [teamB, setTeamB] = useState({ name: '', logo: '' });
  const [venue, setVenue] = useState('');
  const [tossWinner, setTossWinner] = useState('');
  const [tossChoice, setTossChoice] = useState('');
  const [isEditing, setIsEditing] = useState(null); // 'A' or 'B'
  const [tempName, setTempName] = useState('');

  const handleCircleClick = (side) => {
    setIsEditing(side);
    setTempName(side === 'A' ? teamA.name : teamB.name);
  };

  const saveTeamName = () => {
    const randomLogo = TEAM_LOGOS[logoKeys[Math.floor(Math.random() * logoKeys.length)]];
    if (isEditing === 'A') {
      setTeamA({ name: tempName, logo: randomLogo });
    } else {
      setTeamB({ name: tempName, logo: randomLogo });
    }
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
      battingTeam: battingTeam,
      totalOvers: 20 // Defaulting to 20 for simplicity in this flow
    });
  };

  if (isEditing) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center scale-in">
        <div className="modern-card w-full max-w-xs">
          <h2 className="text-lg font-bold mb-4">Enter Team {isEditing} Name</h2>
          <input 
            autoFocus
            className="modern-input mb-4" 
            value={tempName} 
            onChange={(e) => setTempName(e.target.value)}
            placeholder="e.g. Chennai Kings"
          />
          <button onClick={saveTeamName} className="btn-start">CONFIRM NAME</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center pt-10 fade-in">
      <header className="mb-10 text-center">
        <h1 className="text-2xl font-black brand-title">MATCH CENTER</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Today Live Setup</p>
      </header>

      {/* Circle Selection Section */}
      <div className="w-full max-w-sm flex items-center justify-between mb-12 px-4">
        <div className="flex flex-col items-center gap-3 w-24">
          <div 
            onClick={() => handleCircleClick('A')}
            className={`team-circle ${teamA.name ? 'active' : ''}`}
          >
            {teamA.logo || 'A'}
          </div>
          <span className="text-[10px] font-black uppercase tracking-tight text-center truncate w-full">{teamA.name || 'Team A'}</span>
        </div>

        <button 
          onClick={() => !teamA.name ? handleCircleClick('A') : handleCircleClick('B')} 
          className="plus-btn"
        >
          +
        </button>

        <div className="flex flex-col items-center gap-3 w-24">
          <div 
            onClick={() => handleCircleClick('B')}
            className={`team-circle ${teamB.name ? 'active' : ''}`}
          >
            {teamB.logo || 'B'}
          </div>
          <span className="text-[10px] font-black uppercase tracking-tight text-center truncate w-full">{teamB.name || 'Team B'}</span>
        </div>
      </div>

      {/* Bottom Info Section */}
      <div className="w-full max-w-sm space-y-6">
        <div className="modern-card">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Ground / Venue</label>
              <input 
                placeholder="Where is the match?" 
                className="modern-input" 
                value={venue} 
                onChange={(e) => setVenue(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Toss Winner</label>
                <select className="modern-input text-sm" value={tossWinner} onChange={e => setTossWinner(e.target.value)}>
                  <option value="">Winner</option>
                  <option value="A">{teamA.name || 'Team A'}</option>
                  <option value="B">{teamB.name || 'Team B'}</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Decision</label>
                <select className="modern-input text-sm" value={tossChoice} onChange={e => setTossChoice(e.target.value)}>
                  <option value="">Choice</option>
                  <option value="Bat">Batting</option>
                  <option value="Bowl">Bowling</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleStart} className="btn-start">START MATCH</button>
      </div>
    </div>
  );
}

export default Setup;
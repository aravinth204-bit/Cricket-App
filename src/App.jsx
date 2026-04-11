import { useState, useEffect } from 'react';
import Setup from './Setup';
import Scoreboard from './Scoreboard';

function SplashScreen() {
  return (
    <div className="splash-container">
      <div className="brand-title text-2xl font-black text-primary animate-pulse">
        ACTIVE <span className="text-slate-800">11'S</span>
      </div>
      <div className="loader-bar">
        <div className="loader-progress"></div>
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

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center fade-in">
      <div className="modern-card w-full max-w-sm">
        <h2 className="text-xl font-bold mb-6">Select Opening Players</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Batting Power</label>
            <div className="grid grid-cols-2 gap-3">
              <input 
                placeholder="Striker" 
                className="modern-input text-sm" 
                value={b1} 
                onChange={e => setB1(e.target.value)} 
              />
              <input 
                placeholder="Non-Striker" 
                className="modern-input text-sm" 
                value={b2} 
                onChange={e => setB2(e.target.value)} 
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-widest">Opening Attack</label>
            <input 
              placeholder="Strike Bowler" 
              className="modern-input text-sm" 
              value={bowler} 
              onChange={e => setBowler(e.target.value)} 
            />
          </div>
          <p className="text-[10px] text-slate-400 italic">Leave blank to auto-fill with generic names</p>
          <button onClick={handleGo} className="btn-start mt-4">GO TO SCOREBOARD</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState('splash');
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen('setup');
    }, 2000);
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

  return (
    <>
      {screen === 'splash' && <SplashScreen />}
      {screen === 'setup' && <Setup onSetupComplete={handleSetupComplete} />}
      {screen === 'players' && <PlayerSelection data={matchData} onStartMatch={handleMatchStart} />}
      {screen === 'scoreboard' && <Scoreboard data={matchData} onUpdateMatchData={handleUpdate} />}
    </>
  );
}

export default App;
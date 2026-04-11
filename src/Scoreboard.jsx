import { useEffect, useMemo, useState } from 'react';

function Scoreboard({ data, onUpdateMatchData }) {
  const [events, setEvents] = useState(data?.events || []);
  const [editChoice, setEditChoice] = useState('0');

  // Openers are passed directly from the PlayerSelection screen
  const initialBatsmen = useMemo(() => [
    { name: data.batsmen[0], runs: 0, balls: 0 },
    { name: data.batsmen[1], runs: 0, balls: 0 }
  ], [data.batsmen]);

  const replayEvents = (eventsToReplay) => {
    const resultBatsmen = initialBatsmen.map(b => ({ ...b }));
    const resultBowler = { name: data.bowler, overs: 0, runs: 0 };
    let teamScore = { score: 0, wickets: 0 };
    let overs = 0;
    let ballsInOver = 0;
    let striker = 0;
    let nextPlayerIndex = 2;

    eventsToReplay.forEach((event) => {
      if (event.type === 'run') {
        teamScore.score += event.runs;
        resultBatsmen[striker].runs += event.runs;
        resultBatsmen[striker].balls += 1;
        resultBowler.runs += event.runs;
        if (event.runs % 2 === 1) striker = 1 - striker;
      } else {
        teamScore.wickets += 1;
        // Auto-fill with generic names for wickets if no player list
        resultBatsmen[striker] = { name: `Opponent ${nextPlayerIndex + 1}`, runs: 0, balls: 0 };
        nextPlayerIndex += 1;
      }
      ballsInOver += 1;
      if (ballsInOver === 6) { overs += 1; ballsInOver = 0; }
    });

    resultBowler.overs = overs;
    return { teamScore, overs, ballsInOver, batsmen: resultBatsmen, bowler: resultBowler, striker };
  };

  const matchState = useMemo(() => replayEvents(events), [events, initialBatsmen]);

  useEffect(() => {
    if (!onUpdateMatchData) return;
    onUpdateMatchData({ ...data, events, currentScore: matchState.teamScore });
  }, [events, matchState.teamScore, data, onUpdateMatchData]);

  const addRun = (runs) => setEvents((prev) => [...prev, { type: 'run', runs }]);
  const addWicket = () => setEvents((prev) => [...prev, { type: 'wicket' }]);
  
  const replaceLastBall = () => {
    if (events.length === 0) return;
    const newEvent = editChoice === 'Wicket' ? { type: 'wicket' } : { type: 'run', runs: Number(editChoice) };
    setEvents((prev) => [...prev.slice(0, -1), newEvent]);
  };

  const currentBattingTeamLogo = data.battingTeam === data.teamA.name ? data.teamA.logo : data.teamB.logo;

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 flex flex-col items-center">
      
      {/* Dynamic Header */}
      <div className="w-full max-w-sm mb-6 flex justify-between items-center px-2">
        <h1 className="brand-title text-sm font-black text-slate-800">
          ACTIVE <span className="text-primary italic">11'S</span>
        </h1>
        <div className="text-right">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.groundName}</div>
          <div className="text-[10px] font-black text-primary uppercase">IN-PLAY</div>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200">
        
        {/* Score Card Header */}
        <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="flex justify-between items-start mb-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{currentBattingTeamLogo}</span>
                <span className="text-xs font-black uppercase tracking-widest text-primary">{data.battingTeam}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black">{matchState.teamScore.score}</span>
                <span className="text-2xl font-bold text-slate-500">/</span>
                <span className="text-3xl font-bold text-slate-400">{matchState.teamScore.wickets}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-slate-100">{matchState.overs}.{matchState.ballsInOver}</div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Overs Completed</div>
            </div>
          </div>

          {/* Batsmen Area */}
          <div className="grid grid-cols-2 gap-4">
            {matchState.batsmen.map((b, i) => (
              <div key={i} className={`p-4 rounded-2xl border transition-all ${i === matchState.striker ? 'border-primary bg-primary/10' : 'border-white/5 bg-white/5 opacity-60'}`}>
                <div className="flex justify-between items-center mb-1">
                   <span className={`text-[9px] font-black uppercase ${i === matchState.striker ? 'text-primary' : 'text-slate-500'}`}>
                    {i === matchState.striker ? 'Striker *' : 'Non-Str'}
                   </span>
                </div>
                <div className="text-sm font-bold truncate text-white uppercase italic tracking-tight">{b.name}</div>
                <div className="text-xl font-black text-white">{b.runs} <span className="text-[10px] text-slate-500 font-bold">({b.balls})</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Panel */}
        <div className="p-8 space-y-8">
          
          <div className="flex justify-between items-center px-2">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Bowler</div>
              <div className="text-sm font-bold text-slate-800 uppercase italic tracking-tight">{matchState.bowler.name}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Economy</div>
              <div className="text-sm font-black text-primary">{matchState.overs}.{matchState.ballsInOver} - {matchState.bowler.runs}R</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3, 4, 6].map(run => (
              <button key={run} onClick={() => addRun(run)} className="h-14 bg-slate-50 rounded-2xl border border-slate-100 text-slate-800 font-black text-xl hover:bg-primary hover:text-white transition-all active:scale-90">
                {run}
              </button>
            ))}
            <button onClick={addWicket} className="h-14 col-span-2 bg-rose-50 rounded-2xl border border-rose-100 text-rose-600 font-black text-sm tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95">
              OUT
            </button>
          </div>

          <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100 flex gap-2">
            <select 
              value={editChoice} 
              onChange={(e) => setEditChoice(e.target.value)} 
              className="flex-1 bg-transparent border-none text-xs font-black text-slate-400 uppercase tracking-widest px-4 focus:ring-0"
            >
              {[0,1,2,3,4,6].map(r => <option key={r} value={r}>{r} Runs</option>)}
              <option value="Wicket">Wicket</option>
            </select>
            <button onClick={replaceLastBall} className="h-10 px-6 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">
              Correct Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Scoreboard;

import { useState, useEffect } from 'react';

function useLiveState(key, initialData) {
  const [state, setState] = useState(() => {
    try {
       const saved = localStorage.getItem('active11s_live_' + key);
       if (saved !== null) return JSON.parse(saved);
    } catch(e) {}
    return typeof initialData === 'function' ? initialData() : initialData;
  });

  useEffect(() => {
    localStorage.setItem('active11s_live_' + key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

const WICKET_TYPES = ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Retired'];
const NEEDS_FIELDER = ['Caught', 'Run Out', 'Stumped'];

const sr = (runs, balls) => (balls === 0 ? 0 : ((runs / balls) * 100).toFixed(1));

const renderLogo = (logo, size = '40px') => {
  if (!logo) return null;
  if (typeof logo === 'string' && (logo.endsWith('.png') || logo.startsWith('/'))) {
    return <img src={logo} alt="logo" style={{ width: size, height: size, objectFit: 'contain' }} />;
  }
  return <span style={{ fontSize: size }}>{logo}</span>;
};

const renderLogoHtml = (logo, size = '24px') => {
  if (!logo) return '';
  if (typeof logo === 'string' && (logo.endsWith('.png') || logo.startsWith('/'))) {
    return `<img src="${window.location.origin}${logo}" style="width:${size};height:${size};vertical-align:middle;margin-right:8px;object-fit:contain;">`;
  }
  return logo;
};

const Confetti = () => {
  const pieces = Array.from({ length: 40 });
  return pieces.map((_, i) => (
    <div 
      key={i} 
      className="confetti" 
      style={{ 
        left: `${Math.random() * 100}vw`, 
        backgroundColor: ['#f2d74e', '#95c3de', '#ff9a91', '#85cc6f', '#3b82f6'][Math.floor(Math.random() * 5)],
        animationDelay: `${Math.random() * 2.5}s`,
        width: `${Math.random() * 8 + 6}px`,
        height: `${Math.random() * 8 + 6}px`,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px'
      }} 
    />
  ));
};

// ── PDF Generator (opens print window) ────────────────────────────────────────
export function printScorecard(m) {
  const battingRows = (m.battingScorecard || []).map(b => `
    <tr>
      <td>${b.name}</td><td class="sm">${b.status || ''}</td>
      <td class="n">${b.runs}</td><td class="n">${b.balls}</td>
      <td class="n">${b.fours || 0}</td><td class="n">${b.sixes || 0}</td>
      <td class="n">${sr(b.runs, b.balls)}</td>
    </tr>`).join('');

  const bowlingRows = (m.bowlingScorecard || []).map(b => `
    <tr>
      <td>${b.name}</td><td class="n">${b.overs}</td>
      <td class="n">${b.runs}</td><td class="n">${b.wkts}</td>
    </tr>`).join('');

  const extras = m.extras
    ? `Wd:${m.extras.wides} Nb:${m.extras.noBalls} B:${m.extras.byes} Lb:${m.extras.legByes}`
    : '';

  const html = `<!DOCTYPE html><html><head>
  <meta charset="utf-8" />
  <title>ACTIVE 11S - Scorecard</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 24px; color: #0f172a; }
    .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px; }
    .brand { font-size: 26px; font-weight: 900; color: #2563eb; letter-spacing: -1px; }
    .match-info { font-size: 13px; color: #64748b; margin-top: 4px; }
    .score-box { display: flex; justify-content: space-between; background: #1e3a8a; color: white; border-radius: 12px; padding: 18px 24px; margin-bottom: 20px; }
    .team-score h2 { margin: 0; font-size: 14px; opacity: 0.7; }
    .team-score .runs { font-size: 36px; font-weight: 900; letter-spacing: -2px; }
    .team-score .overs { font-size: 13px; opacity: 0.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    th { background: #2563eb; color: white; padding: 8px 10px; text-align: left; font-size: 11px; letter-spacing: 0.5px; }
    td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; }
    tr:hover td { background: #f8fafc; }
    .n { text-align: right; font-weight: 700; }
    .sm { color: #94a3b8; font-size: 11px; }
    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin: 16px 0 8px; }
    .awards { display: flex; gap: 20px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; }
    .award-item { font-size: 13px; }
    .award-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #b45309; }
    .award-name { font-size: 16px; font-weight: 800; color: #0f172a; }
    .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
    @media print { body { padding: 0 12px; } }
  </style>
</head><body>
  <div class="header">
    <div class="brand">ACTIVE 11'S</div>
    <div class="match-info">${m.ground} &nbsp;|&nbsp; ${m.date}</div>
  </div>

  <div class="score-box">
    <div class="team-score" style="text-align:left">
      <h2>${renderLogoHtml(m.teamALogo, '18px')} ${m.teamAName}</h2>
      ${m.teamAScore !== undefined
        ? `<div class="runs">${m.teamAScore}/${m.teamAWkts}</div><div class="overs">${m.teamAOvers} Overs</div>`
        : `<div style="opacity:0.5;font-size:14px">Yet to bat</div>`}
    </div>
    <div style="font-size:18px;align-self:center;opacity:0.4">vs</div>
    <div class="team-score" style="text-align:right">
      <h2>${m.teamBName} ${renderLogoHtml(m.teamBLogo, '18px')}</h2>
      ${m.teamBScore !== undefined
        ? `<div class="runs">${m.teamBScore}/${m.teamBWkts}</div><div class="overs">${m.teamBOvers} Overs</div>`
        : `<div style="opacity:0.5;font-size:14px">Yet to bat</div>`}
    </div>
  </div>

  ${(m.potm || m.bestBowler) ? `
  <div class="awards">
    ${m.potm ? `<div class="award-item"><div class="award-label">🏆 Player of Match</div><div class="award-name">${m.potm}</div></div>` : ''}
    ${m.bestBowler ? `<div class="award-item"><div class="award-label">🎳 Best Bowler</div><div class="award-name">${m.bestBowler}</div></div>` : ''}
  </div>` : ''}

  ${m.battingScorecard && m.battingScorecard.length > 0 ? `
  <div class="section-title">⚡ Batting — ${m.battingTeam || ''}</div>
  <table>
    <thead><tr><th>Batsman</th><th>Dismissal</th><th class="n">R</th><th class="n">B</th><th class="n">4s</th><th class="n">6s</th><th class="n">SR</th></tr></thead>
    <tbody>${battingRows}</tbody>
    <tfoot><tr><td colspan="2" style="font-weight:700">Extras</td><td colspan="5" style="text-align:right;color:#64748b;font-size:12px">${extras}</td></tr></tfoot>
  </table>` : ''}

  ${m.bowlingScorecard && m.bowlingScorecard.length > 0 ? `
  <div class="section-title">🎳 Bowling</div>
  <table>
    <thead><tr><th>Bowler</th><th class="n">O</th><th class="n">R</th><th class="n">W</th></tr></thead>
    <tbody>${bowlingRows}</tbody>
  </table>` : ''}

  <div class="footer">Generated by ACTIVE 11S Cricket App &nbsp;•&nbsp; ${new Date().toLocaleDateString()}</div>
  <script>setTimeout(() => window.print(), 400);</script>
</body></html>`;

  const win = window.open('', '_blank');
  if (win) { win.document.write(html); win.document.close(); }
}

// ── Shared helpers ─────────────────────────────────────────────────────────
const runBtnStyle = (bg = '#f1f5f9', col = '#0f172a') => ({
  flex: 1, minHeight: '56px', background: bg, border: 'none',
  borderRadius: '16px', fontSize: '20px', fontWeight: 800, color: col,
  cursor: 'pointer', fontFamily: 'inherit',
});

const ballDot = (label, i) => {
  const isWide = label === 'Wd', isNb = label.startsWith('Nb'), isW = label === 'W';
  const isFour = label === '4', isSix = label === '6';
  const bg = isW ? '#ef4444' : isFour ? '#3b82f6' : isSix ? '#8b5cf6' : isWide || isNb ? '#f59e0b' : '#e2e8f0';
  const col = (isW || isFour || isSix || isWide || isNb) ? 'white' : '#0f172a';
  return <div key={i} style={{ minWidth: '36px', height: '36px', borderRadius: '50%', background: bg, color: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800 }}>{label}</div>;
};

const Overlay = ({ children }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
    <div style={{ background: 'white', borderRadius: '28px 28px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: '480px' }}>
      {children}
    </div>
  </div>
);

// ── Scoreboard ────────────────────────────────────────────────────────────────
function Scoreboard({ data, onMatchEnd }) {
  const [totalScore, setTotalScore] = useLiveState('totalScore', 0);
  const [wkts, setWkts] = useLiveState('wkts', 0);
  const [legalBalls, setLegalBalls] = useLiveState('legalBalls', 0);
  const [extrasState, setExtrasState] = useLiveState('extrasState', { wides: 0, noBalls: 0, byes: 0, legByes: 0 });
  const [batsmen, setBatsmen] = useLiveState('batsmen', [
    { name: data.batsmen[0], runs: 0, balls: 0, fours: 0, sixes: 0 },
    { name: data.batsmen[1], runs: 0, balls: 0, fours: 0, sixes: 0 },
  ]);
  const [striker, setStriker] = useLiveState('striker', 0);
  const [dismissed, setDismissed] = useLiveState('dismissed', []);
  const [bowler, setBowler] = useLiveState('bowler', { name: data.bowler, balls: 0, runs: 0, wkts: 0 });
  const [doneBowlers, setDoneBowlers] = useLiveState('doneBowlers', []);
  const [overHistory, setOverHistory] = useLiveState('overHistory', []);
  const [currOver, setCurrOver] = useLiveState('currOver', []);

  // ── Snapshot undo ──────────────────────────────────────────────────────────
  const [snapHistory, setSnapHistory] = useLiveState('snapHistory', []);
  const getCurrentSnap = () => ({
    totalScore, wkts, legalBalls, extrasState: { ...extrasState },
    batsmen: batsmen.map(b => ({ ...b })), striker,
    dismissed: dismissed.map(d => ({ ...d })), bowler: { ...bowler },
    doneBowlers: doneBowlers.map(b => ({ ...b })),
    overHistory: overHistory.map(o => [...o]), currOver: [...currOver],
  });
  const takeSnap = () => setSnapHistory(h => [...h, getCurrentSnap()]);
  const undoLastBall = () => {
    if (snapHistory.length === 0) return;
    const prev = snapHistory[snapHistory.length - 1];
    setSnapHistory(h => h.slice(0, -1));
    setTotalScore(prev.totalScore); setWkts(prev.wkts); setLegalBalls(prev.legalBalls);
    setExtrasState(prev.extrasState); setBatsmen(prev.batsmen); setStriker(prev.striker);
    setDismissed(prev.dismissed); setBowler(prev.bowler); setDoneBowlers(prev.doneBowlers);
    setOverHistory(prev.overHistory); setCurrOver(prev.currOver);
  };

  // ── Modals ─────────────────────────────────────────────────────────────────
  const [wicketModal, setWicketModal] = useLiveState('wkModal', false);
  const [wkType, setWkType] = useState('');
  const [fielder, setFielder] = useState('');
  const [newBatName, setNewBatName] = useState('');
  const [bowlerModal, setBowlerModal] = useLiveState('bowlerModal', false);
  const [newBowlerName, setNewBowlerName] = useState('');
  const [tab, setTab] = useState('score');
  const [potm, setPotm] = useState('');
  const [bestBowlerAward, setBestBowlerAward] = useState('');
  const [activeBattingTeam, setActiveBattingTeam] = useLiveState('activeBat', data.battingTeam);
  
  // ── Innings Management ───────────────────────────────────────────────────
  const [innings, setInnings] = useLiveState('innings', data.chaseTarget ? 2 : 1);
  const [target, setTarget] = useLiveState('target', data.chaseTarget ? parseInt(data.chaseTarget, 10) : null);
  const [innings1Data, setInnings1Data] = useLiveState('in1Data', data.chaseTarget ? { score: parseInt(data.chaseTarget, 10) - 1, wkts: 10, overs: data.totalOvers, batsmen: [], bowlers: [] } : null);
  const [inningsCompleteModal, setInningsCompleteModal] = useLiveState('inningsComp', false);
  const [matchOverModal, setMatchOverModal] = useLiveState('matchOver', false);
  const [flashMsg, setFlashMsg] = useState(null);
  const [manualResult, setManualResult] = useState('');

  const showFlash = (text, bg, emojis = []) => {
    setFlashMsg({ text, bg, emojis });
    setTimeout(() => {
      setFlashMsg(m => m?.text === text ? null : m);
    }, 2000);
  };

  const [topPerformers, setTopPerformers] = useState({ batsmen: [], bowlers: [] });

  useEffect(() => {
    if (matchOverModal) {
      const allBatsmen = [
        ...(innings1Data && Array.isArray(innings1Data.batsmen) ? innings1Data.batsmen : []),
        ...dismissed,
        ...batsmen
      ].filter(b => b && b.name && b.balls > 0);

      const allBowlers = [
        ...(innings1Data && Array.isArray(innings1Data.bowlers) ? innings1Data.bowlers : []),
        ...doneBowlers,
        { ...bowler, overs: Math.floor(bowler.balls / 6) }
      ].filter(b => b && b.name && (b.balls > 0 || b.overs > 0));

      const batList = allBatsmen.map(b => ({
        name: b.name,
        pts: (b.runs || 0) * 1 + (b.fours || 0) * 0.5 + (b.sixes || 0) * 1 + ((b.runs || 0) >= 20 ? 10 : 0),
        desc: `${b.runs}(${b.balls})`
      })).sort((a, b) => b.pts - a.pts).slice(0, 4);

      const bowlList = allBowlers.map(b => ({
        name: b.name,
        pts: ((b.wkts || 0) * 25) + (10 - ((b.runs || 0) / (Math.max(1, (b.overs || 0) + (b.balls || 0) / 6)))),
        desc: `${b.wkts}W ${b.runs}R`
      })).sort((a, b) => b.pts - a.pts).slice(0, 4);

      setTopPerformers({ batsmen: batList, bowlers: bowlList });

      if (!potm && !bestBowlerAward) {
        if (bowlList[0]) setBestBowlerAward(bowlList[0].name);
        if (batList[0] && bowlList[0]) {
          setPotm(batList[0].pts > bowlList[0].pts ? batList[0].name : bowlList[0].name);
        } else if (batList[0]) setPotm(batList[0].name);
      }
    }
  }, [matchOverModal, innings1Data, dismissed, batsmen, doneBowlers, bowler, potm, bestBowlerAward]);

  const [nextBat1, setNextBat1] = useState('');
  const [nextBat2, setNextBat2] = useState('');
  const [nextBowler, setNextBowler] = useState('');

  const overs = Math.floor(legalBalls / 6);
  const ballsThisOver = legalBalls % 6;
  const totalExtras = extrasState.wides + extrasState.noBalls + extrasState.byes + extrasState.legByes;
  const totalOvers = parseInt(data.totalOvers, 10) || 20;

  const isInningsOver = legalBalls >= totalOvers * 6 || wkts >= 10;
  const isTargetReached = target !== null && totalScore >= target;

  const nextBattingTeam = activeBattingTeam === data.teamA.name ? data.teamB.name : data.teamA.name;
  const battingTeamLogo = activeBattingTeam === data.teamA.name ? data.teamA.logo : data.teamB.logo;

  // ── Core ball commit ───────────────────────────────────────────────────────
  const commitLegal = ({ batsmanRuns = 0, creditBatsman = true, label = '•' }) => {
    takeSnap();
    const newLB = legalBalls + 1;
    const newBTO = newLB % 6;
    setTotalScore(sc => sc + batsmanRuns);
    const nb = batsmen.map((b, i) => i !== striker ? b : {
      ...b,
      runs: creditBatsman ? b.runs + batsmanRuns : b.runs,
      balls: b.balls + 1,
      fours: creditBatsman && batsmanRuns === 4 ? b.fours + 1 : b.fours,
      sixes: creditBatsman && batsmanRuns === 6 ? b.sixes + 1 : b.sixes,
    });
    setBatsmen(nb);
    const newBowler = { ...bowler, balls: bowler.balls + 1, runs: bowler.runs + batsmanRuns };
    setBowler(newBowler);
    const newCurrOver = [...currOver, label];
    const newScore = totalScore + batsmanRuns;

    if (innings === 2 && target && newScore >= target) {
      setCurrOver(newCurrOver);
      setTotalScore(newScore);
      setLegalBalls(newLB);
      setMatchOverModal(true);
      return;
    }

    if (batsmanRuns === 4 && creditBatsman) showFlash('FOUR! ✨', '#3b82f6', ['💥', '🎇', '✨', '🏏', '⚡', '⚡']);
    if (batsmanRuns === 6 && creditBatsman) showFlash('SIX! 🚀', '#8b5cf6', ['🎆', '🧨', '🎆', '🚀', '🔥', '🔥']);

    if (newBTO === 0) {
      setOverHistory(h => [...h, newCurrOver]);
      setCurrOver([]);
      setLegalBalls(newLB);
      let ns = 1 - striker;
      if (batsmanRuns % 2 === 1) ns = striker;
      setStriker(ns);
      const updatedDoneBowlers = [...doneBowlers, { ...newBowler, overs: Math.floor(newLB / 6) }];
      setDoneBowlers(updatedDoneBowlers);
      
      if (newLB >= totalOvers * 6) {
        if (innings === 1) setInningsCompleteModal(true);
        else setMatchOverModal(true);
      } else {
        setBowlerModal(true);
      }
    } else {
      setCurrOver(newCurrOver);
      setLegalBalls(newLB);
      if (batsmanRuns % 2 === 1) setStriker(s => 1 - s);
    }
  };

  const handleRun = (runs) => commitLegal({ batsmanRuns: runs, creditBatsman: true, label: runs === 0 ? '•' : String(runs) });

  const handleWide = () => {
    takeSnap();
    setTotalScore(sc => {
      const newScore = sc + 1;
      if (innings === 2 && target && newScore >= target) {
        setMatchOverModal(true);
      }
      return newScore;
    });
    setExtrasState(e => ({ ...e, wides: e.wides + 1 }));
    setBowler(b => ({ ...b, runs: b.runs + 1 }));
    setCurrOver(co => [...co, 'Wd']);
  };

  const handleNoBall = (batsmanRuns = 0) => {
    takeSnap();
    const total = 1 + batsmanRuns;
    setTotalScore(sc => {
      const newScore = sc + total;
      if (innings === 2 && target && newScore >= target) {
        setMatchOverModal(true);
      }
      return newScore;
    });
    setExtrasState(e => ({ ...e, noBalls: e.noBalls + 1 }));
    setBowler(b => ({ ...b, runs: b.runs + total }));
    if (batsmanRuns > 0) {
      setBatsmen(bm => bm.map((b, i) => i !== striker ? b : {
        ...b, runs: b.runs + batsmanRuns,
        fours: batsmanRuns === 4 ? b.fours + 1 : b.fours,
        sixes: batsmanRuns === 6 ? b.sixes + 1 : b.sixes,
      }));
    }
    setCurrOver(co => [...co, batsmanRuns > 0 ? `Nb+${batsmanRuns}` : 'Nb']);
    if (total % 2 === 1) setStriker(s => 1 - s);
  };

  const handleBye = (runs) => {
    setExtrasState(e => ({ ...e, byes: e.byes + runs }));
    commitLegal({ batsmanRuns: runs, creditBatsman: false, label: `B${runs}` });
  };

  const handleLegBye = (runs) => {
    setExtrasState(e => ({ ...e, legByes: e.legByes + runs }));
    commitLegal({ batsmanRuns: runs, creditBatsman: false, label: `Lb${runs}` });
  };

  const openWicketModal = () => { setWkType(''); setFielder(''); setNewBatName(''); setWicketModal(true); };

  const confirmWicket = () => {
    if (!wkType) return;
    takeSnap();
    const newLB = legalBalls + 1;
    const newBTO = newLB % 6;
    const out = { ...batsmen[striker], balls: batsmen[striker].balls + 1, how: wkType + (fielder ? ` (${fielder})` : '') };
    setDismissed(d => [...d, out]);
    setWkts(w => w + 1);
    const bowlerWkt = !['Run Out', 'Handled Ball', 'Retired'].includes(wkType);
    const newBowler = { ...bowler, balls: bowler.balls + 1, wkts: bowler.wkts + (bowlerWkt ? 1 : 0) };
    setBowler(newBowler);
    
    const newWktsCount = wkts + 1;
    const isAllOut = newWktsCount >= 10;

    if (newBTO === 0 || isAllOut) {
      const finalOver = [...currOver, 'W'];
      setOverHistory(h => [...h, finalOver]);
      setCurrOver([]);
      setLegalBalls(newLB);
      setWicketModal(false);
      showFlash('WICKET! 🎯', '#dc2626');
      
      if (isAllOut || newLB >= totalOvers * 6) {
        if (innings === 1) setInningsCompleteModal(true);
        else setMatchOverModal(true);
      } else {
        setStriker(s => 1 - s);
        setBatsmen(bm => bm.map((b, i) => i === striker ? { name: newBatName.trim() || `Batsman ${newWktsCount + 2}`, runs: 0, balls: 0, fours: 0, sixes: 0 } : b));
        setDoneBowlers(db => [...db, { ...newBowler, overs: Math.floor(newLB / 6) }]);
        setBowlerModal(true);
      }
    } else {
      setBatsmen(bm => bm.map((b, i) => i === striker ? { name: newBatName.trim() || `Batsman ${newWktsCount + 2}`, runs: 0, balls: 0, fours: 0, sixes: 0 } : b));
      setCurrOver(co => [...co, 'W']);
      setLegalBalls(newLB);
      setWicketModal(false);
      showFlash('WICKET! 🎯', '#dc2626', ['😭', '💔', '☝️', '📉', '🥀']);
    }
  };

  const startSecondInnings = () => {
    // Save 1st Innings Data
    const i1Summary = {
      score: totalScore,
      wkts: wkts,
      overs: `${overs}.${ballsThisOver}`,
      extras: { ...extrasState },
      batsmen: [...dismissed.map(b => ({ ...b, status: b.how })), ...batsmen.map((b, i) => ({ ...b, status: i === striker ? 'not out *' : 'not out' }))],
      bowlers: [...doneBowlers, { ...bowler, overs: `${Math.floor(bowler.balls / 6)}.${bowler.balls % 6}` }]
    };
    setInnings1Data(i1Summary);
    setTarget(totalScore + 1);
    setInnings(2);
    setActiveBattingTeam(nextBattingTeam);

    // Reset Scoring State
    setTotalScore(0);
    setWkts(0);
    setLegalBalls(0);
    setExtrasState({ wides: 0, noBalls: 0, byes: 0, legByes: 0 });
    setBatsmen([
      { name: nextBat1 || 'Striker 1', runs: 0, balls: 0, fours: 0, sixes: 0 },
      { name: nextBat2 || 'Non-Striker 2', runs: 0, balls: 0, fours: 0, sixes: 0 },
    ]);
    setStriker(0);
    setDismissed([]);
    setBowler({ name: nextBowler || 'Opening Bowler', balls: 0, runs: 0, wkts: 0 });
    setDoneBowlers([]);
    setOverHistory([]);
    setCurrOver([]);
    setSnapHistory([]);
    
    setInningsCompleteModal(false);
  };

  const confirmNewBowler = () => {
    setBowler({ name: newBowlerName.trim() || `Bowler ${doneBowlers.length + 2}`, balls: 0, runs: 0, wkts: 0 });
    setNewBowlerName('');
    setBowlerModal(false);
  };

  const saveAndEnd = () => {
    const allBowlersList = [...doneBowlers, { ...bowler, overs: Math.floor(bowler.balls / 6) }];
    
    const currentBattingScorecard = [
      ...dismissed.map(b => ({ ...b, status: b.how })),
      ...batsmen.map((b, i) => ({ ...b, status: i === striker ? 'not out *' : 'not out' }))
    ];

    const isTeamABatting = activeBattingTeam === data.teamA.name;

    const summary = {
      ground: data.groundName,
      date: new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      teamAName: data.teamA.name, teamALogo: data.teamA.logo,
      teamBName: data.teamB.name, teamBLogo: data.teamB.logo,
      
      teamAScore: isTeamABatting ? totalScore : (innings1Data ? (innings === 2 ? innings1Data.score : undefined) : undefined),
      teamAWkts: isTeamABatting ? wkts : (innings1Data ? (innings === 2 ? innings1Data.wkts : undefined) : undefined),
      teamAOvers: isTeamABatting ? `${overs}.${ballsThisOver}` : (innings1Data ? (innings === 2 ? innings1Data.overs : undefined) : undefined),
      
      teamBScore: !isTeamABatting ? totalScore : (innings1Data ? (innings === 2 ? innings1Data.score : undefined) : undefined),
      teamBWkts: !isTeamABatting ? wkts : (innings1Data ? (innings === 2 ? innings1Data.wkts : undefined) : undefined),
      teamBOvers: !isTeamABatting ? `${overs}.${ballsThisOver}` : (innings1Data ? (innings === 2 ? innings1Data.overs : undefined) : undefined),
      
      potm, bestBowler: bestBowlerAward,
      battingTeam: activeBattingTeam, 
      totalOvers: data.totalOvers,
      extras: extrasState,
      battingScorecard: currentBattingScorecard,
      bowlingScorecard: allBowlersList.map(b => ({ name: b.name, overs: `${Math.floor(b.balls / 6)}.${b.balls % 6}`, runs: b.runs, wkts: b.wkts })),
      
      result: manualResult || (target ? (totalScore >= target ? `${activeBattingTeam} won by ${10 - wkts} wickets` : (isInningsOver ? `${activeBattingTeam === data.teamA.name ? data.teamB.name : data.teamA.name} won by ${target - 1 - totalScore} runs` : 'Match tied')) : 'Match Summary')
    };
    if (onMatchEnd) onMatchEnd(summary);
  };

  const inpSt = { width: '100%', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', fontSize: '16px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', color: '#0f172a' };

  // ── SCORECARD VIEW ─────────────────────────────────────────────────────────
  if (tab === 'card') {
    const thSt = { fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', padding: '8px 4px', textAlign: 'left' };
    const tdSt = { fontSize: '13px', padding: '10px 4px', borderBottom: '1px solid #f1f5f9', color: '#0f172a' };
    const tdNum = { ...tdSt, textAlign: 'right', fontWeight: 700 };
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
        <div style={{ background: '#2563eb', color: 'white', padding: '40px 20px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.7 }}>{data.groundName}</div>
            <button onClick={() => setTab('score')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>← Back</button>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, opacity: 0.8, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderLogo(data.battingTeam === data.teamA.name ? data.teamA.logo : data.teamB.logo, '24px')}
            {data.battingTeam} Innings
          </div>
          <div style={{ fontSize: '40px', fontWeight: 900, letterSpacing: '-2px' }}>{totalScore}/{wkts}</div>
          <div style={{ fontSize: '14px', opacity: 0.7 }}>{overs}.{ballsThisOver} Overs • Extras: {totalExtras}</div>
        </div>
        <div style={{ padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '16px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#2563eb', marginBottom: '12px' }}>Batting</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={{ ...thSt, width: '36%' }}>Batsman</th>
                <th style={{ ...thSt, textAlign: 'right' }}>R</th><th style={{ ...thSt, textAlign: 'right' }}>B</th>
                <th style={{ ...thSt, textAlign: 'right' }}>4s</th><th style={{ ...thSt, textAlign: 'right' }}>6s</th>
                <th style={{ ...thSt, textAlign: 'right' }}>SR</th>
              </tr></thead>
              <tbody>
                {dismissed.map((b, i) => (
                  <tr key={i}>
                    <td style={tdSt}><div style={{ fontWeight: 700 }}>{b.name}</div><div style={{ fontSize: '10px', color: '#94a3b8' }}>{b.how}</div></td>
                    <td style={tdNum}>{b.runs}</td><td style={tdNum}>{b.balls}</td>
                    <td style={tdNum}>{b.fours}</td><td style={tdNum}>{b.sixes}</td><td style={tdNum}>{sr(b.runs, b.balls)}</td>
                  </tr>
                ))}
                {batsmen.map((b, i) => (
                  <tr key={`bat-${i}`}>
                    <td style={tdSt}><div style={{ fontWeight: 700, color: i === striker ? '#2563eb' : undefined }}>{b.name}{i === striker ? ' *' : ''}</div><div style={{ fontSize: '10px', color: '#10b981' }}>batting</div></td>
                    <td style={tdNum}>{b.runs}</td><td style={tdNum}>{b.balls}</td>
                    <td style={tdNum}>{b.fours}</td><td style={tdNum}>{b.sixes}</td><td style={tdNum}>{sr(b.runs, b.balls)}</td>
                  </tr>
                ))}
                <tr><td style={{ ...tdSt, fontWeight: 700 }} colSpan={3}>Extras</td><td style={tdNum} colSpan={3}>{totalExtras} (wd {extrasState.wides}, nb {extrasState.noBalls}, b {extrasState.byes}, lb {extrasState.legByes})</td></tr>
              </tbody>
            </table>
          </div>
          <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#8b5cf6', marginBottom: '12px' }}>Bowling</div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={{ ...thSt, width: '40%' }}>Bowler</th>
                <th style={{ ...thSt, textAlign: 'right' }}>O</th><th style={{ ...thSt, textAlign: 'right' }}>R</th>
                <th style={{ ...thSt, textAlign: 'right' }}>W</th><th style={{ ...thSt, textAlign: 'right' }}>Econ</th>
              </tr></thead>
              <tbody>
                {doneBowlers.map((b, i) => (
                  <tr key={i}>
                    <td style={tdSt}><div style={{ fontWeight: 700 }}>{b.name}</div></td>
                    <td style={tdNum}>{b.overs}</td><td style={tdNum}>{b.runs}</td><td style={tdNum}>{b.wkts}</td>
                    <td style={tdNum}>{b.overs > 0 ? (b.runs / b.overs).toFixed(2) : '-'}</td>
                  </tr>
                ))}
                <tr>
                  <td style={{ ...tdSt, color: '#2563eb', fontWeight: 700 }}>{bowler.name} *</td>
                  <td style={tdNum}>{Math.floor(bowler.balls / 6)}.{bowler.balls % 6}</td>
                  <td style={tdNum}>{bowler.runs}</td><td style={tdNum}>{bowler.wkts}</td>
                  <td style={tdNum}>{Math.floor(bowler.balls / 6) > 0 ? (bowler.runs / (bowler.balls / 6)).toFixed(2) : '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── SCORING VIEW ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#1e3a8a', color: 'white', padding: '36px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {renderLogo(battingTeamLogo, '18px')}
              {activeBattingTeam}
            </div>
            <div style={{ fontSize: '52px', fontWeight: 900, lineHeight: 1, letterSpacing: '-3px' }}>{totalScore}<span style={{ color: '#60a5fa', margin: '0 4px' }}>/</span>{wkts}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '26px', fontWeight: 800 }}>{overs}.{ballsThisOver}</div>
            <div style={{ fontSize: '10px', opacity: 0.5, textTransform: 'uppercase' }}>/ {totalOvers} Overs</div>
            {target && <div style={{ fontSize: '12px', color: '#60a5fa', fontWeight: 700, marginTop: '4px' }}>Target: {target}</div>}
            <div style={{ display: 'flex', gap: '6px', marginTop: '8px', justifyContent: 'flex-end' }}>
              <button onClick={() => setTab('card')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Scorecard</button>
              <button onClick={() => setMatchOverModal(true)} style={{ background: 'rgba(239,68,68,0.3)', border: '1px solid rgba(239,68,68,0.5)', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>End Match</button>
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, opacity: 0.5, textTransform: 'uppercase', marginBottom: '8px' }}>This Over</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', minHeight: '36px', alignItems: 'center' }}>
            {currOver.length === 0 ? <div style={{ fontSize: '12px', opacity: 0.3 }}>No balls yet</div> : currOver.map((l, i) => ballDot(l, i))}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Batsmen */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {batsmen.map((b, i) => {
            const isStr = i === striker;
            return (
              <div key={i} style={{ background: isStr ? '#eff6ff' : 'white', borderRadius: '16px', padding: '14px', border: `2px solid ${isStr ? '#2563eb' : '#e2e8f0'}`, boxShadow: isStr ? '0 0 0 4px rgba(37,99,235,0.08)' : '0 2px 6px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: isStr ? '#2563eb' : '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>{isStr ? 'Striker ●' : 'Non-Str'}</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</div>
                <div style={{ fontSize: '22px', fontWeight: 900, color: isStr ? '#2563eb' : '#0f172a' }}>{b.runs}<span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginLeft: '4px' }}>({b.balls})</span></div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>4s: {b.fours}  6s: {b.sixes}  SR: {sr(b.runs, b.balls)}</div>
              </div>
            );
          })}
        </div>

        {/* Bowler + Controls */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
          <div>
            <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '1px' }}>Bowler</div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{bowler.name}</div>
            <div style={{ fontSize: '10px', color: '#8b5cf6', fontWeight: 700 }}>{Math.floor(bowler.balls / 6)}.{bowler.balls % 6} ov  {bowler.runs} R  {bowler.wkts} W</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setStriker(s => 1 - s)} style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '8px 10px', fontSize: '11px', fontWeight: 800, color: '#15803d', cursor: 'pointer' }}>⇄ Swap</button>
            <button onClick={undoLastBall} disabled={snapHistory.length === 0} style={{ background: snapHistory.length === 0 ? '#f8fafc' : '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '12px', padding: '8px 10px', fontSize: '11px', fontWeight: 800, color: snapHistory.length === 0 ? '#cbd5e1' : '#b45309', cursor: snapHistory.length === 0 ? 'not-allowed' : 'pointer' }}>↩ Undo</button>
          </div>
        </div>

        {/* Run Buttons */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '1px', marginBottom: '12px' }}>Runs Off Bat</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            {[0, 1, 2, 3].map(r => <button key={r} onClick={() => handleRun(r)} style={runBtnStyle()}>{r}</button>)}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => handleRun(4)} style={{ ...runBtnStyle('#eff6ff', '#2563eb'), flexGrow: 1 }}>4</button>
            <button onClick={() => handleRun(6)} style={{ ...runBtnStyle('#f5f3ff', '#7c3aed'), flexGrow: 1 }}>6</button>
            <button onClick={openWicketModal} style={{ ...runBtnStyle('#fef2f2', '#dc2626'), flexGrow: 2, fontSize: '16px' }}>OUT</button>
          </div>
        </div>

        {/* Extras */}
        <div style={{ background: 'white', borderRadius: '20px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '1px', marginBottom: '12px' }}>
            Extras — Wd:{extrasState.wides} Nb:{extrasState.noBalls} B:{extrasState.byes} Lb:{extrasState.legByes} (Total:{totalExtras})
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { label: 'Wide', fn: handleWide, bg: '#fff7ed', bdr: '#fed7aa', col: '#c2410c' },
              { label: 'No Ball', fn: () => handleNoBall(0), bg: '#fff7ed', bdr: '#fed7aa', col: '#c2410c' },
              { label: 'Bye 1', fn: () => handleBye(1), bg: '#f8fafc', bdr: '#e2e8f0', col: '#475569' },
              { label: 'Bye 2', fn: () => handleBye(2), bg: '#f8fafc', bdr: '#e2e8f0', col: '#475569' },
              { label: 'LB 1', fn: () => handleLegBye(1), bg: '#f8fafc', bdr: '#e2e8f0', col: '#475569' },
              { label: 'LB 2', fn: () => handleLegBye(2), bg: '#f8fafc', bdr: '#e2e8f0', col: '#475569' },
            ].map(({ label, fn, bg, bdr, col }) => (
              <button key={label} onClick={fn} style={{ flex: 1, minWidth: '60px', padding: '12px 6px', background: bg, border: `1.5px solid ${bdr}`, borderRadius: '12px', fontSize: '12px', fontWeight: 800, color: col, cursor: 'pointer' }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Over History */}
        {overHistory.length > 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '14px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '1px', marginBottom: '10px' }}>Over History</div>
            {overHistory.map((over, oi) => (
              <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', minWidth: '28px' }}>Ov {oi + 1}</span>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>{over.map((b, bi) => ballDot(b, bi))}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── WICKET MODAL ── */}
      {wicketModal && (
        <Overlay>
          <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>How is {batsmen[striker].name} out?</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>{batsmen[striker].runs} runs off {batsmen[striker].balls} balls</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {WICKET_TYPES.map(wt => (
              <button key={wt} onClick={() => setWkType(wt)} style={{ padding: '10px 16px', borderRadius: '12px', border: '1.5px solid', borderColor: wkType === wt ? '#2563eb' : '#e2e8f0', background: wkType === wt ? '#eff6ff' : 'white', color: wkType === wt ? '#2563eb' : '#0f172a', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>{wt}</button>
            ))}
          </div>
          {wkType && NEEDS_FIELDER.includes(wkType) && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>{wkType === 'Caught' ? 'Caught by' : wkType === 'Stumped' ? 'Stumped by' : 'Run Out by'}</div>
              <input 
                value={fielder} 
                onChange={e => {
                  const val = e.target.value;
                  setFielder(val ? val.charAt(0).toUpperCase() + val.slice(1) : '');
                }} 
                placeholder="Fielder name" 
                style={inpSt} 
              />
            </div>
          )}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>New Batsman (leave blank to auto-fill)</div>
            <input 
              value={newBatName} 
              onChange={e => {
                const val = e.target.value;
                setNewBatName(val ? val.charAt(0).toUpperCase() + val.slice(1) : '');
              }} 
              placeholder={`Batsman ${wkts + 3}`} 
              style={inpSt} 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button onClick={() => setWicketModal(false)} style={{ padding: '16px', borderRadius: '14px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
            <button onClick={confirmWicket} style={{ padding: '16px', borderRadius: '14px', border: 'none', background: '#dc2626', color: 'white', fontWeight: 800, fontSize: '14px', cursor: 'pointer', opacity: wkType ? 1 : 0.4 }}>Confirm OUT</button>
          </div>
        </Overlay>
      )}

      {/* ── NEW BOWLER MODAL ── */}
      {bowlerModal && (
        <Overlay>
          <div style={{ fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>Over {overs} Complete!</div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>Who bowls the next over?</div>
          <input 
            autoFocus 
            value={newBowlerName} 
            onChange={e => {
              const val = e.target.value;
              setNewBowlerName(val ? val.charAt(0).toUpperCase() + val.slice(1) : '');
            }} 
            onKeyDown={e => e.key === 'Enter' && confirmNewBowler()} 
            placeholder={`Bowler ${doneBowlers.length + 2}`} 
            style={{ ...inpSt, marginBottom: '16px' }} 
          />
          <button onClick={confirmNewBowler} style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 800, fontSize: '16px', cursor: 'pointer' }}>
            Start Over {overs + 1} →
          </button>
        </Overlay>
      )}

      {/* ── INNINGS COMPLETE MODAL ── */}
      {inningsCompleteModal && (
        <Overlay>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#2563eb', marginBottom: '8px' }}>Innings Complete!</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>
              {activeBattingTeam} scored {totalScore}/{wkts} in {overs}.{ballsThisOver} overs
            </div>
            
            <div style={{ background: '#f8fafc', borderRadius: '20px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Next Innings Setup — {nextBattingTeam}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#2563eb', marginBottom: '6px' }}>Striker</div>
                  <input 
                    placeholder="Name" 
                    value={nextBat1} 
                    onChange={e => {
                      const val = e.target.value;
                      setNextBat1(val ? val.charAt(0).toUpperCase() + val.slice(1) : '');
                    }} 
                    style={inpSt} 
                  />
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>Non-Striker</div>
                  <input 
                    placeholder="Name" 
                    value={nextBat2} 
                    onChange={e => {
                      const val = e.target.value;
                      setNextBat2(val ? val.charAt(0).toUpperCase() + val.slice(1) : '');
                    }} 
                    style={inpSt} 
                  />
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: '#8b5cf6', marginBottom: '6px' }}>Opening Bowler ({activeBattingTeam})</div>
                <input 
                  placeholder="Name" 
                  value={nextBowler} 
                  onChange={e => {
                    const val = e.target.value;
                    setNextBowler(val ? val.charAt(0).toUpperCase() + val.slice(1) : '');
                  }} 
                  style={inpSt} 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={() => setMatchOverModal(true)} style={{ padding: '16px', borderRadius: '16px', border: '1.5px solid #e2e8f0', background: 'white', fontWeight: 700, fontSize: '15px' }}>End Match</button>
              <button onClick={startSecondInnings} style={{ padding: '16px', borderRadius: '16px', border: 'none', background: '#2563eb', color: 'white', fontWeight: 800, fontSize: '15px' }}>
                Start 2nd Innings →
              </button>
            </div>
          </div>
        </Overlay>
      )}

      {/* ── MATCH OVER / END MODAL ── */}
      {matchOverModal && (
        <>
          <Confetti />
          <Overlay>
            <div className="win-celebration" style={{ maxHeight: '85vh', overflowY: 'auto', padding: '10px 4px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#0f172a', letterSpacing: '-1.5px', marginBottom: '4px' }}>Match Over! 🏆</div>
                <div style={{ 
                  display: 'inline-block',
                  padding: '6px 16px',
                  background: '#eff6ff',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#2563eb',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.1)'
                }}>
                  {manualResult || (target ? (totalScore >= target ? `${activeBattingTeam} won by ${10 - wkts} wickets 🎉` : (isInningsOver ? `${nextBattingTeam} won by ${target - 1 - totalScore} runs 🎯` : 'Match tied 🤝')) : 'Full Match Summary')}
                </div>
              </div>

              {/* Manual Result Declaration */}
              <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '16px', marginBottom: '28px', border: '1.5px solid #e2e8f0' }}>
                <label style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '12px', textAlign: 'center' }}>
                  Declare Winner Manually
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { label: `${data.teamA.name} Won`, val: `${data.teamA.name} Won` },
                    { label: `${data.teamB.name} Won`, val: `${data.teamB.name} Won` },
                    { label: 'Draw / Tied', val: 'Match Draw/Tied' },
                    { label: 'Abandoned', val: 'Match Abandoned' }
                  ].map(r => (
                    <button
                      key={r.val}
                      onClick={() => setManualResult(manualResult === r.val ? '' : r.val)}
                      style={{
                        padding: '12px 6px', borderRadius: '12px', border: '1.5px solid',
                        borderColor: manualResult === r.val ? '#2563eb' : '#e2e8f0',
                        background: manualResult === r.val ? '#eff6ff' : 'white',
                        color: manualResult === r.val ? '#2563eb' : '#64748b',
                        fontSize: '11px', fontWeight: 800, cursor: 'pointer'
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Score comparison card */}
              <div style={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', 
                borderRadius: '28px', 
                padding: '24px', 
                marginBottom: '28px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                border: '1.5px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                {/* Team Left */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: '64px', height: '64px', background: 'white', borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                    border: '3px solid white'
                  }}>
                    {renderLogo(data.teamA.logo, '42px')}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{data.teamA.name}</div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#2563eb', letterSpacing: '-1px' }}>
                      {activeBattingTeam === data.teamA.name ? `${totalScore}/${wkts}` : (innings1Data ? `${innings1Data.score}/${innings1Data.wkts}` : '—')}
                    </div>
                  </div>
                </div>

                <div style={{ 
                  width: '40px', height: '40px', 
                  borderRadius: '12px', background: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 900, color: '#cbd5e1',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.04)',
                  zIndex: 2
                }}>VS</div>

                {/* Team Right */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: '64px', height: '64px', background: 'white', borderRadius: '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
                    border: '3px solid white'
                  }}>
                    {renderLogo(data.teamB.logo, '42px')}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{data.teamB.name}</div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: '#f59e0b', letterSpacing: '-1px' }}>
                      {activeBattingTeam === data.teamB.name ? `${totalScore}/${wkts}` : (innings1Data ? `${innings1Data.score}/${innings1Data.wkts}` : '—')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Awards Section */}
              <div style={{ background: '#f8fafc', borderRadius: '24px', padding: '20px', marginBottom: '28px', border: '1px dashed #e2e8f0' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                    🏆 Player of the Match
                  </label>
                  <input 
                    placeholder="Enter hero name..." 
                    value={potm} 
                    onChange={e => setPotm(e.target.value)} 
                    style={{...inpSt, border: '1.5px solid #ffedd5', background: 'white'}} 
                  />
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {topPerformers.batsmen.map(tp => (
                      <button key={tp.name} onClick={() => setPotm(tp.name)} style={{ background: '#fff7ed', border: '1px solid #ffd8a8', borderRadius: '8px', padding: '4px 8px', fontSize: '10px', color: '#c2410c', fontWeight: 700, cursor: 'pointer' }}>
                        {tp.name} {tp.desc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>
                    🎳 Best Bowler Award
                  </label>
                  <input 
                    placeholder="Enter name..." 
                    value={bestBowlerAward} 
                    onChange={e => setBestBowlerAward(e.target.value)} 
                    style={{...inpSt, border: '1.5px solid #f3e8ff', background: 'white'}} 
                  />
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {topPerformers.bowlers.map(tp => (
                      <button key={tp.name} onClick={() => setBestBowlerAward(tp.name)} style={{ background: '#f5f3ff', border: '1px solid #dcd1ff', borderRadius: '8px', padding: '4px 8px', fontSize: '10px', color: '#7c3aed', fontWeight: 700, cursor: 'pointer' }}>
                        {tp.name} {tp.desc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button 
                  onClick={() => setMatchOverModal(false)} 
                  style={{ 
                    padding: '18px', borderRadius: '20px', border: '2px solid #f1f5f9', 
                    background: 'white', fontWeight: 700, fontSize: '16px', color: '#64748b',
                    cursor: 'pointer', transition: 'all 0.2s' 
                  }}
                >
                  Cancel
                </button>
                <button 
                  onClick={saveAndEnd} 
                  style={{ 
                    padding: '18px', borderRadius: '20px', border: 'none', 
                    background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', 
                    color: 'white', fontWeight: 800, fontSize: '16px',
                    boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                    cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  Save & Exit
                </button>
              </div>
            </div>
          </Overlay>
        </>
      )}

      {/* ── FLASH CELEBRATION ── */}
      {flashMsg && (
        <div className="flash-message">
          <div className="flash-content">
            {flashMsg.emojis.map((emoji, i) => {
              const angle = (i / flashMsg.emojis.length) * 360;
              const dist = 150 + Math.random() * 100;
              const dx = Math.cos(angle * Math.PI / 180) * dist;
              const dy = Math.sin(angle * Math.PI / 180) * dist;
              return (
                <span 
                  key={i} 
                  className="flash-emoji-burst" 
                  style={{ '--dx': `${dx}px`, '--dy': `${dy}px`, '--dr': `${Math.random() * 360}deg` }}
                >
                  {emoji}
                </span>
              );
            })}
            <div style={{ background: flashMsg.bg, padding: '40px 60px', borderRadius: '30px', boxShadow: `0 20px 60px ${flashMsg.bg}80`, zIndex: 10, position: 'relative' }}>
              <div className="flash-text">{flashMsg.text}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Scoreboard;

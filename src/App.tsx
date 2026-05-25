import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jeopardyData } from './data';
import { Team, ActiveClue } from './types';

export default function App() {
  const [gameState, setGameState] = useState<'setup' | 'board' | 'clue' | 'victory'>('setup');
  const [numTeams, setNumTeams] = useState<number>(2);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState<number>(0);
  const [completedClues, setCompletedClues] = useState<string[]>([]); // Tracking key format: 'catIdx-clueIdx'
  
  // Clue Resolution Engine
  const [activeClue, setActiveClue] = useState<ActiveClue | null>(null);
  const [isDailyDouble, setIsDailyDouble] = useState<boolean>(false);
  const [dailyDoubleWager, setDailyDoubleWager] = useState<number>(0);
  const [isWagerLocked, setIsWagerLocked] = useState<boolean>(false);
  const [wagerInput, setWagerInput] = useState<string>('');
  const [revealAnswer, setRevealAnswer] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);

  // Hidden coordinates for Daily Double
  const [ddCoords, setDdCoords] = useState<{ cat: number; row: number }>({ cat: 0, row: 0 });

  useEffect(() => {
    // Generate a random position for Daily Double when application is ready
    const randomCat = Math.floor(Math.random() * 5);
    const randomRow = Math.floor(Math.random() * 4) + 1; // Row values 200-500
    setDdCoords({ cat: randomCat, row: randomRow });
  }, []);

  const initializeGame = () => {
    const initializedTeams = Array.from({ length: numTeams }, (_, i) => ({
      name: `Team ${i + 1}`,
      score: 0
    }));
    setTeams(initializedTeams);
    setCompletedClues([]);
    setCurrentTeamIdx(0);
    setGameState('board');
  };

  const handleBoxSelection = (catIdx: number, clueIdx: number, points: number) => {
    const clue = jeopardyData[catIdx].clues[clueIdx];
    const isDD = catIdx === ddCoords.cat && clueIdx === ddCoords.row;
    
    setActiveClue({
      categoryName: jeopardyData[catIdx].name,
      categoryIdx: catIdx,
      clueIdx,
      points,
      question: clue.q,
      answer: clue.a
    });
    
    setIsDailyDouble(isDD);
    setIsWagerLocked(!isDD); // If not Daily Double, wager configuration is omitted
    setDailyDoubleWager(points);
    setRevealAnswer(false);
    setAttempts(0);
    setGameState('clue');
  };

  const handleWagerLock = () => {
    const parsedWager = parseInt(wagerInput);
    const activeTeamScore = teams[currentTeamIdx].score;
    const maxWager = Math.max(activeTeamScore, 500); // Standard Jeopardy floor metric

    if (isNaN(parsedWager) || parsedWager < 5 || parsedWager > maxWager) {
      alert(`Invalid Wager. You must input a value between 5 and ${maxWager}`);
      return;
    }
    setDailyDoubleWager(parsedWager);
    setIsWagerLocked(true);
  };

  const submitAnswerStatus = (isCorrect: boolean) => {
    if (!activeClue) return;

    const modifiedTeams = [...teams];
    const underlyingValue = isDailyDouble ? dailyDoubleWager : activeClue.points;

    if (isCorrect) {
      modifiedTeams[currentTeamIdx].score += underlyingValue;
      setTeams(modifiedTeams);
      resolveClueOnBoard();
    } else {
      // Incorrect responses trigger point deductions
      modifiedTeams[currentTeamIdx].score -= underlyingValue;
      setTeams(modifiedTeams);

      // Daily Double allows only 1 attempt by the active team
      if (isDailyDouble) {
        resolveClueOnBoard();
        return;
      }

      const nextAttemptsCount = attempts + 1;
      setAttempts(nextAttemptsCount);

      if (nextAttemptsCount < numTeams) {
        // Rotate control to sequential team matching criteria
        const nextTeam = (currentTeamIdx + 1) % numTeams;
        setCurrentTeamIdx(nextTeam);
        setRevealAnswer(false);
      } else {
        // All teams exhausted option capabilities
        resolveClueOnBoard();
      }
    }
  };

  const resolveClueOnBoard = () => {
    if (!activeClue) return;
    const key = `${activeClue.categoryIdx}-${activeClue.clueIdx}`;
    const nextCompleted = [...completedClues, key];
    setCompletedClues(nextCompleted);
    setActiveClue(null);
    setWagerInput('');
    
    if (nextCompleted.length === 25) {
      setGameState('victory');
    } else {
      setGameState('board');
    }
  };

  return (
    <div className="w-screen h-screen relative flex items-center justify-center font-poppins bg-black">
      {/* Decorative Grid Beams Background Overlay */}
      <div className="absolute inset-0 grid-beams pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black opacity-90 pointer-events-none z-0" />

      <AnimatePresence mode="wait">
        {/* SETUP SCREEN */}
        {gameState === 'setup' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="z-10 text-center max-w-xl p-8 border border-kesri/30 bg-neutral-950/80 rounded-2xl shadow-kesri-glow backdrop-blur-md"
          >
            <div className="text-kesri text-6xl mb-4 font-light">☬</div>
            <h1 className="font-cinzel text-5xl font-bold tracking-widest text-white mb-2">1984 JEOPARDY</h1>
            <p className="text-gold text-sm uppercase tracking-widest mb-10">Sikh History & Remembrance Edition</p>
            
            <h3 className="text-gray-400 uppercase text-xs font-semibold tracking-wider mb-4">Configure Teams</h3>
            <div className="flex justify-center gap-4 mb-8">
              {[2, 3, 4].map((num) => (
                <button
                  key={num}
                  onClick={() => setNumTeams(num)}
                  className={`w-14 h-14 rounded-full border-2 font-bold transition-all duration-300 ${
                    numTeams === num 
                      ? 'bg-kesri text-black border-kesri shadow-lg' 
                      : 'border-kesri/40 text-kesri hover:bg-kesri/10'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button 
              onClick={initializeGame}
              className="w-full py-4 font-cinzel font-bold text-lg bg-kesri hover:bg-amber-500 text-black rounded-lg transition-colors duration-200 uppercase tracking-wider"
            >
              Initialize Command Board
            </button>
          </motion.div>
        )}

        {/* INTERACTIVE GAME BOARD */}
        {gameState === 'board' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 w-full h-full max-w-7xl flex flex-col justify-between p-6"
          >
            {/* Header tracking control metrics */}
            <div className="text-center py-2 border-b border-kesri/20">
              <h2 className="font-cinzel text-2xl tracking-widest text-kesri">Strategic Game Board</h2>
              <p className="text-xs text-gray-500 uppercase mt-1">
                Active Control: <span className="text-gold font-bold">{teams[currentTeamIdx]?.name}</span>
              </p>
            </div>

            {/* Core Grid Matrix Configuration */}
            <div className="grid grid-cols-5 gap-4 my-auto h-[65vh]">
              {jeopardyData.map((category, catIdx) => (
                <div key={catIdx} className="flex flex-col gap-3">
                  {/* Category Card Header */}
                  <div className="h-20 flex items-center justify-center text-center p-2 bg-neutral-900 border-b-4 border-kesri rounded shadow-md">
                    <h3 className="font-cinzel text-[11px] font-bold text-kesri leading-tight tracking-wider uppercase">
                      {category.name}
                    </h3>
                  </div>

                  {/* Value Row Coordinates */}
                  {category.clues.map((_, clueIdx) => {
                    const points = (clueIdx + 1) * 100;
                    const isUsed = completedClues.includes(`${catIdx}-${clueIdx}`);
                    return (
                      <button
                        key={clueIdx}
                        disabled={isUsed}
                        onClick={() => handleBoxSelection(catIdx, clueIdx, points)}
                        className={`flex-1 min-h-[70px] font-bold text-3xl flex items-center justify-center rounded transition-all duration-300 border ${
                          isUsed 
                            ? 'bg-neutral-950/40 border-neutral-900 text-neutral-800 cursor-default' 
                            : 'bg-neutral-900/60 border-kesri/20 text-kesri hover:bg-kesri hover:text-black hover:scale-[1.02] hover:shadow-kesri-glow'
                        }`}
                      >
                        {!isUsed && points}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Premium Lower Layer Live Scoreboard */}
            <div className="h-20 bg-neutral-950 border border-kesri/20 rounded-xl flex items-center justify-around px-8 shadow-inner">
              {teams.map((team, idx) => (
                <div 
                  key={idx} 
                  className={`text-center px-6 py-2 rounded-lg transition-all duration-300 ${
                    idx === currentTeamIdx 
                      ? 'border border-gold bg-gold/5 shadow-gold-glow scale-105' 
                      : 'opacity-60'
                  }`}
                >
                  <div className="font-cinzel text-xs uppercase tracking-widest text-gold">{team.name}</div>
                  <div className="text-2xl font-bold font-mono tracking-tight text-white">{team.score}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ACTIVE CLUE MODAL/SCREEN */}
        {gameState === 'clue' && activeClue && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-20 w-full h-full max-w-5xl flex items-center justify-center p-8"
          >
            {/* Embedded Daily Double Screen Logic Handler */}
            {isDailyDouble && !isWagerLocked && (
              <div className="absolute inset-0 z-30 bg-black flex flex-col items-center justify-center p-6 text-center">
                <motion.h1 
                  animate={{ scale: [1, 1.03, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="font-cinzel text-7xl font-bold tracking-widest text-gold drop-shadow-[0_0_30px_rgba(212,175,55,0.4)] mb-4"
                >
                  DAILY DOUBLE
                </motion.h1>
                <p className="text-gray-400 max-w-md text-sm mb-8">
                  Strategic Opportunity discovered by <span className="text-kesri font-bold">{teams[currentTeamIdx].name}</span>. Speculate point structures wisely based on active standing thresholds.
                </p>
                <div className="flex flex-col items-center gap-4">
                  <input 
                    type="number"
                    value={wagerInput}
                    onChange={(e) => setWagerInput(e.target.value)}
                    placeholder={`Min: 5 | Max: ${Math.max(teams[currentTeamIdx].score, 500)}`}
                    className="bg-neutral-900 border-2 border-gold text-white text-center font-mono text-2xl py-3 px-6 rounded-lg w-72 focus:outline-none focus:shadow-gold-glow transition-all"
                  />
                  <button 
                    onClick={handleWagerLock}
                    className="py-3 px-8 bg-gold hover:bg-amber-500 text-black font-cinzel font-bold rounded uppercase tracking-wider transition-colors"
                  >
                    Lock Strategic Wager
                  </button>
                </div>
              </div>
            )}

            {/* Standard Clue Display Panel */}
            <div className="w-full flex flex-col items-center text-center p-12 border border-kesri/30 bg-neutral-950/90 rounded-2xl shadow-kesri-glow">
              <span className="font-cinzel text-xs tracking-widest text-gold mb-1 uppercase">{activeClue.categoryName}</span>
              <span className="font-mono text-sm tracking-widest text-kesri/70 mb-8 uppercase">
                Value: {isDailyDouble ? `${dailyDoubleWager} (Daily Double)` : `${activeClue.points} Points`}
              </span>

              <div className="min-h-[160px] flex items-center justify-center mb-10 px-4">
                <p className="text-3xl font-light leading-relaxed tracking-wide max-w-4xl text-neutral-100">
                  {activeClue.question}
                </p>
              </div>

              {/* Dynamic Answer Reveal Box */}
              <div className="h-24 w-full flex items-center justify-center mb-12">
                {revealAnswer ? (
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-cinzel font-bold text-kesri tracking-wide"
                  >
                    {activeClue.answer}
                  </motion.p>
                ) : (
                  <button 
                    onClick={() => setRevealAnswer(true)}
                    className="py-3 px-8 text-sm font-cinzel border border-kesri/40 text-kesri hover:bg-kesri/10 rounded transition-all duration-200 uppercase tracking-widest"
                  >
                    Reveal Verified Truth
                  </button>
                )}
              </div>

              {/* Functional Response Verification System */}
              {revealAnswer && (
                <div className="flex gap-6 w-full max-w-md">
                  <button
                    onClick={() => submitAnswerStatus(true)}
                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase rounded-lg shadow-md transition-colors duration-150 text-sm tracking-wider"
                  >
                    Correct
                  </button>
                  <button
                    onClick={() => submitAnswerStatus(false)}
                    className="flex-1 py-4 bg-rose-700 hover:bg-rose-600 text-white font-bold uppercase rounded-lg shadow-md transition-colors duration-150 text-sm tracking-wider"
                  >
                    Incorrect
                  </button>
                  <button
                    onClick={resolveClueOnBoard}
                    className="flex-1 py-4 bg-neutral-800 hover:bg-neutral-700 text-gray-400 hover:text-white font-bold uppercase rounded-lg shadow-md transition-colors duration-150 text-sm tracking-wider"
                  >
                    Pass Box
                  </button>
                </div>
              )}

              {/* Interactive warning regarding passing control on multi-team setups */}
              {!revealAnswer && !isDailyDouble && (
                <div className="text-xs text-neutral-500 uppercase tracking-widest mt-2">
                  Answering: <span className="text-gold font-bold">{teams[currentTeamIdx].name}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* VICTORY & SUMMARY SCREEN */}
        {gameState === 'victory' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 text-center max-w-2xl p-12 border-2 border-gold/40 bg-neutral-950/90 rounded-2xl shadow-gold-glow"
          >
            <h1 className="font-cinzel text-6xl font-bold tracking-widest text-gold mb-8">OPERATION CONCLUDED</h1>
            
            <div className="mb-10 p-6 border border-kesri/20 bg-black/40 rounded-xl">
              <h2 className="text-xs text-gray-400 tracking-widest uppercase mb-1">Highest Honor Standing</h2>
              <div className="font-cinzel text-4xl text-kesri font-bold mt-2">
                {[...teams].sort((a,b) => b.score - a.score)[0]?.name} Leads
              </div>
            </div>

            <h3 className="text-left font-cinzel text-xs text-neutral-500 tracking-widest uppercase border-b border-neutral-800 pb-2 mb-4">
              Final Matrix Standing Records
            </h3>
            <div className="flex flex-col gap-3 mb-10">
              {[...teams].sort((a,b) => b.score - a.score).map((team, idx) => (
                <div key={idx} className="flex justify-between items-center font-mono py-2 px-4 bg-neutral-900/50 rounded border border-neutral-800">
                  <span className="text-gray-300 font-sans font-medium">{team.name}</span>
                  <span className={`text-xl font-bold ${team.score >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                    {team.score}
                  </span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setGameState('setup')}
              className="w-full py-4 font-cinzel font-bold text-md bg-transparent border border-kesri text-kesri hover:bg-kesri/10 rounded transition-colors duration-200 uppercase tracking-widest"
            >
              Reinitialize Operational Core
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

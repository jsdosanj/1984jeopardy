import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jeopardyData } from './data';
import { Team, ActiveClue, GameState } from './types';

// ─── Team color palette ────────────────────────────────────────────────────────
const TEAM_COLORS = [
  { border: '#FF6B1A', text: '#FF6B1A', bg: 'rgba(255,107,26,0.1)', dot: '#FF6B1A' },
  { border: '#3B82F6', text: '#60A5FA', bg: 'rgba(59,130,246,0.1)', dot: '#3B82F6' },
  { border: '#10B981', text: '#34D399', bg: 'rgba(16,185,129,0.1)', dot: '#10B981' },
  { border: '#A855F7', text: '#C084FC', bg: 'rgba(168,85,247,0.1)', dot: '#A855F7' },
];

const POINT_VALUES = [100, 200, 300, 400, 500];

// ─── Setup Screen ──────────────────────────────────────────────────────────────
function SetupScreen({ onStart }: { onStart: (teams: Team[]) => void }) {
  const [numTeams, setNumTeams] = useState<number>(2);
  const [teamNames, setTeamNames] = useState<string[]>(['Team 1', 'Team 2', 'Team 3', 'Team 4']);

  const handleStart = () => {
    const teams: Team[] = Array.from({ length: numTeams }, (_, i) => ({
      id: i,
      name: teamNames[i] || `Team ${i + 1}`,
      score: 0,
      color: TEAM_COLORS[i].border,
    }));
    onStart(teams);
  };

  return (
    <motion.div
      key="setup"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative z-10 w-full max-w-lg mx-auto px-4"
    >
      {/* Logo / Title */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
              style={{
                background: 'linear-gradient(135deg, #0D2847 0%, #071830 100%)',
                border: '2px solid #FF6B1A',
                boxShadow: '0 0 40px rgba(255,107,26,0.3)',
              }}
            >
              ☬
            </div>
            <div
              className="absolute -inset-2 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,107,26,0.15) 0%, transparent 70%)',
              }}
            />
          </div>
        </div>
        <h1
          className="font-cinzel text-5xl font-black tracking-widest text-glow-orange mb-1"
          style={{ color: '#FF6B1A', fontFamily: 'Cinzel Decorative, Cinzel, serif' }}
        >
          1984
        </h1>
        <h2
          className="font-cinzel text-2xl font-bold tracking-[0.3em] mb-2"
          style={{ color: '#F0F4FF' }}
        >
          JEOPARDY
        </h2>
        <p className="text-xs tracking-[0.25em] uppercase" style={{ color: '#8BA4C8' }}>
          Sikh History &amp; Remembrance Edition
        </p>
      </div>

      {/* Panel */}
      <div
        className="rounded-2xl p-8"
        style={{
          background: 'linear-gradient(180deg, #0A1F3A 0%, #071830 100%)',
          border: '1px solid #0D2847',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Number of teams */}
        <div className="mb-8">
          <label className="block text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#8BA4C8' }}>
            Number of Teams
          </label>
          <div className="flex gap-3 justify-center">
            {[2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setNumTeams(n)}
                className="w-16 h-16 rounded-xl font-cinzel font-bold text-xl transition-all duration-200"
                style={{
                  background: numTeams === n
                    ? 'linear-gradient(135deg, #FF6B1A 0%, #E55A10 100%)'
                    : 'linear-gradient(135deg, #071830 0%, #0A1F3A 100%)',
                  border: numTeams === n ? '2px solid #FF6B1A' : '2px solid #0D2847',
                  color: numTeams === n ? 'white' : '#8BA4C8',
                  boxShadow: numTeams === n ? '0 0 20px rgba(255,107,26,0.4)' : 'none',
                  transform: numTeams === n ? 'scale(1.08)' : 'scale(1)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Team name inputs */}
        <div className="mb-8">
          <label className="block text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#8BA4C8' }}>
            Team Names
          </label>
          <div className="flex flex-col gap-3">
            {Array.from({ length: numTeams }, (_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: TEAM_COLORS[i].dot, boxShadow: `0 0 8px ${TEAM_COLORS[i].dot}` }}
                />
                <input
                  type="text"
                  value={teamNames[i]}
                  onChange={(e) => {
                    const next = [...teamNames];
                    next[i] = e.target.value;
                    setTeamNames(next);
                  }}
                  maxLength={20}
                  className="wager-input flex-1 py-3 px-4 rounded-xl text-sm font-semibold"
                  placeholder={`Team ${i + 1}`}
                  style={{
                    background: '#071830',
                    border: `1px solid ${TEAM_COLORS[i].border}40`,
                    color: '#F0F4FF',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = TEAM_COLORS[i].border;
                    e.target.style.boxShadow = `0 0 12px ${TEAM_COLORS[i].border}40`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${TEAM_COLORS[i].border}40`;
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="divider mb-8" />

        {/* Rules summary */}
        <div className="mb-8 text-xs space-y-2" style={{ color: '#8BA4C8' }}>
          <div className="flex gap-2">
            <span style={{ color: '#FF6B1A' }}>→</span>
            <span>Wrong answer passes to the next team with no penalty</span>
          </div>
          <div className="flex gap-2">
            <span style={{ color: '#FF6B1A' }}>→</span>
            <span>If no team answers correctly, the question is retired with no points awarded</span>
          </div>
          <div className="flex gap-2">
            <span style={{ color: '#C9A84C' }}>★</span>
            <span>One hidden Daily Double doubles the points for that question</span>
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStart}
          className="btn-primary w-full py-4 rounded-xl text-sm tracking-widest"
          style={{ fontFamily: 'Cinzel, serif' }}
        >
          Begin Game
        </button>
      </div>

      {/* Footer */}
      <p className="text-center mt-6 text-xs tracking-widest uppercase" style={{ color: '#2A4A6A' }}>
        Waheguru Ji Ka Khalsa · Waheguru Ji Ki Fateh
      </p>
    </motion.div>
  );
}

// ─── Scoreboard Strip ──────────────────────────────────────────────────────────
function ScoreStrip({
  teams,
  currentTeamIdx,
  compact = false,
}: {
  teams: Team[];
  currentTeamIdx: number;
  compact?: boolean;
}) {
  return (
    <div className={`flex items-center justify-around gap-2 ${compact ? 'px-4' : 'px-8'}`}>
      {teams.map((team, idx) => {
        const color = TEAM_COLORS[idx];
        const isActive = idx === currentTeamIdx;
        return (
          <div
            key={team.id}
            className="flex-1 text-center rounded-xl transition-all duration-300 relative overflow-hidden"
            style={{
              padding: compact ? '8px 4px' : '12px 8px',
              background: isActive ? color.bg : 'rgba(7,24,48,0.6)',
              border: `1px solid ${isActive ? color.border : '#0D2847'}`,
              boxShadow: isActive ? `0 0 20px ${color.border}40` : 'none',
              transform: isActive ? 'scale(1.04)' : 'scale(1)',
            }}
          >
            {isActive && (
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent, ${color.border}, transparent)` }}
              />
            )}
            <div
              className="font-cinzel font-bold truncate mb-1"
              style={{
                color: isActive ? color.text : '#8BA4C8',
                fontSize: compact ? '9px' : '10px',
                letterSpacing: '0.15em',
              }}
            >
              {team.name}
            </div>
            <div
              className="font-mono font-bold score-number"
              style={{
                color: isActive ? color.text : '#8BA4C8',
                fontSize: compact ? '18px' : '22px',
              }}
            >
              {team.score >= 0 ? team.score : `-${Math.abs(team.score)}`}
            </div>
            {isActive && (
              <div
                className="mt-1 text-center"
                style={{ fontSize: '6px', color: color.text, letterSpacing: '0.15em' }}
              >
                ▲ ACTIVE
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Game Board ────────────────────────────────────────────────────────────────
function GameBoard({
  teams,
  currentTeamIdx,
  completedClues,
  ddCoords,
  onSelectClue,
}: {
  teams: Team[];
  currentTeamIdx: number;
  completedClues: Set<string>;
  ddCoords: { cat: number; row: number };
  onSelectClue: (catIdx: number, clueIdx: number, points: number) => void;
}) {
  const activeColor = TEAM_COLORS[currentTeamIdx];

  return (
    <motion.div
      key="board"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative z-10 w-full h-full flex flex-col"
      style={{ maxWidth: '1400px', margin: '0 auto', padding: '12px 16px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <h1
            className="font-cinzel font-black tracking-widest"
            style={{
              color: '#FF6B1A',
              fontSize: '18px',
              textShadow: '0 0 20px rgba(255,107,26,0.4)',
              fontFamily: 'Cinzel Decorative, Cinzel, serif',
            }}
          >
            1984 JEOPARDY
          </h1>
          <p className="text-xs tracking-widest uppercase" style={{ color: '#2A4A6A' }}>
            Sikh History &amp; Remembrance
          </p>
        </div>
        <div
          className="text-xs font-cinzel tracking-wider rounded-full px-4 py-2"
          style={{
            color: activeColor.text,
            border: `1px solid ${activeColor.border}`,
            background: activeColor.bg,
          }}
        >
          {teams[currentTeamIdx]?.name}&apos;s Turn
        </div>
      </div>

      {/* Main grid */}
      <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: 'repeat(5, 1fr)', minHeight: 0 }}>
        {jeopardyData.map((category, catIdx) => (
          <div key={catIdx} className="flex flex-col gap-2">
            {/* Category header */}
            <div
              className="category-header rounded-xl flex items-center justify-center text-center p-3"
              style={{ minHeight: '70px', flexShrink: 0 }}
            >
              <h3
                className="font-cinzel font-bold leading-tight"
                style={{ color: '#FF6B1A', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
              >
                {category.name}
              </h3>
            </div>

            {/* Clue cells */}
            {POINT_VALUES.map((points, clueIdx) => {
              const key = `${catIdx}-${clueIdx}`;
              const isUsed = completedClues.has(key);
              const isDD = catIdx === ddCoords.cat && clueIdx === ddCoords.row;

              return (
                <button
                  key={clueIdx}
                  disabled={isUsed}
                  onClick={() => onSelectClue(catIdx, clueIdx, points)}
                  className="clue-cell rounded-xl flex items-center justify-center flex-1"
                  style={{ minHeight: '60px' }}
                >
                  {!isUsed && (
                    <span
                      className="clue-value font-cinzel font-black"
                      style={{
                        color: '#C9A84C',
                        fontSize: 'clamp(18px, 2.5vw, 32px)',
                        textShadow: '0 0 10px rgba(201,168,76,0.3)',
                      }}
                    >
                      {points}
                    </span>
                  )}
                  {isUsed && (
                    <span style={{ color: '#0D2847', fontSize: '20px' }}>—</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Score strip */}
      <div
        className="mt-3 flex-shrink-0 rounded-2xl py-3"
        style={{
          background: 'linear-gradient(180deg, #0A1F3A 0%, #071830 100%)',
          border: '1px solid #0D2847',
        }}
      >
        <ScoreStrip teams={teams} currentTeamIdx={currentTeamIdx} compact />
      </div>
    </motion.div>
  );
}

// ─── Daily Double Screen ───────────────────────────────────────────────────────
function DailyDoubleScreen({
  team,
  maxWager,
  onWagerLocked,
}: {
  team: Team;
  maxWager: number;
  onWagerLocked: (wager: number) => void;
}) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const teamColor = TEAM_COLORS[team.id];

  const handleLock = () => {
    const val = parseInt(input, 10);
    if (isNaN(val) || val < 5) {
      setError('Minimum wager is 5 points.');
      return;
    }
    if (val > maxWager) {
      setError(`Maximum wager is ${maxWager} points.`);
      return;
    }
    setError('');
    onWagerLocked(val);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center text-center px-6"
      style={{ background: '#020B18' }}
    >
      {/* Radial glow backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 65%)',
        }}
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="relative z-10"
      >
        <div className="mb-2 text-xs font-cinzel tracking-widest uppercase" style={{ color: '#8BA4C8' }}>
          You found a
        </div>
        <h1
          className="dd-pulse font-cinzel font-black mb-4"
          style={{
            fontSize: 'clamp(42px, 8vw, 80px)',
            color: '#C9A84C',
            letterSpacing: '0.08em',
            fontFamily: 'Cinzel Decorative, Cinzel, serif',
          }}
        >
          DAILY DOUBLE
        </h1>

        <div className="divider mb-8" style={{ maxWidth: '400px', margin: '0 auto 2rem' }} />

        <div className="mb-2 text-sm" style={{ color: '#8BA4C8' }}>
          <span style={{ color: teamColor.text, fontWeight: 700 }}>{team.name}</span>, place your wager
        </div>
        <div className="text-xs mb-8" style={{ color: '#2A4A6A' }}>
          Max wager: <span style={{ color: '#C9A84C' }}>{maxWager}</span> points
        </div>

        <div className="flex flex-col items-center gap-4" style={{ maxWidth: '320px', margin: '0 auto' }}>
          <input
            type="number"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLock()}
            placeholder={`5 – ${maxWager}`}
            className="wager-input w-full py-4 px-6 rounded-xl text-center text-2xl"
            style={{ fontFamily: 'Cinzel, serif' }}
            autoFocus
          />
          {error && (
            <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>
          )}
          <button
            onClick={handleLock}
            className="btn-primary w-full py-4 rounded-xl"
            style={{ fontFamily: 'Cinzel, serif', fontSize: '13px' }}
          >
            Lock In Wager
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Clue Screen ──────────────────────────────────────────────────────────────
function ClueScreen({
  clue,
  teams,
  currentTeamIdx,
  numTeams,
  attempts,
  onCorrect,
  onIncorrect,
  onSkip,
}: {
  clue: ActiveClue;
  teams: Team[];
  currentTeamIdx: number;
  numTeams: number;
  attempts: number;
  onCorrect: () => void;
  onIncorrect: () => void;
  onSkip: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const teamColor = TEAM_COLORS[currentTeamIdx];
  const teamsAttempted = attempts;
  const teamsRemaining = numTeams - teamsAttempted;

  return (
    <motion.div
      key="clue"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6"
      style={{ maxWidth: '900px', margin: '0 auto' }}
    >
      {/* Clue panel */}
      <div
        className="w-full rounded-2xl p-8 md:p-12 mb-6"
        style={{
          background: 'linear-gradient(180deg, #0A1F3A 0%, #071830 100%)',
          border: `1px solid ${clue.isDailyDouble ? '#C9A84C' : '#0D2847'}`,
          boxShadow: clue.isDailyDouble
            ? '0 0 40px rgba(201,168,76,0.15)'
            : '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Category + value */}
        <div className="flex items-center justify-between mb-6">
          <span
            className="font-cinzel text-xs font-bold uppercase tracking-widest"
            style={{ color: '#FF6B1A' }}
          >
            {clue.categoryName}
          </span>
          <span
            className="font-cinzel font-black text-lg"
            style={{
              color: clue.isDailyDouble ? '#C9A84C' : '#C9A84C',
              textShadow: '0 0 10px rgba(201,168,76,0.3)',
            }}
          >
            {clue.isDailyDouble ? `★ DAILY DOUBLE` : `$${clue.points}`}
          </span>
        </div>

        <div className="divider mb-8" />

        {/* Question text */}
        <div className="min-h-[100px] flex items-center justify-center mb-8">
          <p
            className="text-center leading-relaxed font-light"
            style={{
              color: '#F0F4FF',
              fontSize: 'clamp(16px, 2.5vw, 26px)',
              maxWidth: '700px',
            }}
          >
            {clue.question}
          </p>
        </div>

        {/* Answer reveal */}
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="reveal-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center"
            >
              <button
                onClick={() => setRevealed(true)}
                className="btn-ghost py-3 px-10 rounded-xl text-xs tracking-widest"
              >
                Reveal Answer
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="answer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="divider mb-6" />
              <p
                className="text-center font-cinzel font-bold mb-8"
                style={{
                  color: '#FF6B1A',
                  fontSize: 'clamp(14px, 2vw, 22px)',
                  textShadow: '0 0 20px rgba(255,107,26,0.3)',
                }}
              >
                {clue.answer}
              </p>

              {/* Action buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={onCorrect}
                  className="btn-correct flex-1 py-3 rounded-xl font-bold text-xs tracking-widest uppercase"
                  style={{ maxWidth: '180px' }}
                >
                  ✓ Correct
                </button>
                <button
                  onClick={onIncorrect}
                  className="btn-incorrect flex-1 py-3 rounded-xl font-bold text-xs tracking-widest uppercase"
                  style={{ maxWidth: '180px' }}
                >
                  ✗ Incorrect
                </button>
                <button
                  onClick={onSkip}
                  className="btn-skip flex-1 py-3 rounded-xl font-bold text-xs tracking-widest uppercase"
                  style={{ maxWidth: '180px' }}
                >
                  Skip
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Team status bar */}
      <div
        className="w-full rounded-xl px-6 py-4 flex items-center justify-between"
        style={{
          background: '#071830',
          border: '1px solid #0D2847',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-2.5 h-2.5 rounded-full ring-pulse"
            style={{ background: teamColor.dot }}
          />
          <span className="text-xs font-semibold" style={{ color: teamColor.text }}>
            {teams[currentTeamIdx]?.name} is answering
          </span>
        </div>

        {!clue.isDailyDouble && teamsAttempted > 0 && (
          <div className="text-xs" style={{ color: '#8BA4C8' }}>
            {teamsAttempted} team{teamsAttempted > 1 ? 's' : ''} passed · {teamsRemaining} remaining
          </div>
        )}

        {clue.isDailyDouble && (
          <div
            className="text-xs font-cinzel tracking-widest"
            style={{ color: '#C9A84C' }}
          >
            Wager: {clue.points} pts
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Victory Screen ───────────────────────────────────────────────────────────
function VictoryScreen({ teams, onRestart }: { teams: Team[]; onRestart: () => void }) {
  const sorted = [...teams].sort((a, b) => b.score - a.score);
  const winner = sorted[0];
  const winnerColor = TEAM_COLORS[winner.id];

  return (
    <motion.div
      key="victory"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
      className="relative z-10 w-full max-w-xl mx-auto px-4 text-center"
    >
      {/* Crown */}
      <div className="crown-float text-6xl mb-4">🏆</div>

      <h1
        className="font-cinzel font-black tracking-widest mb-2"
        style={{
          color: '#C9A84C',
          fontSize: 'clamp(28px, 5vw, 48px)',
          fontFamily: 'Cinzel Decorative, Cinzel, serif',
          textShadow: '0 0 30px rgba(201,168,76,0.4)',
        }}
      >
        GAME OVER
      </h1>

      {/* Winner banner */}
      <div
        className="rounded-2xl p-6 mb-8 relative overflow-hidden"
        style={{
          background: winnerColor.bg,
          border: `2px solid ${winnerColor.border}`,
          boxShadow: `0 0 40px ${winnerColor.border}40`,
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${winnerColor.border}, transparent)` }}
        />
        <div className="text-xs font-cinzel tracking-widest uppercase mb-2" style={{ color: winnerColor.text }}>
          Winner
        </div>
        <div
          className="font-cinzel font-black text-4xl mb-1"
          style={{ color: winnerColor.text }}
        >
          {winner.name}
        </div>
        <div
          className="font-mono font-bold text-2xl"
          style={{ color: winnerColor.text }}
        >
          {winner.score} points
        </div>
      </div>

      {/* Final scores */}
      <div
        className="rounded-2xl p-6 mb-8"
        style={{
          background: 'linear-gradient(180deg, #0A1F3A 0%, #071830 100%)',
          border: '1px solid #0D2847',
        }}
      >
        <div className="text-xs font-cinzel tracking-widest uppercase mb-4" style={{ color: '#8BA4C8' }}>
          Final Standings
        </div>
        <div className="flex flex-col gap-3">
          {sorted.map((team, rank) => {
            const tc = TEAM_COLORS[team.id];
            return (
              <div
                key={team.id}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{
                  background: rank === 0 ? tc.bg : '#071830',
                  border: `1px solid ${rank === 0 ? tc.border : '#0D2847'}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-cinzel font-bold text-sm" style={{ color: '#2A4A6A', minWidth: '20px' }}>
                    #{rank + 1}
                  </span>
                  <div className="w-2 h-2 rounded-full" style={{ background: tc.dot }} />
                  <span className="font-semibold text-sm" style={{ color: rank === 0 ? tc.text : '#8BA4C8' }}>
                    {team.name}
                  </span>
                </div>
                <span
                  className="font-mono font-bold score-number text-lg"
                  style={{ color: rank === 0 ? tc.text : (team.score >= 0 ? '#8BA4C8' : '#ef4444') }}
                >
                  {team.score}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={onRestart}
        className="btn-primary w-full py-4 rounded-xl text-sm tracking-widest"
        style={{ fontFamily: 'Cinzel, serif' }}
      >
        Play Again
      </button>

      <p className="mt-6 text-xs tracking-widest uppercase" style={{ color: '#2A4A6A' }}>
        Waheguru Ji Ka Khalsa · Waheguru Ji Ki Fateh
      </p>
    </motion.div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState<number>(0);
  const [completedClues, setCompletedClues] = useState<Set<string>>(new Set());
  const [activeClue, setActiveClue] = useState<ActiveClue | null>(null);
  const [attempts, setAttempts] = useState<number>(0);

  // Daily Double — one random cell, rows 1–4 (indices 1–4, skip 100pt row for fairness)
  const [ddCoords] = useState<{ cat: number; row: number }>(() => ({
    cat: Math.floor(Math.random() * 5),
    row: Math.floor(Math.random() * 4) + 1,
  }));

  // Daily Double wager state
  const [ddWager, setDdWager] = useState<number>(0);
  const [ddWagerLocked, setDdWagerLocked] = useState<boolean>(false);

  const handleStart = (initialTeams: Team[]) => {
    setTeams(initialTeams);
    setCompletedClues(new Set());
    setCurrentTeamIdx(0);
    setAttempts(0);
    setActiveClue(null);
    setGameState('board');
  };

  const handleSelectClue = useCallback((catIdx: number, clueIdx: number, points: number) => {
    const isDD = catIdx === ddCoords.cat && clueIdx === ddCoords.row;
    const clue = jeopardyData[catIdx].clues[clueIdx];

    setActiveClue({
      categoryName: jeopardyData[catIdx].name,
      categoryIdx: catIdx,
      clueIdx,
      points: isDD ? ddWager : points,
      question: clue.q,
      answer: clue.a,
      isDailyDouble: isDD,
    });

    setAttempts(0);

    if (isDD) {
      const maxWager = Math.max(teams[currentTeamIdx].score, 500);
      setDdWager(0);
      setDdWagerLocked(false);
    }

    setGameState('clue');
  }, [ddCoords, teams, currentTeamIdx, ddWager]);

  const handleDdWagerLocked = (wager: number) => {
    setDdWager(wager);
    setDdWagerLocked(true);
    // Update activeClue points with actual wager
    setActiveClue((prev) => prev ? { ...prev, points: wager } : prev);
  };

  const resolveClue = useCallback(() => {
    if (!activeClue) return;
    const key = `${activeClue.categoryIdx}-${activeClue.clueIdx}`;
    const next = new Set(completedClues);
    next.add(key);
    setCompletedClues(next);
    setActiveClue(null);
    setAttempts(0);
    setDdWagerLocked(false);
    if (next.size === 25) {
      setGameState('victory');
    } else {
      setGameState('board');
    }
  }, [activeClue, completedClues]);

  const handleCorrect = useCallback(() => {
    if (!activeClue) return;
    setTeams((prev) =>
      prev.map((t, i) =>
        i === currentTeamIdx ? { ...t, score: t.score + activeClue.points } : t
      )
    );
    resolveClue();
  }, [activeClue, currentTeamIdx, resolveClue]);

  const handleIncorrect = useCallback(() => {
    if (!activeClue) return;

    // Daily Double: only one attempt
    if (activeClue.isDailyDouble) {
      resolveClue();
      return;
    }

    const nextAttempts = attempts + 1;

    if (nextAttempts >= teams.length) {
      // All teams tried, no one gets the points
      resolveClue();
    } else {
      setAttempts(nextAttempts);
      setCurrentTeamIdx((prev) => (prev + 1) % teams.length);
    }
  }, [activeClue, attempts, teams.length, resolveClue]);

  const handleSkip = useCallback(() => {
    resolveClue();
  }, [resolveClue]);

  const isDD = activeClue?.isDailyDouble ?? false;
  const showDDScreen = isDD && !ddWagerLocked;

  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-hidden select-none relative">
      {/* Backgrounds */}
      <div className="starfield" />
      <div className="scanlines" />
      <div className="grid-lines" />

      <AnimatePresence mode="wait">
        {gameState === 'setup' && (
          <SetupScreen key="setup" onStart={handleStart} />
        )}

        {gameState === 'board' && (
          <GameBoard
            key="board"
            teams={teams}
            currentTeamIdx={currentTeamIdx}
            completedClues={completedClues}
            ddCoords={ddCoords}
            onSelectClue={handleSelectClue}
          />
        )}

        {gameState === 'clue' && activeClue && showDDScreen && (
          <DailyDoubleScreen
            key="dd"
            team={teams[currentTeamIdx]}
            maxWager={Math.max(teams[currentTeamIdx]?.score ?? 0, 500)}
            onWagerLocked={handleDdWagerLocked}
          />
        )}

        {gameState === 'clue' && activeClue && !showDDScreen && (
          <ClueScreen
            key="clue"
            clue={activeClue}
            teams={teams}
            currentTeamIdx={currentTeamIdx}
            numTeams={teams.length}
            attempts={attempts}
            onCorrect={handleCorrect}
            onIncorrect={handleIncorrect}
            onSkip={handleSkip}
          />
        )}

        {gameState === 'victory' && (
          <VictoryScreen
            key="victory"
            teams={teams}
            onRestart={() => setGameState('setup')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

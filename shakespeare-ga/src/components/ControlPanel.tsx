import React, { useState } from 'react';
import type { GAConfig } from '../algorithms/GeneticAlgorithm';

interface ControlPanelProps {
  onStart: (target: string, config: GAConfig) => void;
  onStop: () => void;
  onReset: () => void;
  isRunning: boolean;
  isComplete: boolean;
}

const shakespeareQuotes = [
  "To be or not to be",
  "All the world's a stage",
  "Romeo Romeo wherefore art thou Romeo",
  "The course of true love never did run smooth",
  "Love all trust a few do wrong to none",
  "Brevity is the soul of wit",
  "To thine own self be true"
];

const ControlPanel: React.FC<ControlPanelProps> = ({
  onStart,
  onStop,
  onReset,
  isRunning,
  isComplete
}) => {
  const [targetPhrase, setTargetPhrase] = useState(shakespeareQuotes[0]);
  const [useCustom, setUseCustom] = useState(false);
  const [customPhrase, setCustomPhrase] = useState('');
  const [populationSize, setPopulationSize] = useState(200);
  const [mutationRate, setMutationRate] = useState(0.01);
  const [crossoverRate, setCrossoverRate] = useState(0.7);
  const [elitismCount, setElitismCount] = useState(2);
  const [tournamentSize, setTournamentSize] = useState(5);

  const charset = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.,!?\'-';

  const handleStart = () => {
    const target = useCustom ? customPhrase : targetPhrase;
    if (!target.trim()) {
      alert('Please enter a target phrase');
      return;
    }

    const config: GAConfig = {
      populationSize,
      mutationRate,
      crossoverRate,
      elitismCount,
      tournamentSize,
      charset
    };

    onStart(target, config);
  };

  return (
    <div className="control-panel">
      <h2>Genetic Algorithm Controls</h2>

      <div className="control-section">
        <h3>Target Phrase</h3>
        <div className="phrase-selection">
          <label>
            <input
              type="radio"
              checked={!useCustom}
              onChange={() => setUseCustom(false)}
            />
            Shakespeare Quote
          </label>
          <select
            value={targetPhrase}
            onChange={(e) => setTargetPhrase(e.target.value)}
            disabled={useCustom || isRunning}
          >
            {shakespeareQuotes.map((quote, index) => (
              <option key={index} value={quote}>
                {quote}
              </option>
            ))}
          </select>
        </div>

        <div className="phrase-selection">
          <label>
            <input
              type="radio"
              checked={useCustom}
              onChange={() => setUseCustom(true)}
            />
            Custom Phrase
          </label>
          <input
            type="text"
            value={customPhrase}
            onChange={(e) => setCustomPhrase(e.target.value)}
            disabled={!useCustom || isRunning}
            placeholder="Enter your own phrase..."
          />
        </div>
      </div>

      <div className="control-section">
        <h3>Algorithm Parameters</h3>

        <div className="parameter">
          <label>
            Population Size: {populationSize}
            <input
              type="range"
              min="50"
              max="500"
              step="10"
              value={populationSize}
              onChange={(e) => setPopulationSize(Number(e.target.value))}
              disabled={isRunning}
            />
          </label>
        </div>

        <div className="parameter">
          <label>
            Mutation Rate: {(mutationRate * 100).toFixed(1)}%
            <input
              type="range"
              min="0.001"
              max="0.1"
              step="0.001"
              value={mutationRate}
              onChange={(e) => setMutationRate(Number(e.target.value))}
              disabled={isRunning}
            />
          </label>
        </div>

        <div className="parameter">
          <label>
            Crossover Rate: {(crossoverRate * 100).toFixed(0)}%
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={crossoverRate}
              onChange={(e) => setCrossoverRate(Number(e.target.value))}
              disabled={isRunning}
            />
          </label>
        </div>

        <div className="parameter">
          <label>
            Elitism Count: {elitismCount}
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={elitismCount}
              onChange={(e) => setElitismCount(Number(e.target.value))}
              disabled={isRunning}
            />
          </label>
        </div>

        <div className="parameter">
          <label>
            Tournament Size: {tournamentSize}
            <input
              type="range"
              min="2"
              max="10"
              step="1"
              value={tournamentSize}
              onChange={(e) => setTournamentSize(Number(e.target.value))}
              disabled={isRunning}
            />
          </label>
        </div>
      </div>

      <div className="control-buttons">
        {!isRunning ? (
          <button className="btn-start" onClick={handleStart} disabled={isComplete}>
            Start Evolution
          </button>
        ) : (
          <button className="btn-stop" onClick={onStop}>
            Stop Evolution
          </button>
        )}
        <button className="btn-reset" onClick={onReset}>
          Reset
        </button>
      </div>

      {isComplete && (
        <div className="completion-message">
          Evolution Complete! Target phrase achieved!
        </div>
      )}
    </div>
  );
};

export default ControlPanel;

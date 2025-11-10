import React from 'react';
import { IndividualClass } from '../types/Individual';

interface PopulationDisplayProps {
  population: IndividualClass[];
  target: string;
  generation: number;
  bestEver: IndividualClass | null;
  averageFitness: number;
  isComplete: boolean;
}

const PopulationDisplay: React.FC<PopulationDisplayProps> = ({
  population,
  target,
  generation,
  bestEver,
  averageFitness,
  isComplete
}) => {
  const renderGenes = (genes: string, target: string) => {
    return genes.split('').map((char, index) => {
      const isMatch = char === target[index];
      return (
        <span
          key={index}
          className={isMatch ? 'char-match' : 'char-no-match'}
        >
          {char}
        </span>
      );
    });
  };

  const displayPopulation = population.slice(0, 20);

  return (
    <div className="population-display">
      <div className="stats-header">
        <h2>Evolution Progress</h2>
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-label">Generation:</span>
            <span className="stat-value">{generation}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Best Fitness:</span>
            <span className="stat-value">
              {bestEver ? bestEver.fitness.toFixed(2) : 0}%
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Average Fitness:</span>
            <span className="stat-value">{averageFitness.toFixed(2)}%</span>
          </div>
        </div>
      </div>

      <div className="target-display">
        <h3>Target Phrase:</h3>
        <div className="target-phrase">{target}</div>
      </div>

      {isComplete && (
        <div className="success-message">
          <h2>Success! Evolution Complete!</h2>
          <p>The genetic algorithm has successfully evolved to match the target phrase.</p>
        </div>
      )}

      {bestEver && (
        <div className="best-individual">
          <h3>Best Individual:</h3>
          <div className="individual-genes">
            {renderGenes(bestEver.genes, target)}
          </div>
          <div className="individual-fitness">
            Fitness: {bestEver.fitness.toFixed(2)}%
          </div>
        </div>
      )}

      <div className="population-list">
        <h3>Top {displayPopulation.length} Individuals:</h3>
        {displayPopulation.map((individual, index) => (
          <div key={index} className="individual-row">
            <div className="individual-rank">#{index + 1}</div>
            <div className="individual-genes">
              {renderGenes(individual.genes, target)}
            </div>
            <div className="individual-fitness">
              {individual.fitness.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>

      {population.length === 0 && (
        <div className="empty-state">
          <p>No population yet. Configure parameters and click "Start Evolution" to begin.</p>
        </div>
      )}
    </div>
  );
};

export default PopulationDisplay;

import { useState, useEffect, useRef } from 'react';
import './App.css';
import { GeneticAlgorithm, type GAConfig } from './algorithms/GeneticAlgorithm';
import { IndividualClass } from './types/Individual';
import ControlPanel from './components/ControlPanel';
import PopulationDisplay from './components/PopulationDisplay';
import FitnessChart, { type DataPoint } from './components/FitnessChart';

function App() {
  const [ga, setGa] = useState<GeneticAlgorithm | null>(null);
  const [population, setPopulation] = useState<IndividualClass[]>([]);
  const [generation, setGeneration] = useState(0);
  const [bestEver, setBestEver] = useState<IndividualClass | null>(null);
  const [averageFitness, setAverageFitness] = useState(0);
  const [target, setTarget] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const animationRef = useRef<number | null>(null);

  const startEvolution = (targetPhrase: string, config: GAConfig) => {
    // Initialize new GA
    const newGa = new GeneticAlgorithm(config);
    newGa.initialize(targetPhrase);

    setGa(newGa);
    setTarget(targetPhrase);
    setPopulation(newGa.getPopulation());
    setGeneration(newGa.getGeneration());
    setBestEver(newGa.getBestEver());
    setAverageFitness(newGa.getAverageFitness());
    setIsRunning(true);
    setIsComplete(false);
    setChartData([{
      generation: 0,
      bestFitness: newGa.getBestEver()?.fitness || 0,
      averageFitness: newGa.getAverageFitness()
    }]);
  };

  const evolveGeneration = () => {
    if (!ga || isComplete) return;

    ga.evolve();

    const newPopulation = ga.getPopulation();
    const newGeneration = ga.getGeneration();
    const newBestEver = ga.getBestEver();
    const newAverageFitness = ga.getAverageFitness();

    setPopulation(newPopulation);
    setGeneration(newGeneration);
    setBestEver(newBestEver);
    setAverageFitness(newAverageFitness);

    // Update chart data
    setChartData((prev: DataPoint[]) => [...prev, {
      generation: newGeneration,
      bestFitness: newBestEver?.fitness || 0,
      averageFitness: newAverageFitness
    }]);

    // Check if complete
    if (ga.isComplete()) {
      setIsComplete(true);
      setIsRunning(false);
    }
  };

  const stopEvolution = () => {
    setIsRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  const resetEvolution = () => {
    stopEvolution();
    setGa(null);
    setPopulation([]);
    setGeneration(0);
    setBestEver(null);
    setAverageFitness(0);
    setTarget('');
    setIsComplete(false);
    setChartData([]);
  };

  // Evolution loop
  useEffect(() => {
    if (isRunning && !isComplete && ga) {
      const evolve = () => {
        evolveGeneration();
        animationRef.current = requestAnimationFrame(evolve);
      };
      animationRef.current = requestAnimationFrame(evolve);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isRunning, isComplete, ga]);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Shakespeare Genetic Algorithm</h1>
        <p>Watch as random text evolves into Shakespeare quotes using genetic algorithms</p>
      </header>

      <div className="app-content">
        <div className="left-panel">
          <ControlPanel
            onStart={startEvolution}
            onStop={stopEvolution}
            onReset={resetEvolution}
            isRunning={isRunning}
            isComplete={isComplete}
          />
          <FitnessChart data={chartData} />
        </div>

        <div className="right-panel">
          <PopulationDisplay
            population={population}
            target={target}
            generation={generation}
            bestEver={bestEver}
            averageFitness={averageFitness}
            isComplete={isComplete}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

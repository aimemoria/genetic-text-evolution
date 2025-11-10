import { IndividualClass } from '../types/Individual';

export interface GAConfig {
  populationSize: number;
  mutationRate: number;
  crossoverRate: number;
  elitismCount: number;
  tournamentSize: number;
  charset: string;
}

export class GeneticAlgorithm {
  private config: GAConfig;
  private population: IndividualClass[];
  private generation: number;
  private target: string;
  private bestEver: IndividualClass | null;

  constructor(config: GAConfig) {
    this.config = config;
    this.population = [];
    this.generation = 0;
    this.target = '';
    this.bestEver = null;
  }

  initialize(target: string): void {
    this.target = target;
    this.generation = 0;
    this.population = [];
    this.bestEver = null;

    // Create initial random population
    for (let i = 0; i < this.config.populationSize; i++) {
      const individual = IndividualClass.createRandom(target.length, this.config.charset);
      individual.calculateFitness(target);
      this.population.push(individual);
    }

    // Sort by fitness and set best ever
    this.population.sort((a, b) => b.fitness - a.fitness);
    this.bestEver = this.population[0];
  }

  evolve(): void {
    // 1. Calculate fitness for all individuals
    this.population.forEach(individual => {
      individual.calculateFitness(this.target);
    });

    // 2. Sort by fitness (descending - best first)
    this.population.sort((a, b) => b.fitness - a.fitness);

    // Update best ever
    if (!this.bestEver || this.population[0].fitness > this.bestEver.fitness) {
      this.bestEver = this.population[0];
    }

    // 3. Create new population
    const newPopulation: IndividualClass[] = [];

    // Apply elitism - keep the best individuals
    for (let i = 0; i < this.config.elitismCount && i < this.population.length; i++) {
      newPopulation.push(this.population[i]);
    }

    // 4. Fill the rest of the population with offspring
    while (newPopulation.length < this.config.populationSize) {
      const parent1 = this.selectParent();
      const parent2 = this.selectParent();

      let offspring: IndividualClass[];

      // Apply crossover
      if (Math.random() < this.config.crossoverRate) {
        offspring = this.crossover(parent1, parent2);
      } else {
        offspring = [parent1, parent2];
      }

      // Apply mutation to offspring
      for (const child of offspring) {
        const mutatedChild = child.mutate(this.config.mutationRate, this.config.charset);
        mutatedChild.calculateFitness(this.target);
        newPopulation.push(mutatedChild);

        if (newPopulation.length >= this.config.populationSize) {
          break;
        }
      }
    }

    // 5. Replace old population and increment generation
    this.population = newPopulation;
    this.generation++;
  }

  private selectParent(): IndividualClass {
    // Tournament selection
    let best: IndividualClass | null = null;

    for (let i = 0; i < this.config.tournamentSize; i++) {
      const randomIndex = Math.floor(Math.random() * this.population.length);
      const contestant = this.population[randomIndex];

      if (!best || contestant.fitness > best.fitness) {
        best = contestant;
      }
    }

    return best!;
  }

  private crossover(parent1: IndividualClass, parent2: IndividualClass): IndividualClass[] {
    // Single-point crossover
    const length = parent1.genes.length;
    const crossoverPoint = Math.floor(Math.random() * length);

    const child1Genes = parent1.genes.substring(0, crossoverPoint) +
                       parent2.genes.substring(crossoverPoint);
    const child2Genes = parent2.genes.substring(0, crossoverPoint) +
                       parent1.genes.substring(crossoverPoint);

    return [
      new IndividualClass(child1Genes),
      new IndividualClass(child2Genes)
    ];
  }

  // Getter methods
  getPopulation(): IndividualClass[] {
    return this.population;
  }

  getGeneration(): number {
    return this.generation;
  }

  getBestIndividual(): IndividualClass | null {
    return this.population.length > 0 ? this.population[0] : null;
  }

  getBestEver(): IndividualClass | null {
    return this.bestEver;
  }

  getAverageFitness(): number {
    if (this.population.length === 0) return 0;
    const sum = this.population.reduce((acc, ind) => acc + ind.fitness, 0);
    return sum / this.population.length;
  }

  getTarget(): string {
    return this.target;
  }

  isComplete(): boolean {
    return this.bestEver !== null && this.bestEver.fitness >= 100;
  }
}

import { Body, Vector, World } from "../index";

// Создаём мир
const world = new World();

// Параметры системы
const G = 1;
const sun = new Body({ position: new Vector(0, 0), mass: 10000 });
const r = 10; // расстояние планеты от Sun
const M = sun.mass;

// Начальная скорость для круговой орбиты
const v = Math.sqrt(G * M / r);

const planet = new Body({
  position: new Vector(r, 0),
  mass: 1,
  velocity: new Vector(0, v), // перпендикулярно радиусу
});

// Добавляем тела в мир
world.addBody(sun);
world.addBody(planet);

// Ограничение по шагам
const maxSteps = 2000;
let stepCount = 0;


// Симуляция с выводом
const interval = setInterval(() => {
  world.step(0.005);
  stepCount++;
  
  console.log(`Step ${stepCount}`);
  console.log("Sun:", sun.position);
  console.log("Planet:", planet.position);

  if (stepCount >= maxSteps) {
    clearInterval(interval);
    console.log("Simulation finished.");
  }
}, 16);
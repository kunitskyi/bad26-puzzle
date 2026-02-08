import fs from "fs";

const FILE_PATH = "./data.txt";

fs.promises
  .readFile(FILE_PATH, { encoding: "utf-8" })
  .then((data) => {
    let lines = data.split(/\r?\n/);
    return lines.map((line) => {
      let trimmed = line.trim();

      if (trimmed.length === 6) {
        return trimmed;
      } else {
        throw new Error(
          `Line with "${trimmed}" in it not supported! It must contain only 6 symbols!`
        );
      }
    });
  })
  .then((lines) => {
    return solve(lines);
  })
  .then((output) => {
    console.log(`Result: ${output}`);
    return fs.promises.writeFile(
      `output/${new Date().toISOString()}.txt`,
      output,
      "utf8"
    );
  })
  .catch((err) => {
    console.error("ERROR!!!");
    console.error(err.message);
  });

function solve(puzzles) {
  // Making graph
  let graph = new Map();
  for (let index = 0; index < puzzles.length; index++) {
    graph.set(index, []);

    const END = puzzles[index].slice(-2);

    for (let iterations = 0; iterations < puzzles.length; iterations++) {
      if (index === iterations) continue;

      const START = puzzles[iterations].slice(0, 2);

      if (END === START) {
        graph.get(index).push(iterations);
      }
    }
  }

  // Using Depth-First Search
  let maxPath = [];
  let visited = [];

  let dfs = function (currentIndex, path) {
    visited[currentIndex] = true;
    path.push(currentIndex);

    let extended = false;
    for (const next of graph.get(currentIndex)) {
      if (!visited[next]) {
        dfs(next, path);
        extended = true;
      }
    }

    if (!extended) {
      if (path.length > maxPath.length) {
        maxPath = [...path];
      }
    }

    path.pop();
    visited[currentIndex] = false;
  };

  // Run DFS
  for (let index = 0; index < puzzles.length; index++) {
    dfs(index, []);
  }

  // Creating result
  let result = puzzles[maxPath[0]];

  for (let index = 1; index < maxPath.length; index++) {
    result += puzzles[maxPath[index]].slice(2);
  }

  return result;
}

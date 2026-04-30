const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/**
 * Greedy Algorithm Implementation
 */
function greedyPath(graph, start, end) {
    let current = start;
    let path = [start];
    let totalCost = 0;
    let visited = new Set([start]);

    while (current !== end) {
        let neighbors = graph[current];
        if (!neighbors || neighbors.length === 0) return { path: [], cost: Infinity };

        let bestNeighbor = null;
        let minCost = Infinity;

        for (let neighbor of neighbors) {
            if (!visited.has(neighbor.to) && neighbor.cost < minCost) {
                minCost = neighbor.cost;
                bestNeighbor = neighbor.to;
            }
        }

        if (bestNeighbor === null) break;

        current = bestNeighbor;
        path.push(current);
        totalCost += minCost;
        visited.add(current);

        if (current === end) return { path, cost: totalCost };
    }

    return { path: path[path.length - 1] === end ? path : [], cost: path[path.length - 1] === end ? totalCost : Infinity };
}

/**
 * Dynamic Programming (Dijkstra) Implementation
 */
function dpPath(graph, start, end) {
    let distances = {};
    let prev = {};
    let nodes = new Set();

    for (let node in graph) {
        distances[node] = Infinity;
        prev[node] = null;
        nodes.add(node);
        graph[node].forEach(neighbor => {
            if (!(neighbor.to in distances)) {
                distances[neighbor.to] = Infinity;
                prev[neighbor.to] = null;
                nodes.add(neighbor.to);
            }
        });
    }

    if (!nodes.has(start)) return { path: [], cost: Infinity };
    distances[start] = 0;

    while (nodes.size > 0) {
        let closestNode = null;
        for (let node of nodes) {
            if (closestNode === null || distances[node] < distances[closestNode]) {
                closestNode = node;
            }
        }

        if (distances[closestNode] === Infinity || closestNode === end) break;

        nodes.delete(closestNode);

        let neighbors = graph[closestNode] || [];
        for (let neighbor of neighbors) {
            let alt = distances[closestNode] + neighbor.cost;
            if (alt < distances[neighbor.to]) {
                distances[neighbor.to] = alt;
                prev[neighbor.to] = closestNode;
            }
        }
    }

    let path = [];
    let u = end;
    if (prev[u] || u === start) {
        while (u !== null) {
            path.unshift(u);
            u = prev[u];
        }
    }

    return { path, cost: distances[end] === Infinity ? Infinity : distances[end] };
}

app.get('/api/flights', (req, res) => {
    try {
        const dbPath = path.join(__dirname, 'data', 'flights.json');
        const rawData = fs.readFileSync(dbPath);
        const baseRoutes = JSON.parse(rawData);
        res.json(baseRoutes);
    } catch (error) {
        res.status(500).json({ error: "Could not load flights" });
    }
});

app.post('/api/route/optimize', (req, res) => {
    const { source, destination } = req.body;

    try {
        const dbPath = path.join(__dirname, 'data', 'flights.json');
        const rawData = fs.readFileSync(dbPath);
        const baseRoutes = JSON.parse(rawData);

        const graph = {};
        const processedRoutes = baseRoutes.map(route => {
            const variation = (Math.random() * 0.2) + 0.9; 
            const realTimeCost = Math.round(route.baseCost * variation);
            
            if (!graph[route.from]) graph[route.from] = [];
            graph[route.from].push({ to: route.to, cost: realTimeCost });
            
            return { ...route, cost: realTimeCost };
        });

        const greedyResult = greedyPath(graph, source, destination);
        const dpResult = dpPath(graph, source, destination);

        let comparison = "";
        if (dpResult.cost < greedyResult.cost) {
            comparison = "Dynamic Programming found a more optimal route.";
        } else if (dpResult.cost === greedyResult.cost && dpResult.cost !== Infinity) {
            comparison = "Both algorithms found the same optimal cost.";
        } else if (dpResult.cost === Infinity) {
            comparison = "No path found between the selected cities.";
        } else {
            comparison = "Greedy was surprisingly optimal here!";
        }

        res.json({
            greedy: greedyResult,
            dp: dpResult,
            optimalAlgorithm: dpResult.cost <= greedyResult.cost ? "Dynamic Programming" : "Greedy",
            comparison,
            liveFlights: processedRoutes
        });
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

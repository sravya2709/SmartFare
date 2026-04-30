# SmartFare: Travel Cost Optimization System

SmartFare is a web application designed to find and compare travel routes using two different algorithmic strategies: **Greedy** and **Dynamic Programming (Dijkstra)**. 

##  Project Overview
The goal is to demonstrate that while a Greedy approach is fast and often intuitive, it may not always provide the global minimum cost. The Dynamic Programming approach ensures the absolute minimum cost path is found.

##  Technology Stack
- **Frontend**: React (Vite), Vanilla CSS (Glassmorphism design)
- **Backend**: Node.js, Express
- **Algorithms**: Greedy Search, Dijkstra's Algorithm (DP-based)

##  Project Structure
- `/frontend`: React application for the user interface.
- `/backend`: Express server handling graph processing and route optimization.

##  How to Run

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at the URL provided by Vite (usually `http://localhost:5173`).

##  Algorithm Logic
- **Greedy**: At each city, the algorithm looks at all immediate connections and picks the one with the lowest cost. It does not look ahead to see if a slightly more expensive connection now might lead to a much cheaper connection later.
- **Dynamic Programming (Dijkstra)**: This algorithm explores paths systematically and "remembers" the shortest distance to each city discovered so far. This guarantees that the final path found is the absolute minimum cost.

##  Sample Test Data
- **Route A**: Delhi ➔ Mumbai (₹500)
- **Route B**: Delhi ➔ Ahmedabad (₹200)
- **Route C**: Ahmedabad ➔ Bangalore (₹600)
- **Route D**: Mumbai ➔ Bangalore (₹400)
- **Route E**: Bangalore ➔ Chennai (₹300)

**Scenario**: Delhi to Chennai.
- **Greedy** might pick Delhi ➔ Ahmedabad (cheaper start) but end up with a higher total.
- **DP** will evaluate all paths and find the true minimum.

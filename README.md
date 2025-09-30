

---

# 🚦 Smart Traffic Management with Reinforcement Learning

This project implements a Smart Traffic Management System using **Reinforcement Learning (RL)**. It focuses on optimizing traffic signal control at urban intersections by reducing vehicle delays, improving throughput, and prioritizing pedestrian and emergency flows.

The system uses **synthetic traffic data** modeled after a 4-lane roundabout in Nairobi’s CBD. Two RL models (**DQN** and **PPO**) are trained and evaluated against baseline fixed-timing control strategies.

---

## 📌 Features

* AI-based traffic light control using **Deep Q-Network (DQN)** and **Proximal Policy Optimization (PPO)**.
* Synthetic dataset of vehicle inflows and pedestrian crossings for simulation.
* Inference and logging to **CSV/Excel** with model actions, rewards, and traffic states.
* Web dashboard (React + Flask API) for visualization and monitoring.

---


## ⚙️ Setup & Installation

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/smart-traffic-rl.git
cd smart-traffic-rl
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

Typical dependencies include:

* `numpy`, `pandas`
* `matplotlib`, `seaborn`
* `stable-baselines3`, `gym`
* `flask`, `flask-cors`
* `openpyxl` (for Excel I/O)

### 3. Run Training

```bash
python train_models.py
```

### 4. Run Inference & Export Logs

```bash
python run_inference.py
```

This generates a CSV log of model decisions, rewards, and state variables.

### 5. Launch Dashboard

```bash
cd dashboard
npm install
npm start
```

Dashboard will run at `http://localhost:3000/`.

---

## 📊 Dataset

* **Synthetic traffic dataset** based on Nairobi CBD roundabout.
* Includes: vehicle inflows (per lane), pedestrian crossing requests, signal phases, queue lengths, and delays.
* 1-hour simulation (~1000 vehicles).

---

## 🚀 Future Work

* Integrate **real-world traffic datasets** (e.g., Nairobi KURA or OpenTraffic).
* Scale up to multiple intersections with **multi-agent reinforcement learning**.
* Add emergency vehicle prioritization and adaptive pedestrian crossing signals.
* Deploy prototype dashboard for city-level traffic monitoring.

---

## 📖 References

* Behrisch, M., et al. (2011). *SUMO—Simulation of Urban MObility: An overview*.
* Mnih, V., et al. (2015). *Human-level control through deep reinforcement learning*.
* Schulman, J., et al. (2017). *Proximal Policy Optimization Algorithms*.
* Li, Y., et al. (2020). *CoLight: Learning network-level cooperation for traffic signal control*.

---



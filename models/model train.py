"""
train_models.py
Smart Traffic RL Project - DQN & PPO Training on Synthetic Roundabout Data
"""

import gym
from gym import spaces
import numpy as np
import pandas as pd
from stable_baselines3 import DQN, PPO

# ========================
# Custom Traffic Environment
# ========================
class TrafficEnv(gym.Env):
    def __init__(self, df):
        super(TrafficEnv, self).__init__()
        self.df = df
        self.index = 0

        # State space: [lane_N, lane_S, lane_E, lane_W, pedestrian_request]
        self.observation_space = spaces.Box(low=0, high=100, shape=(5,), dtype=np.float32)
        # Action space: 0 = keep phase, 1 = switch phase
        self.action_space = spaces.Discrete(2)

    def reset(self):
        self.index = 0
        return self._get_state()

    def step(self, action):
        row = self.df.iloc[self.index]

        # Reward: negative of wait time + average queue length
        reward = - (row['avg_wait_time'] +
                    (row['lane_N'] + row['lane_S'] + row['lane_E'] + row['lane_W']) / 4)

        self.index += 1
        done = self.index >= len(self.df) - 1
        next_state = self._get_state()
        return next_state, reward, done, {}

    def _get_state(self):
        row = self.df.iloc[self.index]
        return np.array([
            row['lane_N'], row['lane_S'], row['lane_E'], row['lane_W'], row['pedestrian_request']
        ], dtype=np.float32)


# ========================
# Helper Function: Evaluation
# ========================
def evaluate(model, env, steps=100):
    obs = env.reset()
    rewards = []
    for _ in range(steps):
        action, _ = model.predict(obs)
        obs, reward, done, _ = env.step(action)
        rewards.append(reward)
        if done:
            obs = env.reset()
    return np.mean(rewards)


# ========================
# Main Training Pipeline
# ========================
if __name__ == "__main__":
    # Load dataset (replace with your dataset path if needed)
    df = pd.read_excel("C:\Users\Lenovo\Downloads\synthetic_roundabout_traffic.xlsx")

    # Create environment
    env = TrafficEnv(df)

    # Train DQN model
    print("Training DQN...")
    dqn_model = DQN("MlpPolicy", env, verbose=1)
    dqn_model.learn(total_timesteps=5000)
    dqn_model.save("dqn_traffic_model")

    # Train PPO model
    print("Training PPO...")
    ppo_model = PPO("MlpPolicy", env, verbose=1)
    ppo_model.learn(total_timesteps=5000)
    ppo_model.save("ppo_traffic_model")

    # Evaluate both models
    print("DQN avg reward:", evaluate(dqn_model, env))
    print("PPO avg reward:", evaluate(ppo_model, env))

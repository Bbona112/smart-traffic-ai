import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
import random
from collections import deque

# ----------------------------
# DQN Model Definition
# ----------------------------
class DQN(nn.Module):
    def __init__(self, state_size, action_size, hidden_size=64):
        super(DQN, self).__init__()
        self.fc1 = nn.Linear(state_size, hidden_size)
        self.fc2 = nn.Linear(hidden_size, hidden_size)
        self.fc3 = nn.Linear(hidden_size, action_size)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = torch.relu(self.fc2(x))
        return self.fc3(x)


# ----------------------------
# DQN Agent
# ----------------------------
class DQNAgent:
    def __init__(self, state_size, action_size):
        self.state_size = state_size
        self.action_size = action_size
        self.memory = deque(maxlen=5000)
        self.gamma = 0.95      # discount factor
        self.epsilon = 1.0     # exploration rate
        self.epsilon_min = 0.01
        self.epsilon_decay = 0.995
        self.learning_rate = 0.001

        self.model = DQN(state_size, action_size)
        self.optimizer = optim.Adam(self.model.parameters(), lr=self.learning_rate)
        self.loss_fn = nn.MSELoss()

    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))

    def act(self, state):
        if np.random.rand() <= self.epsilon:
            return random.randrange(self.action_size)  # explore
        state = torch.FloatTensor(state).unsqueeze(0)
        q_values = self.model(state)
        return torch.argmax(q_values[0]).item()  # exploit

    def replay(self, batch_size=32):
        if len(self.memory) < batch_size:
            return

        minibatch = random.sample(self.memory, batch_size)
        for state, action, reward, next_state, done in minibatch:
            state = torch.FloatTensor(state).unsqueeze(0)
            next_state = torch.FloatTensor(next_state).unsqueeze(0)

            target = reward
            if not done:
                target = reward + self.gamma * torch.max(self.model(next_state)[0]).item()

            target_f = self.model(state)
            target_val = target_f.clone().detach()
            target_val[0][action] = target

            # train
            self.optimizer.zero_grad()
            output = self.model(state)
            loss = self.loss_fn(output, target_val)
            loss.backward()
            self.optimizer.step()

        if self.epsilon > self.epsilon_min:
            self.epsilon *= self.epsilon_decay


# ----------------------------
# Example usage
# ----------------------------
if __name__ == "__main__":
    # Example: state = [traffic density per lane + pedestrian wait flag]
    state_size = 5   # 4 lanes + pedestrian crossing demand
    action_size = 3  # {switch NS green, switch EW green, pedestrian green}

    agent = DQNAgent(state_size, action_size)

    # Fake training loop
    for episode in range(10):
        state = np.random.rand(state_size)
        action = agent.act(state)
        next_state = np.random.rand(state_size)
        reward = np.random.randn()  # dummy reward
        done = False
        agent.remember(state, action, reward, next_state, done)
        agent.replay(batch_size=16)
        print(f"Episode {episode}, Action taken: {action}")

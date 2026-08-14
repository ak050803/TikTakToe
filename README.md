# 🎮 TikTakToe

A modern, interactive **Tic Tac Toe web game** built with **HTML, CSS, and Vanilla JavaScript**, featuring multiple game modes, an intelligent AI opponent, local multiplayer, and real-time online multiplayer powered by Firebase Realtime Database.

## ✨ Features

* 🤖 **Play vs Computer**

  * Challenge an AI opponent powered by the **Minimax algorithm with Alpha-Beta pruning**.
  * The AI evaluates possible game states to select an optimal move.

* 👥 **Local Multiplayer**

  * Play against another player on the same device.
  * Supports alternating X and O turns.

* 🌐 **Online Multiplayer**

  * Create an online game using a unique game code.
  * Share the generated code with another player.
  * Join an existing game using the code.
  * Game state is synchronized in real time using **Firebase Realtime Database**.

* 🏆 **Score Tracking**

  * Tracks X wins, O wins, and draws throughout the session.

* ✨ **Interactive UI**

  * Dark gaming-inspired interface.
  * Animated X and O placement.
  * Hover effects on board cells.
  * Animated winning line.
  * Responsive Bootstrap-based layout.

* 🔄 **Game Reset**

  * Restart the current game at any time without refreshing the page.

## 🧠 AI Implementation

The computer opponent is implemented using the **Minimax algorithm enhanced with Alpha-Beta pruning**.

The AI evaluates available moves recursively and assigns scores based on the game outcome:

* Winning for the computer → positive score
* Winning for the player → negative score
* Draw → neutral score

Alpha-Beta pruning reduces unnecessary branches during the search, making the decision process more efficient.

This makes the computer opponent significantly more strategic than a simple random-move AI.

## 🌐 Online Multiplayer Architecture

The online multiplayer mode uses **Firebase Realtime Database** to synchronize game state between players.

### Game Flow

1. Player 1 selects **Generate Code**.
2. The application creates a unique five-character game code.
3. A game object is created in Firebase under the generated code.
4. Player 2 enters the code using **Enter Code**.
5. Both players listen for changes to the same Firebase game node.
6. Board state and current-player information are synchronized in real time.

The application also distinguishes between the host and joining player so that X and O turns are assigned appropriately.

## 🛠️ Technologies Used

| Technology                     | Purpose                                           |
| ------------------------------ | ------------------------------------------------- |
| **HTML5**                      | Application structure and UI                      |
| **CSS3**                       | Custom styling, animations and game-board design  |
| **JavaScript (ES6+)**          | Game logic, DOM manipulation and state management |
| **Bootstrap 5.3**              | Responsive layout, buttons and modals             |
| **Font Awesome 6.4**           | UI icons                                          |
| **Firebase Realtime Database** | Real-time online multiplayer                      |

## 📂 Project Structure

```text
TikTakToe/
│
├── index.html       # Main application interface
├── script.js        # Game logic, AI and multiplayer functionality
├── style.css        # Custom styling and animations
└── README.md        # Project documentation
```

## 🎮 Game Modes

### 1. Play vs Computer

Select **Play vs Computer** to play against the AI.

The computer uses Minimax with Alpha-Beta pruning to analyze possible moves and determine its best available action.

### 2. Local Multiplayer

Select **Local Multiplayer** to play with another person on the same device.

Players alternate between:

```text
X → O → X → O → ...
```

The game automatically detects wins and draws.

### 3. Online Multiplayer

For an online match:

**Player 1**

1. Click **Generate Code**.
2. Copy the displayed game code.
3. Share the code with Player 2.

**Player 2**

1. Click **Enter Code**.
2. Enter the shared game code.
3. Click **Join**.

Once connected, both players receive synchronized board updates through Firebase.

## 🏆 Winning Conditions

The game checks all eight possible winning combinations:

```text
Rows:
X X X
- - -
- - -

- - -
X X X
- - -

- - -
- - -
X X X


Columns:
X - -
X - -
X - -

- X -
- X -
- X -

- - X
- - X
- - X


Diagonals:
X - -
- X -
- - X

- - X
- X -
X - -
```

When a player wins, an animated line is drawn across the winning combination.

## 🎨 UI & Design

The interface uses a dark gaming-inspired theme with:

* Dark background
* Cyan X styling
* Magenta O styling
* Glowing title
* Interactive board cells
* Hover animations
* Scoreboard
* Animated winning line
* Bootstrap responsive components

The board is dynamically generated through JavaScript, allowing the game state to remain synchronized with the underlying board array.

## 🚀 Getting Started

### Prerequisites

No build tools or package manager are required.

You only need:

* A modern web browser
* Internet connection for CDN resources and online multiplayer

### Run Locally

Clone the repository:

```bash
git clone https://github.com/ak050803/TikTakToe.git
```

Navigate into the project:

```bash
cd TikTakToe
```

Then open:

```text
index.html
```

in your browser.

Alternatively, use the **Live Server** extension in VS Code for a smoother development experience.

## 🔥 Firebase Configuration

The online multiplayer functionality uses Firebase Realtime Database.

The application currently initializes Firebase directly from `index.html` and uses the Realtime Database structure:

```text
games/
└── GAME_CODE/
    ├── board
    ├── currentPlayer
    └── reset
```

The game code is used as the unique identifier for an online match.

> **Security Note:** Firebase client configuration values are generally intended to be present in client-side applications. However, database access should always be protected with appropriate Firebase Security Rules before deploying a production application.

## 🧩 Core JavaScript Components

The main game logic is organized around several responsibilities:

### Game State

The application maintains:

* Current player
* Current board state
* Game mode
* Game activity
* Player scores
* Online game code
* Host/joiner state

### Board Management

The board is dynamically generated with JavaScript, and each cell receives a click handler to process player moves.

### Winner Detection

The application checks the eight possible winning combinations after every move.

### AI

The AI consists of:

```text
findBestMove()
        ↓
minimax()
        ↓
checkWinnerMinimax()
```

Alpha-Beta pruning is used during the recursive search to eliminate branches that cannot influence the final decision.

### Online Synchronization

Firebase listeners monitor the active game's database node and update the local board whenever another player makes a move.

## 📸 Screenshots

Add screenshots of the application here once you have captured them:

```text
screenshots/
├── home.png
├── vs-computer.png
├── local-multiplayer.png
└── online-multiplayer.png
```

Example:

```markdown
![TikTakToe Gameplay](screenshots/home.png)
```

## 🌱 Future Improvements

Potential enhancements for future versions include:

* [ ] Player name customization
* [ ] Difficulty levels for the AI
* [ ] Persistent player statistics
* [ ] Online player presence indicators
* [ ] Improved matchmaking
* [ ] Game history
* [ ] Sound effects
* [ ] Theme customization
* [ ] Mobile-specific UI improvements
* [ ] Firebase authentication
* [ ] Improved Firebase security rules
* [ ] Online leaderboard
* [ ] Deploy the application with a live demo

## 🎯 Learning Outcomes

This project demonstrates practical implementation of:

* DOM manipulation
* Event-driven JavaScript
* Game-state management
* Algorithmic problem solving
* Minimax decision-making
* Alpha-Beta pruning
* Recursive algorithms
* Real-time database synchronization
* Firebase integration
* Responsive UI design
* CSS animations
* Modular frontend logic

## 📌 Project Highlights

> **TikTakToe is more than a basic Tic Tac Toe implementation — it combines game development, algorithmic AI, responsive frontend design, and real-time multiplayer functionality in a single browser-based application.**

The project particularly demonstrates the use of **Minimax + Alpha-Beta pruning** for game AI and **Firebase Realtime Database** for synchronizing multiplayer game state.

## 🔗 Repository

**GitHub:**
https://github.com/ak050803/TikTakToe

## 👨‍💻 Author

**Ansu Kumar Singh**

GitHub:
https://github.com/ak050803

---

⭐ If you found this project interesting, consider giving the repository a star!

# Tic Tac Toe game 

View Project live on your browser: https://vanquishi.github.io/JS-tic-tac-toe/

This project is coded with pure HTML, CSS, and JavaScript. NO frameworks and plugins whatsoever. I just want to get down to basics and practice programming skills with JS

The hardest part for me is coding the MiniMax algorithm for this game's AI. The AI is the minimizing player, in which it tries to avoid the worst outcome. The maximizing player, which 
is YOU, aims for the best possible outcome. Who does not want to win, eh?

This algorithm calculates all possible outcomes corresponding to a move. There are 3 cases:
- AI wins
- Draw
- You win

And in order to translate this better into code, the outcomes are assigned a value:
- AI wins: -1
- Draw: 0
- You win: 1

When you choose the option for Master difficulty level, the Minimax algorithm is called to find the next best move for the AI by choosing the smallest value. Why? Because it's a minimizing player.
In order to make this algorithm even better, I implement depth for each outcome. This would help to decide the best outcome with the least moves as possible

Here is the article that really helps with this algorithm details: https://alialaa.com/blog/tic-tac-toe-js-minimax

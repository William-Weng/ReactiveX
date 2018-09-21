const context = stage.getContext('2d')
const Paddle = { width: 100, height: 20 }
const Brick = { rows: 5, columns: 7, height: 20, gap: 3 }
const Ball = { radius: 10 }

context.fillStyle = 'green'

/// 啟動畫面
export function drawIntro() {
    context.clearRect(0, 0, stage.width, stage.height)
    context.textAlign = 'center'
    context.font = '24px Courier New'
    context.fillText('開始玩了啦…', stage.width * 0.5, stage.height * 0.5)
}

/// 結束畫面
export function drawGameOver(text) {
    context.clearRect(stage.width / 4, stage.height / 3, stage.width / 2, stage.height / 3)
    context.textAlign = 'center'
    context.font = '24px Courier New'
    context.fillText(text, stage.width / 2, stage.height / 2)
}

/// 分數畫面
export function drawScore(score) {
    context.textAlign = 'left'
    context.font = '16px Courier New'
    context.fillText(score, Brick.gap, 16)
}

/// 畫移動的方塊（球拍）
export function drawPaddle(position) {
    context.beginPath()
    context.rect(
      position - Paddle.width / 2,
      context.canvas.height - Paddle.height,
      Paddle.width,
      Paddle.height
    )

    context.fill()
    context.closePath()
}

/// 畫球
export function drawBall(ball) {
    context.beginPath()
    context.arc(ball.position.x, ball.position.y, Ball.radius, 0, Math.PI * 2)
    context.fill()
    context.closePath()
}
  
/// 畫被打擊的方塊
export function drawBrick(brick) {
    context.beginPath()
    
    context.rect(
      brick.x - brick.width / 2,
      brick.y - brick.height / 2,
      brick.width,
      brick.height
    )
    
    context.fill()
    context.closePath()
}

/// 畫被打擊的方塊們
export function drawBricks(bricks) {
    bricks.forEach(brick => drawBrick(brick))
}

/// 建立方塊的基本數據
export function createBricks() {

    let width = (stage.width - Brick.gap - Brick.gap * Brick.columns) / Brick.columns
    let bricks = []
  
    for (let i = 0; i < Brick.rows; i++) {
      for (let j = 0; j < Brick.columns; j++) {

        let _brick = {
            x: j * (width + Brick.gap) + width / 2 + Brick.gap,
            y: i * (Brick.height + Brick.gap) + Brick.height / 2 + Brick.gap + 20,
            width: width,
            height: Brick.height
          }

        bricks.push(_brick)
      }
    }
  
    return bricks
}

const Paddle = { width: 100, height: 20 }
const Ball = { radius: 10 }

/// 測試是否打到磚塊
export function isHit(paddle, ball) {
    return ball.position.x > paddle - Paddle.width / 2
      && ball.position.x < paddle + Paddle.width / 2
      && ball.position.y > stage.height - Paddle.height - Ball.radius / 2;
  }
  
/// 測試是否是碰撞到（反彈）
export function isCollision(brick, ball) {
    return ball.position.x + ball.direction.x > brick.x - brick.width / 2
    && ball.position.x + ball.direction.x < brick.x + brick.width / 2
    && ball.position.y + ball.direction.y > brick.y - brick.height / 2
    && ball.position.y + ball.direction.y < brick.y + brick.height / 2;
  }

  
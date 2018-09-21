
import { drawIntro, drawGameOver, drawScore, drawPaddle, drawBall, drawBricks, createBricks } from './drawCanvas.js'
import { isHit, isCollision } from './util.js'

const { interval,requestAnimationFrame, fromEvent, Observable, Subject, merge } = rxjs
const { tap, map, scan, distinctUntilChanged, withLatestFrom, retryWhen, delay } = rxjs.operators

const stage = document.getElementById('stage')
const Paddle = { width: 100, height: 20 }
const context = stage.getContext('2d')

const FPS = Math.ceil(1000 / 60);
const PaddleControls = { 'ArrowLeft': -1, 'ArrowRight': 1 }
const PaddleSpeed = 240
const BallSpeed = 5
const Ball = { radius: 10 }

/// 點擊的事件流（按下 / 放開）
const keyEvent = { up$: fromEvent(document, 'keyup'), down$: fromEvent(document, 'keydown')}

/// 設定一些初始值（球的位置 + 速度 / 方塊們 / 分數）
const initState = () => ({
    ball: {
      position: { x: stage.width / 2, y: stage.height / 2 },
      direction: { x: 2, y: 2 }
    },
    bricks: createBricks(),
    score: 0
})

/// 更新畫面的時間流（60fps），利用前後時間的差距，計算下一個的位置在哪裡
const ticker$ = interval(FPS, requestAnimationFrame).pipe(
  map(() => ({
      time: Date.now(),
      deltaTime: null 
  })),
  scan((previous, current) => ({
      time: current.time, 
      deltaTime: (current.time - previous.time) / 1000,
  })),
)

/// 按鍵的數據流（按左或按右），當有改變才再次發出
const key$ = merge(
    keyEvent.down$.pipe(map(event => (PaddleControls[event.key] || 0))),
    keyEvent.up$.pipe(map(event => 0)),
  ).pipe(
    distinctUntilChanged()
  )

/// 產生球拍（移動）
const createPaddle$ = (ticker$) => (
    
    ticker$.pipe(
        withLatestFrom(key$),
        scan((position, [ticker, direction]) => {
            const nextPosition = position + direction * ticker.deltaTime * PaddleSpeed
            return Math.max(Math.min(nextPosition, stage.width - Paddle.width / 2), Paddle.width / 2)
        }, stage.width / 2),
        distinctUntilChanged()
    )
)

/// 產生回合數（一直更新畫面）
const createState$ = (ticker$, paddle$) => (

  ticker$.pipe(
    withLatestFrom(paddle$),
    scan(({ ball, bricks, score }, [ticker, paddle]) => {

        let remainingBricks = []
        const collisions = { paddle: false, floor: false, wall: false, ceiling: false, brick: false }

        ball.position.x = ball.position.x + ball.direction.x * ticker.deltaTime * BallSpeed;
        ball.position.y = ball.position.y + ball.direction.y * ticker.deltaTime * BallSpeed;

        bricks.forEach((brick) => {
            if (!isCollision(brick, ball)) {
                remainingBricks.push(brick)
            } else {
                collisions.brick = true
                score = score + 10
            }
        })

        collisions.paddle = isHit(paddle, ball);

        if (ball.position.x < Ball.radius || ball.position.x > stage.width - Ball.radius) {
            ball.direction.x = -ball.direction.x
            collisions.wall = true
        }

        collisions.ceiling = ball.position.y < Ball.radius;

        if (collisions.brick || collisions.paddle || collisions.ceiling ) {
            ball.direction.y = -ball.direction.y;
        }

        return { ball: ball, bricks: remainingBricks, collisions: collisions, score: score }

    }, initState()))
)

/// 更新畫面
function updateView([ticker, paddle, state]) {
    
    context.clearRect(0, 0, stage.width, stage.height)
  
    drawPaddle(paddle)
    drawBall(state.ball)
    drawBricks(state.bricks)
    drawScore(state.score)
  
    if (state.ball.position.y > stage.height - Ball.radius) {
      drawGameOver('GAME OVER')
      restart.error('game over')
    }
  
    if (state.bricks.length === 0) {
      drawGameOver('Congradulations!')
      restart.error('cong')
    }
  }

let restart

const game$ = Observable.create((observer) => {
    
    drawIntro()
    
    const paddle$ = createPaddle$(ticker$)
    const state$ = createState$(ticker$, paddle$)
  
    let data$ = ticker$.pipe(
        withLatestFrom(paddle$, state$),
    )

    data$.subscribe(observer)
  })
  
  game$.pipe(
      retryWhen(err$ => { return err$.pipe(delay(1000)) })
  ).subscribe(
      (x) => { updateView(x) }
  )


//   drawIntro()

//   const paddle$ = createPaddle$(ticker$)
//   const state$ = createState$(ticker$, paddle$)

//   const game$ = ticker$.pipe(
//     withLatestFrom(paddle$, state$),
//   )

// game$.subscribe(updateView)



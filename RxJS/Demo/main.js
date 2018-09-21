/// [RxJS Drag and Drop](https://codepen.io/joshblack/pen/zGZZjX)
/// [Draggable Elements with RxJS](https://varun.ca/drag-with-rxjs/)
/// [如何「畫圖」寫測試 - RxJS Marble Test](https://www.slideshare.net/ssuserb9c983/rxjs-marble-test)

const { interval, range } = rxjs
const { take, delay, refCount, publish, share, asap , TestScheduler} = rxjs.operators

let timeStart = new Date()
let source$ = range(1, 1000, asap)
let test$ = TestScheduler

source$.subscribe(
    null,
    null,
    () => { console.log(Date.now() - timeStart) }
)


/// 有開關的功能 => Subject的複雜版
// tick$.connect()

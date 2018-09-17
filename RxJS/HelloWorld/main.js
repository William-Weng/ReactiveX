/// [Mouse Drag with RxJS](https://medium.com/@jdjuan/mouse-drag-with-rxjs-45861c4d0b7e)
/// [RxJS - RxJS v5.x to v6 Update Guide](https://rxjs-dev.firebaseapp.com/guide/v6/migration#import-paths)
/// [RxJS/fromevent.md at master · Reactive-Extensions/RxJS · GitHub](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/fromevent.md#rxobservablefromeventelement-eventname-selector-options)

import { paint } from './canvas.js'

const { fromEvent } = rxjs
const { takeUntil, mergeMap } = rxjs.operators

const move$ = fromEvent(document.body, 'mousemove')
const down$ = fromEvent(document.body, 'mousedown')
const up$ = fromEvent(document.body, 'mouseup')

/// 按下滑鼠左鍵後，結合滑鼠的移動動作，直到滑鼠左鍵放開為止
const paints$ = down$.pipe(
    mergeMap((down) => move$.pipe(takeUntil(up$)))
)

/// Working (訂閱)
paints$.subscribe(
    (position) => { paint(position) },
    (error) => { console.log('Error: ', error) },
    () => { console.log('complete') }
)

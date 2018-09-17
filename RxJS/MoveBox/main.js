/// [RxJS Drag and Drop](https://codepen.io/joshblack/pen/zGZZjX)
/// [Draggable Elements with RxJS](https://varun.ca/drag-with-rxjs/)

const { fromEvent } = rxjs
const { takeUntil, skipUntil, map, mergeMap, repeat } = rxjs.operators

const box = document.querySelector('.box');

const up$ = fromEvent(box, 'mouseup');
const move$ = fromEvent(document, 'mousemove');
const down$ = fromEvent(box, 'mousedown');

/// 按下滑鼠左鍵後，結合滑鼠的移動動作，直到滑鼠左鍵放開為止
const drag$ = down$.pipe(
    mergeMap((downPosition) => { return mergeMovePositionMap(downPosition) }),
    takeUntil(up$),
    repeat()
)

/// Working (訂閱)
drag$.subscribe(
    (position) => { moveBox(box, position) },
    (error) => { console.log('Error: ', error) },
    () => { console.log('complete') }
)

// ----- function -----
/// 產生要mergeMap的資訊
const mergeMovePositionMap = (_downPosition) => {

    let point = startPoint(_downPosition)
    let positionMap = movePositionMap(point)

    return positionMap
}

/// 點擊點的相關數據
const startPoint = (_position) => {

    const x = _position.clientX + window.scrollX
    const y = _position.clientY + window.scrollY
    const left = parseInt(_position.target.style.left, 10) || 0
    const top = parseInt(_position.target.style.top, 10) || 0

    return { x: x, y: y, left: left, top: top }
}

/// 計算滑鼠移動時的位置
const movePositionMap = (_point) => {

    let positionMap = move$.pipe(

        map((movePosition) => {
            movePosition.preventDefault();

            return {
                left: _point.left + movePosition.clientX - _point.x,
                top: _point.top + movePosition.clientY - _point.y
            };
        })
    )

    return positionMap
}

/// 移動Box
const moveBox = (_box, _position) => {
    _box.style.top = _position.top + 'px';
    _box.style.left = _position.left + 'px';
}
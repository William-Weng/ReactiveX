const { interval, Subject } = rxjs
const { take, multicast, connect, refCount } = rxjs.operators

/// 產生新的Subject
let makeNewSubject = () => {
    return new Subject()
}

const coldSource$ = interval(1000).pipe(take(5))

const tick$ = coldSource$.pipe(
    multicast(makeNewSubject),
    refCount(),
)

/// Working (訂閱1)
const sub1$ = tick$.subscribe(
    (x) => { console.log('1 => ' + x) },
    (error) => { console.log('Error: ', error) },
    () => { console.log('complete') }
)

setTimeout(() => {

    /// Working (訂閱2)
    const sub2$ = tick$.subscribe(
        (x) => { console.log('2 => ' + x) },
        (error) => { console.log('Error: ', error) },
        () => { console.log('complete') }
    )
}, 2000)

/// () => new Subject()，會產生新的Subject，所以會產生重新訂閱的數據流
setTimeout(() => {

    /// Working (訂閱2)
    const sub3$ = tick$.subscribe(
        (x) => { console.log('2 => ' + x) },
        (error) => { console.log('Error: ', error) },
        () => { console.log('complete') }
    )
}, 5500)

/// 有開關的功能 => Subject的複雜版
// tick$.connect()

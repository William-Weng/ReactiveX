const { interval, Subject } = rxjs
const { take, map } = rxjs.operators

const subject$ = new Subject()  
const tick$ = interval(1000).pipe(take(3))

/// Working (訂閱1)
const sub1$ = subject$.subscribe(
    (x) => { console.log('1 => ' + x) },
    (error) => { console.log('Error: ', error) },
    () => { console.log('complete') }
)

setTimeout(() => { 
    /// Working (訂閱2)
    const sub2$ = subject$.subscribe(
        (x) => { console.log('2 => ' + x) },
        (error) => { console.log('Error: ', error) },
        () => { console.log('complete') }
    )
}, 2000)

/// subject＄是中間人的角色，數據流tick$藉由subject＄向大家發送資料 => 有開關的功能
tick$.subscribe(subject$)

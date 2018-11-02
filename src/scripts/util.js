import { curry, compose } from 'ramda';

let concat = curry((x, y) => x.concat(y));

let add = curry((x, y) => x + y);

let split = curry((by, target) => target.split(by));

let trace = curry((tag, x) => {
    console.log(tag, x);

    return x;
});

export {
    concat,
    add,
    split,
    trace
};
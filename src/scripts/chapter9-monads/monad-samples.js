import { compose, map, curry, identity, chain as rchain, prop } from 'ramda';
import { Maybe, join, IO, ioTrace, chain } from '../chapter8-functors/functor-util';
import { trace } from '../util';
import $ from 'jquery';

const safeProp = curry((x, obj) => Maybe.of(obj[x]));

const safeHead = safeProp(0);

const userWithAddresses = {
    addresses: [{ street: { name: 'Mulburry', number: 8402 }, postcode: 'WC2N' }],
};

const userWithNoAddress = {
    addresses: [],
};

const f = compose( 
    map(map(safeProp('street'))),
    map(safeHead), 
    safeProp('addresses'));

f(userWithAddresses).inspect();
f(userWithNoAddress).inspect();

const mmo = Maybe.of(Maybe.of('nunchucks')).inspect();

const firstAddressStreet = compose(
    join,
    map(safeProp('street')),
    join,
    map(safeHead),
    safeProp('addresses')
);

firstAddressStreet(userWithAddresses).inspect();
firstAddressStreet(userWithNoAddress).inspect();

const firstAddressStreetRefactored = compose(
    chain(safeProp('street')),
    chain(safeHead),
    safeProp('addresses')
);

var v = firstAddressStreetRefactored(userWithAddresses);

firstAddressStreetRefactored(userWithAddresses).inspect();
firstAddressStreetRefactored(userWithNoAddress).inspect();

console.log('--------------------------------------------');

const log = x => new IO(() => {
    console.log('xxx', x);

    return x;
});

const setStyle = curry((sel, props) => new IO(() => { 
    $(sel).css(props); 
}));

const getItem = key => new IO(() => { console.log('leak'); return localStorage.getItem(key);}) ;

const setItem = (key, value) => new IO(() => localStorage.setItem(key, value));

const setAndApplyPreferences = compose(
    map(join),
    ioTrace('after setStyle'),
    map(setStyle('#main')),
    ioTrace('after join'),
    map(join),
    ioTrace('after log'),
    map(log),
    ioTrace('after JSON.parse'),
    map(JSON.parse),
    ioTrace('after getItem'),
    getItem
    // ioTrace('after set color'),
    // () => setItem('preferences', JSON.stringify({ 'background-color': 'red' })) 
);

setAndApplyPreferences('preferences').unsafePerformIO();

const setAndApplyPreferencesRefactored = compose(
    chain(setStyle('#main')),
    chain(log),
    ioTrace('after JSON.parse'),
    map(JSON.parse),
    ioTrace('after getItem'),
    getItem
);

setAndApplyPreferencesRefactored('preferences').unsafePerformIO();

const vv = compose(
    () => console.log('2'),
    () => console.log('1'),
    () => console.log('0')
);

vv();

console.log('--------------------------------------------');

const querySelector = selector => new IO(() => {
    console.log('unsafe');

    return document.querySelector(selector);
});

const sel = querySelector('input.username')
    .map(({ value: username }) =>  
        querySelector('input.email')
            .map(({ value: email }) => `Hello ${username}, you're email is ${email}`)
            .join()
    )
    .map(x => console.log(x));

sel.unsafePerformIO();

const sel2 = querySelector('input.username')
    .chain(({ value: username }) => 
        querySelector('input.email')
            .chain(({ value: email }) => IO.of(`Hello ${username}, you're email is ${email}`))
    )
    .map(x => console.log(x));
    
sel2.unsafePerformIO();

console.log('--------------------------------------------');

const io = new IO(() => { console.log('1'); return 3; });
const io2 = x => new IO(() => console.log(x));

const result = io.map(io2).map(join);

result.unsafePerformIO();

console.log('--------------------------------------------');

const io3 = new IO(() => { 
    console.log('Hello'); 
    return 'Hello'; 
}).chain(x => IO.of('xxxxxx')).map(x => console.log(x));

io3.unsafePerformIO();






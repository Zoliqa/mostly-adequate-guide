import { Container, Maybe, maybe, Either, Left, Right, left, either, IO } from './functor-util';
import { concat, add, split, trace } from '../util';
import { curry, prop, match, compose, map, toString, identity, head, last, filter, equals, reduce, subtract } from 'ramda';
import moment from 'moment';

console.log(subtract(20, 10));

const res = reduce(subtract, 20, [1, 2, 3, 4]);

console.log(res);

//-----------------------------------------------------------------------------------------

Container.of(2).map(two => two + 2).inspect();

Container.of('flamethrowers').map(s => s.toUpperCase()).inspect(); 

Container.of('bombs').map(concat(' away')).map(prop('length')).inspect(); 

//-----------------------------------------------------------------------------------------

Maybe.of('Malkovich Malkovich Malkovich').map(match(/a/ig)).inspect();

Maybe.of(null).map(match(/a/ig)).inspect();

Maybe.of({ name: 'Boris' }).map(prop('age')).map(add(10)).inspect();

Maybe.of({ name: 'Dinah', age: 14 }).map(prop('age')).map(add(10)).inspect();


//-----------------------------------------------------------------------------------------

const safeHead = xs => Maybe.of(xs[0]);

const streetName = compose(map(prop('street')), safeHead, prop('addresses'));

streetName({ addresses: [] }).inspect();

streetName({ addresses: [{ street: 'Shady Ln.', number: 4201 }] }).inspect();

//-----------------------------------------------------------------------------------------

// withdraw :: Number -> Account -> Maybe(Account)
const withdraw = curry((amount, { balance }) =>
    Maybe.of(balance >= amount ? { balance: balance - amount } : null));

// This function is hypothetical, not implemented here... nor anywhere else.
// updateLedger :: Account -> Account 
const updateLedger = account => account;

// remainingBalance :: Account -> String
const remainingBalance = ({ balance }) => `Your balance is $${balance}`;

// finishTransaction :: Account -> String
const finishTransaction = compose(remainingBalance, updateLedger);

// getTwenty :: Account -> Maybe(String)
let getTwenty = compose(map(finishTransaction), withdraw(20));

getTwenty({ balance: 200.00 }).inspect(); 
// Just('Your balance is $180')

getTwenty({ balance: 10.00 }).inspect();
// Nothing

//-----------------------------------------------------------------------------------------

// getTwenty :: Account -> String
getTwenty = compose(maybe('You\'re broke!', finishTransaction), withdraw(20));

let log = getTwenty({ balance: 200.00 }); 
console.log(log);
// 'Your balance is $180.00'

log = getTwenty({ balance: 10.00 }); 
console.log(log);
// 'You\'re broke!'

//-----------------------------------------------------------------------------------------

Either.of('rain').map(str => `b${str}`).inspect(); 
// Right('brain')

left('rain').map(str => `It's gonna ${str}, better bring your umbrella!`).inspect(); 
// Left('rain')

Either.of({ host: 'localhost', port: 80 }).map(prop('host')).inspect();
// Right('localhost')

left('rolls eyes...').map(prop('host')).inspect();

//-----------------------------------------------------------------------------------------

// getAge :: Date -> User -> Either(String, Number)
const getAge = curry((now, user) => {
    const birthDate = moment(user.birthDate, 'YYYY-MM-DD');

    return birthDate.isValid()
        ? Either.of(now.diff(birthDate, 'years'))
        : left('Birth date could not be parsed');
});

getAge(moment(), { birthDate: '2005-12-12' }).inspect();
// Right(9)

getAge(moment(), { birthDate: 'July 4, 2001' }).inspect();
// Left('Birth date could not be parsed')

//-----------------------------------------------------------------------------------------

// fortune :: Number -> String
const fortune = compose(concat('If you survive, you will be '), toString, add(1));

// zoltar :: User -> Either(String, _)
let zoltar = compose(map(console.log), map(fortune), getAge(moment()));

zoltar({ birthDate: '2005-12-12' }).inspect();
// 'If you survive, you will be 10'
// Right(undefined)

zoltar({ birthDate: 'balloons!' }).inspect();
// Left('Birth date could not be parsed')

//-----------------------------------------------------------------------------------------

zoltar = compose(console.log, either(() => 'Error ocurred', fortune), getAge(moment()));

zoltar({ birthDate: '2005-12-12' });//.inspect();
// 'If you survive, you will be 10'
// undefined

zoltar({ birthDate: 'balloons!' });//.inspect();
// 'Birth date could not be parsed'
// undefined

//-----------------------------------------------------------------------------------------

// ioWindow :: IO Window
const ioWindow = new IO(() => window);

ioWindow.map(win => win.innerWidth).inspect();
// IO(1430)

ioWindow
  .map(prop('location'))
  .map(prop('href'))
  .map(split('/')).inspect();
// IO(['http:', '', 'localhost:8000', 'blog', 'posts'])


// $ :: String -> IO [DOM]
const $ = selector => new IO(() => document.querySelectorAll(selector));

$('#main').map(head).map(div => div.innerHTML).inspect();
// IO('I am some inner html')

//-----------------------------------------------------------------------------------------

console.log('testing effects');

// url :: IO String
const url = new IO(() => window.location.href);

// toPairs :: String -> [[String]]
const toPairs = compose(map(split('=')), split('&'));

// Maybe.of('aa=1&bb=2&cc=3').map(toPairs).inspect();

// params :: String -> [[String]]
const params = compose(toPairs, last, split('?'));

// Maybe.of('localhost?aa=3&bb=2&cc=1').map(params).inspect();

// findParam :: String -> IO Maybe [String]
const findParam = key => map(compose(Maybe.of, trace('after filter'), filter(compose(trace('after equals'), equals(key), head)), params), url);

var urlEx = Maybe.of('localhost:8080?a=1&b=2&c=3');

var paramsEx = urlEx.map(params).inspect();

var vv = compose(equals('a'), head)(['b', 'b']);
var vvv = filter(compose(equals('a'), head))([['a', '1'], ['b', '2'], ['c', '3']]);

var filterEx = urlEx.map(compose(filter(compose(equals('a'), head)), params));

var v = compose(equals(2), head);

Maybe.of([2,3]).map(v).inspect();

// -- Impure calling code ----------------------------------------------

// run it by calling $value()!
findParam('a').unsafePerformIO().inspect();
// Just([['searchTerm', 'wafflehouse']])


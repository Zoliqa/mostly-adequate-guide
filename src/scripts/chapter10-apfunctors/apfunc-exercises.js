import { compose, map, curry, identity, chain as rchain, prop, add } from 'ramda';
import { Maybe, join, IO, ioTrace, chain, Container, liftA2, Either } from '../chapter8-functors/functor-util';
import { trace } from '../util';

const safeAdd = (x, y) => Maybe.of(add).ap(x).ap(y);

safeAdd(Maybe.of(1), Maybe.of(2)).inspect();

const safeAdd2 = (x, y) => x.map(add).ap(y);

safeAdd2(Maybe.of(1), Maybe.of(2)).inspect();

const safeAdd3 = (x, y) => liftA2(add, x, y);

safeAdd3(Maybe.of(1), Maybe.of(2)).inspect();

const localStorage = {  
    player1: { id:1, name: 'Albert' },  
    player2: { id:2, name: 'Theresa' },  
  };  
    
// getFromCache :: String -> IO User  
const getFromCache = x => new IO(() => localStorage[x]);  

// game :: User -> User -> String  
const game = curry((p1, p2) => console.log(`${p1.name} vs ${p2.name}`));  

const startGame = new IO(game).ap(getFromCache('player1')).joinPerform().ap(getFromCache('player2'));

console.log('before release');

startGame.unsafePerformIO();
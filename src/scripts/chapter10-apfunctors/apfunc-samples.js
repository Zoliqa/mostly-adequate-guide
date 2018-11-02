import { compose, map, curry, identity, chain as rchain, prop, add } from 'ramda';
import { Maybe, join, IO, ioTrace, chain, Container } from '../chapter8-functors/functor-util';
import { trace } from '../util';

const contAdd2 = map(add, Container.of(2));

const addRes = Container.of(2).chain(two => Container.of(3).map(add(two)));

addRes.inspect();

const addRes2 = Container.of(2).map(add).ap(Container.of(3));

addRes2.inspect();

Maybe.of(add).ap(Maybe.of(2)).ap(Maybe.of(3)).inspect();

console.log('--------------------------------------------');

const $ = selector => new IO(() => document.querySelector(selector));

const getVal = compose(map(prop('value')), $);

const signIn = curry((username, password, rememberMe) => console.log(username, password, rememberMe));

const signer = IO.of(signIn).ap(getVal('.email')).ap(getVal('.password')).ap(IO.of(false));

signer.unsafePerformIO();

var v = compose(map(x => console.log(x)), getVal);

v('.email').unsafePerformIO();

var vv = getVal('.email')
    .map(email => 
        getVal('.password')
            .map(password => signIn(email, password, false))
        .join()
    );

vv.unsafePerformIO();
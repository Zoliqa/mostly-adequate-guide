import { compose, map, curry, identity, chain as rchain, prop, add } from 'ramda';
import { Maybe, join, IO, ioTrace, chain, Container, liftA2, Either } from '../chapter8-functors/functor-util';
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

const signer = new IO(signIn).ap(getVal('.email')).joinPerform().ap(getVal('.password')).joinPerform().ap(IO.of(false));

console.log('before unleashing the beast');

signer.unsafePerformIO();

console.log('--------------------------------------------');

const f = x => console.log(`${x} world`);

const f2 = function outer(x) {
    return function inner(y) {
        console.log(x, y);        
    }
};

// new IO(f).ap(IO.of('Hello')).unsafePerformIO();

// new IO(f2('xx2')).ap(IO.of('yy2')).unsafePerformIO();

const c = new IO(f2).ap(IO.of('xxx3')).joinPerform();

const c2 = c.ap(IO.of('yyy3'));

c2.unsafePerformIO();

var v1 = compose(
    f2,
    () => 'xxx'
)();

var v2 = compose(
    v1,
    () => 'yyy'
);

v2();

c2.unsafePerformIO();

var v22 = compose(
    compose(
        f2,
        () => 'xxxx'
    ),
    () => 'yyyy'
);

v22()();

console.log('--------------------------------------------');

Maybe.of(add).ap(Maybe.of(2)).ap(Maybe.of(3)).inspect();

liftA2(add, Maybe.of(2), Maybe.of(3)).inspect();

console.log('--------------------------------------------');

const user = {
    name: 'name',
    email: 'email'
};

const createUser = curry((email, name) => new IO(() => console.log(`creating user ${ email } ${ name }`) ));

Either.of(createUser).ap(Either.of('email2')).ap(Either.of('name2')).map(io => io.unsafePerformIO());

liftA2(createUser, Either.of('email3'), Either.of('name3')).map(io => io.unsafePerformIO());


import { map, add, compose, identity, head, prop, concat } from 'ramda';
import { Maybe, either, Either, left } from './functor-util';
import { trace } from '../util';

const inc = x => x + 1;

const incrF = compose(trace('after identity'), map(add(1)), trace('after maybe'), Maybe.of);

incrF(10).inspect();

const user = { id: 2, name: 'Einstein', active: false };

const initial = compose(map(head), map(prop('name')), Maybe.of);

initial(user).inspect();

const showWelcome = compose(concat('Welcome '), prop('name'));

// checkActive :: User -> Either String User
const checkActive = function checkActive(user) {
  return user.active
    ? Either.of(user)
    : left('Your account is not active');
};

const eitherWelcome = compose(map(showWelcome), checkActive);

eitherWelcome(user).inspect();

Either.of('The past, present and future walk into a bar...').map(concat('it was tense.')).inspect();
import { compose, map, curry, identity, chain as rchain, prop, split, last, head, match } from 'ramda';
import { Maybe, join, IO, ioTrace, chain, either, left, Either } from '../chapter8-functors/functor-util';
import { trace } from '../util';
import $ from 'jquery';

const user = {
    id: 1,
    name: 'Albert',
    address: {
        street: {
            number: 22,
            name: 'Walnut St'
        }
    }
};

const safeProp = curry((x, obj) => Maybe.of(obj[x]));

const getStreetName = compose(
    chain(safeProp('name')),
    chain(safeProp('street')),
    safeProp('address')
);

const streetName = getStreetName(user);
const streetName2 = getStreetName({});

console.log(streetName);
console.log(streetName2);


console.log('--------------------------------------------');

const getFile = () => IO.of('/home/mostly-adequate/ch9.md');

const pureLog = str => new IO(() => console.log(str));

const logFileName = compose(
    chain(pureLog),
    map(head),
    map(split('.')),
    map(last),
    map(split('/')),
    getFile
);

const logger = logFileName();

logger.unsafePerformIO();

console.log('--------------------------------------------');

const validateEmail = email => {
    if(match(/\S+@\S+.(com|org|net)$/, email)) {
        return Either.of(email);     
    }

    return left('Invalid email address received');
};

const mailingList = ['a@a.com', 'b@b.com'];

const addToMailingList = email => new IO(() => {
    mailingList.push(email);//return 1;
});

const emailBlast = notification => new IO(() => mailingList.forEach(email => console.log(`Sending ${notification} to ${email}`)));

const joinMailingList = compose(
    // map(join),
    // trace('after map emailblast'),
    // map(emailBlast('spam')),
    trace('after addtomailinglist'),
    // map(join),
    map(addToMailingList),
    validateEmail
);

const joinAndSendEmail = joinMailingList('alma@afaalatt.com');

//joinAndSendEmail.unsafePerformIO();
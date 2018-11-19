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

console.log('before unleashing the beast');

logger.unsafePerformIO();

console.log('--------------------------------------------');

const validateEmail = email => {
    if (match(/\S+@\S+.(com|org|net)$/, email).length > 0) {
        return Either.of(email);     
    }

    return left('Invalid email address received');
};

const addToMailingList = email => new IO(() => {
    const mailingList = ['a@a.com', 'b@b.com'];

    mailingList.push(email);

    return mailingList;
});

const emailBlast = mailingList => new IO(() => mailingList.forEach(email => console.log(`Sending notification to ${ email }`)));

const joinMailingList = compose(
    map(compose(chain(emailBlast), addToMailingList)),
    validateEmail
);

const refactored = compose(
    map(chain(emailBlast)),
    map(addToMailingList),
    validateEmail
);

const joinAndSendEmail = refactored('alma@afaalatt.com');

console.log('before unleashing the beast');

joinAndSendEmail.map(io => io.unsafePerformIO());

const joinAndSendEmail2 = refactored('kortefa.com');

joinAndSendEmail2.inspect();
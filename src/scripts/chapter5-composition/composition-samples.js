import { concat, add, split, trace } from '../util';
import { curry, last, compose, prop, map, reduce, sortBy, flip, identity } from 'ramda';

const cars = [{
    name: 'Aston Martin One-77',
    horsepower: 750,
    dollar_value: 100,
    in_stock: true,
}, {
    name: 'Aston Martin One-78',
    horsepower: 1000,
    dollar_value: 200,
    in_stock: true,
}, {
    name: 'Aston Martin One-79',
    horsepower: 1750,
    dollar_value: 300,
    in_stock: false,
}];

const isLastInStock = (cars) => {  
    const lastCar = last(cars);  
    return prop('in_stock', lastCar);  
};

compose(trace('before'), isLastInStock)(cars);

compose(trace('after'), prop('in_stock'), last)(cars);

const average = xs => reduce(add, 0, xs) / xs.length;

const averageDollarValue = (cars) => {  
    const dollarValues = map(c => c.dollar_value, cars);  
    return average(dollarValues);  
}; 

compose(trace('before'), averageDollarValue)(cars);

compose(trace('after'), average, map(prop('dollar_value')))(cars);

const fastestCar = (cars) => {  
    const sorted = sortBy(car => car.horsepower, cars);  
    const fastest = last(sorted);  
    return concat(fastest.name, ' is the fastest');  
}; 

compose(trace('before'), fastestCar)(cars);

const merge = curry((a, b) => [].concat(a, b));

const reverse = curry((a, b) => concat(b, a));

compose(trace('after'), flip(concat)(' is the fastest'), prop('name'), last, sortBy(prop('horsepower')))(cars);
compose(trace('after'), reverse(' is the fastest'), prop('name'), last, sortBy(car => car.horsepower))(cars);

import { curry, compose, map, ap } from 'ramda';

const join = mma => mma.join();

//const chain = curry((f, m) => m.map(compose(join, f)));
//const chain = curry((f, m) => m.chain(f));

const chain = curry((f, m) => m.map(f).join());

// const chain = curry((f, m) => compose(join, map(f)));

class Container {
    constructor(x) {
        this.$value = x;
    }
    
    static of(x) {
        return new Container(x);
    }

    map(f) {
        return Container.of(f(this.$value));
    }

    join() {
        return this.$value;
    }

    chain(fn) {
        return chain(fn, this);
    }

    ap(other) {
        return other.map(this.$value);
    }

    inspect() {
        console.log(`Container(${this.$value})`);    
        
        return this;
    }
}

class Maybe {
    static of(x) {
        return new Maybe(x);
    }
  
    get isNothing() {
        return this.$value === null || this.$value === undefined;
    }
  
    constructor(x) {
        this.$value = x;
    }
  
    map(fn) {
        return this.isNothing ? this : Maybe.of(fn(this.$value));
    }
  
    join() {
        return this.isNothing ? Maybe.of(null) : this.$value;
    }

    chain(fn) {
        return chain(fn, this);
    }

    ap(other) {
        return this.isNothing ? this : other.map(this.$value);
    }

    inspect(isNested) {
        let log;

        if (typeof this.$value === 'object' && !!this.$value && this.$value.constructor === Maybe) {
            log = `Just(${this.$value.inspect(true)})`;  
        }
        else {
            log = this.isNothing ? 'Nothing' : (typeof this.$value === 'object' ? `Just(${JSON.stringify(this.$value)})` : `Just(${this.$value})`);
        }

        if (isNested) {
            return log;
        }
        else {
            console.log(log);

            return this;           
        }
    }
}

const mTrace = curry((tag, m) => {
    console.log(tag);
    m.inspect();

    return m;
});

class Either {
    static of(x) {
        return new Right(x);
    }
  
    constructor(x) {
        this.$value = x;
    }
}
  
class Left extends Either {
    map(f) {
      return this;
    }
  
    ap(other) {
        return this;
    }

    inspect() {
        console.log(`Left(${this.$value})`);

        return this;
    }
}
  
class Right extends Either {
    map(f) {
      return Either.of(f(this.$value));
    }
  
    ap(other) {
        return other.map(this.$value);
    }

    inspect() {
        console.log(`Right(${this.$value})`);

        return this;
    }
}
  
const left = x => new Left(x);

const maybe = curry((v, f, m) => {
    if (m.isNothing) {
      return v;
    }
  
    return f(m.$value);
  });

const either = curry((f, g, e) => {
    let result;
  
    switch (e.constructor) {
      case Left:
        result = f(e.$value);
        break;
  
      case Right:
        result = g(e.$value);
        break;
  
      // No Default
    }
  
    return result;
});

class IO {
    static of(x) {
      return new IO(() => x);
    }
  
    constructor(fn) {
        this.unsafePerformIO = fn;
    }
  
    map(fn) {
        return new IO(compose(fn, this.unsafePerformIO));
    }
  
    join() {
        return this.map(io => io.unsafePerformIO()); 
    }

    chain(fn) {
        return chain(fn, this); //this.map(compose(io => io.unsafePerformIO(), fn));
    }

    ap(other) {
        return other.map(this.unsafePerformIO);
    }

    inspect() {
        const log = this.unsafePerformIO();

        console.log(`IO(${ typeof log === 'object' ? JSON.stringify(log) : log })`);
    }

    joinPerform() {
        return new IO(this.unsafePerformIO());
    }
}

const ioTrace = curry((tag, x) => map(y => { 
    console.log(tag, y); 
    return y; 
}, x));

const liftA2 = curry((g, f1, f2) => f1.map(g).ap(f2));

export {
    Container,
    Maybe,
    maybe,
    Either,
    Left,
    Right,
    left,
    either,
    IO,
    join,
    ioTrace,
    chain,
    map,
    liftA2
};
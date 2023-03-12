const assert = require('assert');
const { BigMap, Tracer, TimeLogger } = require('@dn0rmand/project-euler-tools');

const compareCards = (c1, c2) => {
  return c1.key - c2.key;
};

const validFeature = (f1, f2, f3) => (f1 === f2 && f1 === f3) || (f1 !== f2 && f1 !== f3 && f2 !== f3);

class ValueMapper {
  constructor() {
    this.map = [];
    this.next = 0;
  }

  get(value) {
    if (this.map[value] === undefined) {
      this.map[value] = this.next++;
    }
    return this.map[value];
  }
}

class CardMapper {
  constructor() {
    this.shapes = new ValueMapper();
    this.colors = new ValueMapper();
    this.numbers = new ValueMapper();
    this.shadings = new ValueMapper();
  }

  get(card) {
    return new Card(
      this.shapes.get(card.shape),
      this.colors.get(card.color),
      this.numbers.get(card.number),
      this.shadings.get(card.shading)
    );
  }
}

class Card {
  constructor(shape, color, number, shading) {
    this.shape = shape;
    this.color = color;
    this.number = number;
    this.shading = shading;

    let k = 0;
    k = k * 3 + shape;
    k = k * 3 + color;
    k = k * 3 + number;
    k = k * 3 + shading;

    this.key = k;
  }

  isSET(c2, c3) {
    if (!validFeature(this.shape, c2.shape, c3.shape)) {
      return false;
    }
    if (!validFeature(this.color, c2.color, c3.color)) {
      return false;
    }
    if (!validFeature(this.number, c2.number, c3.number)) {
      return false;
    }
    if (!validFeature(this.shading, c2.shading, c3.shading)) {
      return false;
    }
    return true;
  }

  static fromKey(value) {
    const shading = value % 3;
    value = (value - shading) / 3;
    const number = value % 3;
    value = (value - number) / 3;
    const color = value % 3;
    value = (value - color) / 3;
    const shape = value % 3;

    return new Card(shape, color, number, shading);
  }

  static getSETS(cards) {
    let total = 0;
    for (let i = 0; i < cards.length; i++) {
      const c1 = cards[i];
      for (let j = i + 1; j < cards.length; j++) {
        const c2 = cards[j];
        for (let k = j + 1; k < cards.length; k++) {
          const c3 = cards[k];
          if (c1.isSET(c2, c3)) {
            total++;
          }
        }
      }
    }
    return total;
  }
}

class State {
  constructor(cards, count) {
    this.cards = cards;
    this.count = count;
    this.$key = undefined;
  }

  get key() {
    if (this.$key === undefined) {
      const mapper = new CardMapper();
      const cards = this.cards; //.map((card) => mapper.get(card)).sort(compareCards);
      this.$key = cards.map((c) => c.key).join(':');
    }
    return this.$key;
  }

  getSETS() {
    let total = 0;
    for (let i = 0; i < this.cards.length; i++) {
      const c1 = this.cards[i];
      for (let j = i + 1; j < this.cards.length; j++) {
        const c2 = this.cards[j];
        for (let k = j + 1; k < this.cards.length; k++) {
          const c3 = this.cards[k];
          if (c1.isSET(c2, c3)) {
            total++;
          }
        }
      }
    }
    return total;
  }

  add(card) {
    if (this.cards.includes(card)) {
      return;
    }
    const cards = [...this.cards, card].sort(compareCards);
    return new State(cards, this.count);
  }
}

const CARDS = (function () {
  const cards = [];
  for (let i = 0; i < 81; i++) {
    const card = Card.fromKey(i);
    cards.push(card);
  }
  return cards;
})();

function makeKey(cards) {
  if (cards.length === 0) {
    return 'X';
  }

  const mapper = new CardMapper();
  const newCards = cards
    .map((c) => mapper.get(c))
    .sort(compareCards)
    .map((c) => [c.shape, c.color, c.number, c.shading].join(''));
  return newCards.join(':');
}

const memoize = new Map();

function set(key, count) {
  if (count) {
    memoize.set(key, count + (memoize.get(key) || 0));
  }
}

function dump(n) {
  console.log(`--- ${n} ---`);
  for (let k of memoize.keys()) {
    console.log(`${k} => ${memoize.get(k)}`);
  }
}

function inner(cards, index, remaining) {
  const key = makeKey(cards);

  if (!remaining) {
    const count = Card.getSETS(cards) ** 4;
    set(key, count);
    return count;
  }

  if (index + remaining > CARDS.length) {
    return 0;
  }

  let count = 0;
  const tracer = new Tracer(index === 0);
  const x = cards.length;
  cards.push(undefined);
  for (let i = index; i < CARDS.length; i++) {
    tracer.print((_) => CARDS.length - i);
    const card = CARDS[i];
    cards[x] = card;
    count += inner(cards, i + 1, remaining - 1);
  }
  cards.pop();
  tracer.clear();
  //   set(key, count);
  return count;
}

function F(n) {
  memoize.clear();
  let total = inner([], 0, n);
  dump(n);
  return total;
}

assert.strictEqual(F(3), 1080);
assert.strictEqual(F(4), 84240);
assert.strictEqual(
  TimeLogger.wrap('', (_) => F(5)),
  4127760
);
assert.strictEqual(
  TimeLogger.wrap('', (_) => F(6, true)),
  159690960
);
console.log('Tests passed');

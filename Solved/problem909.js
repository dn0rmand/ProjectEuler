const assert = require("assert");
const { TimeLogger } = require("@dn0rmand/project-euler-tools");
const LExpression = require("../L-Expression");

function solve(expression) {
    return LExpression.evaluate(expression);
}

assert.strictEqual(solve("S(Z)(A)(0)"), 1);
assert.strictEqual(solve("S(S)(S(S))(S(Z))(A)(0)"), 6);

console.log("Tests passed");

const answer = TimeLogger.wrap("", () => solve("S(S)(S(S))(S(S))(S(Z))(A)(0)"));
console.log(`Answer is ${answer}`);

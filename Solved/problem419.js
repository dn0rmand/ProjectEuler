const assert           = require('assert'); 
const timeLogger       = require('tools/timeLogger');
const linearRecurrence = require('tools/linearRecurrence');
const Matrix           = require('tools/matrix-small');

const MODULO   = 2 ** 30;
const MODULO_N = BigInt(MODULO);
const MAX      = 1E12;

const ONE_VALUES = [
    1n,
    2n,
    1n,
    3n,
    4n,
    3n,
    4n,
    6n,
    8n,
    12n,
    13n,
    18n,
    24n,
    33n,
    39n,
    52n,
    67n,
    88n,
    113n,
    155n,
    211n,
    264n,
    331n,
    455n,
    596n,
    762n,
    1000n,
    1288n,
    1688n,
    2222n,
    2884n,
    3754n,
    4915n,
    6364n,
    8300n,
    10845n,
    14138n,
    18372n,
    23966n,
    31254n,
    40821n,
    53113n,
    69336n,
    90273n,
    117678n,
    153518n,
    199990n,
    260671n,
    340007n,
    442943n,
    577508n,
    753198n,
    981549n,
    1279278n,
    1667977n,
    2174254n,
    2833629n,
    3694922n,
    4815820n,
    6277803n,
    8183863n,
    10669039n,
    13906708n,
    18129293n,
    23633257n,
    30806207n,
    40158060n,
    52352642n,
    68240827n,
    88959717n,
    115967551n,
    151170348n,
    197062717n,
    256889008n,
    334874131n,
    436526087n,
    569057058n,
    741802884n,
    966992652n,
    1260561302n,
    1643236390n,
    2142072134n,
    2792379814n,
    3640072450n,
    4745111242n,
    6185610745n,
    8063462631n,
    10511273604n,
    13702309311n,
    17862036048n,
    23284478803n,
    30353168325n,
    39567723260n,
    51579530146n,
    67237912802n,
    87649867697n,
    114258332578n,
    148944459080n,
    194160817265n,
    253103530928n,
    329939820511n,
    430102496310n,
    560671454514n,
    730878699995n,
    952756838019n,
    1241992410734n,
    1619032471841n,
    2110534336401n,
    2751244886139n,
    3586459346264n,
    4675227563783n,
    6094521051389n,
    7944677272832n,
    10356502531197n,
    13500500653947n,
    17598945546560n,
    22941584893683n,
    29906130027544n,
    38984950593147n,
    50819892551303n,
    66247663327244n,
    86358942005101n,
    112575554890882n,
    146750938818062n,
    191301183455720n,
    249375873993310n,
    325080724331714n,
    423767841839027n,
    552414121593987n,
    720114492417133n,
    938724900040992n,
    1223700407254723n,
    1595188070154745n,
    2079450896721153n,
    2710724904584627n,
    3533639392277240n,
    4606371978541825n,
    6004761803018575n,
    7827670974559408n,
    10203973997057430n,
    13301668522415405n,
    17339752688312093n,
    22603707580253604n,
    29465679265987427n,
    38410789738277644n,
    50071432496093609n,
    65271981059543939n,
    85087070943540096n,
    110917571464168974n,
    144589625091674569n,
    188483748275008093n,
    245703130129692670n,
    320293015420993638n,
    417526693840319527n,
    544278307941608274n,
    709508829994378550n,
    924899582628994442n,
    1205678072683543876n,
    1571694528797636205n,
    2048825262030192975n,
    2670802038978659180n,
    3481596829538215620n,
    4538530485741859152n,
];

const TWO_VALUES = [
    1n,
    1n,
    2n,
    2n,
    3n,
    2n,
    3n,
    4n,
    8n,
    10n,
    14n,
    18n,
    24n,
    28n,
    41n,
    56n,
    69n,
    91n,
    123n,
    164n,
    221n,
    286n,
    366n,
    494n,
    636n,
    832n,
    1095n,
    1423n,
    1847n,
    2440n,
    3154n,
    4166n,
    5366n,
    7025n,
    9119n,
    11925n,
    15495n,
    20259n,
    26320n,
    34409n,
    44827n,
    58432n,
    76193n,
    99353n,
    129347n,
    168789n,
    219947n,
    286629n,
    373946n,
    487068n,
    635384n,
    827997n,
    1079630n,
    1406896n,
    1834405n,
    2390723n,
    3116889n,
    4062500n,
    5296800n,
    6903398n,
    9000648n,
    11731820n,
    15294780n,
    19936176n,
    25989654n,
    33878726n,
    44162056n,
    57571828n,
    75046243n,
    97830808n,
    127529655n,
    166245780n,
    216712312n,
    282504612n,
    368261992n,
    480063032n,
    625786818n,
    815782154n,
    1063407055n,
    1386263277n,
    1807079826n,
    2355682460n,
    3070805045n,
    4003042115n,
    5218262473n,
    6802411151n,
    8867467178n,
    11559433288n,
    15068584916n,
    19643125285n,
    25606275696n,
    33379784410n,
    43513168749n,
    56722683014n,
    73942536280n,
    96389613059n,
    125651557682n,
    163796211233n,
    213521273788n,
    278341369349n,
    362839469751n,
    472989332113n,
    616578276631n,
    803757052468n,
    1047759974121n,
    1365835410396n,
    1780472747631n,
    2320982799819n,
    3025581524666n,
    3944078499476n,
    5141411083663n,
    6702227789546n,
    8736869958980n,
    11389186959269n,
    14846683861237n,
    19353800351308n,
    25229173726602n,
    32888177226430n,
    42872281111664n,
    55887330013190n,
    72853452580754n,
    94970109793652n,
    123800865960767n,
    161384009318205n,
    210376511103271n,
    274242050106468n,
    357495693453410n,
    466023265094385n,
    607497334868679n,
    791919709014455n,
    1032328546700010n,
    1345720014574449n,
    1754250021008268n,
    2286800474773101n,
    2981021077861466n,
    3885991355731623n,
    5065689972632129n,
    6603518302352420n,
    8608196379792567n,
    11221449062007913n,
    14628026045683009n,
    19068762070079800n,
    24857604971922174n,
    32403808672463339n,
    42240868442800995n,
    55064235995825397n,
    71780486270315672n,
    93571410337247667n,
    121977563543005307n,
    159007179059650624n,
    207278144517714075n,
    270203077033606500n,
    352230590019834762n,
    459159789793735002n,
    598550265351387583n,
    780256520359864666n,
    1017124663217037826n,
    1325900591929170581n,
    1728413871265428938n,
];

const THREE_VALUES = [
    3n,
    4n,
    5n,
    6n,
    8n,
    11n,
    15n,
    22n,
    26n,
    32n,
    44n,
    56n,
    74n,
    100n,
    126n,
    163n,
    220n,
    284n,
    376n,
    486n,
    627n,
    817n,
    1077n,
    1392n,
    1829n,
    2354n,
    3108n,
    4020n,
    5271n,
    6861n,
    8949n,
    11625n,
    15209n,
    19790n,
    25821n,
    33671n,
    43875n,
    57165n,
    74629n,
    97186n,
    126692n,
    165238n,
    215188n,
    280720n,
    365777n,
    477029n,
    621549n,
    810552n,
    1056452n,
    1377215n,
    1795221n,
    2340549n,
    3050221n,
    3977107n,
    5183828n,
    6758049n,
    8808899n,
    11484231n,
    14969652n,
    19513856n,
    25439677n,
    33160053n,
    43227992n,
    56350638n,
    73457598n,
    95756570n,
    124828355n,
    162722051n,
    212121142n,
    276514188n,
    360465948n,
    469879244n,
    612542635n,
    798480843n,
    1040889124n,
    1356875974n,
    1768798819n,
    2305759160n,
    3005737520n,
    3918218921n,
    5107691523n,
    6658262870n,
    8679593469n,
    11314472890n,
    14749317090n,
    19226884590n,
    25063691549n,
    32672512357n,
    42591076098n,
    55520881487n,
    72375566917n,
    94347350403n,
    122988937407n,
    160325556647n,
    208996852527n,
    272443509282n,
    355151042266n,
    462967083578n,
    603513096022n,
    786726265171n,
    1025557989166n,
    1336894821661n,
    1742744913419n,
    2271802979121n,
    2961471186519n,
    3860505383167n,
    5032468311911n,
    6560210424197n,
    8551741806128n,
    11147855650224n,
    14532091700587n,
    18943704713003n,
    24694581328560n,
    32191296548779n,
    41963842838468n,
    54703107227982n,
    71309735128213n,
    92957740796211n,
    121177605613315n,
    157964366250387n,
    205918762374769n,
    268431014451672n,
    349920566531083n,
    456148506796060n,
    594624809734601n,
    775139394568926n,
    1010454101642239n,
    1317204976487427n,
    1717078493052643n,
    2238344472445022n,
    2917854985483885n,
    3803649430650180n,
    4958350924696710n,
    6463593603624120n,
    8425793601599479n,
    10983673142673729n,
    14318066524520352n,
    18664706105785076n,
    24330886644717456n,
    31717190692187189n,
    41345808893718880n,
    53897456596533732n,
    70259499302862676n,
    91588686256268500n,
    119392929318922321n,
    155637909156561323n,
    202886039995150066n,
    264477630458793346n,
    344767027056964969n,
    449430459315857912n,
    585867331387611699n,
    763723335099849272n,
    995572380307501144n,
    1297805523750175971n,
    1691789781121923732n,
    2205378702572417600n,
    2874881545247246484n,
    3747630235535766904n,
    4885325585898622552n,
    6368399386079139784n,
    8301700681537176475n,
    10821908299165445174n,
    14107193671159361340n,
    18389816994039910063n,
    23972547421092825269n,
    31250067893825233074n,
];

function next(value)
{
    let count = 0;
    let previous = -1;
    let newValue = [];

    const flush = digit => {
        if (count > 0) {
            if (count > 9) {
                debugger;
            }
            newValue.push(count);
            newValue.push(previous);
        }
        previous = digit;
        count    = 1;
    };

    for(const digit of value) {
        if (digit === previous) {
            count++;
        } else {
            flush(digit);
        }
    }
    flush(0);
    return newValue;
}

function f(n)
{
    let value = [1];

    for(let i = 1; i < n; i++) {
        value = next(value);
    }

    return value;
}

function count(digit, value)
{
    return value.reduce((a, v) => a + (v === digit ? 1 : 0), 0);
}

function getABC(n)
{
    const value = f(n);

    const counts = value.reduce((a, v) => { a[v] = (a[v] || 0) + 1; return a; }, []);

    return { 
        a: counts[1] || 0, 
        b: counts[2] || 0, 
        c: counts[3] || 0 
    }; 
}

function prepare(values, expected, offset)
{
    const l = linearRecurrence(values, expected);
    if (l.divisor !== 1n) { throw "No good"; }

    const M = Matrix.fromRecurrence(l.factors);
    const I = new Matrix(M.rows, 1);

    for(let r = 0; r < M.rows; r++) {
        I.set(M.rows-1-r, 0, Number(values[r] % MODULO_N));
    }

    return { M, I, offset };
}

function X(n, { M, I, offset })
{
    const m = M.pow(n-offset, MODULO);
    const v = m.multiply(I, MODULO);
    const r = v.get(M.rows-1, 0); 

    return r;
}

const time = new timeLogger('Problem 419');

time.start();

const A_Info = prepare(ONE_VALUES, 78, 1);
const B_Info = prepare(TWO_VALUES, 77, 3);
const C_Info = prepare(THREE_VALUES, 72, 9);

time.pause();

function A(n)
{
    return X(n, A_Info);
}

function B(n)
{
    return X(n, B_Info);
}

function C(n)
{
    return X(n, C_Info);
}

assert.strictEqual(A(40), 31254);
assert.strictEqual(B(40), 20259);
assert.strictEqual(C(40), 11625);

time.resume();

const a = A(MAX);
const b = B(MAX);
const c = C(MAX);

time.stop();

console.log(`Answer is ${a},${b},${c}`);
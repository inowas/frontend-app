export function convertLLR(LLR) {
    return LLR / 10000 * 365; // convert kg/ha/d to kg/m2/y
}

export function convertQ(Q) {
    return Q * 1000000; // convert Mega to standard
}

export function convertC(C) {
    return C / 1000; // convert mg/l to kg/m3
}

function calcHLR(IR, AF) {
    return IR * AF;
}

function calcLR(HLR, C, OD) {
    return HLR * C * 365 / OD;
}

function calcA(C, Q, LLR) {
    return C * Q / LLR;
}

export function calcAH(Q, IR, AF) {
    return calcA(
        1,
        convertQ(Q),
        calcHLR(IR, AF)
    );
}

export function isCtoHigh(C, IR, AF, OD, LLR) {
    const HLR = calcHLR(IR, AF);
    const LR = calcLR(HLR, C, OD);
    return LR > LLR;
}

function calcC(C, IR, AF, OD, LLR) {
    if (isCtoHigh(C, IR, AF, OD, LLR)) {
        const HLR = calcHLR(IR, AF);
        return LLR * OD / HLR / 365;
    }

    return C;
}

export function calcAN(Cn, IR, AF, OD, LLRN, Q) {
    return calcA(
        calcC(
            convertC(Cn),
            IR,
            AF,
            OD,
            convertLLR(LLRN)
        ),
        convertQ(Q),
        convertLLR(LLRN)
    );
}

export function calcAO(Co, IR, AF, OD, LLRO, Q) {
    return calcA(
        calcC(
            convertC(Co),
            IR,
            AF,
            OD,
            convertLLR(LLRO)
        ),
        convertQ(Q),
        convertLLR(LLRO)
    );
}

export function calculateDiagramData(LLRN, LLRO, AF, Q, IR, OD, Cn, Co) {
    return [{
        name: 'AH',
        value: calcAH(Q, IR, AF),
        fill: '#4C4C4C'
    }, {
        name: 'AN',
        value: calcAN(Cn, IR, AF, OD, LLRN, Q),
        fill: '#1EB1ED'
    }, {
        name: 'AO',
        value: calcAO(Co, IR, AF, OD, LLRO, Q),
        fill: '#ED8D05'
    }];
}

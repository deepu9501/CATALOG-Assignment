const crypto = require('crypto');

 
function generateRandomCoefficients(m, secret) {
    const coefficients = [];
    for (let i = 0; i < m; i++) {
        coefficients.push(crypto.randomInt(1, 100));  
    }
    coefficients.push(secret);  
    return coefficients;
}

 
function evaluatePolynomial(coefficients, x) {
    let result = 0;
    for (let i = 0; i < coefficients.length; i++) {
        result += coefficients[i] * Math.pow(x, i);
    }
    return result;
}

 
function generateShares(m, secret) {
    const k = m + 1; 
    const coefficients = generateRandomCoefficients(m, secret);
    const shares = [];

    for (let x = 1; x <= k; x++) {
        const y = evaluatePolynomial(coefficients, x);
        shares.push({ x, y });
    }

    return shares;
}

 
function reconstructSecret(shares) {
    const k = shares.length;
    let secret = 0;

    for (let i = 0; i < k; i++) {
        let numerator = 1;
        let denominator = 1;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                numerator *= -shares[j].x;  
                denominator *= (shares[i].x - shares[j].x); 
            }
        }
        secret += (numerator / denominator) * shares[i].y;
    }
    
    return Math.round(secret);  
}

 
const m = 2; 
const secret = 5;  
const shares = generateShares(m, secret);

 
console.log(`Secret: ${secret}`);
console.log(`Degree of polynomial (m): ${m}`);
console.log(`Generated Shares:`);

shares.forEach(share => {
    console.log(`Share: x = ${share.x}, y = ${share.y}`);
});

 
const reconstructedSecret = reconstructSecret(shares);
console.log(`Reconstructed Secret: ${reconstructedSecret}`);
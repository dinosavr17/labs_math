import React, { useState } from 'react';

function App() {
    const [equations, setEquations] = useState([
        [1, 1, 1, 1],
        [1, 2, 2, 2],
        [2, 3, 4, 4],
        [3, 4, 5, 6],
    ]);

    const [coefficients, setCoefficients] = useState([2, 4, 7, 9]);
    const [solution, setSolution] = useState([]);
    const [residuals, setResiduals] = useState([]);

    const handleCoefficientChange = (index, value) => {
        const newCoefficients = [...coefficients];
        newCoefficients[index] = parseFloat(value) || 0;
        setCoefficients(newCoefficients);
    };

    const handleUnknownChange = (eqIndex, coeffIndex, value) => {
        const newEquations = equations.map((eq, i) => {
            if (i === eqIndex) {
                return eq.map((coeff, j) => (j === coeffIndex ? parseFloat(value) || 0 : coeff));
            }
            return eq;
        });
        setEquations(newEquations);
    };

    const solveEquations = () => {
        const A = equations.map((eq) => [...eq]);
        const b = [...coefficients];
        const x = gaussElimination(A, b);
        const residuals = calculateResiduals(A, x, b);

        setSolution(x);
        setResiduals(residuals);
    };

    const gaussElimination = (A, b) => {
        const n = b.length;
        const x = new Array(n).fill(0);
        //Прямой метод Гаусса
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                const factor = A[j][i] / A[i][i];
                for (let k = i; k < n; k++) {
                    A[j][k] -= factor * A[i][k];
                }
                b[j] -= factor * b[i];
            }
        }

        //Обратный метод Гаусса
        for (let i = n - 1; i >= 0; i--) {
            x[i] = (b[i] - dotProduct(A[i].slice(i + 1), x.slice(i + 1))) / A[i][i];
        }

        return x;
    };

    const calculateResiduals = (A, x, b) => {
        const residuals = b.map((bi, i) => bi - dotProduct(A[i], x));
        return residuals;
    };

    const dotProduct = (a, b) => {
        return a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    };

    return (
        <div>
            <h1>Решить систему уравнений</h1>
            <div>
                <h3>Система уравнений</h3>
                {equations.map((eq, eqIndex) => (
                    <div style={{display: "flex", flexDirection: 'row'}} key={eqIndex}>
                        {eq.map((coeff, coeffIndex) => (
                            <div style={{padding: '0 5px'}} key={coeffIndex}>
                                <label htmlFor={`eq${eqIndex}x${coeffIndex + 1}`}>{`x${coeffIndex + 1}`}</label>
                                <input
                                    id={`eq${eqIndex}x${coeffIndex + 1}`}
                                    type="text"
                                    value={coeff}
                                    onChange={(e) => handleUnknownChange(eqIndex, coeffIndex, e.target.value)}
                                />
                            </div>
                        ))}
                        = {coefficients[eqIndex]}
                    </div>
                ))}
            </div>
            <div>
                <h3>Свободные члены</h3>
                {coefficients.map((coeff, i) => (
                    <div key={i}>
                        <label htmlFor={`coef${i + 1}`}>{`x${i + 1}`}</label>
                        <input
                            id={`coef${i + 1}`}
                            type="text"
                            value={coeff}
                            onChange={(e) => handleCoefficientChange(i, e.target.value)}
                        />
                    </div>
                ))}
            </div>
            <button  style={{margin: '10px'}} onClick={solveEquations}>Решить систему</button>
            <div>
                <h3>Решение системы:</h3>
                {solution.map((x, i) => (
                    <div key={i}>x{i + 1} = {x.toFixed(2)}</div>
                ))}
            </div>
            <div>
                <h3>Невязки:</h3>
                {residuals.map((residual, i) => (
                    <div key={i}>{i + 1} = {residual.toFixed(2)}</div>
                ))}
            </div>
        </div>
    );
}

export default App;

const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    memory: 0,
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand) return;

    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        try {
            const currentValue = firstOperand || 0;
            const result = performCalculation[operator](firstOperand, inputValue);

            if (isNaN(result) || !isFinite(result)) {
                throw new Error("Math error");
            }

            calculator.displayValue = String(result);
            calculator.firstOperand = result;
        } catch (error) {
            calculator.displayValue = "Error";
        }
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;

    // If the next operator is not "=", update the display without appending it
    if (nextOperator !== '=') {
        calculator.displayValue += ` ${nextOperator} `;
    }
}
const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '^': (firstOperand, secondOperand) => Math.pow(firstOperand, secondOperand),
    '=': (firstOperand, secondOperand) => secondOperand,
};

function handleFunction(func) {
    const { displayValue } = calculator;
    const inputValue = parseFloat(displayValue);

    try {
        const result = performFunction[func](inputValue);

        if (isNaN(result) || !isFinite(result)) {
            throw new Error("Math error");
        }

        calculator.displayValue = String(result);
    } catch (error) {
        calculator.displayValue = "Error";
    }
}

const performFunction = {
    'sin': (value) => Math.sin(value),
    'cos': (value) => Math.cos(value),
    'tan': (value) => Math.tan(value),
    'asin': (value) => Math.asin(value),
    'acos': (value) => Math.acos(value),
    'atan': (value) => Math.atan(value),
    'log': (value) => Math.log10(value),
    'ln': (value) => Math.log(value),
    'exp': (value) => Math.exp(value),
    'sqrt': (value) => Math.sqrt(value),
    '%': (value) => value / 100,
};

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

document.querySelector('.calculator-keys').addEventListener('click', (event) => {
    const { target } = event;

    if (!target.matches('button')) return;

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('function')) {
        handleFunction(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (target.classList.contains('memory')) {
        handleMemory(target.value);
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

function handleMemory(memoryAction) {
    const { displayValue } = calculator;
    const inputValue = parseFloat(displayValue);

    switch (memoryAction) {
        case 'MC':
            calculator.memory = 0;
            break;
        case 'MR':
            calculator.displayValue = String(calculator.memory);
            break;
        case 'M+':
            calculator.memory += inputValue;
            break;
        case 'M-':
            calculator.memory -= inputValue;
            break;
    }
}

document.addEventListener('keydown', (event) => {
    const { key } = event;

    if (/[0-9]/.test(key)) {
        inputDigit(key);
        updateDisplay();
    } else if (key === '.') {
        inputDecimal(key);
        updateDisplay();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperator(key);
        updateDisplay();
    } else if (key === 'Enter' || key === '=') {
        handleOperator('=');
        updateDisplay();
    } else if (key === 'Backspace') {
        calculator.displayValue = calculator.displayValue.slice(0, -1);
        if (calculator.displayValue === '') {
            calculator.displayValue = '0';
        }
        updateDisplay();
    } else if (key === 'Escape') {
        resetCalculator();
        updateDisplay();
    } else if (key.toLowerCase() === 'm') {
        handleMemory('MR');
        updateDisplay();
    }
});

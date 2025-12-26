const displayEl = document.getElementById('display');
const expressionEl = document.getElementById('expression');

let current = '';
let previous = '';
let operator = null;
let fullExpression = '';

function updateDisplay() {
  displayEl.textContent = fullExpression === '' ? '0' : fullExpression;
  expressionEl.textContent = '';
}

function appendNumber(n) {
  if (previous !== '' && operator === null) {
    // starting a new calculation after result
    fullExpression = n;
    previous = '';
    current = n;
    updateDisplay();
    return;
  }

  if (n === '.' && current.includes('.')) return;

  if (current === '0' && n !== '.') {
    current = n;
  } else {
    current = current + n;
  }

  fullExpression = fullExpression + n;
  updateDisplay();
}

function chooseOperator(op) {
  // prevent operator at very start
  if (fullExpression === '' && current === '') return;

  const isOp = (c) => /[+\-*/]$/.test(c);

  // If there's a current number, commit it as previous (or compute first)
  if (current !== '') {
    if (previous === '') {
      previous = current;
      current = '';
    } else {
      // have both numbers -> compute first
      compute();

      // after compute, previous and fullExpression hold result
      previous = fullExpression;
      current = '';
    }
  }

  // Replace operator if already exists at end
  if (isOp(fullExpression)) {
    fullExpression = fullExpression.slice(0, -1) + op;
  } else {
    fullExpression = fullExpression + op;
  }

  operator = op;
  updateDisplay();
}

function compute() {
  if (previous === '' || current === '' || !operator) return;

  const a = parseFloat(previous);
  const b = parseFloat(current);
  let res;

  switch (operator) {
    case '+':
      res = a + b;
      break;
    case '-':
      res = a - b;
      break;
    case '*':
      res = a * b;
      break;
    case '/':
      res = b === 0 ? 'Error' : a / b;
      break;
    default:
      return;
  }

  displayEl.textContent = String(res);
  expressionEl.textContent = '';

  previous = res === 'Error' ? '' : String(parseFloat(String(res)));
  current = res === 'Error' ? 'Error' : String(res);
  operator = null;
  fullExpression = String(res);
}

function clearAll() {
  current = '';
  previous = '';
  operator = null;
  fullExpression = '';
  updateDisplay();
}

function deleteLast() {
  if (fullExpression === '') {
    updateDisplay();
    return;
  }

  const last = fullExpression.slice(-1);
  fullExpression = fullExpression.slice(0, -1);

  if (current === 'Error') {
    current = '';
    fullExpression = '';
  } else if (current !== '') {
    current = current.slice(0, -1);
  } else if (operator !== null) {
    operator = null;
  } else if (previous !== '') {
    previous = previous.slice(0, -1);
  }

  updateDisplay();
}

// Button clicks
document.querySelectorAll('.btn').forEach(btn => {
  const val = btn.dataset.value;
  const action = btn.dataset.action;

  if (val) {
    btn.addEventListener('click', () => appendNumber(val));
  }

  if (action === 'operator') {
    btn.addEventListener('click', () => chooseOperator(btn.dataset.value));
  }

  if (action === 'equals') {
    btn.addEventListener('click', () => compute());
  }

  if (action === 'clear') {
    btn.addEventListener('click', () => clearAll());
  }

  if (action === 'delete') {
    btn.addEventListener('click', () => deleteLast());
  }
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    appendNumber(e.key);
    return;
  }

  if (e.key === 'Enter' || e.key === '=') {
    compute();
    return;
  }

  if (e.key === 'Backspace') {
    deleteLast();
    return;
  }

  if (e.key === 'Escape') {
    clearAll();
    return;
  }

  if (['+', '-', '*', '/'].includes(e.key)) {
    chooseOperator(e.key);
    return;
  }
});

updateDisplay();

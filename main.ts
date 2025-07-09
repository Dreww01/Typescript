import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

// Helper function to check if a string can be converted to a valid number
function isNumber(value: string): boolean {
  return !isNaN(Number(value));
}

// Helper function to ask if user wants to continue
async function askToContinue(): Promise<boolean> {
  const again = await askQuestion('Do you want to perform another calculation? (y/n): ');
  return again.toLowerCase() === 'y';
}

async function calculator() {
  // Main calculator function that runs in a loop until user decides to exit
  while (true) {
    // Prompt user for the first number and validate input
    const num1Str = await askQuestion('Enter the first number: ');
    if (!isNumber(num1Str)) {
      console.log('Invalid input. Please enter a valid number.');
      continue;
    }
    const num1 = Number(num1Str);

    // Prompt user for the second number and validate input
    const num2Str = await askQuestion('Enter the second number: ');
    if (!isNumber(num2Str)) {
      console.log('Invalid input. Please enter a valid number.');
      continue;
    }
    const num2 = Number(num2Str);

    // Prompt user to choose an arithmetic operation
    const operation = await askQuestion(
      'Choose an operation (+, -, *, /, %, ^): '
    );

    let result: number | null = null;
    // Perform the selected operation with error handling
    switch (operation) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        if (num2 === 0) {
          console.log('Error: Division by zero is not allowed.');
          if (await askToContinue()) {
            continue;
          } else {
            rl.close();
            return;
          }
        } else {
          result = num1 / num2;
        }
        break;
      case '%':
        if (num2 === 0) {
          console.log('Error: Modulus by zero is not allowed.');
          if (!(await askToContinue())) {
            rl.close();
            return;
          } else {
            continue;
          }
        }
        result = num1 % num2;
        break;
      case '^':
        result = Math.pow(num1, num2);
        break;
      default:
        console.log('Invalid operation. Please choose a valid operator.');
        continue;
    }

    // Display the result of the calculation
    console.log(`Result: ${result}`);

    // Ask user if they want to perform another calculation
    if (!(await askToContinue())) {
      break;
    }
  }
  // Close the readline interface when done
  rl.close();
}

// Start the calculator program
calculator();

// ===== ARROW FUNCTIONS =====
console.log("=== Arrow Functions Practice ===");

// Old way (function declaration)
function oldGreeting(name) {
  return "Hello " + name;
}

// New way (arrow function)
const newGreeting = (name) => {
  return `Hello ${name}`;
};

// Even shorter (implicit return)
const shortGreeting = (name) => `Hello ${name}`;

// Multiple parameters
const addNumbers = (a, b) => a + b;

// No parameters
const getCurrentTime = () => new Date().toLocaleTimeString();

// Test them out
console.log(oldGreeting("Alice"));
console.log(newGreeting("Bob"));
console.log(shortGreeting("Charlie"));
console.log(addNumbers(5, 3));
console.log(getCurrentTime());

// Arrow functions in array methods (VERY important for React!)
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map((num) => num * 2);
const evens = numbers.filter((num) => num % 2 === 0);
const sum = numbers.reduce((total, num) => total + num, 0);

console.log("Doubled:", doubled);
console.log("Evens:", evens);
console.log("Sum:", sum);

// ===== TEMPLATE LITERALS =====
console.log("\n=== Template Literals Practice ===");

const name = "JavaScript";
const version = "ES6+";
const year = 2024;

// Old way (string concatenation)
const oldMessage = "Learning " + name + " " + version + " in " + year;

// New way (template literals)
const newMessage = `Learning ${name} ${version} in ${year}`;

console.log(oldMessage);
console.log(newMessage);

// Multi-line strings (great for HTML templates!)
const htmlTemplate = `
    <div class="card">
        <h2>${name}</h2>
        <p>Version: ${version}</p>
        <p>Year: ${year}</p>
    </div>
`;

console.log(htmlTemplate);

// Expressions in template literals
const mathResult = `2 + 2 equals ${2 + 2}`;
const conditionalMessage = `Today is ${
  new Date().getDay() === 1 ? "Monday" : "not Monday"
}`;

console.log(mathResult);
console.log(conditionalMessage);

// ===== DESTRUCTURING =====
console.log("\n=== Destructuring Practice ===");

// Object destructuring (SUPER important for React!)
const person = {
  firstName: "John",
  lastName: "Doe",
  age: 30,
  city: "New York",
  hobbies: ["coding", "reading", "gaming"],
};

// Old way
const firstName = person.firstName;
const lastName = person.lastName;

// New way (destructuring)
const { firstName: fName, lastName: lName, age, city } = person;
console.log(`${fName} ${lName} is ${age} years old and lives in ${city}`);

// Array destructuring
const colors = ["red", "green", "blue", "yellow"];
const [primary, secondary, tertiary] = colors;
console.log("Primary:", primary);
console.log("Secondary:", secondary);

// Destructuring in function parameters (React props!)
const displayUser = ({ firstName, age, city }) => {
  return `${firstName} (${age}) from ${city}`;
};

console.log(displayUser(person));

// Nested destructuring
const userData = {
  user: {
    profile: {
      name: "Alice",
      settings: {
        theme: "dark",
        notifications: true,
      },
    },
  },
};

const {
  user: {
    profile: {
      name,
      settings: { theme },
    },
  },
} = userData;
console.log(`${name} prefers ${theme} theme`);

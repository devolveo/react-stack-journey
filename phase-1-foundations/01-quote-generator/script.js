// Step 3: Prevent repeating the same quote twice in a row
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded with modern JavaScript!");

  const quotes = [
    {
      text: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
    },
    {
      text: "Life is what happens when you're busy making other plans.",
      author: "John Lennon",
    },
    {
      text: "The future belongs to those who believe in their dreams.",
      author: "Eleanor Roosevelt",
    },
    {
      text: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle",
    },
    {
      text: "The way to get started is to quit talking and begin doing.",
      author: "Walt Disney",
    },
  ];

  const quoteElement = document.getElementById("quote");
  const authorElement = document.getElementById("author");
  const newQuoteBtn = document.getElementById("new-quote-btn");

  let lastQuoteIndex = -1; // Remember which quote we showed last

  function showRandomQuote() {
    let randomNumber;

    // Keep trying until we get a different quote
    do {
      randomNumber = Math.floor(Math.random() * quotes.length);
    } while (randomNumber === lastQuoteIndex && quotes.length > 1);

    lastQuoteIndex = randomNumber; // Remember this quote
    const { text, author } = quotes[randomNumber];

    quoteElement.textContent = text;
    authorElement.textContent = `— ${author}`;

    console.log(`Showing quote ${randomNumber}: "${text}"`);
  }

  newQuoteBtn.addEventListener("click", showRandomQuote);
  showRandomQuote(); // Show first quote

  //add keyboard key press support
  const handleKeyPress = (event) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      showRandomQuote();
      console.log("New quote via keyboard!");
    }
  };

  document.addEventListener("keydown", handleKeyPress);
  console.log("Modern quote generator ready!");
  console.log("Keyboard shortcuts active: SPACE or ENTER for new quotes");
});

// Step 3: Prevent repeating the same quote twice in a row
const QUOTES_API = "https://dummyjson.com/quotes";
const SINGLE_QUOTE_API = "https://dummyjson.com/quotes/random";
const localQuotes = [
  {
    id: 1,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "motivation",
    year: 2005,
  },
  {
    id: 2,
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    category: "life",
    year: 1980,
  },
  {
    id: 3,
    text: "The future belongs to those who believe in their dreams.",
    author: "Eleanor Roosevelt",
    category: "dreams",
    year: 1945,
  },
  {
    id: 4,
    text: "Success is not final, failure is not fatal.",
    author: "Winston Churchill",
    category: "motivation",
    year: 1942,
  },
  {
    id: 5,
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    category: "inspiration",
    year: 1991,
  },
  {
    id: 6,
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
    category: "opportunity",
    year: 1955,
  },
  {
    id: 7,
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    category: "motivation",
    year: 1903,
  },
  {
    id: 8,
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "perseverance",
    year: -500,
  },
];

document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded with API Integration!");

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

  async function fetchQuoteFromAPI() {
    try {
      console.log("Fetching new quote from API...");

      quoteElement.textContent = "Loading new quote...";
      authorElement.textContent = "";

      await new Promise((resolve) => setTimeout(resolve, 300));

      //fetch from API
      const response = await fetch(SINGLE_QUOTE_API);
      const data = await response.json();

      console.log("API response: ", data);

      //update the display
      quoteElement.textContent = `"${data.quote}"`;
      authorElement.textContent = `— ${data.author}`;
    } catch (error) {
      console.error("Error fetching data from API", error);
      quoteElement.textContent =
        "Sorry, could not load a new quote. Please try again.";
      authorElement.textContent = "~";
    }
  }

  async function fetchMultipleQuotes() {
    try {
      console.log("Fetching multiple quotes from API...");

      quoteElement.textContent = "Loading quotes database...";
      authorElement.textContent = "";

      await new Promise((resolve) => setTimeout(resolve, 300));

      const response = await fetch(QUOTES_API);
      const data = await response.json();

      console.log("Multiple quotes received:", data);
      console.log("Number of quotes:", data.quotes.length);

      // The API returns: { quotes: [...], total: 30, skip: 0, limit: 30 }
      return data.quotes; // Return just the quotes array
    } catch (error) {
      console.error("Error fetching multiple quotes:", error);
      return localQuotes;
    }
  }

  newQuoteBtn.addEventListener("click", fetchQuoteFromAPI);
  fetchQuoteFromAPI(); // Show first quote

  console.log("API-powered quote gnerator ready!");

  //add keyboard key press support
  const handleKeyPress = (event) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      fetchQuoteFromAPI();
      console.log("New quote via keyboard!");
    }
  };

  // TEST FUNCTION: Let's practice array methods
  // EXPANDED TEST: Understanding each array method
  // FIXED VERSION: Using correct API property names
  async function testArrayMethods() {
    const quotes = await fetchMultipleQuotes();

    console.log("=== ARRAY METHODS DEEP DIVE ===");
    console.log("Original quotes array:", quotes.length, "quotes");

    // 1. MAP: Transform each element into something new
    console.log("\n--- MAP Examples ---");
    const authors = quotes.map((quote) => quote.author);
    console.log("Authors only:", authors);

    const quoteLengths = quotes.map((quote) => ({
      author: quote.author,
      length: quote.quote.length, // Fixed: use quote.quote instead of quote.text
    }));
    console.log("Quote lengths:", quoteLengths.slice(0, 3)); // Show first 3

    // 2. FILTER: Keep only elements that match a condition
    console.log("\n--- FILTER Examples ---");
    const shortQuotes = quotes.filter((quote) => quote.quote.length < 50); // Fixed
    console.log("Short quotes (under 50 chars):", shortQuotes.length);

    const modernQuotes = quotes.filter((quote) => quote.id > 50);
    console.log("Modern quotes (ID > 50):", modernQuotes.length);

    // 3. REDUCE: Combine all elements into a single value
    console.log("\n--- REDUCE Examples ---");
    const totalCharacters = quotes.reduce(
      (total, quote) => total + quote.quote.length,
      0
    ); // Fixed
    console.log("Total characters in all quotes:", totalCharacters);

    const averageLength = totalCharacters / quotes.length;
    console.log(
      "Average quote length:",
      Math.round(averageLength),
      "characters"
    );

    // 4. COMBINATION: Chain methods together (very common in React!)
    console.log("\n--- CHAINED METHODS ---");
    const shortAuthors = quotes
      .filter((quote) => quote.quote.length < 60) // Fixed: quote.quote
      .map((quote) => quote.author) // Then transform
      .filter((author) => author.length < 15); // Filter again
    console.log("Authors with short names and short quotes:", shortAuthors);

    // Display a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];

    quoteElement.textContent = `"${selectedQuote.quote}"`; // Fixed: quote.quote
    authorElement.textContent = `— ${selectedQuote.author} (ID: ${selectedQuote.id})`;

    console.log("=== END ARRAY METHODS TEST ===\n");
  }

  document.addEventListener("keydown", handleKeyPress);
  console.log("Modern quote generator ready!");
  console.log("Keyboard shortcuts active: SPACE or ENTER for new quotes");

  const testArraysBtn = document.getElementById("test-arrays-btn");
  testArraysBtn.addEventListener("click", testArrayMethods);
});

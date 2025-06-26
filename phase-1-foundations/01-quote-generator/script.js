// Step 3: Prevent repeating the same quote twice in a row
const QUOTE_API = "https://dummyjson.com/quotes/random";
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
      const response = await fetch(QUOTE_API);
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

  document.addEventListener("keydown", handleKeyPress);
  console.log("Modern quote generator ready!");
  console.log("Keyboard shortcuts active: SPACE or ENTER for new quotes");
});

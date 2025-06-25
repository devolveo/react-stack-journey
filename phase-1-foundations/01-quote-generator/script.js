// Quote Generator - Day 1 Setup
document.addEventListener("DOMContentLoaded", function () {
  const quoteElement = document.getElementById("quote");
  const authorElement = document.getElementById("author");
  const newQuoteBtn = document.getElementById("new-quote-btn");

  // Temporary static quote - we'll make this dynamic tomorrow
  const sampleQuote = {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  };

  // Function to display quote
  function displayQuote(quote) {
    quoteElement.textContent = quote.text;
    authorElement.textContent = `- ${quote.author}`;
  }

  // Event listener for button
  newQuoteBtn.addEventListener("click", function () {
    displayQuote(sampleQuote);
    console.log("Button clicked! Tomorrow we will add real API calls.");
  });

  console.log("Quote Generator initialized!");
});

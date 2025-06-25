// Simple working version first
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded!");

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

  // Get our HTML elements
  const quoteElement = document.getElementById("quote");
  const authorElement = document.getElementById("author");
  const newQuoteBtn = document.getElementById("new-quote-btn");

  //funtion show random quote
  function showRandomQuote() {
    // to retrieve a quote to show to the window
    // 1. get random number to access the quote array by its index
    //    the random number must be witihin quote range (from 0 to quote length)
    // const randomNumber = Math.floor(Math.random() * quotes.length);
    const randomNumber = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomNumber];

    // 2. insert the quote to the element intended
    quoteElement.textContent = selectedQuote.text;
    // 3. insert the quote author to the element intended
    authorElement.textContent = selectedQuote.author;
    console.log("Showing quote number:", randomNumber);
    console.log("Quote:", selectedQuote.text);
  }

  // Connect button to function
  newQuoteBtn.addEventListener("click", showRandomQuote);

  // show first quote when first load
  showRandomQuote();

  console.log("Script setup complete!");
});

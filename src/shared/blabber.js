module.exports = () => {
  const QUOTES = [
    "My grandfather use to work for your grandfather. Of course the rates have gone up.",
    "What hump?",
    "You're putting me on.",
    "Do you also say Froaderick?",
    'No, it\'s pronounced "eye-gor."',
    "Could be worse.",
    "Not the third switch!",
    "Dirty word! He said a dirty word!",
    "Dirty word! He said a dirty word!",
    "He's going to be very popular.",
  ];

  return `${"Igor:".green} ${
    QUOTES[Math.floor(Math.random() * QUOTES.length)]
  }`;
};

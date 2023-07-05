// function splits the text by capitalized and then return the text as a combined text with each separated words capitalized
// e.g. "help", "helpMe", "helpMeYou" => "Help", "Help Me", "Help Me You"

const splitTextByCaps = (text) => {
  // Split the text into words based on uppercase letters
  const words = text.split(/(?=[A-Z])/)

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  )

  // Join the words back together with spaces
  const transformedText = capitalizedWords.join(' ')

  console.log(transformedText)

  return transformedText
}

export { splitTextByCaps }

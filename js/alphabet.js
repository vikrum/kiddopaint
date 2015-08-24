KiddoPaint.Alphabet.english = {
  pages: 2,
  character1: { letters: [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S' ] },
  character2: { letters: [ 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '!', '?', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ] }
}

KiddoPaint.Alphabet.nextPage = function() {
  KiddoPaint.Alphabet.page += 1;
  if(KiddoPaint.Alphabet.page > KiddoPaint.Alphabet.english.pages) {
    KiddoPaint.Alphabet.page = 1;
  }
}

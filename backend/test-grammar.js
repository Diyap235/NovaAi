const nlp = require('./services/nlpService');

const tests = [
  "their going to the market yesterday and buyed some apple's. the weather was good but we was tired after long walk.",
  "i goed to school and buyed a book. she were happy but they was late.",
  "he thinked about it and telled me the answer. we was very tired.",
  "i knowed the answer but i sayed nothing. they was confused.",
  "The children runned fast and catched the ball. it were a great day.",
];

tests.forEach((text, i) => {
  console.log('\n' + '='.repeat(65));
  console.log('INPUT  : ' + text);
  console.log('='.repeat(65));
  const r = nlp.correctGrammar(text);
  console.log('OUTPUT : ' + r.corrected);
  console.log('FIXES  : ' + r.totalFixes);
  r.corrections.forEach((c, j) => {
    console.log('  ' + (j + 1) + '. [' + c.type + ']  "' + c.original + '"  ->  "' + c.fixed + '"');
  });
});

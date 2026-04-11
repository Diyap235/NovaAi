require('dotenv').config();
const aiService = require('./services/aiService');

const inputs = [
  // HIGH (expected 70-100)
  "Artificial intelligence is transforming industries by automating processes and improving efficiency.",
  "Machine learning is a subset of artificial intelligence that enables systems to learn from data.",
  "Technology is rapidly evolving and changing the way we live and work.",
  "Data is the new oil in the digital economy.",
  "The internet has revolutionized communication across the globe.",
  "Cloud computing provides scalable resources over the internet.",
  "Cybersecurity is essential in protecting sensitive information.",
  "Big data analytics helps organizations make better decisions.",
  "Digital transformation is crucial for modern businesses.",
  "Innovation drives economic growth and development.",
  "Blockchain technology ensures secure and transparent transactions.",
  "Artificial intelligence is the future of technology.",
  "Automation increases productivity and reduces costs.",
  "The world is becoming increasingly interconnected.",
  "Software development requires problem-solving skills.",
  "The rapid advancement of technology is shaping our future.",
  "Businesses must adapt to technological changes to survive.",
  "Online learning is becoming more popular worldwide.",
  "Social media has changed how people communicate.",
  "Data-driven decisions improve business outcomes.",
  // MEDIUM (expected 40-70)
  "AI is changing industries by making tasks more automatic and efficient.",
  "Machines can learn patterns from data without being explicitly programmed.",
  "Technology continues to influence how people interact and work daily.",
  "Information is becoming one of the most valuable resources today.",
  "The web has made global communication faster and easier.",
  "Remote servers allow users to access computing power anytime.",
  "Protecting digital data is becoming more important every day.",
  "Companies use data insights to guide their strategies.",
  "Businesses are shifting towards digital systems to stay competitive.",
  "New ideas and inventions help economies grow stronger.",
  "Distributed systems can improve transaction security.",
  "Intelligent systems are becoming more common in everyday life.",
  "Automation helps companies save time and money.",
  "People around the world are more connected than ever before.",
  "Writing software involves logical thinking and creativity.",
  "New technologies continue to reshape industries globally.",
  "Companies need to evolve with changing technologies.",
  "Digital education is gaining popularity among students.",
  "Platforms online have transformed human interaction.",
  "Decisions based on data often lead to better results.",
  // LOW (expected 0-30)
  "I built a small tool that tracks how often I procrastinate and sends me reminders to refocus.",
  "My app visualizes daily habits using colorful graphs and motivational messages.",
  "I experimented with a custom algorithm that predicts my sleep quality based on screen time.",
  "I designed a system that suggests break times depending on how fast I type.",
  "I created a personal dashboard that shows how productive I am throughout the week.",
  "My project analyzes my mood based on the words I type each day.",
  "I developed a feature that rewards me when I complete tasks without distractions.",
  "I tested a model that estimates how focused I am during coding sessions.",
  "I built a simple program that tracks how often I switch between tasks.",
  "My tool helps me understand when I am most productive during the day.",
];

const EXPECTED = [
  ...Array(20).fill('HIGH (70-100)'),
  ...Array(20).fill('MEDIUM (40-70)'),
  ...Array(10).fill('LOW (0-30)'),
];

const buildPrompt = (text) => `You are a plagiarism detection engine.
Analyze this text and return ONLY valid JSON, no extra text:
{
  "plagiarism_score": <0 to 100>,
  "risk_level": "Low | Medium | High",
  "confidence": "Low | Medium | High",
  "analysis": "<one sentence>",
  "flags": [{ "text": "<phrase>", "reason": "<why>" }],
  "suggestion": "<one sentence>"
}
RULES: Generic/common tech phrases = HIGH score. Personal/unique writing = LOW score.
INPUT: "${text}"`;

async function runTests() {
  console.log('\n=== PLAGIARISM DETECTION TEST ===\n');
  let pass = 0, fail = 0;

  for (let i = 0; i < inputs.length; i++) {
    const text     = inputs[i];
    const expected = EXPECTED[i];
    try {
      const raw  = await aiService.generate(buildPrompt(text), { maxTokens: 512, temperature: 0.2 });
      const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || raw);
      const score = json.plagiarism_score;
      const expRange = expected.includes('HIGH') ? [70,100] : expected.includes('MEDIUM') ? [40,70] : [0,30];
      const ok = score >= expRange[0] && score <= expRange[1];
      if (ok) pass++; else fail++;
      console.log(`${ok ? '✅' : '❌'} #${i+1} | Score: ${score} | Expected: ${expected} | Risk: ${json.risk_level}`);
      console.log(`   "${text.slice(0,60)}..."`);
    } catch (e) {
      fail++;
      console.log(`❌ #${i+1} ERROR: ${e.message}`);
    }
  }

  console.log(`\n=== RESULTS: ${pass}/50 passed (${Math.round(pass/50*100)}%) ===\n`);
}

runTests();

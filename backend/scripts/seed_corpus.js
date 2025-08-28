const fs = require('fs');
const path = require('path');

// Additional corpus chunks for seeding
const additionalChunks = [
  {
    "id": "fundamental_rights",
    "text": "Fundamental Rights are enshrined in Part III of the Indian Constitution (Articles 12-35). These rights are justiciable and can be enforced through the courts. The six fundamental rights are: Right to Equality (Articles 14-18), Right to Freedom (Articles 19-22), Right against Exploitation (Articles 23-24), Right to Freedom of Religion (Articles 25-28), Cultural and Educational Rights (Articles 29-30), and Right to Constitutional Remedies (Article 32). These rights are not absolute and can be reasonably restricted in the interest of public order, morality, and security.",
    "metadata": {
      "source": "Constitution of India",
      "part": "III",
      "articles": "12-35",
      "topic": "Fundamental Rights"
    }
  },
  {
    "id": "directive_principles",
    "text": "Directive Principles of State Policy are enshrined in Part IV of the Indian Constitution (Articles 36-51). These are non-justiciable guidelines for the government to establish a welfare state. They include principles like equal pay for equal work, right to work, education, and public assistance, protection of environment, and promotion of international peace. While not enforceable in courts, they are fundamental in the governance of the country and it is the duty of the State to apply these principles in making laws.",
    "metadata": {
      "source": "Constitution of India",
      "part": "IV",
      "articles": "36-51",
      "topic": "Directive Principles"
    }
  },
  {
    "id": "amendment_process",
    "text": "The Constitution of India can be amended under Article 368. Amendments can be made by a special majority of Parliament (two-thirds of members present and voting, and majority of total membership). Some amendments require ratification by at least half of the State legislatures. The amendment process ensures that the Constitution remains flexible while protecting its basic structure. The Supreme Court has held that Parliament cannot amend the basic structure of the Constitution, even with a unanimous vote.",
    "metadata": {
      "source": "Constitution of India",
      "article": "368",
      "topic": "Amendment Process"
    }
  }
];

function seedCorpus() {
  const corpusPath = path.join(__dirname, '../data/corpus_chunks.json');
  
  try {
    // Read existing corpus
    let existingCorpus = [];
    if (fs.existsSync(corpusPath)) {
      const data = fs.readFileSync(corpusPath, 'utf8');
      existingCorpus = JSON.parse(data);
      console.log(`📚 Found existing corpus with ${existingCorpus.length} chunks`);
    }

    // Check for duplicates
    const existingIds = new Set(existingCorpus.map(chunk => chunk.id));
    const newChunks = additionalChunks.filter(chunk => !existingIds.has(chunk.id));

    if (newChunks.length === 0) {
      console.log('✅ No new chunks to add - corpus is up to date');
      return;
    }

    // Add new chunks
    const updatedCorpus = [...existingCorpus, ...newChunks];
    
    // Write back to file
    fs.writeFileSync(corpusPath, JSON.stringify(updatedCorpus, null, 2));
    
    console.log(`✅ Added ${newChunks.length} new chunks to corpus`);
    console.log(`📊 Total corpus size: ${updatedCorpus.length} chunks`);
    
    // Log new chunk IDs
    console.log('📝 New chunks added:');
    newChunks.forEach(chunk => {
      console.log(`   - ${chunk.id}: ${chunk.metadata.topic}`);
    });

  } catch (error) {
    console.error('❌ Error seeding corpus:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedCorpus()
    .then(() => {
      console.log('\n✅ Corpus seeding completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Corpus seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedCorpus, additionalChunks };

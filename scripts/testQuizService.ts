import { localQuizService } from '../services/localQuizService';

async function testQuizService() {
  console.log('🧪 Testing Local Quiz Service...\n');

  // Test standard quiz answers
  const standardAnswers = {
    activity: "Solving complex puzzles or math problems.",
    role: "The analyst, focusing on data and logic.",
    environment: "A quiet, focused environment where I can concentrate.",
    subject: "Mathematics or Physics",
    priority: "Continuous learning and intellectual challenges."
  };

  console.log('📝 Testing Standard Quiz:');
  console.log('Answers:', standardAnswers);
  
  try {
    const suggestions = await localQuizService.getSuggestionsWithPartialMatching(
      standardAnswers,
      'standard'
    );
    
    console.log(`\n✅ Got ${suggestions.length} suggestions:`);
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.career}`);
      console.log(`   Description: ${suggestion.description.substring(0, 100)}...`);
      console.log(`   Roadmap Path: ${suggestion.roadmapPath}\n`);
    });
  } catch (error) {
    console.error('❌ Standard quiz test failed:', error);
  }

  // Test long quiz answers
  const longAnswers = {
    problemSolving: "Break it down logically and analyze data to find the optimal solution.",
    workStyle: "Independent and self-directed: I do my best work when I have autonomy and can manage my own projects.",
    ambition: "To become a leading expert or specialist in my field.",
    workWith: "Data and abstract concepts (numbers, code, theories).",
    learningStyle: "By deconstructing examples and understanding the underlying theory."
  };

  console.log('\n📝 Testing Long Quiz:');
  console.log('Answers:', longAnswers);
  
  try {
    const suggestions = await localQuizService.getSuggestionsWithPartialMatching(
      longAnswers,
      'long'
    );
    
    console.log(`\n✅ Got ${suggestions.length} suggestions:`);
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.career}`);
      console.log(`   Description: ${suggestion.description.substring(0, 100)}...`);
      console.log(`   Roadmap Path: ${suggestion.roadmapPath}\n`);
    });
  } catch (error) {
    console.error('❌ Long quiz test failed:', error);
  }

  // Test with no matching answers (should use fallback)
  const randomAnswers = {
    activity: "Something completely random",
    role: "A role that doesn't exist",
    environment: "Nowhere",
    subject: "Random subject",
    priority: "Random priority"
  };

  console.log('\n📝 Testing Fallback (Random Answers):');
  console.log('Answers:', randomAnswers);
  
  try {
    const suggestions = await localQuizService.getSuggestionsWithPartialMatching(
      randomAnswers,
      'standard'
    );
    
    console.log(`\n✅ Got ${suggestions.length} fallback suggestions:`);
    suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion.career}`);
      console.log(`   Roadmap Path: ${suggestion.roadmapPath}\n`);
    });
  } catch (error) {
    console.error('❌ Fallback test failed:', error);
  }

  console.log('🎉 Test completed!');
}

// Run the test
testQuizService().catch(console.error);
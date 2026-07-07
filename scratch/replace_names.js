const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'c:/Users/J Taj Kiran/Downloads/HabitTracker-main/HabitTracker-main/code007/app/mockData.ts',
  'c:/Users/J Taj Kiran/Downloads/HabitTracker-main/HabitTracker-main/code007/app/page.tsx',
  'c:/Users/J Taj Kiran/Downloads/HabitTracker-main/HabitTracker-main/code007/backend/routes/ai.ts',
  'c:/Users/J Taj Kiran/Downloads/HabitTracker-main/HabitTracker-main/code007/backend/routes/auth.ts',
  'c:/Users/J Taj Kiran/Downloads/HabitTracker-main/HabitTracker-main/code007/backend/routes/tasks.ts',
  'c:/Users/J Taj Kiran/Downloads/HabitTracker-main/HabitTracker-main/code007/mobile/screens/DashboardScreen.tsx'
];

filesToUpdate.forEach((filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ Skip non-existent file: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // String replacements
  content = content
    .replace(/Alex Rivera/g, 'Developer Engineer 01')
    .replace(/alex\.rivera@workquest\.ai/g, 'employee1@workquest.ai')
    .replace(/Sarah Connor/g, 'Manager Leader 01')
    .replace(/sarah\.connor@workquest\.ai/g, 'manager01@workquest.ai');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Updated ${filePath}`);
});

console.log('🎉 String replacements complete.');

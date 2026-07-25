const { Project } = require('ts-morph');
const path = require('path');
const fs = require('fs');

async function run() {
  const project = new Project({
    compilerOptions: { jsx: 1 }
  });

  const baseDir = "c:/Users/amish/Downloads/Fitma.ai Onboarding Flow";
  project.addSourceFilesAtPaths(path.join(baseDir, 'src/**/*.tsx'));
  project.addSourceFilesAtPaths(path.join(baseDir, 'src/**/*.ts'));

  const appFile = project.getSourceFile(path.join(baseDir, 'src/app/App.tsx'));
  
  // Clean up App.tsx: remove old interfaces and functions
  const toRemove = [];
  appFile.getInterfaces().forEach(i => {
    const name = i.getName();
    if (['ChatMessage', 'GoalConfig', 'NotificationItem', 'MemoryItem', 'LoggedMeal'].includes(name)) {
      toRemove.push(i);
    }
  });
  
  const fnToRemove = [];
  appFile.getVariableStatements().forEach(v => {
    const name = v.getDeclarations()[0].getName();
    if (['getGreeting', 'getHealthScore', 'isPlaceholderConfig', 'withFirebaseTimeout'].includes(name)) {
      fnToRemove.push(v);
    }
  });

  toRemove.forEach(n => n.remove());
  fnToRemove.forEach(n => n.remove());

  // Add explicit imports to all files
  const sourceFiles = project.getSourceFiles();
  for (const file of sourceFiles) {
    if (file.getFilePath().includes('utils.ts') || file.getFilePath().includes('types.ts') || file.getFilePath().includes('constants.ts')) continue;
    
    const text = file.getText();
    
    // Add util imports
    const needsUtils = [];
    if (text.includes('getGreeting')) needsUtils.push('getGreeting');
    if (text.includes('getHealthScore')) needsUtils.push('getHealthScore');
    if (text.includes('isPlaceholderConfig')) needsUtils.push('isPlaceholderConfig');
    if (text.includes('withFirebaseTimeout')) needsUtils.push('withFirebaseTimeout');
    
    if (needsUtils.length > 0) {
      file.addImportDeclaration({
        namedImports: [...new Set(needsUtils)],
        moduleSpecifier: file === appFile ? '../utils' : (file.getFilePath().includes('components/layout') || file.getFilePath().includes('components/ui') ? '../../utils' : '../utils')
      });
    }

    // Add type imports
    const needsTypes = [];
    if (text.includes('ChatMessage') && !text.includes('import { ChatMessage }')) needsTypes.push('ChatMessage');
    if (text.includes('GoalConfig') && !text.includes('import { GoalConfig }')) needsTypes.push('GoalConfig');
    if (text.includes('NotificationItem') && !text.includes('import { NotificationItem }')) needsTypes.push('NotificationItem');
    if (text.includes('MemoryItem') && !text.includes('import { MemoryItem }')) needsTypes.push('MemoryItem');
    if (text.includes('LoggedMeal') && !text.includes('import { LoggedMeal }')) needsTypes.push('LoggedMeal');
    
    if (needsTypes.length > 0) {
      file.addImportDeclaration({
        namedImports: [...new Set(needsTypes)],
        moduleSpecifier: file === appFile ? '../types' : (file.getFilePath().includes('components/layout') || file.getFilePath().includes('components/ui') ? '../../types' : '../types')
      });
    }
  }

  await project.save();
  console.log("Utils and types fixed.");
}

run().catch(console.error);

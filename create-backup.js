const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get current directory
const projectRoot = process.cwd();
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const backupName = `essence-radio-backup-${timestamp}.zip`;

console.log('📦 Creating project backup:', backupName);

// Directories and files to exclude
const excludes = [
  'node_modules',
  'dist',
  'build',
  '.git',
  '.vscode',
  '.idea',
  'coverage',
  '.nyc_output',
  '.railway',
  '.vercel',
  '.fly',
  '*.log',
  '.env',
  '.env.local',
  '.env.production',
  '*.pem',
  '*.key',
  '.DS_Store',
  'Thumbs.db',
  '*.sqlite',
  '*.db',
  '*.zip'
];

// Try using PowerShell Compress-Archive (Windows)
if (process.platform === 'win32') {
  try {
    // Get all files and directories to include
    const filesToInclude = [];
    
    function walkDir(dir, baseDir = '') {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.join(baseDir, entry.name);
        
        // Check if should be excluded
        const shouldExclude = excludes.some(exclude => {
          if (exclude.includes('*')) {
            const pattern = exclude.replace('*', '');
            return entry.name.includes(pattern) || relativePath.includes(pattern);
          }
          return entry.name === exclude || relativePath === exclude;
        });
        
        if (shouldExclude) continue;
        
        if (entry.isDirectory()) {
          walkDir(fullPath, relativePath);
        } else {
          filesToInclude.push(relativePath);
        }
      }
    }
    
    walkDir(projectRoot);
    
    // Create temp file list
    const fileListPath = path.join(projectRoot, '_backup_files.txt');
    fs.writeFileSync(fileListPath, filesToInclude.join('\n'));
    
    // Use PowerShell to create zip
    const psCommand = `
      $files = Get-Content '${fileListPath}' | Where-Object { Test-Path $_ }
      Compress-Archive -Path $files -DestinationPath '${backupName}' -Force
      Remove-Item '${fileListPath}'
    `;
    
    execSync(`powershell -Command "${psCommand}"`, { cwd: projectRoot });
    console.log('✅ Backup created:', backupName);
    
    // Get file size
    const stats = fs.statSync(backupName);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 File size: ${sizeMB} MB`);
    
  } catch (error) {
    console.error('❌ Error creating backup:', error.message);
    console.log('\n💡 Alternative: Use 7-Zip or WinRAR to manually create zip');
    console.log('   Include all files except: node_modules, dist, .git, .env files');
  }
} else {
  // Unix/Linux/Mac - try zip command
  try {
    const excludeArgs = excludes.map(ex => `-x "${ex}/*"`).join(' ');
    execSync(`zip -r "${backupName}" . ${excludeArgs}`, { cwd: projectRoot });
    console.log('✅ Backup created:', backupName);
  } catch (error) {
    console.error('❌ Error creating backup:', error.message);
  }
}


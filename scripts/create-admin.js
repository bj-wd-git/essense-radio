/**
 * Script to create an admin user
 * Usage: node scripts/create-admin.js <username> <email> <password>
 */

const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 3) {
  console.error('Usage: node scripts/create-admin.js <username> <email> <password>');
  process.exit(1);
}

const [username, email, password] = args;

console.log('Creating admin user...');
console.log(`Username: ${username}`);
console.log(`Email: ${email}`);

// This would typically use the backend API or database directly
// For now, this is a placeholder - you'll need to:
// 1. Register the user via API
// 2. Update the role to 'admin' in the database

console.log('\nTo make a user admin, run this SQL:');
console.log(`UPDATE users SET role = 'admin' WHERE username = '${username}';`);
console.log('\nOr use the MySQL container:');
console.log(`docker exec -it essence-mysql mysql -uroot -ppassword essence_radio`);
console.log(`Then run: UPDATE users SET role = 'admin' WHERE username = '${username}';`);


const { Client } = require('pg');

async function testConnection(url) {
  const client = new Client({ 
    connectionString: url,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log(`✅ Success for: ${url.replace(/:[^:@]+@/, ':***@')}`);
    await client.end();
    return true;
  } catch (err) {
    console.log(`❌ Failed for: ${url.replace(/:[^:@]+@/, ':***@')}`);
    console.log(`   Error: ${err.message}`);
    return false;
  }
}

async function run() {
  const urls = [
    // 1. Original password, old username, pooler domain
    "postgresql://postgres:Manshi%40130903@aws-1-ap-south-1.pooler.supabase.com:6543/postgres",
    
    // 2. Original password, project-ref username, pooler domain
    "postgresql://postgres.vahmipbeqjwuvbnjwfwj:Manshi%40130903@aws-1-ap-south-1.pooler.supabase.com:6543/postgres",

    // 3. New password, project-ref username, pooler domain
    "postgresql://postgres.vahmipbeqjwuvbnjwfwj:Ma%40130903@aws-1-ap-south-1.pooler.supabase.com:6543/postgres",

    // 4. New password, old username, pooler domain
    "postgresql://postgres:Ma%40130903@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
  ];

  for (const url of urls) {
    await testConnection(url);
  }
}

run();

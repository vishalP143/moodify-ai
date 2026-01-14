require('dotenv').config();

console.log("\n--- DEBUGGING API KEY ---");
console.log("Looking for .env file in:", process.cwd());

const key = process.env.GEMINI_API_KEY;

if (!key) {
    console.log("❌ ERROR: The server sees NO key at all.");
    console.log("   Fix: Check if your file is named '.env' (not .env.txt) and is in the 'backend' folder.");
} else {
    console.log("✅ SUCCESS: The server found a key!");
    console.log("   It starts with: " + key.substring(0, 10) + "...");
    console.log("   Total length: " + key.length + " characters.");
    
    if (key.startsWith('"') || key.startsWith(' ')) {
        console.log("⚠️ WARNING: Your key has quotes or spaces around it in the .env file. Please remove them.");
    }
}
console.log("-------------------------\n");
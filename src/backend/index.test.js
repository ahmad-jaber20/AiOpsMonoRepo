const calculateDiscount = require('./index.js');

console.log("Running backend tests...");

const result = calculateDiscount(100, 0.2);

if (result === 80) {
    console.log("✅ Test Passed: Discount calculated correctly.");
    process.exit(0); // Success
} else {
    console.error("❌ Test Failed: Expected 80, got " + result);
    process.exit(1); // Failure
}

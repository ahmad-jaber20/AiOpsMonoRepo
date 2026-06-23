// A simple function to test
function calculateDiscount(price, discount) {
    if (price < 0 || discount < 0) {
        return 0;
    }
    return price - (price * discount);
}

module.exports = calculateDiscount;

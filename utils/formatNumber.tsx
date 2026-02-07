const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 1 // Adjust precision as needed
    }).format(num);
};


export default formatNumber;
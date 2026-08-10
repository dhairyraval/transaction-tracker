export function formatAmount(amount) {
    const parsed = Number(amount);
    if (isNaN(parsed)) return "0.00 /- rs";

    const formatted = parsed.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return `${formatted} inr.`;
}

export function formatMonth(monthNum){
    // year is a placeholder
    const date = new Date(2024, monthNum - 1, 1);
    return date.toLocaleString('en-US', { month: 'long' });
}

export function formatDate(dataStr){
    const formatted = new Date(dataStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
    });
    return formatted
}
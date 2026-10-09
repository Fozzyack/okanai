/** Checks for a positive hourly rate with at most two decimal places. */
export const isValidBasePay = (pay: string): boolean => {
    const trimmedPay = pay.trim();

    if (!/^(?:\d+(?:\.\d{1,2})?|\.\d{1,2})$/.test(trimmedPay)) {
        return false;
    }

    const amount = Number(trimmedPay);
    return Number.isFinite(amount) && amount > 0;
};

/** Returns the pay as a number, throwing a RangeError for invalid input. */
export const parseBasePay = (pay: string): number => {
    if (!isValidBasePay(pay)) {
        throw new RangeError(
            "Base pay must be a positive number with at most two decimal places.",
        );
    }

    return Number(pay.trim());
};

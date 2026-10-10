/** Checks for a positive hourly rate with any number of decimal places. */
export const isValidBasePay = (pay: string): boolean => {
    const trimmedPay = pay.trim();

    if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(trimmedPay)) {
        return false;
    }

    const amount = Number(trimmedPay);
    return Number.isFinite(amount) && amount > 0;
};

/** Returns the pay as a number, throwing a RangeError for invalid input. */
export const parseBasePay = (pay: string): number => {
    if (!isValidBasePay(pay)) {
        throw new RangeError(
            "Base pay must be a positive number.",
        );
    }

    return Number(pay.trim());
};

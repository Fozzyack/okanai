export type BasePayInputProps = {
    pay: string;
    errMsg: string;

    onChangePay: (amount: string) => void;
    onNext: () => void;
};

export type StepHeaderProps = {
    text: string;
    text_highlight: string;
};

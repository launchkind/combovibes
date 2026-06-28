declare module "@cashfreepayments/cashfree-js" {
  interface CashfreeInstance {
    checkout(options: {
      paymentSessionId: string;
      redirectTarget?: "_self" | "_blank" | "_modal";
    }): void;
  }

  export function load(options: { mode: "sandbox" | "production" }): Promise<CashfreeInstance>;
}

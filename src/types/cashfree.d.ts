declare module "@cashfreepayments/cashfree-js" {
  interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget?: "_self" | "_blank" | "_modal" | HTMLElement;
    returnUrl?: string;
  }

  interface CashfreeCheckoutResult {
    error?: { message: string; code?: string; type?: string };
    redirect?: boolean;
    paymentDetails?: { paymentMessage?: string };
  }

  interface CashfreeInstance {
    /**
     * Resolves only for non-redirecting targets (`_modal`); with `_self` the
     * browser navigates away before the promise settles.
     */
    checkout(options: CashfreeCheckoutOptions): Promise<CashfreeCheckoutResult>;
  }

  export function load(options: { mode: "sandbox" | "production" }): Promise<CashfreeInstance | null>;
}

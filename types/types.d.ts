type User = {
  id: string;
  emailAddresses: {
    id: string;
    emailAddress: string;
    verification: {
      status: string;
      strategy: string;
      externalVerificationRedirectURL: string | null;
      attempts: number;
      expireAt: number;
      nonce: string | null;
      message: string | null;
    };
  };
  // Add more properties if needed
};

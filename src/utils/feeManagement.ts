export const calculateFee = (amount: number, feeRate: number) => {
    return amount * feeRate;
  };
  
  export const applyFee = (amount: number, fee: number) => {
    return amount - fee;
  };
  
export const stripe = {
  // mockResolve means when we call this it will resolve {}. The reason is when we call stripe.charges({}), it returns promise
  charges: {
    create: jest.fn().mockResolvedValue({}),
  },
};

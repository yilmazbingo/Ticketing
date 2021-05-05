// export const natsWrapper = {
//   // this is the only thing TicketCreatedPublisher cares from natswrapper. it does not do anythign with client directly. Publiser class  uses it to publish the event.
//   client: {
//     publish: (subject: string, data: string, callback: () => void) => {
//       callback();
//     },
//   },
// };

export const natsWrapper = {
  // this is the only thing TicketCreatedPublisher cares from natswrapper. it does not do anythign with client directly. Publiser class  uses it to publish the event.
  client: {
    publish: jest.fn().mockImplementation(
      (subject: string, data: string, callback: () => void) => {
          callback();

    )
   
  },
};

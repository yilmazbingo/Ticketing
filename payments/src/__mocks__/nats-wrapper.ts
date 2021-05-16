export const natsWrapper = {
  // this is the only thing TicketCreatedPublisher cares from natswrapper. it does not do anythign with client directly. Publiser class  uses it to publish the event.
  // if publish() gets executed that means we published an event.
  // rather than providing fake function, we provide mock function.
  // mock is a fake function but it allows us to make expectations around it in test environment.
  client: {
    // when we call publish, mockImplmentation will be called
    publish: jest
      .fn()
      .mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
// jest.fn can be called from anything inside of application. It internally is going to keep track of whether or not it has been called, what arguments has been provided so we can make some expectations around it.
// since we pass a callback to the fake function, in jext.fn we have to make sure that callback is called. tahts i

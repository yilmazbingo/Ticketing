import "bootstrap/dist/css/bootstrap.min.css";

// next does not just take your component and show it on the screen. instead it wraps it up inside of its own custom default Component which is referred to app inside next. this is our own custom component
// {Component} is the component in the pages that we are displaying and pageProps is its own props.
// if you want to include global css in our project, we can only import into this App file.
// this file always load up when the user visits our application

const AppComponent = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

// Error: Anonymous arrow functions cause Fast Refresh to not preserve local component state.Please add a name to your function

// export default ({ Component, pageProps }) => {
//   return <Component {...pageProps} />
// };
// getInitialProps can be attached to component but not getServerSideProps
// AppComponent.getInitialProps = async (appContext) => {
//   const client = buildClient(appContext.ctx);
//   const { data } = await client.get("/api/users/currentuser");
//   console.log("data of currentUser", data);
//   // we are invoking the getInitials of the page that beign rendered
//   let pageProps = {};
//   if (appContext.Component.getinitialProps) {
//     // we are providing "client" to each getInitialProps
//     pageProps = await appContext.Component.getInitialProps(
//       appContext.ctx,
//       client,
//       data.currentUser
//     );
//   }
//   console.log(data);
//   return {
//     props: { yilmaz: "bingol", pageProps, ...data },
//   };
// };

// arguments that are provided in AppComponent.getInitialProps are different than page's getInitialProps.(context==={Component,ctx=(req,res)})

export default AppComponent;

import "bootstrap/dist/css/bootstrap.min.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

// next does not just take your component and show it on the screen. instead it wraps it up inside of its own custom default Component which is referred to app inside next. this is our own custom component
// {Component} is the component in the pages that we are displaying and pageProps is its own props.
// if you want to include global css in our project, we can only import into this App file.
// this file always load up when the user visits our application

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser}></Header>
      <Component {...pageProps} />
    </div>
  );
};

// Error: Anonymous arrow functions cause Fast Refresh to not preserve local component state.Please add a name to your function

// export default ({ Component, pageProps }) => {
//   return <Component {...pageProps} />;
// };
// getInitialProps can be attached to component but not getServerSideProps
export const getServerSideProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }
  console.log(data);
  return {
    pageProps,
    ...data,
  };
};

// arguments that are provided in AppComponent.getInitialProps are different than page's getInitialProps.(context==={Component,ctx=(req,res)})

export default AppComponent;

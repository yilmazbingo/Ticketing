import React, { useState } from "react";
import useRequest from "../../hooks/use-request";
// import {useRouter} from "next/router"
import Router from "next/router";
import BaseLayout from "../../components/BaseLayout";
import buildClient from "../../api/build-client";

// next.js does not like anonymous functions
const signUp = ({ currentUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: { email, password },
    onSuccess: () => Router.push("/"),
  });
  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
    //  i throw error inside the hook so if there is error programmatica navigations wont work
    // Router.push("/"); instead I add onSuccess callback to the useRequest hook.
  };
  return (
    <BaseLayout currentUser={currentUser && currentUser.currentUser}>
      <form onSubmit={onSubmit}>
        <h1>Signup</h1>
        <div className="form-group">
          <label>Email Adress</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
          />
        </div>
        {/* by defaults errors are null */}
        {errors}
        <button className="btn btn-primary">Sign up</button>
      </form>
    </BaseLayout>
  );
};

export default signUp;
export const getServerSideProps = async (context) => {
  const client = buildClient(context);
  let currentUser;
  try {
    const currentUserRes = await client.get("/api/users/currentuser");
    currentUser = currentUserRes.data;
  } catch (e) {
    console.log("error in sigin page", e);
  }
  if (!currentUser) {
    currentUser = null;
  }
  return { props: { currentUser } };
};

import React, { useState } from "react";
import useRequest from "../../hooks/use-request";
// import {useRouter} from "next/router"
import Router from "next/router";

// next.js does not like anonymous functions
const signUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
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
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
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
      <button className="btn btn-primary">Sign in</button>
    </form>
  );
};

export default signUp;

import React, { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };
  //blur event is triggered on an input anytime user clicks into an input and then clicks out.
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };
  return (
    <div>
      <h1>create ticke</h1>
      <form onSubmit={onSubmit} action="">
        <div className="form-group">
          <label for="">Ticket</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            type="text"
          />
        </div>
        <div class="form-group">
          <label for="">Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
            type="text"
          />
        </div>
        {errors}
        <button className="btn btn-primary"> Submit </button>
      </form>
    </div>
  );
};

export default NewTicket;

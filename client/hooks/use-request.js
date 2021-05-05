import axios from "axios";
import { useState } from "react";

// hooks are used inside react component. getInitialsProps is not a componennt. it is a plain function. since we are not allowed to fetch data during ssr, we cannot use this in componnet for making request during sssr
const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);
  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);
      console.log("response from doRequest", response.data);
      if (onSuccess) {
        onSuccess(response.data);
      }
      return response.data;
    } catch (err) {
      console.log("error in use-hooks catch", err);
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err, index) => (
              <li key={index}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
      // we dont need to throw this any more because we added onSuccess for programmatically navigation
      // throw err;
    }
  };
  // react hooks return array
  return { doRequest, errors };
};

export default useRequest;

import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./style.css";
import {
  FacebookLoginButton,
  InstagramLoginButton,
} from "react-social-login-buttons";
import baseUrl from "../components/baseUrl";

const SignInForm = () => {
  const navigate = useNavigate();
  const [getVal, setVal] = React.useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setVal({ ...getVal, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const response = await axios.post(`${baseUrl}/signin`, getVal);
    const response = await baseUrl.post("/signin", getVal).catch((err) => {
      console.log("error");
    });
    if (response) {
      alert(response.data.message);
      const jwtToken = response.data.token;
      if (jwtToken && jwtToken !== undefined && jwtToken !== null) {
        localStorage.setItem("jwtToken", jwtToken);
        navigate("*");
        window.location.reload();
      }
    }
    if (!response) {
      console.log("no response");
    }
  };

  return (
    <div className="formCenter">
      <div style={{ height: "70px" }}></div>
      <form className="formFields">
        <div className="formField">
          <label className="formFieldLabel" htmlFor="email">
            E-Mail Address
          </label>
          <input
            onChange={(e) => handleChange(e)}
            type="email"
            id="email"
            className="formFieldInput"
            placeholder="Enter your email"
            name="email"
          />
        </div>

        <div className="formField">
          <label className="formFieldLabel" htmlFor="password">
            Password
          </label>
          <input
            onChange={(e) => handleChange(e)}
            type="password"
            id="password"
            className="formFieldInput"
            placeholder="Enter your password"
            name="password"
          />
        </div>

        <div className="formField">
          <button onClick={handleSubmit} className="formFieldButton">
            Sign In
          </button>{" "}
          <Link to="/" className="formFieldLink">
            Create an account
          </Link>
        </div>
      </form>
      <div style={{ height: "100px" }}></div>
    </div>
  );
};

export default SignInForm;

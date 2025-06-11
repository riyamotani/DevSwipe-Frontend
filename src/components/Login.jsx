import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${baseUrl}/login`,
        {
          emailId: email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data))
      navigate("/feed")
    } catch (err) {
      setError(err.response.data)
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <fieldset className="fieldset bg-base-300 border-base-300 rounded-box w-xs border p-4">
        <h1 className="text-xl flex justify-center">Login</h1>

        <label className="label">Email</label>
        <input
          type="email"
          className="input input-bordered focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label">Password</label>
        <input
          type="password"
          className="input input-bordered focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-red-400 mt-2">{error}</p>

        <button className="btn bg-base-100 mt-4" onClick={handleLogin}>
          Login
        </button>
      </fieldset>
    </div>
  );
};

export default Login;

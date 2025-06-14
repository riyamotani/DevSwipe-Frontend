import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice.js";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const fetchConnections = async () => {
    try {
      const res = await axios.get(baseUrl + "/user/connections", {
        withCredentials: true,
      });
      console.log(res.data.data, "res.data")
      console.log(connections, "connections")
      dispatch(addConnections(res.data.data));
    } catch (err) {
      // Handle Error Case
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (connections && connections.length === 0) return <h1 className="flex justify-center my-10"> No Connections Found</h1>;

  return (
    connections && connections.length !== 0 &&
    <div className="text-center my-10">
      <h1 className="text-bold text-white text-3xl">Connections</h1>

      {connections.map((connection) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about, skills } =
          connection;

        return (
          <div
            key={_id}
            className="flex m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto"
          >
            <div>
              <img
                alt="photo"
                className="w-20 h-20 rounded-full object-cover"
                src={photoUrl}
              />
            </div>
            <div className="text-left mx-4 ">
              <h2 className="font-bold text-xl">
                {firstName + " " + lastName}
              </h2>
              <p>{(age ? age : "") + (gender ? ", " + gender : "")}</p>
              <p>{about ? about : ""}</p>
              {skills && skills.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Skills:</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-200 text-blue-700 px-2 py-1 rounded-lg text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default Connections;
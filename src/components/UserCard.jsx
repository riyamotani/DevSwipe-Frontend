import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } =
    user;

  const dispatch = useDispatch();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        baseUrl + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {}
  };
  return (
    <div className="card bg-base-100 w-80 shadow-sm">
      <figure>
        <img src={photoUrl} alt="photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {firstName + " " + (lastName ? lastName : "")}
        </h2>
        <h2>{(age ? age : "") + (gender ? ", " + gender : "")}</h2>
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
        <div className="card-actions justify-center mb-5">
          <button className="btn bg-cyan-600" onClick={() => handleSendRequest("ignored", _id)}>Ignore</button>
          <button className="btn btn-accent" onClick={() => handleSendRequest("interested", _id)}>Interested</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

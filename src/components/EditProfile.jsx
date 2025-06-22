import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { baseUrl } from "../utils/constants";

const EditProfile = ({ user }) => {
  const [firstName, setFirstname] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills || []);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.post(
        `${baseUrl}/profile/edit`,
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
          skills,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setError(error.response?.data || "Something went wrong.");
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center items-start gap-10 my-10 px-4">
        {/* Edit Profile Form */}
        <div className="card bg-base-300 w-full max-w-md shadow-lg p-4 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-base-200">
          <div className="card-body">
            <h2 className="card-title justify-center text-2xl mb-4">Edit Profile</h2>

            {[
              {
                label: "First Name",
                value: firstName,
                onChange: setFirstname,
                type: "text",
              },
              {
                label: "Last Name",
                value: lastName,
                onChange: setLastName,
                type: "text",
              },
              {
                label: "Age",
                value: age,
                onChange: setAge,
                type: "number",
              },
              {
                label: "Photo URL",
                value: photoUrl,
                onChange: setPhotoUrl,
                type: "text",
              },
              {
                label: "Skills (comma separated)",
                value: skills.join(","),
                onChange: (v) => setSkills(v.split(",")),
                type: "text",
              },
            ].map((field, i) => (
              <label key={i} className="form-control w-full my-2">
                <div className="label">
                  <span className="label-text">{field.label}</span>
                </div>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="input input-bordered focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 w-full"
                />
              </label>
            ))}

            {/* Gender Dropdown */}
            <label className="form-control w-full my-2">
              <div className="label">
                <span className="label-text">Gender</span>
              </div>
              <select
                className="select select-bordered focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </label>

            {/* About */}
            <label className="form-control w-full my-2">
              <div className="label">
                <span className="label-text">About</span>
              </div>
              <textarea
                className="textarea textarea-bordered h-24 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                placeholder="Tell us about yourself"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </label>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div className="card-actions justify-center mt-4">
              <button className="btn btn-primary w-full" onClick={saveProfile}>
                Save Profile
              </button>
            </div>
          </div>
        </div>

        {/* User Preview Card */}
        <div className="w-full max-w-md">
          <UserCard
            user={{ firstName, lastName, photoUrl, about, age, gender, skills }}
          />
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div className="toast toast-top toast-center z-50 pt-20">
          <div className="alert alert-success">
            <span>Profile saved successfully</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;

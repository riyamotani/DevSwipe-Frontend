import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const dispatch = useDispatch();
    const feed = useSelector((store) => store.feed)

    const getFeed = async () => {
        console.log(feed, "feed")
        if(feed) return;
        try {
            const res = await axios.get(`${baseUrl}/user/feed`,{withCredentials: true})
            dispatch(addFeed(res.data.data));
        } catch (err) {
            console.log("Error: ", err)
        }
    }

    useEffect(() => {
        getFeed();
    },[])

    if (feed && feed.length <= 0)
    return <h1 className="flex justify-center my-10">No new users found!</h1>;

    return(
        feed && <div className="flex justify-center my-10">
            <UserCard user={feed[0]}/>
        </div>
    )
}

export default Feed;
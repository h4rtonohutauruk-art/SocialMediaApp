import { getPosts } from "@/actions/post.action";
import { getDBUserId } from "@/actions/user.action";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import WhoToFollow from "@/components/WhoToFollow";
import { currentUser } from "@clerk/nextjs/server";
import NotificationsPage from "./notifications/page";
import { getCurrentLocation } from "@/lib/geolocation";
export default async function HomePage() {
  const user = await currentUser();
  const posts = await getPosts();
  const dbUserId = await getDBUserId();
  const [location, setLocation] = useState<any>(null);
  console.log("this is post", posts?.length);
  console.log("this is post", dbUserId);
  const handleLocation = async () => {
    try {
      console.log("calling handlelocation");
      const result = await getCurrentLocation();
      setLocation(result);
      console.log("this is location:", result);
    } catch (error) {
      console.log("Error for geolocation", error);
    }
  };

  return (
    // <div className=" grid grid-cols-1 lg:grid-cols-10 gap-6">
    //   <div className=" lg:col-span-6 ">
    //     {user ? <CreatePost /> : null}
    //     <div className=" space-y-6">
    //       {posts?.map((post) => (
    //         <PostCard key={post.id} post={post} dbUserId={dbUserId} />
    //       ))}
    //     </div>
    //   </div>
    //   <div className=" hidden lg:block lg:col-span-4 sticky top-20">
    //     <WhoToFollow />
    //   </div>

    //   {/* <div className=" lg:col-span-4 bg-blue-600">b</div> */}
    // </div>
    <div>
      <button onClick={() => handleLocation()}>Get Location</button>
      {location && (
        <>
          <p>Latitute : {location.latitute}</p>
          <p>Latitute : {location.longitude}</p>
        </>
      )}
      <h1>Hello Capacitor</h1>
    </div>
  );
}

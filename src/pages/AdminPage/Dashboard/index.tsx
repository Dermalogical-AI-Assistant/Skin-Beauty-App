import useAuthStore from "../../../stores/AuthStore.ts";
import useTestSetAccessToken from "../../../hooks/useTestSetAccessToken.ts";

const Dashboard: React.FC = () => {
    const { user } = useAuthStore();

    const {fetchUserInfo} = useTestSetAccessToken();

    async function fetchUserInfoData() {
      const data = await fetchUserInfo.refetch();
      if (data.isSuccess) {
        console.log("This is user data: ",data.data.data);
      }
    }

    return (
        <>
            hello from dashboard
            <button
                onClick={() => {
                  fetchUserInfoData();
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Fetch User Info
            </button>

            <div>
                <h1>{user?.username}</h1>
                <p>{user?.email}</p>
            </div>
        </>
    );
};

export default Dashboard;
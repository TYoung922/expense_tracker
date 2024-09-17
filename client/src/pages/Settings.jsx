// Styles
import styles from "../styles/settingsComponents/Settings.module.scss";

// Components
import { Title } from "../components/Titles/Titles";
import MainContainer from "../components/Containers/MainContainer";

//Utils
import { useUserUpdatePassword } from "../queries/user";
import { useState } from "react";
import { queryClient } from "../constants/config";

const Settings = () => {
  const {
    mutate: UpdatePassword,
    isError,
    error,
    isLoading,
    isSuccess,
  } = useUserUpdatePassword();

  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");

  //   let body = {
  //     oldPassword: oldPw,
  //     password: newPw,
  //   };

  //   return (
  //     <MainContainer>
  //       <Title>Settings</Title>
  //       <form action="submit" onSubmit={(e) => e.preventDefault()}>
  //         <div className={styles.container}>
  //           {/* Old PW */}
  //           <div className={styles.password}>
  //             <label htmlFor="oldPassword">Current Password:</label>
  //             <input
  //               type="password"
  //               name="oldPassword"
  //               value={oldPw}
  //               autoComplete="current-password"
  //               onChange={(e) => setOldPw(e.target.value)}
  //             />
  //           </div>
  //           <div className={styles.password}>
  //             {/* New PW  */}
  //             <label htmlFor="newPassword">New Password:</label>
  //             <input
  //               type="password"
  //               name="newPassword"
  //               autoComplete="new-password"
  //               value={newPw}
  //               onChange={(e) => setNewPw(e.target.value)}
  //             />
  //           </div>
  //           <button
  //             onClick={() =>
  //               UpdatePassword(body, {
  //                 onSuccess: () => {
  //                   queryClient.invalidateQueries("user");
  //                   queryClient.removeQueries();
  //                 },
  //               })
  //             }
  //           >
  //             {isLoading ? "Loading" : "Change Password"}
  //           </button>
  //         </div>
  //         {isError && (
  //           <div style={{ marginTop: "1rem", color: "red" }}>
  //             {error.response.data}
  //           </div>
  //         )}
  //       </form>
  //     </MainContainer>
  //   );
  // };

  const handlePasswordChange = () => {
    if (oldPw && newPw) {
      UpdatePassword(
        { oldPassword: oldPw, password: newPw },
        {
          onSuccess: () => {
            queryClient.invalidateQueries("user");
            setOldPw("");
            setNewPw("");
          },
          onError: (err) => {
            console.error(err);
          },
        }
      );
    } else {
      alert("Please fill in both fields");
    }
  };

  return (
    <MainContainer>
      <Title>Settings</Title>
      <form action="submit" onSubmit={(e) => e.preventDefault()}>
        <div className={styles.container}>
          <div className={styles.password}>
            <label htmlFor="oldPassword">Current Password:</label>
            <input
              type="password"
              name="oldPassword"
              value={oldPw}
              autoComplete="current-password"
              onChange={(e) => setOldPw(e.target.value)}
            />
          </div>
          <div className={styles.password}>
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              name="newPassword"
              autoComplete="new-password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
          </div>
          <button onClick={handlePasswordChange}>
            {isLoading ? "Loading..." : "Change Password"}
          </button>
        </div>
        {isError && (
          <div style={{ marginTop: "1rem", color: "red" }}>
            {error.message || "An error occurred"}
          </div>
        )}
        {isSuccess && (
          <div style={{ marginTop: "1rem", color: "green" }}>
            Password changed successfully!
          </div>
        )}
      </form>
    </MainContainer>
  );
};

export default Settings;

import React from "react";

function UserDashBoard() {
  const user = localStorage.getItem("user");

  return (
    <div className="mt-20 ml-40">
      <div>DashBoard</div>
    </div>
  );
}

export default UserDashBoard;

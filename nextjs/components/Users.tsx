/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { usePrivateApi } from "@/hooks/usePrivateApi";
import { User } from "@/models/user.model";
import { useEffect, useState } from "react";

const UsersList = ({ users }: { users: User[] }) => {
  return (
    <>
      <ul>
        {users.map((user) => {
          return <li key={user._id}>{user.email}</li>;
        })}
      </ul>
    </>
  );
};

export const Users = () => {
  const { privateApi } = usePrivateApi();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await privateApi.get("/users");
        setUsers(response.data);
        setIsLoading(false);
        console.log({ users });
      } catch (err) {
        console.log(err);
      }
    };
    getUsers();
  }, []);

  return (
    <main>
      {isLoading ? (
        <></>
      ) : (
        <div>
          <p className="font-bold">Users:</p>
          <UsersList users={users}></UsersList>
        </div>
      )}
    </main>
  );
};

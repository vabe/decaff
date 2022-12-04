import { useMemo } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LoadingContent from "@/components/loading-content";
import Table from "@/components/table";
import { useNotification } from "@/contexts/notification-provider";
import useAxios from "@/hooks/use-axios";
import { Listing } from "../../mocks/types";

export default function Users() {
  useSession({ required: true });
  const router = useRouter();
  const axios = useAxios();
  const queryClient = useQueryClient();
  const { showNotification, updateNotification, updateNotificationType } =
    useNotification();

  const getUsers = async (): Promise<Listing[]> => {
    return axios.get("/users").then((res) => res.data);
  };

  const getAccount = async (): Promise<any> => {
    return axios.get("/users/me").then((res) => res.data);
  };

  const deleteUser = async (userId: string) => {
    return axios.delete(`/users/${userId}`);
  };

  const { data: users, isError, isLoading } = useQuery(["users"], getUsers);
  const { data: account, isLoading: isLoadingAccount } = useQuery(
    ["users-me"],
    getAccount
  );
  const deleteUserMutation = useMutation(deleteUser, {
    onError: () => {
      updateNotificationType("error");
      updateNotification("Could not delete user");
      showNotification();
    },
    onSuccess: () => {
      updateNotificationType("success");
      updateNotification("Successfully deleted the user! 🥳");
      showNotification();
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleEditUserClick = (userId: string) => {
    router.push(`/users/${userId}`);
  };
  const handleDeleteUserClick = (userId: string) => {
    deleteUserMutation.mutate(userId);
  };

  const mappedUsers = useMemo(
    () =>
      users?.map(({ id, email, name }: any) => ({
        id,
        email,
        name,
        edit: (
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEditUserClick(id)}
          >
            Edit
          </Button>
        ),
        delete: (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteUserClick(id)}
          >
            Delete
          </Button>
        ),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users]
  );

  if (isLoading || isLoadingAccount) return <LoadingContent />;
  if (isError) return "Error fetching users. Please try again later";
  if (account.role !== "ADMIN") {
    console.log(account);
    router.back();
    return <></>;
  }

  return (
    <>
      <Typography variant="h2" sx={{ py: 3 }}>
        Available users
      </Typography>
      <Box>
        <Table data={mappedUsers} />
      </Box>
    </>
  );
}

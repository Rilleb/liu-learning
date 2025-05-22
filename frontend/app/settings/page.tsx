'use client'

import { useEffect, useState } from "react"
import { AccountInfo, FriendInviteList } from "../data_types/data_types"
import { useSession } from 'next-auth/react'
import { Button, Flex, Text, TextField } from '@radix-ui/themes'
import * as Dialog from '@radix-ui/react-dialog'
import { Dispatch } from "@reduxjs/toolkit"
import { useAppDispatch, useAppSelector } from "../store"
import { useSocket } from "@/app/components/sockets/socketContext";

type Props = {
  accountData: AccountInfo
  accessToken: String
}

const InvitesComponent = () => {
  const invites = useAppSelector((state) => state.friends.invites);
  const { socket, ready } = useSocket();

  const handleAccept = (invite: { from: number; invite_id: number }) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
      type: "accept_friend_invite",
      invite_came_from: invite.from,
      invite_id: invite.invite_id,
    }));
  };

  const handleDecline = (invite: { from: number }) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify({
      type: "decline_friend_invite",
      invite_came_from: invite.from,
    }));
  };

  if (!invites || invites.length === 0) {
    return (
      <div className="p-4 bg-[var(--color1)] border border-[var(--color3)] rounded shadow">
        <p className="text-[var(--foreground2)]">No pending invites.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[var(--color1)] border border-[var(--color3)] rounded shadow">
      <h2 className="text-xl font-semibold text-[var(--foreground2)] mb-4">Pending Friend Invites</h2>
      <ul className="space-y-3">
        {invites.map((invite, index) => (
          <li key={index} className="p-3 bg-white border border-[var(--color3)] rounded-md shadow-sm">
            <p className="text-[var(--foreground)] font-medium">
              <strong>From:</strong> {invite.from_username}
            </p>
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => handleAccept(invite)}
                className="px-4 py-1 rounded text-white bg-[var(--color_green)] hover:bg-[var(--color_green_hover)]"
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(invite)}
                className="px-4 py-1 rounded text-white bg-[var(--color_red)] hover:opacity-90"
              >
                Decline
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};


const change_password = async (
  old_password: string,
  new_password: string,
  repeat_password: string,
  accessToken: string
): Promise<{ success: boolean; message: string }> => {
  if (new_password !== repeat_password) {
    return { success: false, message: "New passwords do not match." }
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/change_password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Token ${accessToken}`,
    },
    body: JSON.stringify({ old_password, new_password }),
  })

  if (!res.ok) {
    return { success: false, message: "Failed to change password." }
  }

  return { success: true, message: "Password changed successfully." }
}

const AccountComponent = ({ accountData, accessToken }: Props) => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!accountData) return <p>...Loading</p>

  const handleSaveClick = async (accessToken: string) => {
    setIsLoading(true)
    setFeedbackMessage(null)
    const result = await change_password(oldPassword, newPassword, confirmPassword, accessToken)
    setFeedbackMessage(result.message)
    setIsLoading(false)

    if (result.success) {
      // Clear inputs on success
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Account Information</h1>
      <ul className="grid gap-2">
        <li><p>Name: {accountData.name}</p></li>
        <li><p>Email: {accountData.email}</p></li>
        <li><p>Created: {(new Date(accountData.created)).toLocaleDateString()}</p></li>
        <li><p>Course Count: {accountData.course_count}</p></li>
        <li><p>Friends Count: {accountData.friend_count}</p></li>

        <li>
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="bg-[var(--color2)] text-white px-2 py-1.5 rounded hover:bg-[var(--color3)]"
              >
                Change Password
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 !bg-black/50 z-40" />
              <Dialog.Content
                className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 !bg-[var(--background)] p-6 rounded-lg shadow-lg w-[90%] max-w-md"
              >
                <Dialog.Title className="text-lg font-semibold mb-2 !text-[var(--color2)]">Change Password</Dialog.Title>

                <Flex direction="column" gap="3">
                  <TextField.Root
                    placeholder="Old Password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.currentTarget.value)}
                    className="text-[var(--foreground2)]"
                  />
                  <TextField.Root
                    placeholder="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.currentTarget.value)}
                    className="text-[var(--foreground2)]"
                  />
                  <TextField.Root
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                    className="text-[var(--foreground2)]"
                  />
                </Flex>

                {feedbackMessage && (
                  <Text
                    color={feedbackMessage.includes("successfully") ? "green" : "red"}
                    mt="2"
                  >
                    {feedbackMessage}
                  </Text>
                )}

                <div className="flex mt-4 gap-3">
                  <Dialog.Close asChild>
                    <Button
                      variant="soft"
                      className="text-[var(--foreground)] hover:bg-[var(--color1)]"
                    >
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <div className="ml-auto">
                    <Button
                      onClick={() => handleSaveClick(accessToken)}
                      disabled={isLoading}
                      className="text-[var(--foreground)] hover:bg-[var(--color1)]"
                    >
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </li>
      </ul>
    </div>
  )
}

export default function Home() {
  const { data: session, status } = useSession()
  const [accountData, setAccountData] = useState<AccountInfo>()
  const [invites, setInvites] = useState<FriendInviteList>([])
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getData = async () => {
      if (status === "authenticated") {
        const res_account_data = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/account/data?user_id=${session?.user.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        }
        )

        if (!res_account_data.ok) {
          console.error("Error fetching account data")
          return
        }

        const account_data: AccountInfo = await res_account_data.json()
        setAccountData(account_data)
      }
    }
    getData()
  }, [status, session, dispatch])


  return (
    <div className="container h-full m-auto grid gap-4 grid-cols-4 lg:grid-cols-4 lg:grid-rows-5 overflow-auto">
      <div className="tile-marker col-span-2 row-span-2 rounded-sm border-[var(--color3)] p-4">
        <AccountComponent accountData={accountData} accessToken={session?.accessToken} />
      </div>

      <div className="tile-marker col-span-2 row-span-2 rounded-sm border-[var(--color3)] p-4 bg-[var(--background)]">
        <h2 className="text-xl font-bold mb-4 text-[var(--color2)]">Friend Invites</h2>
        <InvitesComponent />
      </div>
    </div>
  )

}

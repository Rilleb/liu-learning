"use client"
import { useEffect, useState } from "react"
import { AccountInfo } from "../data_types/data_types"
import { useSession } from 'next-auth/react'
import { Dialog, Button, Flex, Text, TextField } from '@radix-ui/themes';

type Props = {
    accountData: AccountInfo
}

const AccountComponent = ({ accountData }: Props) => {
    if (!accountData) {
        return <p>...Loading</p>
    }

    return (
        <div>
            <h1>Account Information</h1>
            <ul className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <li>
                    <p>Name: {accountData.name} </p>
                </li>
                <li>
                    <p>Email: {accountData.email} </p>
                </li>
                <li>
                    <p>Created: {accountData.created.toString()} </p>
                </li>
                <li>
                    <p>Course Count: {accountData.course_count} </p>
                </li>
                <li>
                    <p>Friends Count: {accountData.friend_count} </p>
                </li>
                <li>
                    <Dialog.Root>
                        <Dialog.Trigger>
                            <button>Change Password</button>
                        </Dialog.Trigger>

                        <Dialog.Content maxWidth="450px">
                            <Dialog.Title>Edit profile</Dialog.Title>
                            <Dialog.Description size="2" mb="4">
                                Test
                            </Dialog.Description>

                            <Flex direction="column" gap="3">
                            {/* form fields */}
                            </Flex>

                            <Flex gap="3" mt="4" justify="end">
                            <Dialog.Close>
                                <Button variant="soft" color="gray">Test1</Button>
                            </Dialog.Close>
                            <Dialog.Close>
                                <Button>Save</Button>
                            </Dialog.Close>
                            </Flex>
                        </Dialog.Content>
                    </Dialog.Root>
                </li>
            </ul>
        </div>
    )
}

export default function Home() {
    const {data: session, status} = useSession()
    const [accountData, setAccountData] = useState<AccountInfo>()


    useEffect(() => {
        console.log("Session", session)
        const getData = async () => {
            if (status == "authenticated") {
                
    
                const res_account_data = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/account/data?user_id=${session?.user.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    }
                });
            
                if (!res_account_data.ok) {
                    return (
                        <div>
                            <p>Error fetching account data</p>
                        </div>
                    )
                }
                
                const account_data: AccountInfo = await res_account_data.json()
                console.log("Data", account_data)
                setAccountData(account_data)
            }
        }
        getData()
    }, [status])




    const handleChangePassword = () => {
        console.log("Change password")
    }

    return (
        <div className="container h-full m-auto grid gap-4 grid-cols-1 lg:grid-cols-1 lg:grid-rows-5 overflow-auto">
            {/*Account Information*/}
            <div className="tile-marker col-span-2 border-2 row-span-2 rounded-sm border-[var(--color3)] p-4">
                <AccountComponent accountData={accountData} />
            </div>
        </div>
    )
}

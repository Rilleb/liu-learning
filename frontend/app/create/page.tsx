"use client";

import { useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button, Flex } from '@radix-ui/themes'
import { ChevronDownIcon } from '@radix-ui/react-icons'; 
import CreateCourseForm from '../components/forms/create_course';
import CreateQuizForm from '../components/forms/create_quiz';

export default function Page() {
    const [formType, setFormType] = useState('course');

    return (
        <div >
            <div className="ml-auto mr-[40%] w-fit">
                <Flex gap="3" className="mb-6">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                        <Button variant="soft" color="indigo" size="4" className="flex items-center gap-2">
                            Options
                            <ChevronDownIcon />
                        </Button>
                        </DropdownMenu.Trigger>
            
                        <DropdownMenu.Content
                        sideOffset={5}
                        className="bg-white/90 backdrop-blur-md shadow-md rounded-md p-2"
                        >
                        <DropdownMenu.Item
                            onSelect={() => setFormType('course')}
                            className="flex justify-between items-center px-2 py-1.5 rounded cursor-pointer hover:bg-indigo-100"
                        >
                            Course
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            onSelect={() => setFormType('quiz')}
                            className="flex justify-between items-center px-2 py-1.5 rounded cursor-pointer hover:bg-indigo-100"
                        >
                            Quiz
                        </DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </Flex>
            </div>

            <div className="overflow-auto flex flex-col items-center p-6">

        
                {/* Forms */}
                <div className="overflow-auto w-full max-w-2xl px-4">
                <h1 className="text-xl font-semibold mb-4">Create new {formType}</h1>
                {formType === 'course' ? <CreateCourseForm /> : <CreateQuizForm />}
                </div>
            </div>
        </div>
    );
}

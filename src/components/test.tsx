import React, { useState } from 'react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

type UserState = Record<string, unknown>; 

type GamePageProps = {};

const client = generateClient<Schema>();

async function addUserState(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
        const { data, errors } = await client.mutations.addUserState({
            user_stat: '123',
            current_streak: 1
        });

        if (errors) {
            console.error('Error from GraphQL mutation:', errors);
        } else {
            console.log('User state added successfully!', data);
        }
    } catch (error) {
        console.error('Error adding user state:', error);
    }
};

async function getUserState(setUserState: React.Dispatch<React.SetStateAction<UserState | null>>) {
    try {
        const { data, errors }= await client.queries.getUserState({
            user_stat: 'STATE#94f8f458-7011-70fc-7929-0f5ea032f122',
            limit: 1
        });

        if (errors) {
            console.error('Error from GraphQL mutation:', errors);
        } else {
            console.log('User query successful', data);
            setUserState(data as UserState);
        }
    } catch (error) {
        console.error('Error querying user state:', error)
    }
};

const GamePage: React.FC<GamePageProps> = () => {
//   const [userState, setUserState] = useState<Array<Schema["UserStateHx"]["type"]>>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [userState, setUserState] = useState<UserState | null>(null);

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <form onSubmit={addUserState} className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Input an array (e.g. [1,2,3])"
          className="border p-2 rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Add User State
        </button>
      </form>
      <div>
        <button onClick={() => getUserState(setUserState)}>Get Last User State</button>
      </div>
      <div>
        {userState && Object.keys(userState).length > 0 ? (
            <pre>{JSON.stringify(userState, null, 2)}</pre>
        ) : (
            <p>No user state available</p>
        )}
      </div>
    </div>
  );
};

export default GamePage;

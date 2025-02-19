import React, { useState } from 'react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

// How is everything related?
// Step 1: amplify/resource.ts: define schema customType for external ddb data model. This is used for type checking for the mutations/queries for returns(a.ref()) 
// Step 2: amplify/backend.ts: define external data model. Definition adds a data source to AppSync GraphQL API to application. AppSync > select API > Data Sources
// Step 3: amplify/resource.ts: define query and mutation functions for AppSync. 
// Step 4: amplify/data/*.js: these are the custom resolver; graphQL queries which AppSync uses to query ddb. AppSync > select API > Functions
// Step 5: currently in test.tsx: further define how we want to mutate/query using resolver via javascript functions

// NOTE: 
// The idea will be to put these functions into a separate file such as /amplify/data/query.ts 
// which you can then import into your component/page. Unsure if one .ts for all functions or one .ts for
// each data model.

// another option is to do something like const [ todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
type UserState = Record<string, unknown>; 
type GamePageProps = {};
const client = generateClient<Schema>();

async function addUserState(event: React.FormEvent<HTMLFormElement>, inputValue: string) {
    event.preventDefault();

    try {
        const { data, errors } = await client.mutations.addUserState({
            type: inputValue,
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

async function getUserState(event: React.FormEvent<HTMLFormElement>, setUserState: React.Dispatch<React.SetStateAction<UserState | null>>, queryType: string, queryLimit: string) {
    event.preventDefault();
    try {
        const { data, errors }= await client.queries.getUserState({
            type: queryType,
            limit: parseInt(queryLimit)
        });

        if (errors) {
            console.error('Error from GraphQL mutation:', errors);
        } else {
            console.log('User query successful', data);
            setUserState(data as unknown as UserState);
        }
    } catch (error) {
        console.error('Error querying user state:', error)
    }
};


// Example Test Forms
const GamePage: React.FC<GamePageProps> = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [userState, setUserState] = useState<UserState | null>(null);
  const [queryType, setQueryType] = useState<string>('');
  const [queryLimit, setQueryLimit] = useState<string>('');

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <form onSubmit={(e) => addUserState(e, inputValue)} className="flex space-x-2">
        <select
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border p-2 rounded"
        >
            <option value="" disabled>Select an option</option>
            <option value="STATE">STATE</option>
            <option value="MATH">MATH</option>
            <option value="VISUAL">VISUAL</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Add User State
        </button>
      </form>

      <div className="flex flex-col items-center p-4 space-y-4">
      <form onSubmit={(e) => getUserState(e, setUserState, queryType, queryLimit)} className="flex space-x-2">
        <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value)}
            className="border p-2 rounded"
        >
            <option value="" disabled>Select an option</option>
            <option value="STATE">STATE</option>
            <option value="MATH">MATH</option>
            <option value="VISUAL">VISUAL</option>
        </select>
        <input
            type="text"
            value={queryLimit}
            onChange={(e) => setQueryLimit(e.target.value)}
            placeholder="# records to query"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          Query User State
        </button>
      </form>
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

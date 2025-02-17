import React, { useState } from 'react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";

// type ParsedArray = (string | number | boolean | null | undefined)[];

type GamePageProps = {};

const client = generateClient<Schema>();

async function addUserState(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
        const { data, errors } = await client.mutations.addUserState({
            user_stat: 'STATE#123',
            stat: '123',
            current_streak: 1
        });
        if (errors) {
            console.error('Error from GraphQL mutation:', data, errors);
        } else {
            console.log('User state added successfully!', data);
        }
    } catch (error) {
        console.error('Error adding user state:', error);
    }
}

const GamePage: React.FC<GamePageProps> = () => {
//   const [userState, setUserState] = useState<Array<Schema["UserStateHx"]["type"]>>([]);
  const [inputValue, setInputValue] = useState<string>('');
//   const [arrayData, setArrayData] = useState<ParsedArray>([]);

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const parsed = JSON.parse(inputValue);
//       if (Array.isArray(parsed)) {
//         setArrayData(parsed);
//       } else {
//         alert('Please input a valid JSON array.');
//       }
//     } catch {
//       alert('Invalid JSON format. Example: [1,2,3]');
//     }
//   };

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
        {setInputValue.length > 0 && (
            <pre>{JSON.stringify(inputValue, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default GamePage;

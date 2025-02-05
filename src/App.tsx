import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { usePython } from 'react-py';

const client = generateClient<Schema>();

function App() {

  // TO DO ACTIONS
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user, signOut } = useAuthenticator();

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  // TO DO // CRUD
  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content word change")
     });
  };

  function updateTodo(id: string) {
    client.models.Todo.update({ id: id,
                                isDone: true
                              })
  };

  // function deleteTodo(id: string) {
  //   client.models.Todo.delete({ id })
  // }

  // MATH GAME ACTIONS
  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [beginTime, setBeginTime] = useState(0);


  function randomNumber() {
    return Math.floor(Math.random() * 10) + 1;
  };

  function add(num_one: number, num_two: number) {
    return num_one + num_two
  };

  function generateNumbers() {
    setNumber1(randomNumber());
    setNumber2(randomNumber());
    setUserAnswer('');
    setBeginTime(Date.now());
  };
  // MATH GAME // CRUD
  function createUserGameHx(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const userAnswerInt = parseInt(userAnswer, 10) || 0;
    
    client.models.TESTUserGameHx.create({
      username: user?.signInDetails?.loginId,
      number1: number1,
      number2: number2,
      correct_answer: add(number1, number2),
      user_answer: userAnswerInt,
      is_correct: add(number1, number2) === userAnswerInt,
      time_spent: beginTime ? Date.now() - beginTime : null,
    });

    generateNumbers();
  }

  // MATH GAME PYTHON

  // const { loadPyodide } = require("pyodide");
  // async function hello_python() {
  //   let pyodide = await loadPyodide({
  //     indexURL: "<pyodide artifacts folder>",
  //   });
  //   return pyodide.runPythonAsync("1+1");
  // }
  
  // hello_python().then((result) => {
  //   console.log("Python says that 1+1 =", result);
  // });

  function PythonComponent() {
    const {runPython, stdout , stderr, isLoading, isRunning } = usePython();


    const generateNumbersPython = async () => {
      if (isLoading) {
        return <div>Testing!</div>;
      }

      await runPython(`
        import random
  
        def generate_random_number():
          return 1
  
        print(generate_random_number())
        `)
    }

    return (
      <div>
        <button onClick={async () => await generateNumbersPython()}>
          Generate Numbers Python
        </button>
        <p>Here: {stdout}</p>
        {isLoading? <p>Loading...</p> : <p>Ready!</p>}
        {stderr? <p>Error...</p> : <p>Ready!</p>}
        {isRunning? <p>Loading...</p> : <p>Running!</p>}
      </div>
    );
  }


  // FRONT END
  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
        <ul>
          {todos.filter(todo => !todo.isDone)
                .map((todo) => (
                  <li
                    onClick={() => updateTodo(todo.id)}
                    key={todo.id}>{todo.content}
                  </li>
          ))}
        </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
        <button onClick={signOut}>Sign out</button>

      {/* BACKEND TESTING */}
      <div className="flex justify-center space-x-8">
        Add these numbers
        <div className="text-4xl font-bold text-blue-600">{number1}</div> + <div className="text-4xl font-bold text-blue-600">{number2}</div>
        <button onClick={generateNumbers}>Generate Numbers</button>
        <form onSubmit={createUserGameHx}>
          <input 
            type="number"
            value={userAnswer} 
            onChange={(e) => setUserAnswer(e.target.value)} 
            placeholder="?"
          />
          <button type="submit">Submit Answer</button>
        </form>
        <div className="text-4xl font-bold text-blue-600">{beginTime}</div>
      </div>

      {/* PYTHON TESTING */}
      <div>
        <PythonComponent />
      </div>

        
    </main>
  );
}

export default App;

import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "./main";

// Optimistic Updates :

// For Ex. Let's say : We have a form in the UI and so we are sending users data in the server
// So if we are POST or PUT data in the server the data need to reflect fast on the UI before it is stored in the server
// So we want to show the data to be be stored in the FrontEnd before it is actually stored in the backend
// Then means we are Optimistic about the data to be definately stored in the server

// This is called Optimistic Update

// If by any chance the data is not stored in the server or store error is sent from the server 
// we can still retry sending the data in the background or do something else
// There are possibilities of solving the problem the point is ...
// We want to be optimistic that the data would be definately stored in the server and so
// We want to display the data in the frontEnd that it is indeed stored
// By any chance it is won't get stored in the future we may remove/reverse it from the frontEnd or do something else(we'll handle it)
// But till then we want to be really really OPTIMISTIC

// Data submit hote hi hum UI ke undar dikha rahe hain ki add ho gaya

// commit message: 
// 1. Optimistic updates message
// 2. Installing json-server
// 3. Install local json-server port-3000
// 4. Understanding isPending, variables & queryClient.invalidateQueries({})

const Optimistic = () => {
  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch(
        // "http://localhost:3000/posts?_sort=id&_order=desc" // The _sort and _order parameters are not working
        "http://localhost:3000/posts"
      ).then((data) => data.json());
      return response;
    },
  });
  const { mutate, isError, isPending, variables } = useMutation({// When mutate method is called isPending becomes true
    mutationFn: (newProduct) =>
      fetch("http://localhost:3000/posts", {
        method: "POST",
        body: JSON.stringify(newProduct),
        headers: {
          "content-type": "Application/json",
        },
      }),
    onSuccess: async () => {
      // New data server pe store hote hi(onSuccess) existing query Invalid ho jaegi
      // To nayi query call ho jaegi to fresh / naya data/query call/invoke ho jaega
      return await queryClient.invalidateQueries({ queryKey: ["posts"] });//Jab data server pe mutate ho jata hain phir hum queryClient ki madat se data ko ya phir query ko invalidate kar dete hain
      // matlab posts ko re-fetch karke fresh data populate kar lete hain
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = {// variables is this post object that we are mutating
      id: Date.now(),
      title: e.target.elements.title.value,
    };
    mutate(post);
  };

  const handleRetry = (post) => {
    mutate(post);
  }

  return (
    <div className="p-4 flex gap-12">
      <div className="flex-1">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            className="border mb-4 p-2"
            type="text"
            placeholder="Title"
            name="title"
          />
          <button
            className="border mb-4 p-2 bg-purple-500 text-white"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-bold mb-4">Posts:</h2>
        <ul>
          {isPending && (
            <li className="border p-2 mb-4 opacity-40" key={variables.id}>
              {variables.title}
            </li>
          )}
          {isError && (
            <li className="border p-2 mb-4 flex justify-between" key={variables.id}>
              <span className="text-red-500">{variables.title}</span>
              <button className="text-blue-500" onClick={() => handleRetry(variables)}>Retry</button>{/*Not using function callback inside onClick when handleRetry was passed an arguments breaks the entire flow of code . That was a big mistake . ### Be careful in the future */}
            </li>
          )}

          {posts?.map((post) => {
            return (
              <li className="border p-2 mb-4" key={post.id}>
                {post.title}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Optimistic;

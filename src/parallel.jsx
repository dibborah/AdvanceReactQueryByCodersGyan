import React from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';

const Parallel = () => {
    const [userIds, setUserIds] = React.useState([1, 2]);

    // userIds.forEach((id)=>{
    //     const userQuery = useQuery({
    //         queryKey:['user', id],// unique key representing the query and parameter passed in the query need to be there in queryKey as values
    //         queryFn: async () => {
    //             const data = await fetch(`https://dummyjson.com/users/${id}`)
    //             .then(res=> res.json());
    //             return data;            
    //         }
    //     });
    // })

    const userQueries = useQueries({
        queries: userIds.map((id)=>{
            return {
                queryKey: ["user", id],
                queryFn: async () => {
                    const data = await fetch(`https://dummyjson.com/users/${id}`)
                    .then(res => res.json());
                    return data;
                }
            }
        })
    })

    return (
        <div style={{textAlign:"center"}}>
            <button
                onClick={() =>
                    setUserIds((prev) => {
                        return [...prev, Date.now()];
                        // return [...prev, Math.round((Math.random() * 10))];
                    })
                }>
                Load more
            </button>

            {userIds.map((id) => (
                <h1 key={id}>{id}</h1>
            ))}
        </div>
    );
};

export default Parallel;

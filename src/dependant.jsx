import { useQuery } from '@tanstack/react-query';

const fetchPostById = async (postId) => {
    const data = await fetch(`https://dummyjson.com/posts/${postId}`).then((res) => res.json());
    return data;
};

const fetchCommentsByPostId = async (postId) => {
    const data = await fetch(`https://dummyjson.com/comments/post/${postId}`).then((res) =>
        res.json()
    );
    return data.comments;
};

const Dependant = () => {
    // Dependent query
    const { data: post, isLoading } = useQuery({
        queryKey: ['post'],
        queryFn: () => fetchPostById(2),
    });

    const postId = post?.id;

    // React query main useQuery usually parallel main data fetch karti hain// Par dependent query main dependent query ko rokh deti hain("pending" state kar deti hain)
    // React query is smart . Jab tak post.id undefined hoti hain react query fetchCommentsByPostId query ko pending state main dal deti hain aur data fetch nhi karti
    // Aur jab is Query ko post.id mil jaegi query call karne ke liye wo is Query ko call kar degi. Aur data v fetch ho jaega

    const { data: comments , status } = useQuery({
        queryKey: ['comments', post?.id],
        queryFn: () => fetchCommentsByPostId(post.id),
        enabled: !!postId,// The double negation(!!)converts a falsy value(undefined, null etc.) to be false
        // ... converts truthy values (like numbers and string) to be true. It basically converts any value to a PURE BOOLEAN value not just an equivalent one
    });

    return (
        <div className="p-12">
            <h1 className="text-lg font-bold">Post:</h1>
            {isLoading ? <p>Loading the post</p> : <h2>{post?.title}</h2>}
            <br />
            <h1 className="text-lg font-bold">Comments: {status === 'pending' && "Pending"}</h1>
            <ul>
                {comments?.map((comment) => (
                    <p key={comment.id}>{comment.body}</p>
                ))}
            </ul>
        </div>
    );
};

export default Dependant;

import { Link } from "react-router-dom"
import { BlogView } from "../components/blogSection/blogView"
import blogList from "../utils/allBlogs"
import { Helmet } from "react-helmet";
export default function Blogs() {
    return (
        <>
            <Helmet>
                <link rel="canonical" href="http://claimsolution.in/blogs" />
            </Helmet>
            {/* Our blogs */}
            <div className="container-fluid bg-color-1 color-2 pt-3 pb-5">
                <div className="container-px-5 mt-5 mb-3">
                    {blogList.map(blog => <BlogView
                        img={blog.img}
                        heading={blog?.heading}
                        content={blog?.content}
                        post={blog?.post}
                        link={blog?.link}
                    />
                    )}
                </div>
            </div>
        </>
    )
}
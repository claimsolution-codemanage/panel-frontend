import React from 'react'
import { Link } from 'react-router-dom'
import recentBlogs from '../../utils/allBlogs/recentPosts'

export const BlogRight = () => {
  return (
    <div>
      {/* <div class="form-group">
        <input type="text" class="form-control" id="search" placeholder='search...' />
        <button type="button" class="btn btn-dark mt-2">Search</button>
      </div> */}
      <div>
        <div className='mt-5'>
          <p className='m-0 p-0 fw-bold fs-3'>Recent Posts</p>
          <div className='border-3 border-bottom border-danger w-50'></div>
          <div className='border-1 border-bottom border-gray'></div>
          {recentBlogs.map(blog=> <div key={blog.link} className='mt-2'>
          <Link to={blog.link} className='m-0 p-0 recent-post'>{blog.heading}</Link>
          <div className='border-1 border-bottom border-gray pt-2'></div>
        </div>)}
        </div>
      </div>
    </div>
  )
}

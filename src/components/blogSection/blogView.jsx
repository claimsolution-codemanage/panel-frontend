import React from 'react'
import { Link } from 'react-router-dom'

export const BlogView = ({post, img,heading,content,link}) => {
  return (
    <div>
        <Link to={link} className='fs-2 fw-bold recent-post'>{heading}</Link>
        <p>{post}</p>
        <div className="row align-items-center">
            <div className="col-md-4">
                <img src={img} alt="" srcset=""  className='img-fluid card-shadow'/></div>
            <div className="col-md-8">{content} ...</div>
        </div>
        <div className='float-end my-2'>
            <Link to={link} className='color-5 recent-post'>Continue Reading...</Link>
        </div>
        <br /><br />
        <hr className=''/>
    </div>
  )
}

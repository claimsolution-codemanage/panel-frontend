import React from 'react'
import { useParams } from 'react-router-dom'

import NavigationGuides from '../../components/blogSection/blogs/Feb-24/Navigation-Guides'
import MysteryClaim from '../../components/blogSection/blogs/Feb-24/MysteryClaim'
import RejectClaim from '../../components/blogSection/blogs/Feb-24/RejectClaim'
import UnveilingClaim from '../../components/blogSection/blogs/Feb-24/UnveilingClaim'

export default function ViewBlogs() {
    const param = useParams()
    const topic = param?.topic

 if(topic=="How to Recover from a Rejected Insurance Claim"){
    return <RejectClaim/>
 }

 if(topic=="Solving the Mystery Why Car Insurance Claims Get Rejected"){
    return <MysteryClaim/>
 }

 if(topic=="Navigating Rejected Insurance Claims A Comprehensive Guide"){
    return <NavigationGuides/>
 }

 if(topic=="Unveiling the Mystery Behind Rejected Health Insurance Claims: Discover Solutions at ClaimSolution.in"){
    return <UnveilingClaim/>
 }



  return (
    <div className='text-primary fs-4'>No Blog Found!</div>
  )
}

import { MotionAnimate } from 'react-motion-animate'

export default function ScrollMotion({ children }) {
  return (<>
      <div className=''>
        <MotionAnimate
          animation='fadeInUp'
          reset={true}
          distance={20}
          delay={0.5}
          speed={1}>
          <> {children}</>
        </MotionAnimate>
    </div>
  </>)
}
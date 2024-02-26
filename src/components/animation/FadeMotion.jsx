import { MotionAnimate } from 'react-motion-animate'

export default function FadeMotion({ children }) {
  return (<>
      <div className=''>
        <MotionAnimate
        animation='scrollFadeIn' scrollPositions={[0.1, 0.9]}
          >
          <> {children}</>
        </MotionAnimate>
    </div>
  </>)
}
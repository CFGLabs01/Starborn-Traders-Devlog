import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function ShowcaseRig({ children, speed = 0.3 }) {
  const group = useRef();
  useFrame((_, delta) => {
    group.current.rotation.y += speed * delta;
    group.current.position.y = Math.sin(performance.now() * 0.001) * 0.05;
  });
  return <group ref={group}>{children}</group>;
} 
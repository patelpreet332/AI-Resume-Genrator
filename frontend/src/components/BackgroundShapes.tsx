import React, { useMemo } from 'react';
import './BackgroundShapes.css';

interface ShapeProps {
  type: 'circle' | 'square' | 'triangle' | 'balloon';
  size: number;
  top: string;
  left: string;
  animClass: string;
  delay: string;
  color: string;
}

const Shape: React.FC<ShapeProps> = ({ type, size, top, left, animClass, delay, color }) => {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    top,
    left,
    animationDelay: delay,
    '--shape-color': color,
  } as React.CSSProperties;



  return <div className={`shape ${type} ${animClass}`} style={style} />;
};


const BackgroundShapes: React.FC = () => {
  const shapes = useMemo(() => {
    const types: ('circle' | 'square' | 'triangle' | 'balloon')[] = ['circle', 'square', 'triangle', 'balloon'];
    const animClasses = ['anim-1', 'anim-2', 'anim-3', 'anim-4', 'anim-5'];
    const colors = ['var(--primary)', 'var(--secondary)', '#8b5cf6', '#3b82f6', '#ec4899'];
    
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      type: types[i % types.length],
      size: Math.random() * 40 + 20,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animClass: animClasses[i % animClasses.length],
      delay: `${-(Math.random() * 40)}s`,
      color: colors[i % colors.length],
    }));

  }, []);

  return (
    <div className="background-container">
      {shapes.map((shape) => (
        <Shape key={shape.id} {...shape} />
      ))}
    </div>
  );
};

export default BackgroundShapes;

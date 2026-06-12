import '../styles/skeleton.css';

const Skeleton = ({ width, height, borderRadius, style, className = '' }) => {
  return (
    <div
      className={`skeleton-base ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius: borderRadius || '4px',
        ...style
      }}
    ></div>
  );
};

export default Skeleton;

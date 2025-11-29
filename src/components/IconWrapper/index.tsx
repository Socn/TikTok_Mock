export default function IconWrapper({
  size,
  className,
  icon,
  style,
}: {
  size?: string;
  className?: string;
  icon: React.ReactElement;
  style?: React.CSSProperties;
}) {
  const styleSize = {
    small: '16px',
    medium: '24px',
    large: '32px',
    inherit: 'inherit',
  }[size ?? 'medium'];
  return (
    <div className={className} style={style}>
      {icon}
    </div>
  );
}

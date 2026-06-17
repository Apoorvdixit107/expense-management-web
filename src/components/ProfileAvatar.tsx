type ProfileAvatarProps = {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: "h-10 w-10 text-sm",
  md: "h-20 w-20 text-2xl",
  lg: "h-28 w-28 text-3xl",
};

export function ProfileAvatar({ name, imageUrl, size = "md", className = "" }: ProfileAvatarProps) {
  const sizeClass = SIZES[size];
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        referrerPolicy="no-referrer"
        className={`rounded-full object-cover ${sizeClass} ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-brand-light font-bold text-brand ${sizeClass} ${className}`}
    >
      {initial}
    </div>
  );
}

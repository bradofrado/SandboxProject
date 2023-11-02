import { UserCircleIcon } from "../../core/icons";

export interface ProfileImageProps {
  image: string | undefined;
  className?: string;
}
export const ProfileImage: React.FunctionComponent<ProfileImageProps> = ({ image, className }) => {
  return (
    <div className={className}>
      {image ? (
        <img
          alt="profile"
          className="rounded-full w-full h-full object-cover object-center"
          src={image}
        />
      ) : (
        <UserCircleIcon className="w-full h-full" />
      )}
    </div>
  );
};

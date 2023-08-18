import { UserCircleIcon } from "../icons.tsx/icons"

export type ProfileImageProps = {
    image: string | undefined,
    className?: string,
}
export const ProfileImage = ({image, className}: ProfileImageProps) => {
    return <>
        <div className={className}>
            {image ? <img src={image}/> : <UserCircleIcon className="w-full h-full"/>}
        </div>
    </>
}
import styled from "styled-components"
import noPic from "../assets/no-profile-picture-icon.svg"
export function ProfileImage({ userProfileImage = noPic, width='50px', height='50px', onClick }) {
    return <Image onClick={onClick} src={userProfileImage} alt="profile-picture" width={width} height={height} />
}
const Image = styled.img`
border-radius:50%;
object-fit: cover;
`
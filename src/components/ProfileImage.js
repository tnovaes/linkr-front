import styled from "styled-components"
import noPic from "../assets/no-profile-picture-icon.svg"
export function ProfileImage({ profileImgUrl = noPic, width='50px', height='50px', onClick }) {
    return <Image onClick={onClick} src={profileImgUrl} alt="profile-picture" width={width} height={height} />
}
const Image = styled.img`
border-radius:50%;
`
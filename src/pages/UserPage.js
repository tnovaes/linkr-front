import styled from "styled-components";
import { ProfileImage } from "../components/ProfileImage.js";
import { useEffect, useState } from "react";
import apiPosts from "../services/apiPosts.js";
import { useNavigate, useParams } from "react-router";

export default function UserPage() {
    const [userInfo, setUserInfo] = useState({})
    const navigate = useNavigate()
    const params = useParams()
    console.log(params)
    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) return navigate("/")
                if (!Number.isInteger(Number(params.id))) return navigate("/timeline")
                const userInfo = await apiPosts.getPostsByUserID(token, params.id)
                if (!(userInfo?.data?.name.length > 0)) return navigate("/timeline")
                setUserInfo(prev => userInfo.data)
            } catch (e) {
                navigate("/timeline")
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <TimelinePageContainer>
            <FeedContainer>
                <Title><span>{userInfo.name}</span>'s posts</Title>
                {userInfo?.posts?.map(item =>
                    <PostContainer>
                        <ProfileImage profileImgUrl={userInfo.avatar} width="50px" height="50px" />
                        <PostInfo>
                            <Username>{userInfo.name}</Username>
                            <PostDescription>{item.description}</PostDescription>
                            <Metadados>{item.shared_link}</Metadados>
                        </PostInfo>
                    </PostContainer>
                )}
            </FeedContainer>
        </TimelinePageContainer>
    )
}

const TimelinePageContainer = styled.div`
    display:flex;
    justify-content:center;
    width: 100%;
    background-color: #333333;
    min-height:100%;
`

const FeedContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 611px;
    margin-top: 72px;
`

const Title = styled.div`
    margin-top: 78px;
    font-family: 'Oswald';
    font-style: normal;
    font-weight: 700;
    font-size: 43px;
    line-height: 64px;
    color: #FFFFFF;
    align-self: flex-start;
    span{
        text-transform:capitalize;
    }
`

const SharePostContainer = styled.div`
    display:flex;
    justify-content: space-between;
    width:100%;
    height: 209px;
    background: #FFFFFF;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    border-radius: 16px;
    margin-top: 43px;
    padding: 16px;
    gap: 18px;
`

const PostInfo = styled.div`
    display:flex;
    flex-direction: column;
    max-width: 502px;
    gap:7px;
`

const CTA = styled.h1`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 24px;
    color: #707070;
    align-self: flex-start;
`

const LinkInput = styled.input`
    width: 502px;
    height: 30px;
    background: #EFEFEF;
    border-radius: 5px;
    align-self: flex-start;
    padding-left: 10px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    line-height: 18px;
    margin-top:10px;
`

const DescriptionInput = styled.input`
    width: 502px;
    height: 66px;
    background: #EFEFEF;
    border-radius: 5px;
    align-self: flex-start;
    padding-left: 10px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 300;
    font-size: 15px;
    line-height: 18px;
    word-wrap: break-word;
`

const Button = styled.button`
    width: 112px;
    height: 31px;
    background: #1877F2;
    border-radius: 5px;
    align-self: flex-end;
`

const PostContainer = styled.div`
    display:flex;
    justify-content: space-between;
    width:100%;
    background: #171717;
    border-radius: 16px;
    margin-top: 43px;
    padding-left: 18px;
    padding: 19px;
    margin-bottom: 16px;
    gap: 5px;
    box-sizing: border-box;
`

const Username = styled.h1`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 19px;
    line-height: 23px;
    color: #FFFFFF;
    align-self: flex-start;
`

const PostDescription = styled.p`
    max-width:100%;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    line-height: 20px;
    color: #B7B7B7;
    align-self: flex-start;
    word-wrap: break-word;
    text-align: left;
`

const Metadados = styled.div`
    width: 100%;
    height: 155px;
    border: 1px solid #4D4D4D;
    border-radius: 11px;
`








import styled from "styled-components";
import { ProfileImage } from "../components/ProfileImage.js";
import { Link, useNavigate } from "react-router-dom";
import apiPosts from "../services/apiPosts.js";
import { useEffect, useState } from "react";

export default function TimelinePage() {
    const [feed, setFeed] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token")
                console.log(token);
                if (!token) return navigate("/")
                const timeline = await apiPosts.getTimeline(token);
                if (timeline.status === 204) {
                    setFeed([]);
                } else {
                    setFeed(timeline.data);
                }

            } catch (err) {
                console.log(err.response)
                alert("An error occured while trying to fetch the posts, please refresh the page");
            }
        })()
    }, [])

    return (
        <TimelinePageContainer>
            <FeedContainer>
                <Title>timeline</Title>
                <SharePostContainer>
                    <ProfileImage width="50px" height="50px" />
                    <PostInfo>
                        <CTA>What are you going to share today?</CTA>
                        <LinkInput placeholder="http://..."></LinkInput>
                        <DescriptionInput placeholder="Awesome link about your #passion"></DescriptionInput>
                        <Button>Publish</Button>
                    </PostInfo>
                </SharePostContainer>
                {feed.length === 0 ? <NoFeed>There are no posts yet</NoFeed> :
                    feed.map((f) =>
                        <PostContainer>
                            <ProfileImage profileImgUrl={f.avatar} width="50px" height="50px" />
                            <PostInfo>
                                <Username>{f.name}</Username>
                                <PostDescription>{f.description}</PostDescription>
                                <Link to={f.shared_link}>
                                    <Metadata>
                                        <LinkInfo>
                                            <LinkTitle>{f.link_title}</LinkTitle>
                                            <LinkDescription>{f.link_description}</LinkDescription>
                                            <LinkURL>{f.shared_link}</LinkURL>
                                        </LinkInfo>
                                        <LinkImage src={f.link_image}></LinkImage>
                                    </Metadata>
                                </Link>
                            </PostInfo>
                        </PostContainer>
                    )
                }
            </FeedContainer>
        </TimelinePageContainer>
    )
}

const TimelinePageContainer = styled.div`
    display:flex;
    justify-content:center;
    width: 100%;
    min-height: 100%;
    background-color: #333333;
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
    margin-bottom: 29px;
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

const Metadata = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 155px;
    border: 1px solid #4D4D4D;
    border-radius: 11px;
`

const LinkInfo = styled.div`
    max-width:302px;
    padding: 23px 20px;
    display:flex;
    flex-direction: column;
    word-wrap: break-word;
`

const LinkTitle = styled.h1`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #CECECE;
    margin-bottom:5px;
`

const LinkDescription = styled.p`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    color: #9B9595;
    margin-bottom: 13px;
`

const LinkURL = styled.p`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    color: #CECECE;
`

const LinkImage = styled.img`
    max-width: 153px;
    max-height: 155px;
`

const NoFeed = styled.div`
    margin-top: 50px;
    font-family: 'Oswald';
    font-style: normal;
    font-weight: 700;
    font-size: 43px;
    line-height: 64px;
    color: #FFFFFF;
    display: flex;
    justify-content:center;
`







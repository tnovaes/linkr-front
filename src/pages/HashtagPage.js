import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import apiPosts from "../services/apiPosts.js";
import { useNavigate, Link } from "react-router-dom";
import { ProfileImage } from "../components/ProfileImage.js";
import reactStringReplace from 'react-string-replace';

export default function HashtagPage() {
    const { hashtag } = useParams();
    const [feed, setFeed] = useState([]);
    const [trending, setTrending] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        setCarregando(true);
        const token = localStorage.getItem("token");
        if (!token) return navigate("/");
        const promise = apiPosts.getPostsByHashtag(token, hashtag);
        promise.then(resposta => {
            setFeed(resposta.data[0]);
            setTrending(resposta.data[1]);
            setCarregando(false);
        })
        promise.catch(erro => {
            alert(erro.response.data);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hashtag])

    return (
        <HashtagPageContainer>
            <FeedContainer>
                <Title data-test="hashtag-title" ># {hashtag}</Title>
                {carregando === true ? <NoFeed>Loading...</NoFeed> :
                    feed.map((f) =>
                        <PostContainer key={f.id} data-test="post" >
                            <ProfileImage userProfileImage={f.avatar} width="50px" height="50px" />
                            <PostInfo>
                                <TopLine>
                                    <Link to={`/user/${f.post_owner}`}>
                                        <Username data-test="username" >{f.name}</Username>
                                    </Link>
                                </TopLine>
                                <PostDescription data-test="description" >
                                    {reactStringReplace(f.description, /#(\w+)/g, (match, i) => (
                                        <Link to={`/hashtag/${match}`} key={match + i} >#{match}</Link>
                                    ))}
                                </PostDescription>
                                <Metadata href={f.shared_link} target="_blank" data-test="link" >
                                    <LinkInfo>
                                        <LinkTitle>{f.link_title}</LinkTitle>
                                        <LinkDescription>{f.link_description}</LinkDescription>
                                        <LinkURL>{f.shared_link}</LinkURL>
                                    </LinkInfo>
                                    <LinkImage src={f.link_image}></LinkImage>
                                </Metadata>
                            </PostInfo>
                        </PostContainer>
                    )}
            </FeedContainer>
            <TrendingsContainer data-test="trending">
                <TrendTitle>
                    trending
                </TrendTitle>
                {carregando === true ? <NoFeed>Loading...</NoFeed> :
                    trending.map((h) =>
                        <TrendHashtags key={h.name} onClick={() => navigate(`/hashtag/${h.name.substring(1)}`)} data-test="hashtag" >
                            {h.name}
                        </TrendHashtags>
                    )}
            </TrendingsContainer>
        </HashtagPageContainer>
    )
}

const HashtagPageContainer = styled.div`
    display:flex;
    justify-content: center;
    width: 100%;
    min-height: 100%;
    background-color: #333333;
    gap: 25px;
    @media (max-width: 936px) {
        min-width: 100%;
    }
`

const FeedContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 611px;
    margin-top: 72px;
    @media (max-width: 611px) {
        min-width: 100%;
        gap: 25px;
        margin-bottom: 25px;
    }
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
    margin-bottom: 44px;
    @media (max-width: 611px) {
        margin-left: 15px;
        margin-top: 80px;
        margin-bottom: 8px;
    }
`

const PostInfo = styled.div`
    display:flex;
    flex-direction: column;
    max-width: 502px;
    gap:7px;
    @media (max-width: 611px) {
    border-radius: 0px;
    margin: 0 7px;
    max-width: 100%;
    }
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
    button{
        visibility: hidden;
    }

    :hover{
        button{
            visibility:visible;
        }
    }
    @media (max-width: 611px) {
    border-radius: 0px;
    max-width: 100vw;
    justify-content: center;
    margin-bottom: 0;
    }
`

const TopLine = styled.div`
    display: flex;
    justify-content: space-between;
    a {
        text-decoration: none;
    }
`

const Username = styled.h1`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 19px;
    line-height: 23px;
    color: #FFFFFF;
    align-self: flex-start;
    a {
        text-decoration: none;
    }
    a:visited {
    color: #FFFFFF;
    }
`

const PostDescription = styled.p`
    max-width: 100%;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    line-height: 24px;
    color: #B7B7B7;
    align-self: flex-start;
    word-wrap: break-word;
    text-align: left;
    a {
        font-weight: 700; 
        text-decoration: none;
        color: #FFFFFF;
    }
    a:hover{
        cursor: pointer;
    }
`

const Metadata = styled.a`
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 155px;
    border: 1px solid #4D4D4D;
    border-radius: 11px;
    text-decoration: none;
    overflow: hidden;
    @media (max-width: 611px) {
        height: 115px;
        padding: 2px;
    }
    @media (max-width: 375px) {
        max-width: 278px;
        height: 115px;
        padding: 2px;
    }
`

const LinkInfo = styled.div`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    max-width: 302px;
    padding: 20px 20px;
    display: flex;
    flex-direction: column;
    word-wrap: break-word;
    gap: 4px;
    @media (max-width: 611px) {
        padding: 2px;
        overflow: hidden;
    }
    @media (max-width: 375px) {
        max-width: 175px;
        padding: 2px;
        overflow: hidden;
    }
`

const LinkTitle = styled.h1`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 18px;
    height: 36px;
    color: #CECECE;
    word-wrap: break-word;
    overflow: hidden;
    @media (max-width: 611px) {
        padding: 2px;
    }
    @media (max-width: 375px) {
        max-width: 175px;
        padding: 2px;
    }
`

const LinkDescription = styled.p`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 12.5px;
    height: 38px;
    color: #9B9595;
    word-wrap: break-word;
    overflow: hidden;
    @media (max-width: 611px) {
        padding: 2px;
        height: 26px;
    }
    @media (max-width: 375px) {
        max-width: 175px;
        padding: 2px;
        height: 26px;
    }
`

const LinkURL = styled.p`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 14px;
    height: 28px;
    color: #CECECE;
    word-wrap: break-word;
    overflow: hidden;
    @media (max-width: 611px) {
        padding: 2px;
    }
    @media (max-width: 375px) {
        max-width: 175px;
        padding: 2px;
    }
`

const LinkImage = styled.img`
    max-width: 153px;
    max-height: 155px;
    object-fit: cover;
    @media (max-width: 611px) {
        max-height: 115px;
    }
    @media (max-width: 375px) {
        max-width: 95px;
        max-height: 115px;
    }
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


const TrendingsContainer = styled.div`
    max-width: 300px;
    height: 405px;
    background-color: #171717;
    margin-top: 257px;
    border-radius: 16px;   
    @media (max-width: 936px) {
    display: none;
    } 
`

const TrendTitle = styled.div`
    font-family: 'Oswald';
    font-style: normal;
    font-weight: 700;
    font-size: 27px;
    line-height: 60px;
    color: #FFFFFF;
    padding-left: 15px;
    border-bottom: 1px solid #484848;
    margin-bottom: 22px;
`

const TrendHashtags = styled.div`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    font-size: 19px;
    line-height: 24px;
    color: #FFFFFF;
    padding-left: 15px;
    margin: 5px 0 ;
    :hover {
        cursor:pointer;
    }
`

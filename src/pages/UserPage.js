import styled from "styled-components";
import { ProfileImage } from "../components/ProfileImage.js";
import { useEffect, useState } from "react";
import apiPosts from "../services/apiPosts.js";
import { useNavigate, useParams, Link } from "react-router-dom";
import reactStringReplace from 'react-string-replace';
import heart from "../assets/heart.png";
import filledHeart from "../assets/filled-heart.png";
import fallbackPhoto from '../assets/no-profile-picture-icon.svg'
import apiAuth from "../services/apiAuth.js";

export default function UserPage() {
    const { id } = useParams();
    const [feed, setFeed] = useState([]);
    const [trending, setTrending] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [name, setName] = useState([]);
    const [likesInfo, setLikesInfo] = useState(false)
    const [oldFeed, setOldFeed] = useState([])
    const [userPagePhoto, setUserPagePhoto] = useState(fallbackPhoto)
    const navigate = useNavigate();

    useEffect(() => {
        setCarregando(true);
        (async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) return navigate("/")
                if (!Number.isInteger(Number(id))) return navigate("/timeline")
                // const userInfo = await apiPosts.getPostsByUserID(token, id)
                const [userInfo, likedPosts, IsFollowing] = await Promise.all([apiPosts.getPostsByUserID(token, id), apiPosts.getLikes(token), apiAuth.getIsFollowing(token, id)])
                const timelineInfo = userInfo.data[0].map(post => ({ ...post, isLiked: likedPosts.data.some(like => Number(like.post_id) === Number(post.post_id)) }))
                const arrayName = userInfo.data[2];
                if (timelineInfo.length > 0) {
                    setUserPagePhoto(timelineInfo[0].avatar)
                } else {
                    const photoUrl = await apiAuth.getUserPhoto(token, id)
                    console.log(photoUrl[0].avatar)
                    setUserPagePhoto(photoUrl[0].avatar)
                }
                setIsFollowed(IsFollowing.data)
                setFeed(timelineInfo);
                setTrending(userInfo.data[1]);
                setName(arrayName[0]);
                setCarregando(false);
            } catch (err) {
                alert("An error occurred while trying to fetch the posts, please refresh the page");
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    async function handleLikeHover(post_id) {
        const token = localStorage.getItem("token")
        let newFeed = [...feed]
        let newLikesInfo = [];
        if (likesInfo === false) {
            if (oldFeed.length === 0) {
                setOldFeed(newFeed)
            }
            setLikesInfo(true)
            newLikesInfo = await apiPosts.getPostsLikesInfo(token, post_id)
            let names = []
            if (newLikesInfo.data.length === 0) {
                return;
            } else if (newLikesInfo.data.length > 1) {
                for (let i = 0; i < newLikesInfo.data.length; i++) {
                    if (newLikesInfo.data[i].post_id !== post_id) {
                        names.push(newLikesInfo.data[i])
                    }
                    if (names.length > 2) {
                        break;
                    }
                }
            } else if (newLikesInfo.data.length === 1 && newLikesInfo.data[0].post_id !== post_id) {
                names.push(newLikesInfo.data[0])
            }
            newFeed = newFeed.map(post => {
                const isPostTheHovered = post.post_id === post_id
                const isLikedByUser = post.isLiked === true
                if (isPostTheHovered) {
                    if (isLikedByUser) {
                        const likesQuantity = newLikesInfo.data.length
                        if (likesQuantity > 2) {
                            return { ...post, likesInfo: `Você, ${names[0]} e outras ${newLikesInfo.length - 2} pessoas` }
                        } else if (likesQuantity === 2) {
                            return { ...post, likesInfo: `Você e ${names[0]} curtiram..` }
                        } else if (likesQuantity === 1) {
                            return { ...post, likesInfo: `Você curtiu..` }
                        } else if (likesQuantity === 1) {
                            return { ...post, likesInfo: `${names[0]} curtiu..` }
                        } else if (likesQuantity === 2) {
                            return { ...post, likesInfo: `${names[0]} e ${names[1]} curtiram...` }
                        } else if (likesQuantity > 2) {
                            return { ...post, likesInfo: `${names[0]}, ${names[1]} e outras ${newLikesInfo.length - 2} pessoas` }
                        }
                    }
                }
                return post
            })
            setFeed(newFeed)
        }

    }
    async function handleLikeHoverLeaving() {
        setFeed(prev => [...oldFeed])
        setLikesInfo(false)
    }
    async function handleLike(post_id) {
        try {
            const token = localStorage.getItem('token')
            apiPosts.toggleLike(token, post_id)
            const newFeed = feed.map(item => {
                if (post_id === item.post_id) {
                    item.isLiked ? --item.likes : ++item.likes
                    item.isLiked = !item.isLiked
                }
                return item
            })

            setFeed(prev => newFeed)
        } catch (e) {
        }
    }
    async function handleFollow() {
        setFollowLoading(true)
        try {
            const token = localStorage.getItem('token')
            const response = await apiAuth.setFollower(token, id, isFollowed)
            console.log(response)
            if (response.status === 200) {
                console.log(isFollowed)
                setIsFollowed(prev => !prev)
            }
        } catch (e) {
            alert("Não foi possível executar essa operação")
        }
        setFollowLoading(false)
    }
    return (
        <TimelinePageContainer>
            <FeedContainer>
                {carregando === true ? <NoFeed>Loading...</NoFeed> :
                    <TitleContainer>
                        <ImageTitleContainer>
                            <ProfileImage userProfileImage={userPagePhoto} width="50px" height="50px" />
                            <Title>{name.name}'s posts</Title>
                        </ImageTitleContainer>
                        <TitleButton disabled={followLoading} isFollowed={isFollowed} onClick={handleFollow}>{isFollowed ? "Unfollow" : "Follow"} </TitleButton>
                    </TitleContainer>
                }
                {(carregando === false && !feed) ? <NoFeed> Sem posts </NoFeed> :
                    (carregando === false && feed) &&
                    feed?.map((f, index) =>
                        <PostContainer key={index} data-test="post" >
                            <ImageLikeContainer>
                                <ProfileImage userProfileImage={f.avatar} width="50px" height="50px" />
                                <img onClick={() => handleLike(f.post_id)} src={f.isLiked ? filledHeart : heart} alt="heart" />
                                <p onMouseEnter={() => handleLikeHover(f.post_id)} onMouseOut={() => handleLikeHoverLeaving(f.post_id)}>{f.likes} Likes</p>
                                {likesInfo && f.likesInfo?.length > 0 && (<div>
                                    <div></div>
                                    <p>{f.likesInfo}</p>
                                </div>)}
                            </ImageLikeContainer>
                            <PostInfo>
                                <TopLine>
                                    <Username data-test="username" >{f.name}</Username>
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
            <TrendingsContainer>
                <TrendTitle>
                    trending
                </TrendTitle>
                {carregando === true ? <NoFeed>Loading...</NoFeed> :
                    trending.map((h) =>
                        <TrendHashtags key={h.name} onClick={() => navigate(`/hashtag/${h.name.substring(1)}`)}>
                            {h.name}
                        </TrendHashtags>
                    )}
            </TrendingsContainer>
        </TimelinePageContainer>
    )
}

const TitleContainer = styled.div`
position:absolute;
top:-104px;
left:0;
display:flex;
align-items:center;
justify-content:space-between;
@media (min-width: 936px) {
    position:relative;
    width: 937px;
    top:-41px;
font-size: 33px;
line-height: 49px;
}
`
const ImageTitleContainer = styled.div`
 display:flex;
align-items:center;
justify-content:flex-start; 
max-height:64px;
width:100%;
img {
    margin: 0 20px;
} 

`
const TitleButton = styled.button`
cursor: pointer;
background-color:${({ isFollowed }) => isFollowed ? "white" : "#1877f2"};
border-radius: 5px;
font-family: 'Lato';
font-weight: 700;
font-size: 14px;
line-height: 17px;
color:${({ isFollowed }) => isFollowed ? "#1877f2" : "white"};
max-width:112px;
width:100%;
height:31px;
transition: all 0.1s linear;
@media (min-width: 936px) {
        position:fixed;
        top:165px;
        left:calc(50% + 353px);
    }


`



const ImageLikeContainer = styled.div`
display:flex;
flex-direction:column;
align-items:center;
max-width:50px;
margin-right:18px;
margin-bottom:4px;
p{
color:white;
font-family: 'Lato';
font-weight: 400;
font-size: 11px;
line-height: 13px;
text-align: center;
margin-bottom:1px;
}
img {
    margin-bottom:4px;
}
img:first-child {
    margin-bottom:19px;
}
img:nth-child(2) {
    cursor:pointer;
}
>div:last-child{
    max-width:180px;
    width:fit-content;
    height:30px;
    display:flex;
    flex-direction:column;
    align-items:center;
    border-radius: 3px;
    div:first-child{
        width: 0px !important;
        height: 0px !important;
        border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 9px solid rgba(255, 255, 255, 0.9);
}
p {
    width:fit-content;
    color:#505050;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 11px;
    line-height: 13px;
    background: rgba(255,255,255,0.9);
    word-break:keep-all;
    white-space:nowrap;
    padding:6px;
    border-radius:3px;
    }
}
`

const TimelinePageContainer = styled.div`
    display:flex;
    justify-content:center;
    width: 100%;
    background-color: #333333;
    min-height:100%;
    gap: 25px;
    @media (max-width: 936px) {
        min-width: 100%;
    }
`

const FeedContainer = styled.div`
    position:relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 611px;
    margin-top: 257px;
    @media (max-width: 611px) {
        min-width: 100%;
        gap: 25px;
        margin-bottom: 25px;
    }
    @media (min-width: 936px){
        margin-top:194px;
    }
`

const Title = styled.div`
    font-family: 'Oswald';
    font-style: normal;
    font-weight: 700;
    font-size: 43px;
    line-height: 64px;
    color: #FFFFFF;
    align-self: flex-start;
    /* margin-bottom: 44px; */
    @media (max-width: 611px) {
        margin-left: 15px;
        /* margin-top: 80px; */
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

import styled from "styled-components";
import { ProfileImage } from "../components/ProfileImage.js";
import { useEffect, useState } from "react";
import apiPosts from "../services/apiPosts.js";
import { useNavigate, useParams, Link } from "react-router-dom";
import reactStringReplace from 'react-string-replace';
import heart from "../assets/heart.png";
import filledHeart from "../assets/filled-heart.png";
import dialogBox from "../assets/dialogBox.svg";
import fallbackPhoto from '../assets/no-profile-picture-icon.svg'
import apiAuth from "../services/apiAuth.js";
import { usePhoto } from "../hooks/useImage.js";
import papperPlane from "../assets/papperPlane.svg";
import RepostModal from "../components/RepostModal.js";
import repostButton from "../assets/repostButton.svg";

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
    const [selectedPost, setSelectedPost] = useState(0);
    const [postIndex, setpostIndex] = useState(0);
    const [openComment, setOpenComment] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [userId, setUserId] = useState("");
    const [userToken, setUserToken] = useState("");
    const [reload, setReload] = useState(false);
    const [openRepostModal, setOpenRepostModal] = useState(false);

    const { userProfileImage } = usePhoto();

    useEffect(() => {
        setCarregando(true);
        (async () => {
            try {
                const token = localStorage.getItem("token");
                const idUser = localStorage.getItem("id");
                if (!token) return navigate("/")
                if (!Number.isInteger(Number(id))) return navigate("/timeline")
                const [userInfo, likedPosts, IsFollowing] = await Promise.all([apiPosts.getPostsByUserID(token, id), apiPosts.getLikes(token), apiAuth.getIsFollowing(token, id)])
                const timelineInfo = userInfo.data[0].map(post => ({ ...post, isLiked: likedPosts.data.some(like => Number(like.post_id) === Number(post.post_id)) }))
                const arrayName = userInfo.data[2];
                const photoUrl = await apiAuth.getUserPhoto(token, id)
                setUserPagePhoto(photoUrl.data.avatar)
                // }
                setIsFollowed(IsFollowing.data)
                setFeed(timelineInfo);
                setTrending(userInfo.data[1]);
                setName(arrayName[0]);
                setUserId(idUser);
                setUserToken(token);
                setCarregando(false);
            } catch (err) {
                alert("An error occurred while trying to fetch the posts, please refresh the page");
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload]);
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

            if (response.status === 200) {

                setIsFollowed(prev => !prev)
            }
        } catch (e) {
            alert("Não foi possível executar essa operação")
        }
        setFollowLoading(false)
    }
    const toggleComment = (Index, id) => {
        setpostIndex(Index);
        setSelectedPost(id);
        setOpenComment(!openComment);
    }

    function handleComment(e) {
        e.preventDefault();
        setDisabled(true);
        const body = { text: commentText };

        apiPosts.postComment(userToken, body, selectedPost)
            .then(res => {
                setDisabled(false)
                setCommentText("")
                setReload(!reload)
            })
            .catch(err => {
                alert("There was an error publishing your comment")
                console.log(err.response.data);
                setDisabled(false);
            })

    }

    function handleRepostModal(postId) {
        setSelectedPost(postId)
        setOpenRepostModal(true)
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
                        <TitleButton data-test="follow-btn" disabled={followLoading} isFollowed={isFollowed} onClick={handleFollow}>{isFollowed ? "Unfollow" : "Follow"} </TitleButton>
                    </TitleContainer>
                }
                {(carregando === false && !feed) ? <NoFeed> Sem posts </NoFeed> :
                    (carregando === false && feed) &&
                    feed?.map((f, index) => {
                        const cm = f.comments.map((c) => {
                            return (
                                <Comments key={c.id}>
                                    <ProfileImage userProfileImage={c.writer_avatar} width="50px" height="50px" />
                                    <ComName>
                                        <p>{c.writer_name} {(Number(c.writer_id) === Number(c.post_owner)) ? <span>• post’s author</span> : c.is_following && <span>• following</span>}</p>
                                        <h1>{c.text}</h1>
                                    </ComName>
                                </Comments>
                            )
                        })
                        if (f.reposter_name) {
                            return (
                                <BigContainer key={f.post_id} data-test="post">
                                    <RepostBanner>
                                        <img src={repostButton} alt="Reposted by"></img>
                                        <Link to={`/user/${f.post_owner}`}>
                                            <p>Re-posted by <span>{(f.user_id === localStorage.getItem("id")) ? "you" : f.reposter_name}</span></p>
                                        </Link>
                                    </RepostBanner>
                                    <PostContainer >
                                        <SideContainer>
                                            <ImageLikeContainer>
                                                <ProfileImage userProfileImage={f.avatar} width="50px" height="50px" />
                                                <img src={f.isLiked ? filledHeart : heart} alt="heart" data-test="like-btn" />
                                                <p onMouseEnter={() => handleLikeHover(f.original_post_id)} onMouseOut={() => handleLikeHoverLeaving(f.original_post_id)} data-test="counter" >{f.likes} Likes</p>
                                                {likesInfo && f.likesInfo?.length > 0 && (<div data-test="tooltip">
                                                    <div></div>
                                                    <p>{f.likesInfo}</p>
                                                </div>)}
                                            </ImageLikeContainer>
                                            <DialogBox onClick={() => toggleComment(index, f.post_id)}>
                                                <img src={dialogBox} alt="Dialog Box"></img>
                                                <p>{f.comments.length} comments</p>
                                            </DialogBox>
                                            <RepostBox>
                                                <img src={repostButton} alt="Repost Button"></img>
                                                <p>{f.repost_count} re-post</p>
                                            </RepostBox>
                                        </SideContainer>
                                        <PostInfo>
                                            <TopLine>
                                                <Username>{f.name}</Username>
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
                                    {Number(index) === Number(postIndex) && openComment &&
                                        <ComentsBox>
                                            {cm}
                                        </ComentsBox>}
                                </BigContainer>
                            )
                        }
                        return (
                            <BigContainer key={f.post_id} data-test="post">
                                <PostContainer >
                                    <SideContainer>
                                        <ImageLikeContainer>
                                            <ProfileImage userProfileImage={f.avatar} width="50px" height="50px" />
                                            <img onClick={() => handleLike(f.post_id)} src={f.isLiked ? filledHeart : heart} alt="heart" data-test="like-btn" />
                                            <p onMouseEnter={() => handleLikeHover(f.post_id)} onMouseOut={() => handleLikeHoverLeaving(f.post_id)} data-test="counter" >{f.likes} Likes</p>
                                            {likesInfo && f.likesInfo?.length > 0 && (<div data-test="tooltip">
                                                <div></div>
                                                <p>{f.likesInfo}</p>
                                            </div>)}
                                        </ImageLikeContainer>
                                        <DialogBox onClick={() => toggleComment(index, f.post_id)}>
                                            <img src={dialogBox} alt="Dialog Box"></img>
                                            <p>{f.comments.length} comments</p>
                                        </DialogBox>
                                        <RepostBox onClick={() => handleRepostModal(f.post_id)}>
                                            <img src={repostButton} alt="Repost Button"></img>
                                            <p>{f.repost_count} re-post</p>
                                        </RepostBox>
                                        <RepostModal isOpen={openRepostModal} closeModal={() => setOpenRepostModal(!openRepostModal)} setOpenRepostModal post_id={f.post_id} token={userToken}></RepostModal>
                                    </SideContainer>
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
                                {Number(index) === Number(postIndex) && openComment &&
                                    <ComentsBox>
                                        {cm}
                                        <CommentForm onSubmit={handleComment}>
                                            <ProfileImage userProfileImage={userProfileImage} width="50px" height="50px" />
                                            <input
                                                placeholder="write a comment..."
                                                value={commentText}
                                                onChange={(e) => setCommentText(e.target.value)}
                                                disabled={disabled}
                                            />
                                            <button onClick={handleComment}>
                                                <img src={papperPlane} alt="Send Icon" />
                                            </button>
                                        </CommentForm>
                                    </ComentsBox>}
                            </BigContainer>
                        )
                    })}
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
        position:absolute;
        top:16px;
        right:-326px;
    }
`

const ImageLikeContainer = styled.div`
display:flex;
flex-direction:column;
align-items:center;
max-width:70px;
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
z-index:2;
justify-content: space-between;
width:100%;
background: #171717;
border-radius: 16px;
padding-left: 18px;
padding: 19px;
box-sizing: border-box;
a{
    text-decoration: none;
}
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
max-width: 100%;
justify-content: center;
margin: 0;
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

const SideContainer = styled.div`
    max-width:70px;
    margin-right: 10px;
`

const DialogBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 15px;

    p{
        font-family: 'Lato';
        font-weight: 400;
        font-size: 11px;
        line-height: 13px;
        color: #FFFFFF;
    }
`

const BigContainer = styled.div`
    display:flex;
    flex-direction: column;
    margin-bottom: 16px;
`

const Comments = styled.div`
    border-bottom: 1px solid #353535 ;
    padding: 15px 0;
    display: flex;
`
const ComName = styled.div`
    padding-left: 20px;
    
    p{
        font: Lato;
        font-weight: 700;
        font-size: 14px;
        line-height:25px;
        color: #F3F3F3
    }
    span{
        font: Lato;
        font-weight: 400;
        font-size: 14px;
        line-height:25px;
        color: #565656
    }
    h1{
        font: Lato;
        font-weight: 400;
        font-size: 14px;
        line-height:25px;
        color: #ACACAC
    }
`

const ComentsBox = styled.div`
    width: 100%;
    background-color: #1E1E1E;
    color: #F3F3F3;
    box-sizing: border-box;
    margin-top: -25px;
    z-index: 0;
    display: flex;
    flex-direction: column;
    padding: 20px;
    padding-top: 25px;
    border-radius: 15px;
`

const CommentForm = styled.form`
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    position: relative;
    input{
        width: 510px;
        min-height: 40px;
        border-radius: 8px;
        background-color: #252525;
        padding-left: 15px;
        padding-right:50px;
    }

    button{
        position: absolute;
        right: 15px;
        top: 30px;
        background-color: transparent;
    }
`

const RepostBanner = styled.div`
    display:flex;
    justify-content: left;
    align-items: flex-start;
    padding: 10px 13px;
    gap:7px;
    width:100%;
    height:66px;
    background: #1E1E1E;
    border-radius: 16px;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 11px;
    line-height: 13px;
    margin-bottom:-33px;
    a{
        text-decoration: none;
        color: #FFFFFF;
    }
`

const RepostBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top:20px;
    
    img{
        cursor:pointer;
    }

    p{
        font-family: 'Lato';
        font-weight: 400;
        font-size: 11px;
        line-height: 13px;
        color: #FFFFFF;
        margin-top:3px;

    }
`

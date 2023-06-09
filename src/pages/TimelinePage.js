import styled from "styled-components";
import { ProfileImage } from "../components/ProfileImage.js";
import { useNavigate, Link } from "react-router-dom";
import apiPosts from "../services/apiPosts.js";
import React, { useEffect, useRef, useState } from "react";
import { usePhoto } from "../hooks/useImage.js";
import trashCan from "../assets/trash.svg";
import heart from "../assets/heart.png";
import papperPlane from "../assets/papperPlane.svg"
import filledHeart from "../assets/filled-heart.png";
import dialogBox from "../assets/dialogBox.svg"
import pencil from "../assets/pencil.svg";
import Modal from "../components/Modal.js";
import reactStringReplace from 'react-string-replace';

export default function TimelinePage() {
    const [feed, setFeed] = useState();
    const [trending, setTrending] = useState([]);
    const [form, setForm] = useState({ shared_link: "", description: "" });
    const [disabled, setDisabled] = useState(false);
    const [userId, setUserId] = useState("");
    const [userToken, setUserToken] = useState("");
    const [reload, setReload] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(0);
    const [postIndex, setpostIndex] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editDescription, setEditDescription] = useState("");
    const [oldFeed, setOldFeed] = useState([]);
    const [likesInfo, setLikesInfo] = useState(false);
    const [hasFriends, setHasFriends] = useState(false);
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [commentText, setCommentText] = useState("");
    const [openComment, setOpenComment] = useState(false);
    const navigate = useNavigate();
    const refs = useRef([React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(),
    React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(),
    React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(),
    React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()
    ])

    const { userProfileImage } = usePhoto();

    const toggleEditing = (Index, descrip, id) => {
        setpostIndex(Index);
        setSelectedPost(id)
        setEditDescription(descrip)
        setIsEditing(!isEditing);
    };

    const toggleComment = (Index,id)=>{
        setpostIndex(Index);
        setSelectedPost(id);
        setOpenComment(!openComment);
    }

    function handleExit(chave) {
        if (chave === 'Escape') {
            setIsEditing(!isEditing);
        }
    }

    useEffect(() => {
        if (isEditing) {
            refs.current[postIndex].current.focus();
        }
    }, [isEditing, postIndex]);


    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                const idUser = localStorage.getItem("id");
                if (!token) return navigate("/");

                const [timeline, likedPosts] = await Promise.all([apiPosts.getTimeline(token), apiPosts.getLikes(token)])
                const timelineInfo = timeline.data[0].map(post => ({ ...post, isLiked: likedPosts.data.some(like => Number(like.post_id) === Number(post.post_id)) }))
                setHasFriends(timeline.data[2].hasFriends)
                setFeed(timelineInfo);
                console.log(timeline)
                setTrending(timeline.data[1]);
                setUserId(idUser);
                setUserToken(token);
                setIsLoadingPage(false)


            } catch (err) {
                console.log(err.response)
                alert("An error occurred while trying to fetch the posts, please refresh the page");
            }
        })()
    }, [reload, navigate])

    function handleForm(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
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

    function handleEditPost(e) {
        e.preventDefault();
        setDisabled(true);
        const description = { description: editDescription }

        apiPosts.postEdit(userToken, description, selectedPost)
            .then(res => {
                setDisabled(false)
                setIsEditing(false)
                setReload(!reload)
            })
            .catch(err => {
                alert("There was an error publishing your edition")
                console.log(err.response.data);
                setDisabled(false);
            });
    }
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
                    const likesQuantity = newLikesInfo.data.length
                    if (isLikedByUser) {
                        if (likesQuantity > 2) {
                            return { ...post, likesInfo: `Você, ${names[0].name} e outras ${newLikesInfo.length - 2} pessoas` }
                        } else if (likesQuantity === 2) {
                            return { ...post, likesInfo: `Você e ${names[0].name} curtiram..` }
                        } else if (likesQuantity === 1) {
                            return { ...post, likesInfo: `Você curtiu..` }
                        }
                    }
                    else {
                        if (likesQuantity === 1) {
                            return { ...post, likesInfo: `${names[0].name} curtiu..` }
                        } else if (likesQuantity === 2) {
                            return { ...post, likesInfo: `${names[0].name} e ${names[1].name} curtiram...` }
                        } else if (likesQuantity > 2) {
                            return { ...post, likesInfo: `${names[0].name}, ${names[1].name} e outras ${newLikesInfo.length - 2} pessoas` }
                        }
                    }
                }
                return post
            })
        }
        setFeed(newFeed)
    }

    async function handleLikeHoverLeaving() {
        setFeed(prev => [...oldFeed])
        setLikesInfo(false)
    }
    function handlePost(e) {
        e.preventDefault();
        setDisabled(true);

        if (!form.shared_link) return alert("Link input must be filled");

        const token = localStorage.getItem("token");

        apiPosts.publishPost(form, token)
            .then(res => {
                setForm({ shared_link: "", description: "" });
                setDisabled(false);
                setReload(!reload);
            })
            .catch(err => {
                alert("There was an error publishing your link")
                console.log(err.response.data);
                setDisabled(false);
            });
    }

    function handleModal(postId) {
        setSelectedPost(postId)
        setOpenModal(true)
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

    return (
        <TimelinePageContainer>
            <FeedContainer>
                <Title>timeline</Title>
                <SharePostContainer data-test="publish-box" >
                    <ImageContainer>
                        <ProfileImage userProfileImage={userProfileImage} width="50px" height="50px" />
                    </ImageContainer>
                    <PostForm onSubmit={handlePost}>
                        <CTA>What are you going to share today?</CTA>
                        <LinkInput
                            placeholder="http://..."
                            name="shared_link"
                            type="url"
                            required
                            value={form.shared_link}
                            onChange={handleForm}
                            disabled={disabled}
                            data-test="link"
                        ></LinkInput>
                        <DescriptionInput
                            placeholder="Awesome link about your #passion"
                            name="description"
                            type="text"
                            value={form.description}
                            onChange={handleForm}
                            disabled={disabled}
                            data-test="description"
                        ></DescriptionInput>
                        <Button type="submit" disabled={disabled} data-test="publish-btn" >{disabled ? "Publishing..." : "Publish"}</Button>
                    </PostForm>
                </SharePostContainer>
                {isLoadingPage ? <NoFeed data-test="message" >Loading...</NoFeed> :
                    !hasFriends ? "You don't follow anyone yet. Search for new friends!" : feed.length === 0 ? "No posts found from your friends" :
                        feed.map((f, index) => {
                            console.log(f.comments)
                            const cm = f.comments.map((c) => (
                                <Comments>
                                    <ProfileImage userProfileImage={c.writer_avatar} width="50px" height="50px" />
                                    <ComName>
                                        <p>Nome do cara {c.is_following && <span>• following</span>}</p>
                                        <h1>{c.text}</h1>
                                    </ComName>
                                </Comments>
                            ))
                            return (
                                <BigContainer key={f.post_id} data-test="post">
                                    <PostContainer>
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
                                        </SideContainer>
                                        <PostInfo>
                                            <TopLine>
                                                <Link to={`/user/${f.post_owner}`}>
                                                    <Username data-test="username" >{f.name}</Username>
                                                </Link>
                                                {(f.post_owner === Number(userId)) && <ButtonBox>
                                                    <button onClick={() => toggleEditing(index, f.description, f.post_id)} data-test="edit-btn">
                                                        <img src={pencil} alt="Edit" />
                                                    </button>
                                                    <button onClick={() => handleModal(f.post_id)} data-test="delete-btn" >
                                                        <img src={trashCan} alt="Delete" />
                                                    </button>
                                                </ButtonBox>}
                                                <Modal isOpen={openModal} closeModal={() => setOpenModal(!openModal)} setOpenModal post_id={f.post_id} token={userToken} > </Modal>
                                            </TopLine>
                                            {(isEditing && Number(index) === Number(postIndex)) ?
                                                <EditForm onSubmit={handleEditPost}>
                                                    <input
                                                        ref={refs.current[index]}
                                                        value={editDescription}
                                                        onChange={(e) => setEditDescription(e.target.value)}
                                                        onKeyDown={(e) => handleExit(e.key)}
                                                        disabled={disabled}
                                                    />
                                                </EditForm> :
                                                <PostDescription data-test="description" >

                                                    {reactStringReplace(f.description, /#(\w+)/g, (match, i) => (
                                                        <Link to={`/hashtag/${match}`} key={match + i} >#{match}</Link>
                                                    ))}
                                                </PostDescription>}


                                            <Metadata href={f.shared_link} target="_blank" data-test="link">
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
                        })
                }
            </FeedContainer>
            <TrendingsContainer data-test="trending" >
                <TrendTitle>
                    trending
                </TrendTitle>
                {trending.length === 0 ? <NoFeed>Loading...</NoFeed> :
                    trending.map((h) =>
                        <TrendHashtags key={h.hashtag_id} onClick={() => navigate(`/hashtag/${h.name.substring(1)}`)} data-test="hashtag" >
                            {h.name}
                        </TrendHashtags>
                    )}
            </TrendingsContainer>
            <Modal isOpen={openModal} closeModal={() => setOpenModal(!openModal)} post_id={selectedPost} token={userToken} > </Modal>
        </TimelinePageContainer>
    )
}


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
const ImageContainer = styled.div`
    @media (max-width: 611px) {
        display: none;
    }
`
const TimelinePageContainer = styled.div`
    display:flex;
    justify-content:center;
    width: 100%;
    min-height: 100%;
    background-color: #333333;
    gap: 25px;
    @media (max-width: 936px) {
        min-width: 100%;
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

    p{
        font-family: 'Lato';
        font-weight: 400;
        font-size: 11px;
        line-height: 13px;
        color: #FFFFFF;
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

const Title = styled.div`
    margin-top: 78px;
    font-family: 'Oswald';
    font-style: normal;
    font-weight: 700;
    font-size: 43px;
    line-height: 64px;
    color: #FFFFFF;
    align-self: flex-start;
    @media (max-width: 611px) {
        margin-left: 15px;
        margin-top: 80px;
        font-size: 33px;
        line-height: 48px;
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
    margin-bottom: 29px;
    padding: 16px;
    gap: 18px;
    @media (max-width: 611px) {
    border-radius: 0px;
    padding: 15px;
    margin: 0 15px;
    width: 100%;
    justify-content: center;
    }
`

const PostForm = styled.form`
    display:flex;
    flex-direction: column;
    max-width: 502px;
    gap:7px;
    @media (max-width: 611px) {
        max-width: 100%;
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

const CTA = styled.h1`
    font-family: 'Lato';
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 24px;
    color: #707070;
    align-self: flex-start;
    @media (max-width: 611px) {
        align-self: center;
    }
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
    @media (max-width: 611px) {
        max-width: 100%;
    }
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
    @media (max-width: 611px) {
        max-width: 100%;
    }
`

const Button = styled.button`
    width: 112px;
    height: 31px;
    background: #1877F2;
    border-radius: 5px;
    align-self: flex-end;
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

const Comments = styled.div`
    border-bottom: 1px solid #353535 ;
    padding: 15px 0;
    display: flex;
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

const BigContainer = styled.div`
    display:flex;
    flex-direction: column;
    margin-bottom: 16px;
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

const EditForm = styled.form`
    width: 100%;
    input{
        width: 100%;
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    line-height: 20px;
    color: #B7B7B7;
    align-self: flex-start;
    word-wrap: break-word;
    text-align: left;
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

const TopLine = styled.div`
    display: flex;
    justify-content: space-between;
`

const ButtonBox = styled.div`
    max-width: 70px;
    display: flex;
    justify-content: space-around;
    
    button{
        background-color: transparent;
    }
`








import styled from "styled-components";
import { ProfileImage } from "../components/ProfileImage.js";
import { useNavigate, Link } from "react-router-dom";
import apiPosts from "../services/apiPosts.js";
import { useEffect, useState } from "react";
import { usePhoto } from "../hooks/useImage.js";
import trashCan from "../assets/trash.svg";
import pencil from "../assets/pencil.svg";
import Modal from "../components/Modal.js";
import reactStringReplace from 'react-string-replace';

export default function TimelinePage() {
    const [feed, setFeed] = useState([]);
    const [trending, setTrending] = useState([]);
    const [form, setForm] = useState({ shared_link: "", description: "" });
    const [disabled, setDisabled] = useState(false);
    const [userId, setUserId] = useState("");
    const [userToken, setUserToken] = useState("")
    const [reload, setReload] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(0);
    const navigate = useNavigate();
    const { userProfileImage } = usePhoto();

    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem("token");
                const idUser = localStorage.getItem("id");
                if (!token) return navigate("/");

                const timeline = await apiPosts.getTimeline(token);
                if (timeline.status === 204) {
                    alert("There are no posts yet");
                } else {
                    setFeed(timeline.data[0]);
                    setUserId(idUser);
                    setUserToken(token);
                }

            } catch (err) {
                console.log(err.response)
                alert("An error occurred while trying to fetch the posts, please refresh the page");
            }
        })()
    }, [reload])

    function handleForm(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
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

    return (
        <TimelinePageContainer>
            <FeedContainer>
                <Title>timeline</Title>
                <SharePostContainer>
                    <ProfileImage userProfileImage={userProfileImage} width="50px" height="50px" />
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
                        ></LinkInput>
                        <DescriptionInput
                            placeholder="Awesome link about your #passion"
                            name="description"
                            type="text"
                            value={form.description}
                            onChange={handleForm}
                            disabled={disabled}
                        ></DescriptionInput>
                        <Button type="submit" disabled={disabled}>{disabled ? "Publishing..." : "Publish"}</Button>
                    </PostForm>
                </SharePostContainer>
                {feed.length === 0 ? <NoFeed>Loading...</NoFeed> :
                    feed.map((f, index) => {
                        return (
                            <PostContainer key={index}>
                                <ProfileImage userProfileImage={f.avatar} width="50px" height="50px" />
                                <PostInfo>
                                    <TopLine>
                                        <Username>{f.name}</Username>
                                        {(f.post_owner === Number(userId)) && <ButtonBox>
                                            <button onClick={() => console.log('alterar')}>
                                                <img src={pencil} alt="Edit" />
                                            </button>
                                            <button onClick={() => handleModal(f.post_id)}>
                                                <img src={trashCan} alt="Delete" />
                                            </button>
                                        </ButtonBox>}
                                        <Modal isOpen={openModal} closeModal={() => setOpenModal(!openModal)} setOpenModal post_id={f.post_id} token={userToken} > </Modal>
                                    </TopLine>
                                    <PostDescription>
                                        {reactStringReplace(f.description, /#(\w+)/g, (match, i) => (
                                            <Link to ={`/hashtag/${match}`} key={match + i} >#{match}</Link>
                                        ))}
                                    </PostDescription>
                                    <Metadata href={f.shared_link} target="_blank">
                                        <LinkInfo>
                                            <LinkTitle>{f.link_title}</LinkTitle>
                                            <LinkDescription>{f.link_description}</LinkDescription>
                                            <LinkURL>{f.shared_link}</LinkURL>
                                        </LinkInfo>
                                        <LinkImage src={f.link_image}></LinkImage>
                                    </Metadata>
                                </PostInfo>
                            </PostContainer>

                        )
                    })
                }
            </FeedContainer>
            <TrendingsContainer>
                <TrendTitle>
                    trending
                </TrendTitle>
                {trending.length === 0 ? <NoFeed>Loading...</NoFeed> :
                    trending.map((h) =>
                        <TrendHashtags key={h.hashtag_id} onClick={() => navigate(`/hashtag/${h.name.substring(1)}`)}>
                            {h.name}
                        </TrendHashtags>
                    )}
            </TrendingsContainer>
            <Modal isOpen={openModal} closeModal={() => setOpenModal(!openModal)} post_id={selectedPost} token={userToken} > </Modal>
        </TimelinePageContainer>
    )
}

const TimelinePageContainer = styled.div`
    display:flex;
    justify-content:center;
    width: 100%;
    min-height: 100%;
    background-color: #333333;
    gap: 25px;
`

const FeedContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 611px;
    margin-top: 72px;
`

const TrendingsContainer = styled.div`
    max-width: 300px;
    height: 405px;
    background-color: #171717;
    margin-top: 257px;
    border-radius: 16px;
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

const PostForm = styled.form`
    display:flex;
    flex-direction: column;
    max-width: 502px;
    gap:7px;
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

    button{
        visibility: hidden;
    }

    :hover{
        button{
            visibility:visible;
        }
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
    line-height: 20px;
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
`

const LinkImage = styled.img`
    max-width: 153px;
    max-height: 155px;
    object-fit: cover;
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








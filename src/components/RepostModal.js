import styled from "styled-components"
import apiPosts from "../services/apiPosts.js"
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

export default function RepostModal({ isOpen, closeModal, token, post_id }) {
    const [load, setLoad] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        setLoad(false)
    }, [isOpen])

    async function handleRepost(token, post_id) {
        const body = { post_id: post_id }
        try {
            setLoad(true);
            const promisse = await apiPosts.sharePost(token, body);
            if (promisse.status === 200) {
                setLoad(false);
                navigate(0);
            }
        } catch (err) {
            console.log(err.response);
            alert("There was an error sharing this post, please refresh the page");
            navigate(0);
        }
    }

    if (isOpen) {
        return (
            <ModalBack>
                <ModalContent>
                    <Confirmation>
                        Do you want to re-post<br />
                        this link?
                    </Confirmation>
                    <Buttons>
                        <ButtonA onClick={closeModal} data-test="cancel" >No, cancel</ButtonA>
                        <ButtonB onClick={() => handleRepost(token, post_id)} data-test="confirm" >{load ? <ThreeDots width={50} /> : "Yes, share!"}</ButtonB>
                    </Buttons>
                </ModalContent>
            </ModalBack>
        )
    }
}

const ModalBack = styled.div`
    position: fixed;
    top:0;
    left:0;
    bottom:0;
    right:0;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 100;
`
const ModalContent = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: rgba(51, 51, 51, 1);
    border-radius: 50px;
    max-width:600px;
    height:300px;
`

const Confirmation = styled.p`
    font-family: 'Lato';
    font-weight: 700;
    font-size: 34px;
    text-align: Center;
    color: #FFFFFF;
    margin-top: 50px;
    margin-bottom: 50px;
`
const Buttons = styled.div`
    margin-left: auto;
    margin-right: auto;
    max-width: 320px;
    display: flex;
    justify-content: space-between;

    button{
        visibility: visible;
    }
`

const ButtonA = styled.button`
    width:140px;
    height: 40px;
    border-radius: 5px;
    background-color: #FFFFFF;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 18px;
    color:#1877F2;
`

const ButtonB = styled.button`
    width:140px;
    height: 40px;
    border-radius: 5px;
    background-color: #1877F2;
    font-family: 'Lato';
    font-weight: 700;
    font-size: 18px;
    color:#FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
`
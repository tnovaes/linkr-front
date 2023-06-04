import styled from "styled-components"
import apiPosts from "../services/apiPosts.js"
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

export default function Modal({ isOpen, closeModal, setOpenModal, token, post_id }) {
    const [load, setLoad] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        setLoad(false)
    }, [])
    async function deletePost(token, id) {
        try {
            setLoad(true)
            const promisse = await apiPosts.deletePostByID(token, id);
            if (promisse.status === 200) {
                setLoad(false)
                navigate('/timeline')
            } else {
                setLoad(false)
                alert("something whent Wrong")
                navigate('/timeline')
            }
        } catch (err) {
            console.log(err.response)
            alert("An error occurred while trying to delete the posts, please refresh the page");
        }
    }

    if (isOpen) {
        return (
            <ModalBack>
                <ModalContent>
                    <Confirmation>
                        Are you sure you want<br />
                        to delete this post?
                    </Confirmation>
                    <Buttons>
                        <ButtonA onClick={closeModal}>No, go back</ButtonA>
                        <ButtonB onClick={() => deletePost(token, post_id)}>{load ? <ThreeDots width={50} /> : "Yes, delete it"}</ButtonB>
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
    font: Lato;
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
    justify-content: space-between
`

const ButtonA = styled.button`
    width:140px;
    height: 40px;
    border-radius: 5px;
    background-color: #FFFFFF;
    font: Lato;
    font-weight: 700;
    font-size: 18px;
    color:#1877F2;
`

const ButtonB = styled.button`
    width:140px;
    height: 40px;
    border-radius: 5px;
    background-color: #1877F2;
    font: Lato;
    font-weight: 700;
    font-size: 18px;
    color:#FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
`
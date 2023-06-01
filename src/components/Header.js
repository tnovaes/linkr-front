import styled from "styled-components";
import { ProfileImage } from "./ProfileImage.js";
import { useEffect, useState } from "react";
import { Arrow } from "./Arrow.js";
import { fadeGrow } from "../styles/keyframes.js";
import { useNavigate } from "react-router";
import apiAuth from "../services/apiAuth.js";
import { DebounceInput } from 'react-debounce-input';
export function Header({ children, profileImg }) {
    const [usersList, setUsersList] = useState([])
    const [arrowDirection, setArrowDirection] = useState(false)
    const [showMenu, setShowMenu] = useState(false)
    const navigate = useNavigate()
    function handleMenu() {
        setArrowDirection((prev) => !prev)
        setShowMenu((prev) => !prev)
    }
    async function handleLogout() {
        try {
            const token = localStorage.getItem("token")
            await apiAuth.logout(token)
            localStorage.removeItem("token")
            //colocar qualquer outro cleanup que precisar aqui 
            navigate("/")
        } catch (e) {
            navigate("/")
        }
    }
    async function handleSearchInput(e) {
        try {
            const token = localStorage.getItem("token")
            const response = await apiAuth.getUsers(token, e.target.value)
            if (response.status === 200) {
                setUsersList(prev => response.data)
            }
        } catch (err) {
        }
    }
    function handleUserProfileNavigation(id){
        navigate(`/user/${id}`)
    }
    //DESCOMENTAR DEPOIS DE COLOCAR NA PAGINA QUE PRECISA DE AUTHENTICAÇÃO
    //COLOQUEI AQUI PRA ELE REDIRECIONAR PARA A HOME CASO NÃO ESTEJA AUTENTICADO
    //não precisa ter necessáriamente aqui, seria mais por  reaproveitamento entre as paginas que precisam de authenticação
    //mas pode tirar se tiver com problemas pra usar
    // useEffect(()=>{
    //     const token = localStorage.getItem("token")
    //     if (token===null) navigate('/')
    // }, [])
    return (<>
        <HeaderContainer>
            <Logo>linkr</Logo>
            <SearchPersonContainer>
                <DebounceInput
                    element={SearchPersonInput}
                    minLength={3}
                    debounceTimeout={300}
                    onChange={(e) => handleSearchInput(e)}
                    onBlur={()=>setUsersList(()=>[])}
                    placeholder="Search for people"
                />
                <UserListContainer>
                    {usersList.map(item =>
                        <UserListItem onClick={()=>handleUserProfileNavigation(item.id)} key={item.id}>
                            <ProfileImage width={'39px'} height={'39px'}profileImgUrl={item.avatar}/>
                            <p>{item.name}</p>
                        </UserListItem>
                    )}
                </UserListContainer>
            </SearchPersonContainer>
            <NavContainer>
                <Arrow onClick={handleMenu} arrowDirection={arrowDirection} />
                <ProfileImage onClick={handleMenu} profileImg={profileImg} width="53px" height="53px" />
                {showMenu && <MenuButton onClick={handleLogout}>Logout</MenuButton>}
            </NavContainer>
        </HeaderContainer>
        {children}
    </>)
}

const UserListContainer = styled.ul`
height:fit-content;
display: flex;
flex-direction:column;
p{
    margin-left:12px;
    font-family: 'Lato';
    font-weight: 400;
    font-size: 19px;
    line-height: 23px;
    text-transform: capitalize;
}
`
const UserListItem = styled.li`
display: flex;
cursor:pointer;
align-items:center;
margin-bottom: 16px;
margin-left: 16px;
:first-child{
    margin-top: 14px;
}
:last-child{
    margin-bottom: 23px;
}
`


const SearchPersonContainer = styled.div`
position:fixed;
top:13px;
left: calc(50% - 285px);
max-width:570px;
background-color:#E7E7E7;
border-radius: 8px;
display: flex;
flex-direction: column;
input{
    /* position:absolute;
    top:0;
    left:0; */
}

:focus {
    
}

/* input {
    width:100%;
    height:45px;
    padding-left:17px;
    font-family: 'Lato';
    font-weight: 400;
    font-size: 19px;
    line-height: 23px;
    color:black;
    border-radius: 8px;
::placeholder{
    color:#C6C6C6;
}
} */
`
const SearchPersonInput = styled.input`
width:100%;
height:45px;
padding-left:17px;
font-family: 'Lato';
font-weight: 400;
font-size: 19px;
line-height: 23px;
color:black;
border-radius: 8px;
::placeholder{
    color:#C6C6C6;
}
`



const MenuButton = styled.button`
position:absolute;
top:62px;
right:-34px;
width:150px;
height:47px;
border-radius: 0px 0px 20px 20px;
background-color:#171717;
animation: ${fadeGrow};
animation-duration: 0.5s;
animation-fill-mode: forwards;
transition: all 0.150s linear;
:hover{
    opacity:0.4;
    color:#1877f2;
}
`
const HeaderContainer = styled.header`
background-color:#151515;
height: 72px;
display:flex;
justify-content: space-between;
align-items:center;
position:fixed;
top:0;
left:0;
width:100%;
padding: 10px 17px 10px 28px;
img {
    margin-left:10px;
}
`
const Logo = styled.h1`
font-family: 'Passion One';
font-weight: 700;
font-size: 49px;
line-height: 54px;
letter-spacing: 0.05em;
`

const NavContainer = styled.nav`
display:flex;
align-items:center;
position: relative;
img{
    cursor: pointer;
}
`
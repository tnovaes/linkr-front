import styled from "styled-components";
import { ProfileImage } from "./ProfileImage.js";
import { useEffect, useRef, useState } from "react";
import { Arrow } from "./Arrow.js";
import { fadeGrow } from "../styles/keyframes.js";
import { useNavigate } from "react-router";
import apiAuth from "../services/apiAuth.js";
import { DebounceInput } from 'react-debounce-input';
import { usePhoto } from "../hooks/useImage.js";
import { Link } from "react-router-dom";

export function Header({ children }) {
    const [searchInputValue, setSearchInputValue] = useState("");
    const [usersList, setUsersList] = useState([]);
    const [arrowDirection, setArrowDirection] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();
    const searchContainerRef = useRef();
    const { userProfileImage } = usePhoto();

    function handleMenu() {
        setArrowDirection((prev) => !prev)
        setShowMenu((prev) => !prev)
    }

    async function handleLogout() {
        try {
            const token = localStorage.getItem("token")
            await apiAuth.logout(token)
            localStorage.removeItem("token")
            localStorage.removeItem("id")
            //colocar qualquer outro cleanup que precisar aqui 
            navigate("/")
        } catch (e) {
            navigate("/")
        }
    }

    async function handleSearchInput(e) {
        try {
            setSearchInputValue(() => e.target.value)
            if (e.target.value.length < 3) return;
            const token = localStorage.getItem("token")
            const response = await apiAuth.getUsers(token, e.target.value)
            if (response.status === 200) {
                setUsersList(prev => response.data)
            }
        } catch (err) {
        }
    }

    function handleUserProfileNavigation(e) {
        e.preventDefault()
        e.stopPropagation()
        if (e.target.id === 'input') return
        navigate(`/user/${e.target.id}`)
    }

    function cleanInput(e) {
        setUsersList(() => [])
    }

    useEffect(() => {
        const searchContainer = searchContainerRef.current;
        searchContainer.addEventListener('click', handleUserProfileNavigation, { capture: true });
        document.addEventListener('click', cleanInput);
        return () => {
            searchContainer.removeEventListener('click', handleUserProfileNavigation, { capture: true });
            document.removeEventListener('click', cleanInput);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<>
        <HeaderContainer>
            <Link to={"/timeline"}>
                <Logo>linkr</Logo>
            </Link>
            <SearchPersonContainer ref={searchContainerRef}>
                <InnerContainer>
                <DebounceInput
                    element={SearchPersonInput}
                    id={"input"}
                    minLength={3}
                    debounceTimeout={300}
                    onChange={(e) => handleSearchInput(e)}
                    onFocus={(e) => handleSearchInput(e)}
                    placeholder="Search for people"
                    value={searchInputValue}
                    autoComplete="off"
                    data-test="search"
                />
                <UserListContainer >
                    {usersList.map(item =>
                        <UserListItem id={item.id} key={item.id} data-test="user-search" >
                            <ProfileImage id={item.id} width={'39px'} height={'39px'} userProfileImage={item.avatar} />
                            <p id={item.id}>{item.name} {item.is_following && <span>• following</span>}</p>
                        </UserListItem>
                    )}
                </UserListContainer>
                </InnerContainer>
            </SearchPersonContainer>
            <NavContainer data-test="menu" >
                <Arrow onClick={handleMenu} arrowDirection={arrowDirection} />
                <ProfileImage data-test="avatar" onClick={handleMenu} userProfileImage={userProfileImage} width="53px" height="53px" />
                {showMenu && <MenuButton onClick={handleLogout} data-test="logout" >Logout</MenuButton>}
            </NavContainer>
        </HeaderContainer>
        {children}
    </>)
}

const InnerContainer = styled.div`
    @media (max-width: 936px) {
    width:100%;
    max-width: 611px;
    background-color:#E7E7E7;
    border-radius: 8px;
    }
`
const UserListContainer = styled.ul`
    height:fit-content;
    display: flex;
    flex-direction:column;
    overflow-y:auto;
    overflow-x:hidden;
    cursor:pointer;
    ::-webkit-scrollbar {
    width: 8px; 
    }
    ::-webkit-scrollbar-thumb {
    background-color: black; 
    border-radius: 5px; 
    }
    ::-webkit-scrollbar-thumb:hover {
    background-color: #1877f2; 
    }
    ::-webkit-scrollbar-track {
    background-color: #f1f1f1; 
    }

    p{
        margin-left:12px;
        font-family: 'Lato';
        font-weight: 400;
        font-size: 19px;
        line-height: 23px;
        text-transform: capitalize;
    }
    li:hover{
        transition: all 0.3s ease-in-out;
        color:#1877f2;
        transform:scale(1.2) translateX(40px);
        cursor:pointer;
        img {
            transition: all 0.3s ease-in-out;
            outline:2px solid white;
        }
    }
    @media (max-width: 936px) {
    width:100%;
    max-width: 611px;
    background-color:#E7E7E7;
    
    border-radius: 8px;
    }
`

const UserListItem = styled.li`
    display: flex;
    align-items:center;
    margin-bottom: 16px;
    margin-left: 16px;
    animation: ${fadeGrow} 0.1s ease-in forwards;
    :first-child{
        margin-top: 14px;
    }
    :last-child{
        margin-bottom: 23px;
    }
    span:last-child{
        color: #C5C5C5;
        font-family: 'Lato';
        font-weight: 400;
        font-size: 19px;
        line-height: 23px;
        text-transform: lowercase;
    }
    @media (max-width: 936px) {
    font-size: 17px;
    line-height: 20px;
    }
`

const SearchPersonContainer = styled.div`
    position:fixed;
    top:13px;
    left: calc(50% - 285px);
    max-width: 570px;
    background-color:#E7E7E7;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    max-height:60%;
    overflow-y:hidden;
    width:100%;
    input{
        height:45px;
    }
    :focus {
        
    }
    @media (max-width: 936px) {
    position: fixed;
    top: 72px;
    left: 0;
    background-color:#333333;
    padding: 10px 15px;
    border-radius: 0;
    border: none;
    margin: 0;
    width:100%;
    max-width:100%;
    display:flex;
    justify-content:center;
    align-items:center;
    }

`
const SearchPersonInput = styled.input`
    width:100%;
    padding-left:17px;
    font-family: 'Lato';
    font-weight: 400;
    font-size: 19px;
    line-height: 23px;
    color: black;
    border-radius: 8px;
    height:45px;
    padding-bottom:13px;
    padding-top:9px;
    max-width: 611px;
    
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
    z-index:100;
    background-color:#151515;
    height: 72px;
    display:flex;
    justify-content: space-between;
    align-items:center;
    position:fixed;
    top:0;
    left:0;
    width:100%;
    padding: 10px 17px;
    img {
        margin-left: 20px;
    }
    a {
        text-decoration: none;
    }
    @media (min-width: 936px) {
    padding: 10px 30px;
    max-width: 100%;
    }
    @media (max-width: 375px) {
    max-width: 375px;
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
    width: 100px;
    img{
        cursor: pointer;
    }
`
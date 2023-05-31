import styled from "styled-components"

export function Arrow({ arrowDirection = true, onClick }) {
    return (
        <Button onClick={onClick}>
            <ArrowSVG width="23" height="17" viewBox="0 0 23 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                {arrowDirection ? <path d="M2.32315 14.7658L11.4893 2.375L20.6981 14.7341" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                :<path d="M20.6875 2.375L11.5 14.75L2.3125 2.375" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            }
            </ArrowSVG>
        </Button>
    )
}

const Button = styled.button`
border-radius:50%;
padding:7px;
background-color:transparent;
border:none;
:hover{
    opacity:0.8;
    svg path{
        stroke:#1877f2;
    }
}
`
const ArrowSVG = styled.svg`
width: 18.4px;
height: 12.4px;
transition: all 0.250s linear;
`
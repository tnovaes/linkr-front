import { Link } from "react-router-dom";
import styled from "styled-components";
import { fade } from "../styles/keyframes.js";

export default function SignInPage() {
  return (<SignInPageContainer>
    <TitleContainer>
      <Title>linkr</Title>
      <SubTitle>save, share and discover<br /> the best links on the web</SubTitle>
    </TitleContainer>
    <FormContainer>
      <Input placeholder={"e-mail"} />
      <Input placeholder={"password"} />
      <Button>Log In</Button>
      <Link to={'/signup'}> First time? Create and account! </Link>
    </FormContainer>
  </SignInPageContainer>
  );
}

const FormContainer = styled.form`
background-color: #333333;
width: calc(350px + 40%);
max-width:600px;
height:100%;
padding: 274px 53px 0 53px;
display:flex;
flex-direction:column;
margin-left: auto;
a{
color:white;
font-family: 'Lato';
font-weight: 400;
font-size: 17px;
line-height: 20px;
text-decoration-line: underline;
margin: 21px auto 0 auto;
width:fit-content;
}
*{
  animation: ${fade} 1s ease-in forwards;
}
@media (max-width: 1030px) {
  width:100%;
  padding: 15% 6% 0px 6%;
  display:flex;
  flex-direction:column;
  align-items:center;
  max-width:100%;
}
`
const SignInPageContainer = styled.div`
display:flex;
width:100%;
height:100%;
background-color:black;
@media (max-width: 1030px) {
  flex-direction:column;
  padding-top:10px;
}
`
const TitleContainer = styled.div`
height:100%;
background-color:black;
padding-left:10%;
padding-top:300px;
width:62.8%;
@media (max-width: 1030px) {
  padding-top:0px;
  padding-left:0px;
  padding-bottom:27px;
  width:100%;
  height:fit-content;
}
`
const Title = styled.h1`
font-family: 'Passion One';
font-weight: 700;
font-size: 106px;
line-height: 117px;
@media (max-width: 1030px) {
  width:fit-content;
  margin:0 auto;
  font-family: 'Passion One';
  font-size: 76px;
  line-height: 84px;
  letter-spacing: 0.05em;
}
`
const SubTitle = styled.h2`
color:white;
font-family: 'Oswald';
font-weight: 700;
font-size: 43px;
line-height: 64px;
@media (max-width: 1030px) {
  width:fit-content;
  margin:0 auto;
  font-size: 23px;
  line-height: 34px;
  text-align: center;
}
`

const Input = styled.input`
height:65px;
width:100%;
margin-bottom:14px;
font-family: 'Oswald';
font-weight: 700;
font-size: 27px;
line-height: 40px;
padding-left:17px;
:hover{
  opacity:0.8;
  border: 1px solid black;
  outline:none;
}
:focus{
  opacity:0.8;
  border: 2px solid black;
  outline:none;
}
@media (max-width: 1030px) {
  margin:0 auto 14px auto;
  max-width:550px;
}
`
const Button = styled.button`
font-family: 'Oswald';
font-weight: 700;
font-size: 22px;
line-height: 33px;
padding: 11px 0;
width:100%;
margin-bottom:14px;
:hover{
  opacity:0.8;
}
@media (max-width: 1030px) {
  margin:0 auto 14px auto;
  max-width:550px;
}
`
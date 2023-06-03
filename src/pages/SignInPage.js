import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fade } from "../styles/keyframes.js";
import { useEffect, useState } from "react";
import apiAuth from "../services/apiAuth.js";

export default function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [disabled, setDisabled] = useState(false)
  const navigate = useNavigate();
  function handleForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  async function handleSignIn(e) {
    e.preventDefault();
    setDisabled(() => true)
    if (!form.email || !form.password) return alert("All fields must be filled");
    try {
      const response = await apiAuth.signIn(form)
      if (response.status === 200) {
        const { token, id } = await response.data
        localStorage.setItem("token", `Bearer ${token}`)
        localStorage.setItem("id", `11`)
        navigate('/timeline')
      }
    } catch (error) {
      if (error.response.status === 401) alert("Incorrect email or password, please try again.")
    } finally {
      setForm(() => ({ email: "", password: "" }))
      setDisabled(() => false)
    }
  }
  useEffect(() => {
    (async function getUserInfo() {
      try {
        const token = localStorage.getItem("token")
        if (token !== null) {
          //podemos também setar um estado aqui
          // falando que a conta foi detectada com um loading ao lado ao invés de mostrar a página de signin
          // const data = await requisicao_pra_buscar_dados_da_timeline()
          //setar dados do usuario/timeline
          navigate("/timeline")
        }
      } catch (e) {

      }
    })()
  }, [])
  return (<SignInPageContainer>
    <TitleContainer>
      <Title>linkr</Title>
      <SubTitle>save, share and discover<br /> the best links on the web</SubTitle>
    </TitleContainer>
    <FormContainer onSubmit={handleSignIn}>
      <Input
        placeholder={"e-mail"}
        name="email"
        type="email"
        required
        value={form.email}
        onChange={handleForm}
      />
      <Input
        placeholder={"password"}
        name="password"
        type="password"
        required
        value={form.password}
        onChange={handleForm}
      />
      <Button disabled={disabled}>Log In</Button>
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
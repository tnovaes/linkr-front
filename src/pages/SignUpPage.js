import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { fade } from "../styles/keyframes.js";
import { useState } from "react";
import apiAuth from "../services/apiAuth.js";

export default function SignUpPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", avatar: "" });
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  function handleForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSignUp(e) {
    e.preventDefault();
    setDisabled(true);

    if (!form.name || !form.email || !form.password || !form.avatar) return alert("All fields must be filled");

    apiAuth.signUp(form)
      .then(res => {
        navigate("/");
      })
      .catch(err => {
        alert(err.response.data);
        setForm({ name: "", email: "", password: "", avatar: "" });
        setDisabled(false);
      });
  }

  return (<SignUpPageContainer>
    <TitleContainer>
      <Title>linkr</Title>
      <SubTitle>save, share and discover<br /> the best links on the web</SubTitle>
    </TitleContainer>
    <FormContainer onSubmit={handleSignUp}>
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
      <Input
        placeholder={"username"}
        name="name"
        type="text"
        required
        value={form.name}
        onChange={handleForm}
      />
      <Input
        placeholder={"picture url"}
        name="avatar"
        type="text"
        required
        value={form.avatar}
        onChange={handleForm}
      />
      <Button type="submit" disabled={disabled}>
        Sign Up
      </Button>
      <Link to={'/'}> Switch back to log in</Link>
    </FormContainer>
  </SignUpPageContainer>
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
  font-size: 20px;
  line-height: 24px;
  text-decoration-line: underline;
  margin: 21px auto 0 auto;
  width:fit-content;
  }
  *{
    animation: ${fade} 1s ease-in forwards;
  }
  @media (max-width: 1030px) {
    width:100%;
    padding: 12% 6% 0px 6%;
    display:flex;
    flex-direction:column;
    align-items:center;
    max-width:100%;
    height: 100%;
    a{
      font-size: 17px;
      line-height: 20px;
    }
  }
`
const SignUpPageContainer = styled.div`
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
    font-size: 22px;
    line-height: 33px;
    height: 60px;
  }
`
const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Oswald';
  font-weight: 700;
  font-size: 27px;
  line-height: 40px;
  padding: 11px 0;
  width:100%;
  margin-bottom:14px;
  :hover{
    opacity:0.8;
  }
  @media (max-width: 1030px) {
    margin:0 auto 14px auto;
    max-width:550px;
    font-size: 22px;
    line-height: 33px;
  }
`
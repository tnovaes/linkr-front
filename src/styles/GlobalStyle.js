import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        font-family: 'Lato';
        font-weight: 400;
        font-size: 17px;
        line-height: 20px;
        box-sizing:border-box;
    }
    span {
        font-weight: 700;
    }
    main, html, #root, body{
        height:100%;
        width:100%;
    }
    svg {
        cursor: pointer;
    }
    button, input {
        outline: none;
        border: none;
        border-radius: 6px;;
        cursor: pointer;
    }
    input{
        background-color:white;
        color:#9f9f9f;
        font-family: 'Oswald';
        font-style: normal;
        font-weight: 700;
        font-size: 27px;
        line-height: 40px;
    }
    button {
        font-family: 'Lato';
        font-weight: 700;
        font-size: 14px;
        line-height: 17px;
        background-color: #1877f2;
        color:white;
    }
    h1 {
        font-weight: 700;
        font-size: 26px;
        color: white;
    }
`

export default GlobalStyle
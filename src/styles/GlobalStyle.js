import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    * {
        box-sizing:border-box;
    }
    span {
        font-weight: 700;
    }
    main, html, #root, body{
        height:100%;
        width:100%;
    }
    #root div {
        width:100%;
    }
    svg {
        cursor: pointer;
    }
    button, input {
        outline: none;
        border: none;
        border-radius: 6px;
    }
    input{
        background-color:white;
        color:#9f9f9f;
    }
    button {
        font-family: 'Lato';
        font-weight: 700;
        font-size: 14px;
        line-height: 17px;
        background-color: #1877f2;
        color:white;
        cursor:pointer;
    }
    h1 {
        font-weight: 700;
        font-size: 26px;
        color: white;
    }
    a {
        cursor:pointer;
    }
`

export default GlobalStyle
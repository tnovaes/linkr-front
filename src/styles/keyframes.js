import  { keyframes } from "styled-components";


export const fade = keyframes`
 0%{
    opacity:0;
 }
 100%{
    opacity:1;
 }
`

export const fadeGrow = keyframes`
 0%{
    opacity:0;
    height:0;
 }
 100%{
    opacity:1;
    height:47px;
 }
`
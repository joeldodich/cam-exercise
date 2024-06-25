import { styled } from "styled-components";


//create a footer that fades in when the user scrolls to the bottom of the page
//and fades out when the user scrolls up
export const ScrollFadeFooter = styled.footer`
    background: var(--ScrollFade, linear-gradient(0deg, #F8FAFC 0%, rgba(248, 250, 252, 0.70) 50%, rgba(248, 250, 252, 0.05) 100%));
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 5%;
`;
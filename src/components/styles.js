import React from "react";
import styled from "styled-components";

export const Block = styled.div`
margin: 0 1rem;
padding: 2rem;
width: ${p => p.width || `auto`};
background-color: #fafafa;
border-radius: 12px;
`;

export const Header = styled.h2`
font-size: 2rem;
font-weight: bold;
margin: 0 0 1rem 0;
text-align: center;
`;

export const HorizontalFlex = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: ${props => props.justifyContent || `center`};
    align-items: ${props => props.alignItems || `center`};
    margin: ${props => props.margin || `0`};
    width: 100%;
`

export const VerticalFlex = styled(HorizontalFlex)`
    flex-direction: column;
    ${p => p.fullWidth ? `width: 100%;` : ``}
`
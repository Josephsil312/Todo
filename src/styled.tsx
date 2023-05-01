import styled from 'styled-components/native';
import {HeadingTextProps} from './types';

// Styled for heading text
export const HeadingTextStyle = styled.Text<HeadingTextProps>`
  font-size: ${(props: {fontSize: any}) =>
    `${props.fontSize ? props.fontSize : 18}px`};
  color: ${(props: {color: any}) => props.color || '#05041b'};
  font-weight: ${(props: {fontWeight: any}) => props.fontWeight || '500'};
  background-color: ${(props: {backgroundColor: any}) =>
    props.backgroundColor ? `${props.backgroundColor}` : 'transparent'};
  margin-bottom: ${(props: {marginBottom: any}) =>
    props.marginBottom ? `${props.marginBottom}px` : '0px'};
  margin-top: ${(props: {marginTop: any}) =>
    props.marginTop ? `${props.marginTop}px` : '0px'};
  margin-left: ${(props: {marginLeft: any}) =>
    props.marginLeft ? `${props.marginLeft}` : '0px'};
  margin-right: ${(props: {marginRight: any}) =>
    props.marginRight ? `${props.marginRight}px` : '0px'};
  padding-bottom: ${(props: {paddingBottom: any}) =>
    props.paddingBottom ? `${props.paddingBottom}px` : '0px'};
  padding-top: ${(props: {paddingTop: any}) =>
    props.paddingTop ? `${props.paddingTop}px` : '0px'};
  padding-left: ${(props: {paddingLeft: any}) =>
    props.paddingLeft ? `${props.paddingLeft}%` : '0%'};
  padding-right: ${(props: {paddingRight: any}) =>
    props.paddingRight ? `${props.paddingRight}%` : '0%'};
  font-family: ${(props: {fontFamily: any}) =>
    props.fontFamily || 'SuisseIntl'};
  text-align: ${(props: {textAlign: any}) => props.textAlign || 'left'};
  font-style: ${(props: {fontStyle: any}) => props.fontStyle || 'normal'};
`;

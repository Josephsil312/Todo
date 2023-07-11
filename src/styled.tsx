import styled from 'styled-components/native';
import {HeadingTextProps, TextInputProps, GroupStepProps} from './types';

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
  text-decoration-line: ${({textDecorationLine}) => textDecorationLine || ''};
`;

export const RowContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TextInputSingleLine = styled.TextInput.attrs<TextInputProps>(
  (props: {placeholderTextColor: any}) => ({
    placeholderTextColor: props.placeholderTextColor || '#636364',
  }),
)`
  width: 90%;
  font-weight: 600;
  font-size: 16px;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 15px;
  color: ${(props: TextInputProps) => props.color};
  font-family: 'SuisseIntl';
`;

export const LocationContainerNew = styled.TouchableOpacity<GroupStepProps>`
  flex-direction: row;
  margin-top: 10px;
  border-color: ${(props: {borderColor: any}) => props.borderColor};
  border-width: 1px;
  align-items: center;
  margin-left: ${(props: {marginLeft: any}) =>
    props.marginLeft ? props.marginLeft : 20}px;
  border-radius: 10px;
  margin-right: ${(props: {marginRight: any}) =>
    props.marginRight ? props.marginRight : 20}px;
  padding: 1px;
`;

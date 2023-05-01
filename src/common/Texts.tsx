import React from 'react';
import {HeadingTextProps} from '../types';
import {HeadingTextStyle} from '../styled';

export const HeadingText: React.FC<HeadingTextProps> = ({
  textString,
  padding,
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  margin,
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
  backgroundColor,
  fontSize,
  fontFamily,
  fontWeight,
  color,
  numberOfLines,
  textAlign,
  lineHeight,
  fontStyle,
  top,
  alignSelf,
  visible,
}) => {
  return (
    <HeadingTextStyle
      includeFontPadding={false}
      textString={textString}
      paddingBottom={paddingBottom}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      marginTop={marginTop}
      margin={margin}
      marginLeft={marginLeft}
      marginRight={marginRight}
      paddingTop={paddingTop}
      marginBottom={marginBottom}
      padding={padding}
      backgroundColor={backgroundColor}
      fontSize={fontSize}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      color={color}
      numberOfLines={numberOfLines}
      textAlign={textAlign}
      lineHeight={lineHeight}
      fontStyle={fontStyle}
      top={top}
      alignSelf={alignSelf}
      visible={visible}>
      {textString}
    </HeadingTextStyle>
  );
};

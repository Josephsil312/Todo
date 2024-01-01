export interface HeadingTextProps {
  textString?: string | number | boolean;
  flexDirection?: string;
  marginBottom?: number;
  marginTop?: number;
  marginLeft?: string | number;
  marginRight?: number;
  margin?: number;
  paddingBottom?: number;
  paddingTop?: number;
  paddingLeft?: number;
  paddingRight?: number;
  padding?: number;
  backgroundColor?: string;
  fontSize?: number;
  numberOfLines?: number;
  ellipsizeMode?: string;
  fontWeight?: string;
  fontFamily?: string;
  textAlign?: string;
  height?: number;
  color?: string;
  lineHeight?: string;
  multiline?: boolean;
  fontStyle?: string;
  includeFontPadding?: boolean;
  top?: number;
  alignSelf?: string;
  visible?: boolean;
  key?: number;
  width?: number | string;
  borderRadius?: number;
  marginVertical?: number;
  textDecorationLine?: string;
  justifyContent?: string;
  position?:string;
  zIndex?:number;
  left?:number
  right?:number;
  bottom?:number;
  style?:object;
  onPress?: () => void;
  ref?:any;
}

export interface TextInputProps {
  height?: number;
  width?: number | string;
  borderRadius?: number;
  borderColor?: string;
  paddingVertical?: number;
  paddingHorizontal?: number;
  backgroundColor?: string;
  fontSize?: number;
  color: string;
  fontFamily?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  value?: string;
  onChangeText?: (val: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  flex?: number;
  marginRight?: number;
  borderWidth?: string;
  paddingTop?: number;
  paddingBottom?: number;
  marginLeft?: string;
  onSubmitEditing?: () => void;
  marginTop?: number;
  marginBottom?: number;
  
}

export type GroupStepProps = {
  borderColor?: string;
  backgroundColor?: string;
  marginLeft?: string;
  marginRight?: string;
};

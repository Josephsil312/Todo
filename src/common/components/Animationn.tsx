import {LayoutAnimation } from 'react-native'
import React from 'react'

export const Animate = () => {
    LayoutAnimation.configureNext({
        duration: 500,
        create:
        {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update:
        {
          type: LayoutAnimation.Types.easeInEaseOut,
        }
      });
}



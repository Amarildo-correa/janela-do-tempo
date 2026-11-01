// O @amazon-devices/react-native-vector-icons só traz tipos Flow. Cada
// conjunto de ícones é um componente de texto com `name`, `size` e `color`.
declare module '@amazon-devices/react-native-vector-icons/Ionicons' {
  import {ComponentType} from 'react';
  import {TextProps} from 'react-native';

  export type IconProps = TextProps & {
    name: string;
    size?: number;
    color?: string;
  };

  const Ionicons: ComponentType<IconProps>;
  export default Ionicons;
}

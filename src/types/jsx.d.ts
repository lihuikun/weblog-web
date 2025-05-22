// src/types/jsx.d.ts
import { JSX as JSXVue } from 'vue/jsx-runtime'

declare global {
    namespace JSX {
        interface IntrinsicElements extends JSXVue.IntrinsicElements { }
    }
}

import {
    useSelected,
    useFocused,
} from 'slate-react';
import styles from '@/styles/blogs/Editor.module.css';

const Leaf = ({ attributes, children, leaf }) => {
    const { text, ...rest } = leaf
    if (!children) {
        return null; // 如果 children 为空，则返回 null，使最外层的 span 元素消失
    }
    if (leaf.bold) {
        children = <strong>{children}</strong>;
    }

    if (leaf.code) {
        children = <code>{children}</code>;
    }

    if (leaf.italic) {
        children = <em>{children}</em>;
    }

    if (leaf.underline) {
        children = <u>{children}</u>;
    }

    return <span {...attributes} className={Object.keys(rest).join(' ')}>{children}</span>;
};

export default Leaf
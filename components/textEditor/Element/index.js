import React from 'react';
import { useSelected, useFocused } from 'slate-react';
import styles from '@/styles/blogs/Editor.module.css';

import { CodeBlockType, CodeLineType, CodeBlockElement } from './../CodeHighlighting';

const Element = props => {
    const { attributes, children, element } = props
    const style = { textAlign: element.align || 'left' };
    const selected = useSelected();
    const focused = useFocused();
    const isSelected = selected;

    switch (element.type) {
        case CodeBlockType:
            return (
                <CodeBlockElement {...props} />
            );
        case CodeLineType:
            return (
                <div {...attributes}>
                    {children}
                </div>
            )
        case 'block-quote':
            return (
                <blockquote style={style} {...attributes} >
                    {children}
                </blockquote>
            );
        case 'bulleted-list':
            return (
                <ul className={isSelected ? styles['selected'] : ''} style={style} {...attributes}>
                    {children}
                </ul>
            );
        case 'heading-one':
            return (
                <h1 className={isSelected ? styles['selected'] : ''} style={style} {...attributes}>
                    {children}
                </h1>
            );
        case 'heading-two':
            return (
                <h2 className={isSelected ? styles['selected'] : ''} style={style} {...attributes}>
                    {children}
                </h2>
            );
        case 'heading-three':
            return <h3 className={isSelected ? styles['selected'] : ''} style={style}{...attributes}>{children}</h3>
        case 'heading-four':
            return <h4 className={isSelected ? styles['selected'] : ''} style={style}{...attributes}>{children}</h4>
        case 'heading-five':
            return <h5 className={isSelected ? styles['selected'] : ''} style={style}{...attributes}>{children}</h5>
        case 'heading-six':
            return <h6 className={isSelected ? styles['selected'] : ''} style={style}{...attributes}>{children}</h6>
        case 'list-item':
            return (
                <li className={isSelected ? styles['selected'] : ''} style={style} {...attributes}>
                    {children}
                </li>
            );
        case 'numbered-list':
            return (
                <ol className={isSelected ? styles['selected'] : ''} style={style} {...attributes}>
                    {children}
                </ol>
            );
        case 'link':
            return <LinkComponent {...props} isSelected={isSelected}>
                {children}
            </LinkComponent>
        case 'image':
            return <Image {...props} />;
        default:
            return (
                <p className={isSelected ? styles['selected'] : ''} style={style} {...attributes}>
                    {children}
                </p>
            );
    }
};

const Image = ({ attributes, children, element }) => {
    const selected = useSelected();
    const focused = useFocused();

    return (
        <div {...attributes}>
            {children}
            <div contentEditable={false}
                style={{ position: 'relative' }}
            >
                {selected && focused && (
                    <div
                        className={styles['format-shade']}
                    />
                )}  
                <img src={element.url} alt={element.alt} className={styles['format-img']} />
            </div>
        </div>
    );
};


const LinkComponent = ({ attributes, children, element, isSelected }) => {

    return (
        <a href={element.url} {...attributes} className={isSelected ? styles['selected'] : ''}>
            {children}
        </a>
    );
};


export default Element
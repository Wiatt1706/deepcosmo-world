import { Transforms, Editor, Element as SlateElement, Range } from 'slate';
import { ReactEditor, ReadOnly } from 'slate-react';
import { jsx } from 'slate-hyperscript'
import isUrl from 'is-url'
import { toCodeLines } from './../CodeHighlighting';

const ELEMENT_TAGS = {
    A: el => ({ type: 'link', url: el.getAttribute('href') }),
    BLOCKQUOTE: () => ({ type: 'block-quote' }),
    H1: () => ({ type: 'heading-one' }),
    H2: () => ({ type: 'heading-two' }),
    H3: () => ({ type: 'heading-three' }),
    H4: () => ({ type: 'heading-four' }),
    H5: () => ({ type: 'heading-five' }),
    H6: () => ({ type: 'heading-six' }),
    IMG: el => ({ type: 'image', url: el.getAttribute('src') }),
    LI: () => ({ type: 'list-item' }),
    OL: () => ({ type: 'numbered-list' }),
    P: () => ({ type: 'paragraph' }),
    PRE: el => {
        const code = el.textContent;
        const language = el.getAttribute('class');
        console.log(`code:${JSON.stringify(code)}`);
        console.log(`language:${JSON.stringify(language)}`);
        return { type: 'code', code: toCodeLines(code), language: language };
    },
    UL: () => ({ type: 'bulleted-list' }),
}

const TEXT_TAGS = {
    CODE: () => ({ code: true }),
    DEL: () => ({ strikethrough: true }),
    EM: () => ({ italic: true }),
    I: () => ({ italic: true }),
    S: () => ({ strikethrough: true }),
    STRONG: () => ({ bold: true }),
    U: () => ({ underline: true }),
}

export const withHtml = editor => {
    const { insertData, isInline, isVoid } = editor

    editor.isInline = element => {
        return element.type === 'link' ? true : isInline(element)
    }

    editor.isVoid = element => {
        return element.type === 'image' ? true : isVoid(element)
    }

    editor.insertData = data => {
        const html = data.getData('text/html')

        if (html) {
            const parsed = new DOMParser().parseFromString(html, 'text/html')
            const fragment = deserialize(parsed.body)
            Transforms.insertFragment(editor, fragment)
            return
        }
        insertData(data)
    }

    return editor
};

export const withImages = editor => {
    const { insertData, isVoid } = editor;

    editor.isVoid = element => {
        return element.type === 'image' ? true : isVoid(element);
    };

    editor.insertData = data => {
        const text = data.getData('text/plain');
        const { files } = data;

        if (files && files.length > 0) {
            for (const file of files) {
                const reader = new FileReader();
                const [mime] = file.type.split('/');

                if (mime === 'image') {
                    reader.addEventListener('load', () => {
                        const url = reader.result;
                        insertImage(editor, url);
                    });

                    reader.readAsDataURL(file);
                }
            }
        } else if (isImageUrl(text)) {
            insertImage(editor, text);
        } else {
            insertData(data);
        }
    };

    return editor;
};

export const isImageUrl = url => {
    if (!url) return false;
    if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(url)) return false;
    if (!/\.(jpe?g|png|gif|svg)$/i.test(url)) return false;
    return true;
};

const deserialize = el => {
    if (el.nodeType === 3) {
        // 文本节点处理
        return el.textContent;;
    } else if (el.nodeType !== 1) {
        // 非元素节点处理
        return null;
    } else if (el.nodeName === 'BR') {
        // 换行符处理
        return '\n';
    }

    const { nodeName } = el;
    let parent = el;
    if (
        nodeName === 'PRE' &&
        el.childNodes[0] &&
        el.childNodes[0].nodeName === 'code'
    ) {
        parent = el.childNodes[0];
    }

    let children = Array.from(parent.childNodes)
        .map(deserialize)
        .flat();

    if (children.length === 0) {
        children = [{ text: '' }];
    }

    if (el.nodeName === 'BODY') {
        // 根节点处理
        return jsx('fragment', {}, children);
    }

    if (ELEMENT_TAGS[nodeName]) {
        // 元素节点处理
        const attrs = ELEMENT_TAGS[nodeName](el);
        console.log(children);
        return jsx('element', attrs, children);
    }

    if (TEXT_TAGS[nodeName]) {
        const attrs = TEXT_TAGS[nodeName](el);
        const textContent = children.join(''); // 合并数组为单一的文本内容
        return jsx('text', attrs, textContent);
    }
    return children;
};


export const insertImage = (editor, url, alt = "") => {
    const text = { text: '' };
    const image = { type: 'image', url, children: [text], alt };
    Transforms.insertNodes(editor, image);
};

export const ImageElement = ({ attributes, children, element }) => {
    return (
        <img
            {...attributes}
            src={element.url}
            alt="Inserted image"
            style={{ display: 'block' }}
        />
    );
};

export const LIST_TYPES = ['numbered-list', 'bulleted-list'];
export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];


export const withInlines = editor => {
    const {
        insertData,
        insertText,
        isInline,
        isElementReadOnly,
        isSelectable,
    } = editor

    editor.isInline = element =>
        ['link', 'button', 'badge'].includes(element.type) || isInline(element)

    editor.isElementReadOnly = element =>
        element.type === 'badge' || isElementReadOnly(element)

    editor.isSelectable = element =>
        element.type !== 'badge' && isSelectable(element)

    editor.insertText = text => {
        if (text && isUrl(text)) {
            wrapLink(editor, text)
        } else {
            insertText(text)
        }
    }

    editor.insertData = data => {
        const text = data.getData('text/plain')
        if (text && isUrl(text)) {
            wrapLink(editor, text)
        } else {
            insertData(data)
        }
    }

    return editor
}

export const wrapLink = (editor, url) => {
    if (isLinkActive(editor)) {
        unwrapLink(editor)
    }

    const { selection } = editor
    const isCollapsed = selection && Range.isCollapsed(selection)
    const link = {
        type: 'link',
        url,
        children: isCollapsed ? [{ text: url }] : [],
    }

    if (isCollapsed) {
        Transforms.insertNodes(editor, link)
    } else {
        Transforms.wrapNodes(editor, link, { split: true })
        Transforms.collapse(editor, { edge: 'end' })
    }
}

export const unwrapLink = editor => {
    Transforms.unwrapNodes(editor, {
        match: n =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    })
}

export const isLinkActive = editor => {
    const [link] = Editor.nodes(editor, {
        match: n =>
            !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    })
    return !!link
}

export const insertLink = (editor, url) => {
    if (editor.selection) {
        wrapLink(editor, url)
    }
}

export const focusSelection = (editor) => {
    ReactEditor.focus(editor);
    // Get the previously selected range
    const { selection } = editor;

    if (selection) {
        // Reselect the previous range
        Transforms.select(editor, selection);
    }
}


// 判断当前选区是否跨越多行 Element
export const isMultilineSelection = (editor) => {
    const { selection } = editor;

    if (selection) {
        const [start, end] = Range.edges(selection);
        const startBlock = Editor.above(editor, {
            match: (node) => Editor.isBlock(editor, node),
            at: start,
        });
        const endBlock = Editor.above(editor, {
            match: (node) => Editor.isBlock(editor, node),
            at: end,
        });

        if (startBlock && endBlock && startBlock[0] !== endBlock[0]) {
            return true;
        }
    }

    return false;
};

export const clearEditor = (editor) => {
    Transforms.select(editor, [0, 0]); // 选中整个文档
    Transforms.delete(editor); // 删除选中内容
}

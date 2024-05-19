import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-java'
import React, { useCallback } from 'react'
import {
    Node,
    Editor,
    Element,
    Transforms,
} from 'slate'
import {
    useSlate,
    ReactEditor,
    useSlateStatic
} from 'slate-react'
import { normalizeTokens } from './normalize-tokens'
import styles from './CodeHighlighting.module.css';

export const CodeBlockType = 'code-block'
export const CodeLineType = 'code-line'
export const ParagraphType = 'paragraph'

export const useDecorate = (editor) => {
    return useCallback(
        ([node, path]) => {
            if (Element.isElement(node) && node.type === CodeLineType) {
                const ranges = editor.nodeToDecorations.get(node) || []
                return ranges
            }

            return []
        },
        [editor.nodeToDecorations]
    )
}

const getChildNodeToDecorations = ([block, blockPath]) => {
    const nodeToDecorations = new Map();

    const text = block.children.map(line => Node.string(line)).join('\n');
    const language = block.language;
    const tokens = Prism.tokenize(text, Prism.languages[language]);
    const normalizedTokens = normalizeTokens(tokens); // make tokens flat and grouped by line
    const blockChildren = block.children;

    for (let index = 0; index < normalizedTokens.length; index++) {
        const tokens = normalizedTokens[index];
        const element = blockChildren[index];

        if (!nodeToDecorations.has(element)) {
            nodeToDecorations.set(element, []);
        }

        let start = 0;
        for (const token of tokens) {
            const length = token.content.length;
            if (!length) {
                continue;
            }

            const end = start + length;

            const path = [...blockPath, index, 0];
            const range = {
                anchor: { path, offset: start },
                focus: { path, offset: end },
                token: true,
                ...Object.fromEntries(token.types.map(type => [type, true])),
            };

            nodeToDecorations.get(element).push(range);

            start = end;
        }
    }

    return nodeToDecorations;
};

// precalculate editor.nodeToDecorations map to use it inside decorate function then
export const SetNodeToDecorations = () => {
    const editor = useSlate();

    const blockEntries = Array.from(
        Editor.nodes(editor, {
            at: [],
            mode: 'highest',
            match: n => Element.isElement(n) && n.type === CodeBlockType,
        })
    );

    const nodeToDecorations = mergeMaps(
        ...blockEntries.map(getChildNodeToDecorations)
    );

    editor.nodeToDecorations = nodeToDecorations;
    return null;
};

const mergeMaps = (...maps) => {
    const map = new Map();

    for (const m of maps) {
        for (const item of m) {
            map.set(...item);
        }
    }

    return map;
};

export const toChildren = (content) => [{ text: content }];
export const toCodeLines = (content) =>
    content
        .split('\n')
        .map(line => ({ type: CodeLineType, children: toChildren(line) }));

export const LanguageSelect = (props) => {
    return (
        <select
            data-test-id="language-select"
            contentEditable={false}
            {...props}
        >
            <option value="css">CSS</option>
            <option value="html">HTML</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
            <option value="jsx">JSX</option>
            <option value="markdown">Markdown</option>
            <option value="php">PHP</option>
            <option value="python">Python</option>
            <option value="sql">SQL</option>
            <option value="tsx">TSX</option>
            <option value="typescript">TypeScript</option>
        </select>
    );
};

export const CodeBlockElement = props => {
    const { attributes, children, element } = props
    const editor = useSlateStatic()

    const setLanguage = (language) => {
        const path = ReactEditor.findPath(editor, element);
        Transforms.setNodes(editor, { language }, { at: path });
    };

    return (
        <div
            {...attributes}
            className={styles['preElement']}
            spellCheck={false}
        >
            <LanguageSelect
                value={element.language}
                onChange={(e) => setLanguage(e.target.value)}
            />
            <pre className={`language-${element.language}`}>
                {children}
            </pre>
        </div>
    );
}


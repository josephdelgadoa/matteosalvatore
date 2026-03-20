'use client';

import React from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EditorProps extends ReactQuillProps {
    forwardedRef?: React.Ref<any>;
}

const Editor = ({ forwardedRef, ...props }: EditorProps) => {
    return <ReactQuill ref={forwardedRef} {...props} />;
};

export default Editor;

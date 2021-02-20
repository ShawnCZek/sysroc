import React from 'react';
import { Box, Button, ButtonProps, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  uploadBox: {
    display: 'inline-block',
  },
  input: {
    display: 'none',
  },
  label: {
    display: 'block',
    position: 'relative',
  },
  fileNameText: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginLeft: '-6.4rem',
    width: '20rem',
  },
});

interface Props extends ButtonProps {
  inputId: string;
  inputName: string;
}

interface Handle {
  reset: () => void;
  getFile: () => File | null;
}

const ProjectUploadButton: React.ForwardRefRenderFunction<Handle, Props> = ({
  inputId,
  inputName,
  ...props
}, ref) => {
  const classes = useStyles();

  const [text, setText] = React.useState('');
  const [selectedFile, setFile] = React.useState<File | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);

  React.useImperativeHandle(ref, () => ({
    reset(): void {
      setText('');
      setFile(null);
      inputRef.current!.value = '';
    },

    getFile(): File | null {
      return selectedFile;
    }
  }));

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
    const textToSet = file ? `File: ${file.name}` : '';
    setText(textToSet);
    setFile(file);
  };

  return (
    <Box className={classes.uploadBox}>
      <input
        type="file"
        id={inputId}
        name={inputName}
        className={classes.input}
        onChange={onChange}
        ref={inputRef}
      />
      <label className={classes.label} htmlFor={inputId}>
        <Button component="span" {...props}>
          Select
        </Button>
        <Typography
          variant="caption"
          className={classes.fileNameText}
          ref={textRef}
        >
          {text}
        </Typography>
      </label>
    </Box>
  );
};

export default React.forwardRef(ProjectUploadButton);

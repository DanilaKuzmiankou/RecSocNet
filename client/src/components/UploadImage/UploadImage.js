import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';

export const UploadImage = ({ field, form, ...props }) => {
  const fieldName = 'images';
  const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  };

  const focusedStyle = {
    borderColor: '#2196f3',
  };

  const acceptStyle = {
    borderColor: '#00e676',
  };

  const rejectStyle = {
    borderColor: '#ff1744',
  };

  const [files, setFiles] = useState([]);
  const dropzone = useDropzone({
    accept: 'image/*',

    onDrop: async (acceptedFiles) => {
      console.log('accept', acceptedFiles);
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      let prev = [...files];
      prev = prev.concat(newFiles);
      form.setFieldValue(fieldName, prev);
      setFiles(prev);
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(dropzone.isFocused ? focusedStyle : {}),
      ...(dropzone.isDragAccept ? acceptStyle : {}),
      ...(dropzone.isDragReject ? rejectStyle : {}),
    }),
    [dropzone.isFocused, dropzone.isDragAccept, dropzone.isDragReject]
  );

  const thumbs = files.map(function (file, index) {
    return (
      <div key={index}>
        {file.preview ? (
          <div className='thumb'>
            <div className='thumbInner'>
              <OverlayTrigger
                delay={{ show: 150, hide: 300 }}
                overlay={<Tooltip id='tooltip-disabled'>Click to remove picture</Tooltip>}
              >
                <Image
                  onClick={() => removePicture(file)}
                  src={file.preview}
                  className='review_img'
                />
              </OverlayTrigger>
            </div>
          </div>
        ) : null}
      </div>
    );
  });

  useEffect(async () => {
    let isMounted = true;
    if (isMounted) {
      if (field.value && field.value.length) {
        const newFiles = [...files];
        for (let i = 0; i < field.value.length; i++) {
          const obj = {
            preview: field.value[i].imageLink,
          };
          newFiles.push(obj);
        }
        setFiles(newFiles);
      }
    } else {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    }

    return () => {
      isMounted = false;
    };
  }, [field.value]);

  const removePicture = async (file) => {
    let newFiles = [...files];
    newFiles = newFiles.filter((iteratedFile) => iteratedFile.preview !== file.preview);
    setFiles(newFiles);
    form.setFieldValue(fieldName, newFiles);
  };

  return (
    <section className='container'>
      <div {...dropzone.getRootProps({ style })}>
        <input {...dropzone.getInputProps()} />
        <p>Drag &apos;n&apos; drop pictures here, or click to select</p>
      </div>
      {files && files.length > 0 && <h6 className='small_margin_top'>Pictures to upload</h6>}
      <aside className='thumbsContainer'>{thumbs}</aside>
    </section>
  );
};

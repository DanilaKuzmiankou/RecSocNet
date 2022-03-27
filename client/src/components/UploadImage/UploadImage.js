import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const UploadImage = ({ field, form, ...props }) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const fieldName = 'images';
  const baseStyle = {
    borderColor: '#eeeeee',
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

  const dropzone = useDropzone({
    accept: 'image/*',
    onDrop: async (acceptedFiles) => {
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
            <div className='thumb-inner'>
              <OverlayTrigger
                delay={{ show: 150, hide: 300 }}
                overlay={<Tooltip id='tooltip-disabled'>Click to remove picture</Tooltip>}
              >
                <Image
                  onClick={() => removePicture(file)}
                  src={file.preview}
                  className='review-img'
                />
              </OverlayTrigger>
            </div>
          </div>
        ) : null}
      </div>
    );
  });

  useEffect(() => {
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
      <div {...dropzone.getRootProps({ style, className: 'dropzone' })}>
        <input {...dropzone.getInputProps()} />
        <p>{t('drag_and_drop')}</p>
      </div>
      {files && files.length > 0 && <h6 style={{ marginTop: '20px' }}>Pictures to upload</h6>}
      <aside className='thumbs-container'>{thumbs}</aside>
    </section>
  );
};
